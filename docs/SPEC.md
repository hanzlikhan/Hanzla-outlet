# Hanzla Outlet - Complete Specification

**Brand**: Hanzla Outlet - Premium Pakistani Fashion & Lifestyle
**Tagline**: "Style That Speaks"

**Color Palette**:
- Primary: #0A0A0A (Deep Black)
- Accent Gold: #D4AF37
- Teal Accent: #0F766E
- Light BG: #FAFAFA
- Dark BG: #0A0A0A

**Target**: 18-35 age, premium feel but affordable

**Features List (Must Have)**:
- Full authentication (email + password)
- Product catalog (Men, Women, Watches, Accessories, Shoes, Perfumes)
- Advanced shop filters + search
- Product page with size/color selector, image zoom
- Cart (with local + synced)
- Wishlist
- Checkout (multi-step)
- User dashboard (orders, addresses, profile, settings)
- Dark/Light mode
- Fully responsive + animations

**Backend Requirements**:
- FastAPI + SQLAlchemy 2.0 + PostgreSQL
- JWT Auth (fastapi-users)
- Products, Categories, Orders, OrderItems, Wishlist, Addresses
- Admin endpoints for product management

**Frontend Requirements**:
- Next.js 14 App Router
- Tailwind + shadcn/ui (all components shadcn se)
- Framer Motion (heavy animations)
- Zustand + TanStack Query
- Beautiful typography (Inter + Playfair Display)

**Non-functional**:
- Loading states everywhere
- Proper error handling
- SEO friendly
- Clean, maintainable code