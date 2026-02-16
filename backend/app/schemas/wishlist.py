"""
Wishlist API schemas – read response with embedded product info.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.product import ProductRead


class WishlistRead(BaseModel):
    """Response schema for a wishlist item (includes full product details)."""

    product_id: int
    added_at: datetime
    product: ProductRead

    model_config = ConfigDict(from_attributes=True)
