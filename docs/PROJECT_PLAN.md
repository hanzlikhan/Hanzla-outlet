# Hanzla Outlet – Project Plan

**Base**: [SPEC.md](./SPEC.md)  
**Brand**: Hanzla Outlet – Premium Pakistani Fashion & Lifestyle  
**Tagline**: "Style That Speaks"

---

## 1. Tech Stack Summary

| Layer      | Stack |
|-----------|--------|
| Backend   | FastAPI, SQLAlchemy 2.0, PostgreSQL, JWT (fastapi-users) |
| Frontend  | Next.js 14 App Router, Tailwind, shadcn/ui, Framer Motion, Zustand, TanStack Query |
| Typography | Inter + Playfair Display |
| Colors    | Primary #0A0A0A, Accent Gold #D4AF37, Teal #0F766E, BG #FAFAFA / #0A0A0A |

---

## 2. File Structure

### 2.1 Backend (`backend/`)

```
backend/
├── .env.example
├── .gitignore
├── alembic.ini
├── pyproject.toml                    # or requirements.txt
├── README.md
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── (migrations)
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI app, CORS, routers
│   ├── config.py                    # Settings (DB, JWT, env)
│   ├── database.py                  # Async engine, session, Base
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                  # User (fastapi-users compatible)
│   │   ├── category.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   ├── wishlist.py
│   │   └── address.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── wishlist.py
│   │   └── address.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                  # get_db, get_current_user, etc.
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py            # Aggregates all v1 routes
│   │       ├── auth.py              # fastapi-users routes
│   │       ├── categories.py
│   │       ├── products.py
│   │       ├── cart.py              # Optional server cart logic
│   │       ├── wishlist.py
│   │       ├── orders.py
│   │       ├── addresses.py
│   │       ├── users.py             # Profile, settings
│   │       └── admin/
│   │           ├── __init__.py
│   │           ├── router.py
│   │           ├── products.py      # CRUD products (admin)
│   │           └── categories.py   # CRUD categories (admin)
│   │
│   └── services/                    # Optional business logic
│       ├── __init__.py
│       └── order_service.py
└── tests/
    ├── __init__.py
    ├── conftest.py
    └── api/
        └── test_*.py
```

### 2.2 Frontend (`frontend/`)

```
frontend/
├── .env.local.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── components.json                 # shadcn
├── public/
│   ├── favicon.ico
│   └── (images, logos)
│
├── src/                             # Optional: use app at root if no src
│   ├── app/
│   │   ├── layout.tsx               # Root layout, theme, fonts
│   │   ├── page.tsx                 # Home
│   │   ├── globals.css
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx           # Auth layout if needed
│   │   ├── shop/
│   │   │   └── page.tsx             # Catalog + filters + search
│   │   ├── shop/[slug]/
│   │   │   └── page.tsx             # Product detail (size/color, zoom)
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx             # Multi-step checkout
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Overview
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── addresses/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── about/page.tsx                    # ← NEW
│   ├── contact/page.tsx                  # ← NEW
│   ├── faq/page.tsx                      # ← NEW
│   ├── shipping/page.tsx                 # ← NEW
│   ├── privacy/page.tsx                  # ← NEW
│   └── not-found.tsx
|   |  
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── (others as needed)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ThemeToggle.tsx      # Dark/Light
│   │   │   └── MobileNav.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductSearch.tsx
│   │   │   ├── SizeColorSelector.tsx
│   │   │   └── ImageZoom.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutSteps.tsx
│   │   │   ├── StepAddress.tsx
│   │   │   ├── StepPayment.tsx
│   │   │   └── StepReview.tsx
│   │   └── dashboard/
│   │       ├── OrderCard.tsx
│   │       ├── AddressCard.tsx
│   │       └── ProfileForm.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                   # Axios/fetch base, interceptors
│   │   ├── auth.ts                  # Token, login/logout helpers
│   │   ├── utils.ts                 # cn(), etc.
│   │   └── constants.ts             # API_BASE, categories list
│   │
│   ├── stores/
│   │   ├── cart-store.ts            # Zustand: local + sync
│   │   ├── wishlist-store.ts
│   │   └── theme-store.ts           # Optional: if not only next-themes
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-cart.ts
│   │   ├── use-wishlist.ts
│   │   └── use-media.ts
│   │
│   ├── services/                    # API calls (used by TanStack Query)
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── orders.ts
│   │   ├── wishlist.ts
│   │   └── addresses.ts
│   │
│   └── providers/
│       ├── QueryProvider.tsx        # TanStack Query
│       └── ThemeProvider.tsx        # next-themes for dark/light
```

**Note**: Agar abhi `frontend/app` root pe hai bina `src` ke, to same structure ko `frontend/app/` ke andar rakhen (e.g. `frontend/app/shop/page.tsx`). Components, lib, stores, hooks, services, providers ko `frontend/components/`, `frontend/lib/` etc. root pe rakh sakte hain.

---

## 3. Step-by-Step Development Order

### Phase 0: Setup & Foundation

