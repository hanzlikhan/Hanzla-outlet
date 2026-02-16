"""
Admin API router – aggregates admin categories and products.
Mount under /api/v1 so paths are /api/v1/admin/categories, /api/v1/admin/products.
"""

from fastapi import APIRouter

from app.api.v1.admin.categories import router as categories_router
from app.api.v1.admin.products import router as products_router

# Prefix /admin so final paths are /api/v1/admin/categories, /api/v1/admin/products
router = APIRouter(prefix="/admin")
router.include_router(categories_router)
router.include_router(products_router)
