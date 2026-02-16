"""
Category API schemas – create, read, update, list.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    """Shared fields for category."""

    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=120)
    description: str | None = None
    parent_id: int | None = None


class CategoryCreate(CategoryBase):
    """Request schema for creating a category."""

    pass


class CategoryUpdate(BaseModel):
    """Request schema for updating a category (all optional)."""

    name: str | None = Field(None, min_length=1, max_length=100)
    slug: str | None = Field(None, min_length=1, max_length=120)
    description: str | None = None
    parent_id: int | None = None


class CategoryRead(CategoryBase):
    """Response schema for a single category."""

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CategoryReadWithCount(CategoryRead):
    """Category with product count (e.g. for detail by slug)."""

    products_count: int = 0


class CategoryListResponse(BaseModel):
    """Paginated list of categories."""

    total: int
    items: list[CategoryRead]
    page: int
    size: int
