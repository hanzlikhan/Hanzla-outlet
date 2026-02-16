"""
Order model – represents a customer purchase with status tracking.
"""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Order(Base):
    """Order table: user, status, total, shipping address, payment method."""

    __tablename__ = "order"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="RESTRICT"),
        index=True,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )  # pending | processing | shipped | delivered | cancelled
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    shipping_address_id: Mapped[int] = mapped_column(
        ForeignKey("address.id", ondelete="RESTRICT"),
        nullable=False,
    )
    payment_method: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )  # cod | card | easypaisa | jazzcash
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship("User", back_populates="orders")  # noqa: F821
    shipping_address: Mapped["Address"] = relationship("Address", lazy="joined")  # noqa: F821
    items: Mapped[list["OrderItem"]] = relationship(  # noqa: F821
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
    )
