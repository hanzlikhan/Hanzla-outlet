"""
Public categories API – list all (optional parent_id filter), get by slug.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryListResponse, CategoryRead, CategoryReadWithCount

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=CategoryListResponse)
async def list_categories(
    parent_id: int | None = Query(None, description="Filter by parent category id"),
    db: AsyncSession = Depends(get_db),
) -> CategoryListResponse:
    """List all categories, optionally filtered by parent_id (None = root)."""
    q = select(Category).order_by(Category.name)
    if parent_id is not None:
        q = q.where(Category.parent_id == parent_id)
    result = await db.execute(q)
    items = list(result.scalars().all())
    return CategoryListResponse(
        total=len(items),
        items=[CategoryRead.model_validate(c) for c in items],
        page=1,
        size=len(items),
    )


@router.get("/{slug}", response_model=CategoryReadWithCount)
async def get_category_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> CategoryReadWithCount:
    """Get a category by slug; includes product count."""
    result = await db.execute(select(Category).where(Category.slug == slug))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    from app.models.product import Product
    count_result = await db.execute(
        select(func.count()).select_from(Product).where(Product.category_id == category.id)
    )
    products_count = count_result.scalar() or 0
    return CategoryReadWithCount(
        **CategoryRead.model_validate(category).model_dump(),
        products_count=products_count,
    )