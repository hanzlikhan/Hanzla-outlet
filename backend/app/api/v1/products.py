"""
Public products API – list with filters (category_slug, price, search), get by slug.
Only active products are returned.
"""

from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.category import Category
from app.models.product import Product
from app.schemas.product import ProductListResponse, ProductRead

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=ProductListResponse)
async def list_products(
    category_slug: str | None = Query(None, description="Filter by category slug"),
    min_price: Decimal | None = Query(None, ge=0),
    max_price: Decimal | None = Query(None, ge=0),
    search: str | None = Query(None, min_length=1),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> ProductListResponse:
    """List active products with optional filters and pagination."""
    q = select(Product).where(Product.is_active.is_(True))
    if category_slug:
        q = q.join(Category, Product.category_id == Category.id).where(
            Category.slug == category_slug
        )
    if min_price is not None:
        q = q.where(Product.price >= min_price)
    if max_price is not None:
        q = q.where(Product.price <= max_price)
    if search:
        pattern = f"%{search}%"
        q = q.where(
            (Product.name.ilike(pattern)) | (Product.description.ilike(pattern))
        )
    # Total count (same filters, no pagination)
    total_result = await db.execute(select(func.count()).select_from(q.subquery()))
    total = total_result.scalar() or 0
    # Paginate and order
    q = q.order_by(Product.created_at.desc()).offset((page - 1) * size).limit(size)
    q = q.options(selectinload(Product.category))
    result = await db.execute(q)
    products = list(result.unique().scalars().all())
    items = [ProductRead.model_validate(p) for p in products]
    return ProductListResponse(total=total, items=items, page=page, size=size)


@router.get("/{slug}", response_model=ProductRead)
async def get_product_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> ProductRead:
    """Get a product by slug. Returns 404 if not found or inactive."""
    q = (
        select(Product)
        .where(Product.slug == slug, Product.is_active.is_(True))
        .options(selectinload(Product.category))
    )
    result = await db.execute(q)
    product = result.unique().scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductRead.model_validate(product)
