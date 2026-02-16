"""
Seed script – idempotent load of categories and products (Pakistani fashion).

Run from project root or backend/:
    cd backend && python -m app.seed
  or
    python -m app.seed   (from backend/)

Requires .env with DATABASE_URL and SECRET. Tables category and product must exist
(alembic upgrade head). Safe to run multiple times: skips existing slug.
"""

import asyncio
import re
import sys
from decimal import Decimal
from pathlib import Path
from typing import Any

# Ensure backend root is on path so "app" is always found
_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_maker
from app.models.category import Category
from app.models.product import Product


# ---------------------------------------------------------------------------
# Categories (8 – Pakistani fashion)
# ---------------------------------------------------------------------------
CATEGORIES: list[dict[str, Any]] = [
    {"name": "Men", "slug": "men", "description": "Men's fashion and apparel"},
    {"name": "Women", "slug": "women", "description": "Women's fashion and apparel"},
    {"name": "Watches", "slug": "watches", "description": "Luxury and casual watches"},
    {"name": "Accessories", "slug": "accessories", "description": "Belts, bags, and accessories"},
    {"name": "Shoes", "slug": "shoes", "description": "Footwear for men and women"},
    {"name": "Perfumes", "slug": "perfumes", "description": "Fragrances and perfumes"},
    {"name": "Kurtas & Shalwar Kameez", "slug": "ethnic-wear", "description": "Ethnic and traditional wear"},
    {"name": "Western Wear", "slug": "western", "description": "Western style clothing"},
]

# Placeholder image URLs for products
def _images(name: str) -> list[str]:
    safe = re.sub(r"[^\w\s-]", "", name).strip().replace(" ", "+")[:50]
    return [
        f"https://via.placeholder.com/400x600?text={safe}",
        f"https://via.placeholder.com/400x600?text={safe}+2",
    ]


