"""
User model – fastapi-users compatible, integer ID.
Base fields from SQLAlchemyBaseUserTable; we add full_name, phone, timestamps.
"""

from datetime import datetime

from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class User(SQLAlchemyBaseUserTable[int], Base):
    """User table: email, hashed_password, is_active, is_superuser, is_verified + extras."""

    __tablename__ = "user"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
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

    # Phase 3 relationships
    addresses: Mapped[list["Address"]] = relationship(  # noqa: F821
        "Address", back_populates="user", cascade="all, delete-orphan",
    )
    orders: Mapped[list["Order"]] = relationship(  # noqa: F821
        "Order", back_populates="user",
    )
    wishlists: Mapped[list["Wishlist"]] = relationship(  # noqa: F821
        "Wishlist", back_populates="user", cascade="all, delete-orphan",
    )

