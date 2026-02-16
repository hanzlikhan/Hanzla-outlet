"""
Product API schemas – create, read, update, paginated list.
"""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.category import CategoryRead


class ProductBase(BaseModel):
    """Shared fields for product."""

    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=250)
    description: str = Field(..., min_length=1)
    price: Decimal = Field(..., ge=0)
    discount_price: Decimal | None = Field(None, ge=0)
    images: list[str] = Field(default_factory=list)
    sizes: list[str] = Field(default_factory=list)
    colors: list[str] = Field(default_factory=list)
    stock: int = Field(0, ge=0)
    category_id: int = Field(..., gt=0)
    is_active: bool = True


class ProductCreate(ProductBase):
    """Request schema for creating a product."""

    pass


class ProductUpdate(BaseModel):
    """Request schema for updating a product (all optional)."""

    name: str | None = Field(None, min_length=1, max_length=200)
    slug: str | None = Field(None, min_length=1, max_length=250)
    description: str | None = None
    price: Decimal | None = Field(None, ge=0)
    discount_price: Decimal | None = Field(None, ge=0)
    images: list[str] | None = None
    sizes: list[str] | None = None
    colors: list[str] | None = None
    stock: int | None = Field(None, ge=0)
    category_id: int | None = Field(None, gt=0)
    is_active: bool | None = None


class ProductRead(ProductBase):
    """Response schema for a single product (with optional category)."""

    id: int
    created_at: datetime
    updated_at: datetime
    category: CategoryRead | None = None

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    """Paginated list of products."""

    total: int
    items: list[ProductRead]
    page: int
    size: int
