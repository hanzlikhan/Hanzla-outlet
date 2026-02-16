"""
User API schemas – extend fastapi_users base schemas with full_name and phone.
"""

from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    """Response schema for user (includes full_name, phone)."""

    full_name: str | None = None
    phone: str | None = None


class UserCreate(schemas.BaseUserCreate):
    """Request schema for registration."""

    full_name: str | None = None
    phone: str | None = None


class UserUpdate(schemas.BaseUserUpdate):
    """Request schema for updating profile."""

    full_name: str | None = None
    phone: str | None = None
