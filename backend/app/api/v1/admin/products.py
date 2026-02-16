"""
Admin products API – full CRUD (superuser only).
"""

from fastapi import APIRouter, Depends, HTTPException, Query

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth.backend import current_superuser
from app.database import get_db
from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate, ProductListResponse, ProductRead, ProductUpdate

router = APIRouter(prefix="/products", tags=["admin", "products"])


@router.post("/", response_model=ProductRead, status_code=201)
async def create_product(
    body: ProductCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
) -> ProductRead:
    """Create a new product (superuser only)."""
    result = await db.execute(select(Product).where(Product.slug == body.slug))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Product with this slug already exists")
    product = Product(**body.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return ProductRead.model_validate(product)


@router.get("/", response_model=ProductListResponse)
async def list_products_admin(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
) -> ProductListResponse:
    """List all products with pagination (superuser only)."""
    q = select(Product).order_by(Product.created_at.desc())
    total_result = await db.execute(select(func.count()).select_from(q.subquery()))
    total = total_result.scalar() or 0
    q = q.offset((page - 1) * size).limit(size).options(selectinload(Product.category))
    result = await db.execute(q)
    products = list(result.unique().scalars().all())
    return ProductListResponse(
        total=total,
        items=[ProductRead.model_validate(p) for p in products],
        page=page,
        size=size,
    )


@router.get("/{id}", response_model=ProductRead)
async def get_product_admin(
    id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
) -> ProductRead:
    """Get a product by id (superuser only)."""
    q = select(Product).where(Product.id == id).options(selectinload(Product.category))
    result = await db.execute(q)
    product = result.unique().scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductRead.model_validate(product)


@router.patch("/{id}", response_model=ProductRead)
async def update_product_admin(
    id: int,
    body: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
) -> ProductRead:
    """Update a product (superuser only)."""
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(product, key, value)
    await db.commit()
    await db.refresh(product)
    return ProductRead.model_validate(product)


@router.delete("/{id}", status_code=204)
async def delete_product_admin(
    id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
) -> None:
    """Delete a product (superuser only)."""
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.delete(product)
    await db.commit()
    return None