# ---------------------------------------------------------------------------
# Products (25+ – realistic PKR, sizes, colors)
# Each: name, category_slug, price, discount_price (optional), description, sizes, colors, stock, images (optional list)
# ---------------------------------------------------------------------------
PRODUCTS: list[dict[str, Any]] = [
    # Men
    {"name": "Black Kurta Shalwar", "category_slug": "men", "price": Decimal("4500"), "discount_price": None, "description": "Classic black kurta shalwar set, premium cotton.", "sizes": ["S", "M", "L", "XL"], "colors": ["Black", "White"], "stock": 50},
    {"name": "Formal Dress Shirt White", "category_slug": "men", "price": Decimal("3499"), "discount_price": Decimal("2999"), "description": "Slim fit formal shirt for office and occasions.", "sizes": ["S", "M", "L", "XL"], "colors": ["White", "Light Blue"], "stock": 40},
    {"name": "Chinos Casual Beige", "category_slug": "men", "price": Decimal("4299"), "discount_price": None, "description": "Comfortable chinos for smart casual look.", "sizes": ["30", "32", "34", "36"], "colors": ["Beige", "Navy", "Black"], "stock": 35},
    # Women
    {"name": "Embroidered Lawn Suit", "category_slug": "women", "price": Decimal("5999"), "discount_price": Decimal("4999"), "description": "Premium embroidered lawn suit, summer collection.", "sizes": ["S", "M", "L", "XL"], "colors": ["Pink", "Mint", "White"], "stock": 45},
    {"name": "Unstitched Cotton 3-Piece", "category_slug": "women", "price": Decimal("3899"), "discount_price": None, "description": "Unstitched cotton suit fabric, 3-piece.", "sizes": ["Free"], "colors": ["Maroon", "Green", "Blue"], "stock": 60},
    {"name": "Designer Saree Premium", "category_slug": "women", "price": Decimal("8999"), "discount_price": Decimal("7499"), "description": "Designer saree with heavy border and blouse piece.", "sizes": ["Free"], "colors": ["Red", "Gold", "Teal"], "stock": 20},
    # Watches
    {"name": "Analog Luxury Watch Gold", "category_slug": "watches", "price": Decimal("8500"), "discount_price": None, "description": "Elegant analog watch with gold finish.", "sizes": ["One Size"], "colors": ["Gold", "Silver"], "stock": 25},
    {"name": "Sport Digital Watch Black", "category_slug": "watches", "price": Decimal("4299"), "discount_price": Decimal("3499"), "description": "Water-resistant sport watch with digital display.", "sizes": ["One Size"], "colors": ["Black", "Blue"], "stock": 55},
    {"name": "Classic Leather Strap Watch", "category_slug": "watches", "price": Decimal("5999"), "discount_price": None, "description": "Minimalist classic watch with leather strap.", "sizes": ["One Size"], "colors": ["Brown", "Black"], "stock": 30},
    # Accessories
    {"name": "Leather Belt Brown", "category_slug": "accessories", "price": Decimal("1200"), "discount_price": None, "description": "Genuine leather belt, durable buckle.", "sizes": ["32", "34", "36", "38"], "colors": ["Brown", "Black"], "stock": 80},
    {"name": "Canvas Crossbody Bag", "category_slug": "accessories", "price": Decimal("2499"), "discount_price": Decimal("1999"), "description": "Casual canvas crossbody bag for daily use.", "sizes": ["One Size"], "colors": ["Khaki", "Navy", "Black"], "stock": 40},
    {"name": "Silk Tie Collection", "category_slug": "accessories", "price": Decimal("899"), "discount_price": None, "description": "Formal silk tie, multiple patterns.", "sizes": ["One Size"], "colors": ["Navy", "Maroon", "Grey"], "stock": 100},
    # Shoes
    {"name": "Casual Sneakers White", "category_slug": "shoes", "price": Decimal("3499"), "discount_price": None, "description": "Comfortable white sneakers for casual wear.", "sizes": ["7", "8", "9", "10", "11"], "colors": ["White", "Black", "Navy"], "stock": 70},
    {"name": "Formal Oxford Shoes Black", "category_slug": "shoes", "price": Decimal("5499"), "discount_price": Decimal("4499"), "description": "Classic oxford shoes for formal occasions.", "sizes": ["7", "8", "9", "10", "11"], "colors": ["Black", "Brown"], "stock": 35},
    {"name": "Slip-On Loafers Brown", "category_slug": "shoes", "price": Decimal("3999"), "discount_price": None, "description": "Comfortable slip-on loafers, premium finish.", "sizes": ["7", "8", "9", "10"], "colors": ["Brown", "Black"], "stock": 45},
    # Perfumes
    {"name": "Eau de Parfum Oud", "category_slug": "perfumes", "price": Decimal("3999"), "discount_price": None, "description": "Long-lasting oud fragrance, 50ml.", "sizes": ["50ml", "100ml"], "colors": ["Gold"], "stock": 60},
    {"name": "Fresh Citrus Cologne", "category_slug": "perfumes", "price": Decimal("2499"), "discount_price": Decimal("1999"), "description": "Refreshing citrus cologne for daily wear.", "sizes": ["75ml"], "colors": ["Blue"], "stock": 80},
    {"name": "Floral Perfume Women", "category_slug": "perfumes", "price": Decimal("3299"), "discount_price": None, "description": "Elegant floral perfume, 50ml.", "sizes": ["50ml"], "colors": ["Pink"], "stock": 50},
    # Ethnic wear
    {"name": "Embroidered Kurta Navy", "category_slug": "ethnic-wear", "price": Decimal("5299"), "discount_price": Decimal("4499"), "description": "Hand-embroidered kurta, navy blue.", "sizes": ["S", "M", "L", "XL"], "colors": ["Navy", "Maroon", "Black"], "stock": 40},
    {"name": "Chiffon Stitched Suit", "category_slug": "ethnic-wear", "price": Decimal("4699"), "discount_price": None, "description": "Ready-to-wear chiffon suit with dupatta.", "sizes": ["S", "M", "L"], "colors": ["Teal", "Pink", "Lavender"], "stock": 55},
    {"name": "Sherwani Wedding Gold", "category_slug": "ethnic-wear", "price": Decimal("18999"), "discount_price": Decimal("15999"), "description": "Designer sherwani for wedding and events.", "sizes": ["M", "L", "XL"], "colors": ["Gold", "Maroon", "Ivory"], "stock": 15},
    # Western
    {"name": "Denim Jacket Blue", "category_slug": "western", "price": Decimal("4999"), "discount_price": None, "description": "Classic denim jacket, versatile styling.", "sizes": ["S", "M", "L", "XL"], "colors": ["Blue", "Black"], "stock": 45},
    {"name": "Cotton T-Shirt Pack", "category_slug": "western", "price": Decimal("1999"), "discount_price": Decimal("1499"), "description": "Pack of 3 solid cotton t-shirts.", "sizes": ["S", "M", "L", "XL"], "colors": ["White", "Grey", "Black"], "stock": 120},
    {"name": "High-Waist Jeans", "category_slug": "western", "price": Decimal("4499"), "discount_price": None, "description": "Comfortable high-waist jeans for women.", "sizes": ["28", "30", "32", "34"], "colors": ["Blue", "Black"], "stock": 65},
    {"name": "Linen Blazer Beige", "category_slug": "western", "price": Decimal("6999"), "discount_price": Decimal("5999"), "description": "Light linen blazer for smart casual.", "sizes": ["S", "M", "L"], "colors": ["Beige", "Navy"], "stock": 25},
    {"name": "Polo Shirt Collection", "category_slug": "western", "price": Decimal("2299"), "discount_price": None, "description": "Premium cotton polo shirts.", "sizes": ["S", "M", "L", "XL"], "colors": ["White", "Navy", "Red", "Green"], "stock": 90},
]


