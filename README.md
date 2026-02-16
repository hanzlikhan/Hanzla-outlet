# Hanzla Outlet - Premium E-commerce Platform

A modern, full-stack e-commerce application built with **Next.js 14**, **FastAPI**, **Supabase**, and **Tailwind CSS**. Designed for performance, scalability, and a premium user experience.

![Status](https://img.shields.io/badge/Status-Active_Development-emerald)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion (Animations)
- **State Management:** Zustand (Persisted Cart/Wishlist), TanStack Query (Server State)
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL (via Supabase), SQLAlchemy 2.0 (Async)
- **Authentication:** JWT (FastAPI Users)
- **Validation:** Pydantic v2
- **Migrations:** Alembic

## ✨ Features

- **Storefront**: Modern landing page with featured collections and responsive design.
- **User Accounts**: Secure registration, login (JWT), and profile management.
- **Product Catalog**: Browse products by category, view details (sizes, colors).
- **Shopping Cart**: Real-time cart management with local storage persistence.
- **Wishlist**: Save favorite items for later (synced with backend).
- **Checkout**: Multi-step checkout flow (Address → Payment → Review).
- **Order Management**: Order history, status tracking, and order details.
- **Admin Panel**: (Coming Soon) Manage products, categories, and orders.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL Database (or Supabase project)

### 1. Clone the Repository
```bash
git clone https://github.com/hanzlikhan/Hanzla-outlet.git
cd Hanzla-outlet
```

### 2. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment
cp .env.example .env
# Edit .env and add your DATABASE_URL and SECRET
```

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Configure Environment
cp .env.example .env.local
# Edit .env.local if your backend URL differs
```

## 🏃‍♂️ Running the Project

**Terminal 1 (Backend):**
```bash
cd backend
uvicorn app.main:app --reload
```
API running at: `http://localhost:8000`

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
App running at: `http://localhost:3000`

## 📂 Project Structure
```
Hanzla-outlet/
├── backend/            # FastAPI Application
│   ├── alembic/        # Database Migrations
│   ├── app/            # Source Code
│   │   ├── api/        # API Routes (v1)
│   │   ├── models/     # SQLAlchemy Database Models
│   │   ├── schemas/    # Pydantic Schemas
│   │   └── main.py     # Entry Point
│   └── requirements.txt
│
└── frontend/           # Next.js Application
    ├── app/            # App Router Pages
    ├── components/     # Reusable UI Components
    ├── lib/            # Utilities (API, Auth)
    ├── stores/         # Zustand State Stores
    └── public/         # Static Assets
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
This project is licensed under the MIT License.
