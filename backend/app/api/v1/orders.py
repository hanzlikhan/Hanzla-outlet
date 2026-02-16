"""
Orders API – create order (from cart), list orders, order detail.
All endpoints require authentication.
"""

from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth import current_active_user
from app.database import get_db
from app.models.address import Address
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import (
    OrderCreate,
    OrderItemRead,
    OrderListResponse,
    OrderRead,
)

router = APIRouter(prefix="/orders", tags=["orders"])


def _order_item_to_read(oi: OrderItem) -> OrderItemRead:
    """Convert OrderItem ORM to OrderItemRead with flattened product info."""
    return OrderItemRead(
        id=oi.id,
        product_id=oi.product_id,
        quantity=oi.quantity,
        price_at_purchase=oi.price_at_purchase,
        size=oi.size,
        color=oi.color,
        product_name=oi.product.name if oi.product else None,
        product_slug=oi.product.slug if oi.product else None,
        product_image=oi.product.images[0] if oi.product and oi.product.images else None,
    )


def _order_to_read(order: Order) -> OrderRead:
    """Convert Order ORM to OrderRead with nested items and address."""
    return OrderRead(
        id=order.id,
        user_id=order.user_id,
        status=order.status,
        total_amount=order.total_amount,
        payment_method=order.payment_method,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=[_order_item_to_read(oi) for oi in order.items],
        shipping_address=order.shipping_address,
    )


@router.post("/", response_model=OrderRead, status_code=201)
async def create_order(
    body: OrderCreate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> OrderRead:
    """
    Place an order.

    - Validates address belongs to user
    - Validates all products exist, are active, and have enough stock
    - Calculates total from current product prices (uses discount_price if set)
    - Creates Order + OrderItems
    - Reduces product stock
    """
    # 1. Validate address ownership
    addr_result = await db.execute(
        select(Address).where(
            Address.id == body.shipping_address_id,
            Address.user_id == user.id,
        )
    )
    if not addr_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Shipping address not found")

    # 2. Validate products and calculate total
    total = Decimal("0")
    order_items: list[OrderItem] = []

    for cart_item in body.items:
        product = await db.get(Product, cart_item.product_id)
        if not product or not product.is_active:
            raise HTTPException(
                status_code=400,
                detail=f"Product ID {cart_item.product_id} not found or inactive",
            )
        if product.stock < cart_item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}' (available: {product.stock}, requested: {cart_item.quantity})",
            )

        # Use discount price if available, else regular price
        unit_price = product.discount_price if product.discount_price else product.price
        line_total = unit_price * cart_item.quantity
        total += line_total

        order_items.append(
            OrderItem(
                product_id=product.id,
                quantity=cart_item.quantity,
                price_at_purchase=unit_price,
                size=cart_item.size,
                color=cart_item.color,
            )
        )

        # 3. Reduce stock
        product.stock -= cart_item.quantity

    # 4. Create order
    order = Order(
        user_id=user.id,
        status="pending",
        total_amount=total,
        shipping_address_id=body.shipping_address_id,
        payment_method=body.payment_method,
        items=order_items,
    )
    db.add(order)
    await db.commit()

    # 5. Re-fetch with relationships for response
    result = await db.execute(
        select(Order)
        .where(Order.id == order.id)
        .options(
            selectinload(Order.items).selectinload(OrderItem.product),
            selectinload(Order.shipping_address),
        )
    )
    order = result.unique().scalar_one()
    return _order_to_read(order)


@router.get("/", response_model=OrderListResponse)
async def list_orders(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> OrderListResponse:
    """List the current user's orders (newest first), paginated."""
    base_q = select(Order).where(Order.user_id == user.id)

    # Total count
    count_result = await db.execute(select(func.count()).select_from(base_q.subquery()))
    total = count_result.scalar() or 0

    # Paginate
    q = (
        base_q
        .order_by(Order.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
        .options(
            selectinload(Order.items).selectinload(OrderItem.product),
            selectinload(Order.shipping_address),
        )
    )
    result = await db.execute(q)
    orders = list(result.unique().scalars().all())
    return OrderListResponse(
        total=total,
        items=[_order_to_read(o) for o in orders],
        page=page,
        size=size,
    )


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(
    order_id: int,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> OrderRead:
    """Get order detail with items and shipping address (ownership enforced)."""
    result = await db.execute(
        select(Order)
        .where(Order.id == order_id, Order.user_id == user.id)
        .options(
            selectinload(Order.items).selectinload(OrderItem.product),
            selectinload(Order.shipping_address),
        )
    )
    order = result.unique().scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return _order_to_read(order)