def slugify(name: str) -> str:
    """Generate slug from name: lower, spaces to hyphens, remove non-alnum except hyphen."""
    return re.sub(r"[^\w\-]", "", name.lower().strip().replace(" ", "-")) or "product"


async def _get_category_by_slug(session: AsyncSession, slug: str) -> Category | None:
    result = await session.execute(select(Category).where(Category.slug == slug))
    return result.scalar_one_or_none()


async def _get_product_by_slug(session: AsyncSession, slug: str) -> Product | None:
    result = await session.execute(select(Product).where(Product.slug == slug))
    return result.scalar_one_or_none()


async def seed_categories(session: AsyncSession) -> dict[str, int]:
    """
    Insert categories if not present (by slug). Returns slug -> id map.
    """
    slug_to_id: dict[str, int] = {}
    for row in CATEGORIES:
        existing = await _get_category_by_slug(session, row["slug"])
        if existing:
            slug_to_id[row["slug"]] = existing.id
            continue
        cat = Category(
            name=row["name"],
            slug=row["slug"],
            description=row.get("description"),
        )
        session.add(cat)
        await session.flush()
        slug_to_id[row["slug"]] = cat.id
    await session.commit()
    return slug_to_id


async def seed_products(session: AsyncSession, slug_to_id: dict[str, int]) -> None:
    """
    Insert products if not present (by slug). Uses slug_to_id for category_id.
    """
    for row in PRODUCTS:
        name = row["name"]
        slug = slugify(name)
        existing = await _get_product_by_slug(session, slug)
        if existing:
            continue
        cat_slug = row["category_slug"]
        category_id = slug_to_id.get(cat_slug)
        if not category_id:
            raise ValueError(f"Category slug not found: {cat_slug}")
        images = _images(name)
        product = Product(
            name=name,
            slug=slug,
            description=row["description"],
            price=row["price"],
            discount_price=row.get("discount_price"),
            images=images,
            sizes=row["sizes"],
            colors=row["colors"],
            stock=row.get("stock", 0),
            category_id=category_id,
            is_active=True,
        )
        session.add(product)
    await session.commit()


async def main() -> None:
    """Load .env, create session, seed categories then products. Idempotent."""
    async with async_session_maker() as session:
        try:
            slug_to_id = await seed_categories(session)
            await seed_products(session, slug_to_id)
            print("Seed completed: categories and products (idempotent).")
        except Exception as e:
            await session.rollback()
            print(f"Seed failed: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(main())
