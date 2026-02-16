"""
Address API schemas – create, read, update.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AddressBase(BaseModel):
    """Shared fields for address."""

    label: str = Field(..., min_length=1, max_length=50, examples=["Home"])
    street: str = Field(..., min_length=1, max_length=255)
    city: str = Field(..., min_length=1, max_length=100)
    province: str = Field(..., min_length=1, max_length=100, examples=["Punjab"])
    postal_code: str = Field(..., min_length=1, max_length=20)
    phone: str = Field(..., min_length=1, max_length=32)
    is_default: bool = False


class AddressCreate(AddressBase):
    """Request schema for creating an address."""

    pass


class AddressUpdate(BaseModel):
    """Request schema for updating an address (all optional)."""

    label: str | None = Field(None, min_length=1, max_length=50)
    street: str | None = Field(None, min_length=1, max_length=255)
    city: str | None = Field(None, min_length=1, max_length=100)
    province: str | None = Field(None, min_length=1, max_length=100)
    postal_code: str | None = Field(None, min_length=1, max_length=20)
    phone: str | None = Field(None, min_length=1, max_length=32)
    is_default: bool | None = None


class AddressRead(AddressBase):
    """Response schema for a single address."""

    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
