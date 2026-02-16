"""
Order and OrderItem API schemas – create (from cart), read with items.
"""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.address import AddressRead


# ---------------------------------------------------------------------------
# OrderItem schemas
# ---------------------------------------------------------------------------


class OrderItemCreate(BaseModel):
    """Single item in the cart sent by frontend when placing an order."""

    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0)
    size: str | None = None
    color: str | None = None


class OrderItemRead(BaseModel):
    """Response schema for a line item within an order."""

    id: int
    product_id: int
    quantity: int
    price_at_purchase: Decimal
    size: str | None = None
    color: str | None = None
    # Flattened product info for convenience
    product_name: str | None = None
    product_slug: str | None = None
    product_image: str | None = None

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Order schemas
# ---------------------------------------------------------------------------


class OrderCreate(BaseModel):
    """Request schema for placing an order (cart items from frontend Zustand store)."""

    shipping_address_id: int = Field(..., gt=0)
    payment_method: str = Field(
        ...,
        min_length=1,
        examples=["cod", "card", "easypaisa", "jazzcash"],
    )
    items: list[OrderItemCreate] = Field(..., min_length=1)


class OrderRead(BaseModel):
    """Response schema for an order with its items and shipping address."""

    id: int
    user_id: int
    status: str
    total_amount: Decimal
    payment_method: str
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemRead] = []
    shipping_address: AddressRead | None = None

    model_config = ConfigDict(from_attributes=True)


class OrderListResponse(BaseModel):
    """Paginated list of orders."""

    total: int
    items: list[OrderRead]
    page: int
    size: int
