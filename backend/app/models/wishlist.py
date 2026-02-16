"""
Wishlist model – composite primary key (user_id, product_id).
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Wishlist(Base):
    """Wishlist junction table: user <-> product, composite PK."""

    __tablename__ = "wishlist"

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    product_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("product.id", ondelete="CASCADE"),
        primary_key=True,
    )
    added_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship("User", back_populates="wishlists")  # noqa: F821
    product: Mapped["Product"] = relationship("Product", back_populates="wishlist_entries", lazy="joined")  # noqa: F821
