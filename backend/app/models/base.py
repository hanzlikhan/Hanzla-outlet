"""
SQLAlchemy declarative base for all models.
Import Base from app.models.base (or app.models) when defining new models.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """All app models inherit from this. Used by Alembic for target_metadata."""

    pass
