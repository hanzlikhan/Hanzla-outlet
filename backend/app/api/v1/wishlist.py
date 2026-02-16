"""
Wishlist API – add, remove, list. All endpoints require authentication.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth import current_active_user
from app.database import get_db
from app.models.product import Product
from app.models.user import User
from app.models.wishlist import Wishlist
from app.schemas.wishlist import WishlistRead

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.get("/", response_model=list[WishlistRead])
async def list_wishlist(
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[WishlistRead]:
    """List all wishlist items for the current user (with product details)."""
    result = await db.execute(
        select(Wishlist)
        .where(Wishlist.user_id == user.id)
        .options(selectinload(Wishlist.product).selectinload(Product.category))
        .order_by(Wishlist.added_at.desc())
    )
    items = list(result.unique().scalars().all())
    return [WishlistRead.model_validate(w) for w in items]


@router.post("/add/{product_id}", response_model=WishlistRead, status_code=201)
async def add_to_wishlist(
    product_id: int,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> WishlistRead:
    """Add a product to the wishlist. Returns 409 if already exists, 404 if product missing."""
    # Check product exists and is active
    product = await db.get(Product, product_id)
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check not already in wishlist
    existing = await db.execute(
        select(Wishlist).where(
            Wishlist.user_id == user.id,
            Wishlist.product_id == product_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Product already in wishlist")

    wishlist_item = Wishlist(user_id=user.id, product_id=product_id)
    db.add(wishlist_item)
    await db.commit()

    # Re-fetch with product joined for response
    result = await db.execute(
        select(Wishlist)
        .where(Wishlist.user_id == user.id, Wishlist.product_id == product_id)
        .options(selectinload(Wishlist.product).selectinload(Product.category))
    )
    item = result.unique().scalar_one()
    return WishlistRead.model_validate(item)


@router.delete("/remove/{product_id}", status_code=204)
async def remove_from_wishlist(
    product_id: int,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Remove a product from the wishlist."""
    result = await db.execute(
        select(Wishlist).where(
            Wishlist.user_id == user.id,
            Wishlist.product_id == product_id,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Product not in wishlist")

    await db.delete(item)
    await db.commit()