| Step | Task | Details |
|------|------|--------|
| 0.1 | Backend project init | Create `backend/`, pyproject.toml/requirements.txt (FastAPI, uvicorn, sqlalchemy[asyncio], asyncpg, fastapi-users, python-jose, passlib, alembic) |
| 0.2 | Backend config & DB | `config.py`, `database.py`, `.env.example` (DATABASE_URL, SECRET), Alembic init |
| 0.3 | Frontend deps | Tailwind, shadcn/ui init, Framer Motion, Zustand, @tanstack/react-query, next-themes, Inter + Playfair (font) |
| 0.4 | Design tokens | globals.css: CSS variables for colors (#0A0A0A, #D4AF37, #0F766E, #FAFAFA), dark/light; tailwind theme extend |
| 0.5 | Seed Script | backend/app/seed.py — 8 categories + 30+ realistic products (men, women, watches, etc.)

---

### Phase 1: Backend – Auth & User

| Step | Task | Details |
|------|------|--------|
| 1.1 | User model | `models/user.py` (fastapi-users compatible: id, email, hashed_password, is_active, etc.) |
| 1.2 | Auth setup | fastapi-users with JWT (access + optional refresh), `api/v1/auth.py`, register/login routes |
| 1.3 | API deps | `api/deps.py`: get_db, get_current_user, get_current_superuser (for admin) |
| 1.4 | User profile schema | `schemas/user.py`, optional `api/v1/users.py` for profile (get/update) |

---

### Phase 2: Backend – Catalog (Categories & Products)

| Step | Task | Details |
|------|------|--------|
| 2.1 | Category model | `models/category.py` (id, name, slug, parent_id optional), migration |
| 2.2 | Product model | `models/product.py` (id, name, slug, description, price, category_id, images[], sizes[], colors[], stock, is_active, timestamps) |
| 2.3 | Category CRUD API | `api/v1/categories.py`: list, get by slug/id (public) |
| 2.4 | Products API | `api/v1/products.py`: list with filters (category, price, search), get by slug; pagination |
| 2.5 | Admin – Categories | `api/v1/admin/categories.py`: create, update, delete (superuser) |
| 2.6 | Admin – Products | `api/v1/admin/products.py`: full CRUD (superuser) |

---

### Phase 3: Backend – Cart, Wishlist, Orders, Addresses

| Step | Task | Details |
|------|------|--------|
| 3.1 | Address model | `models/address.py` (user_id, label, street, city, state, zip, phone) |
| 3.2 | Order & OrderItem models | `models/order.py`, `models/order_item.py` (order_id, product_id, size, color, qty, price) |
| 3.3 | Wishlist model | `models/wishlist.py` (user_id, product_id) |
| 3.4 | Migrations | Run Alembic for Address, Order, OrderItem, Wishlist |
| 3.5 | Addresses API | `api/v1/addresses.py`: list, create, update, delete (current user) |
| 3.6 | Wishlist API | `api/v1/wishlist.py`: list, add, remove |
| 3.7 | Orders API | `api/v1/orders.py`: create (checkout), list my orders, get by id |
| 3.8 | Optional cart API | If server cart needed: `api/v1/cart.py`; else cart stays frontend-only (Zustand) + order creation with line items |

---

### Phase 4: Frontend – Core UI & Theme

| Step | Task | Details |
|------|------|--------|
| 4.1 | Layout & theme | Root layout with ThemeProvider (next-themes), Inter + Playfair in layout, ThemeToggle component |
| 4.2 | Header & Footer | Header (logo, nav: Shop, Cart, Wishlist, Login/User menu), Footer; responsive, dark/light |
| 4.3 | shadcn components | Install needed: Button, Card, Input, Select, Tabs, Dialog, Sheet, Skeleton, Badge, Avatar, etc. |
| 4.4 | Loading & error | Global loading.tsx where needed, error.tsx, not-found.tsx; skeleton loaders for lists |

---

### Phase 5: Frontend – Auth

| Step | Task | Details |
|------|------|--------|
| 5.1 | API & auth lib | `lib/api.ts` (base URL, attach JWT), `lib/auth.ts` (store token, login/logout helpers) |
| 5.2 | Auth services | `services/auth.ts`: login, register (call backend) |
| 5.3 | Login/Register pages | `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx` with forms, validation, redirect after success |
| 5.4 | Auth state | useAuth hook (optional) + protect dashboard routes (redirect if not logged in) |

---

### Phase 6: Frontend – Shop & Product Detail

| Step | Task | Details |
|------|------|--------|
| 6.1 | Categories & products services | `services/categories.ts`, `services/products.ts` with TanStack Query (useQuery for list, filters, search) |
| 6.2 | Shop page | `app/shop/page.tsx`: ProductGrid, ProductFilters (category, price, etc.), ProductSearch; URL params for filters |
| 6.3 | ProductCard | ProductCard with image, name, price, quick actions (Add to cart, Wishlist); Framer Motion animations |
| 6.4 | Product detail page | `app/shop/[slug]/page.tsx`: image gallery, ImageZoom, SizeColorSelector, Add to cart, Add to wishlist |
| 6.5 | SEO | Metadata (title, description) for shop and product pages |

---

### Phase 7: Frontend – Cart & Wishlist

| Step | Task | Details |
|------|------|--------|
| 7.1 | Cart store | Zustand store: items (product_id, size, color, qty), add, remove, update qty; persist to localStorage; when user logs in, optional sync with backend if you add cart API later |
| 7.2 | Wishlist store + API | Local wishlist state; sync with backend (services/wishlist.ts + TanStack Query) |
| 7.3 | Cart UI | CartDrawer (sheet), CartItem, CartSummary; Header cart icon with count |
| 7.4 | Cart page | `app/cart/page.tsx`: full cart list, update qty, remove, proceed to checkout |
| 7.5 | Wishlist page | `app/wishlist/page.tsx`: list of wishlist items, remove, move to cart |

---

### Phase 8: Frontend – Checkout

| Step | Task | Details |
|------|------|--------|
| 8.1 | Checkout steps component | CheckoutSteps (stepper UI), StepAddress, StepPayment, StepReview |
| 8.2 | Checkout page | `app/checkout/page.tsx`: multi-step form (address selection/add, payment placeholder or gateway stub, review order), submit → create order via API |
| 8.3 | Order success | Redirect to dashboard/orders or success page with order ID |

---

### Phase 9: Frontend – Dashboard

| Step | Task | Details |
|------|------|--------|
| 9.1 | Dashboard layout | `app/dashboard/layout.tsx`: sidebar or tabs (Overview, Orders, Addresses, Profile, Settings), protected |
| 9.2 | Orders list | `app/dashboard/orders/page.tsx`: fetch orders, OrderCard per order |
| 9.3 | Addresses | `app/dashboard/addresses/page.tsx`: list, add, edit, delete (AddressCard) |
| 9.4 | Profile | `app/dashboard/profile/page.tsx`: display/edit name, email (ProfileForm) |
| 9.5 | Settings | `app/dashboard/settings/page.tsx`: theme preference, password change if backend supports |

---

### Phase 10: Polish & Non-Functional

| Step | Task | Details |
|------|------|--------|
| 10.1 | Loading states | Skeleton on all list/detail pages; button loading states on submit |
| 10.2 | Error handling | Error boundaries, API error toasts/messages, retry where appropriate |
| 10.3 | SEO | Default metadata in layout, per-route metadata, OG tags for product pages |
| 10.4 | Animations | Framer Motion: page transitions, card hover, modals, drawer; consistent easing |
| 10.5 | Responsive | Test breakpoints (mobile, tablet, desktop); touch-friendly buttons and nav |
| 10.6 | Code cleanup | Consistent file names, shared types, remove dead code; env for API URL |

---

## 4. Suggested Branching (Optional)

- `main` – stable
- `develop` – integration
- Feature branches: `feature/auth`, `feature/shop`, `feature/checkout`, `feature/dashboard`, etc.

---

## 5. Environment Variables

**Backend (`.env`)**  
`DATABASE_URL`, `SECRET` (JWT), `CORS_ORIGINS` (e.g. http://localhost:3000)

**Frontend (`.env.local`)**  
`NEXT_PUBLIC_API_URL=http://localhost:8000` (or your backend URL)

---

## 6. Quick Reference – SPEC vs Plan

| SPEC Item | Where in plan |
|-----------|----------------|
| Email + password auth | Phase 1 (backend), Phase 5 (frontend) |
| Product catalog (Men, Women, Watches, etc.) | Phase 2 (categories/products), Phase 6 (shop UI) |
| Advanced filters + search | Phase 2.4 (API), Phase 6.1–6.2 (frontend) |
| Product page (size/color, zoom) | Phase 6.4, components ProductFilters, SizeColorSelector, ImageZoom |
| Cart (local + synced) | Phase 7 (Zustand + optional backend cart) |
| Wishlist | Phase 3.3 + 3.6 (backend), Phase 7.2 + 7.5 (frontend) |
| Multi-step checkout | Phase 8 |
| User dashboard (orders, addresses, profile, settings) | Phase 9 |
| Dark/Light mode | Phase 0.4, 4.1, 4.2, 9.5 |
| Responsive + animations | Phase 4, 6.3, 10.4, 10.5 |
| FastAPI + SQLAlchemy 2.0 + PostgreSQL | Phase 0–3 |
| JWT (fastapi-users) | Phase 1 |
| Admin product management | Phase 2.5–2.6 |
| Next.js 14 App Router, Tailwind, shadcn, Framer Motion, Zustand, TanStack Query | Phase 0.3, 4, 5–10 |
| Inter + Playfair Display | Phase 0.4, 4.1 |
| Loading, error handling, SEO, clean code | Phase 10 |

---

Is plan ko SPEC.md ke saath rakh kar phase-by-phase implement karo; agar kisi phase me scope change ho to SPEC aur PROJECT_PLAN dono ko update karna better hai.
