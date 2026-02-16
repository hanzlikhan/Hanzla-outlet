"""
Admin categories API – full CRUD (superuser only).
"""

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.backend import current_superuser
from app.database import get_db
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["admin", "categories"])


@router.post("/", response_model=CategoryRead, status_code=201)
async def create_category(
    body: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
) -> CategoryRead:
    """Create a new category (superuser only)."""
    result = await db.execute(select(Category).where(Category.slug == body.slug))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Category with this slug already exists")
    category = Category(**body.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return CategoryRead.model_validate(category)


@router.get("/", response_model=list[CategoryRead])
async def list_categories_admin(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
) -> list[CategoryRead]:
    """List all categories (superuser only)."""
    result = await db.execute(select(Category).order_by(Category.name))
    categories = list(result.scalars().all())
    return [CategoryRead.model_validate(c) for c in categories]


@router.get("/{id}", response_model=CategoryRead)
async def get_category_admin(
    id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
) -> CategoryRead:
    """Get a category by id (superuser only)."""
    result = await db.execute(select(Category).where(Category.id == id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return CategoryRead.model_validate(category)


@router.patch("/{id}", response_model=CategoryRead)
async def update_category_admin(
    id: int,
    body: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
) -> CategoryRead:
    """Update a category (superuser only)."""
    result = await db.execute(select(Category).where(Category.id == id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(category, key, value)
    await db.commit()
    await db.refresh(category)
    return CategoryRead.model_validate(category)


@router.delete("/{id}", status_code=204)
async def delete_category_admin(
    id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
) -> None:
    """Delete a category (superuser only). Parent is set to NULL on children."""
    result = await db.execute(select(Category).where(Category.id == id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(category)
    await db.commit()
    return None
