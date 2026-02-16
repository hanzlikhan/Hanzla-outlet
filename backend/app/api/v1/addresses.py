"""
Addresses API – CRUD + set-default. All endpoints require authentication.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import current_active_user
from app.database import get_db
from app.models.address import Address
from app.models.user import User
from app.schemas.address import AddressCreate, AddressRead, AddressUpdate

router = APIRouter(prefix="/addresses", tags=["addresses"])


@router.get("/", response_model=list[AddressRead])
async def list_addresses(
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[AddressRead]:
    """List all addresses for the current user."""
    result = await db.execute(
        select(Address)
        .where(Address.user_id == user.id)
        .order_by(Address.is_default.desc(), Address.created_at.desc())
    )
    addresses = list(result.scalars().all())
    return [AddressRead.model_validate(a) for a in addresses]


@router.post("/", response_model=AddressRead, status_code=201)
async def create_address(
    body: AddressCreate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> AddressRead:
    """Create a new address. Auto-sets as default if it's the user's first."""
    # Check if user has any addresses already
    count_result = await db.execute(
        select(Address.id).where(Address.user_id == user.id).limit(1)
    )
    is_first = count_result.scalar_one_or_none() is None

    address = Address(
        user_id=user.id,
        label=body.label,
        street=body.street,
        city=body.city,
        province=body.province,
        postal_code=body.postal_code,
        phone=body.phone,
        is_default=True if is_first else body.is_default,
    )

    # If setting as default, unset others
    if address.is_default and not is_first:
        await db.execute(
            update(Address)
            .where(Address.user_id == user.id, Address.is_default.is_(True))
            .values(is_default=False)
        )

    db.add(address)
    await db.commit()
    await db.refresh(address)
    return AddressRead.model_validate(address)


@router.patch("/{address_id}", response_model=AddressRead)
async def update_address(
    address_id: int,
    body: AddressUpdate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> AddressRead:
    """Update an address (ownership enforced)."""
    result = await db.execute(
        select(Address).where(Address.id == address_id, Address.user_id == user.id)
    )
    address = result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    update_data = body.model_dump(exclude_unset=True)

    # If setting as default, unset others first
    if update_data.get("is_default") is True:
        await db.execute(
            update(Address)
            .where(Address.user_id == user.id, Address.id != address_id, Address.is_default.is_(True))
            .values(is_default=False)
        )

    for field, value in update_data.items():
        setattr(address, field, value)

    await db.commit()
    await db.refresh(address)
    return AddressRead.model_validate(address)


@router.delete("/{address_id}", status_code=204)
async def delete_address(
    address_id: int,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete an address (ownership enforced)."""
    result = await db.execute(
        select(Address).where(Address.id == address_id, Address.user_id == user.id)
    )
    address = result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    await db.delete(address)
    await db.commit()


@router.post("/set-default/{address_id}", response_model=AddressRead)
async def set_default_address(
    address_id: int,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> AddressRead:
    """Set an address as the default (unset all others)."""
    result = await db.execute(
        select(Address).where(Address.id == address_id, Address.user_id == user.id)
    )
    address = result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    # Unset all others
    await db.execute(
        update(Address)
        .where(Address.user_id == user.id, Address.is_default.is_(True))
        .values(is_default=False)
    )

    address.is_default = True
    await db.commit()
    await db.refresh(address)
    return AddressRead.model_validate(address)
