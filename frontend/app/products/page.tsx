/**
 * Products page – Premium product listing with filters and search.
 */

"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    X,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Skeleton from "@/components/ui/Skeleton";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface CategoryRef {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    discount_price: number | null;
    images: string[];
    sizes: string[];
    colors: string[];
    stock: number;
    category_id: number;
    is_active: boolean;
    category: CategoryRef | null;
}

interface ProductListResponse {
    total: number;
    items: Product[];
    page: number;
    size: number;
}

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

interface CategoryListResponse {
    total: number;
    items: CategoryItem[];
}

/* ------------------------------------------------------------------ */
/* Fallback product images                                              */
/* ------------------------------------------------------------------ */

const PRODUCT_FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    "https://images.unsplash.com/photo-1612731486606-2614b4d74921?w=600&q=80",
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
];

/* ------------------------------------------------------------------ */
/* Product Card                                                        */
/* ------------------------------------------------------------------ */

function ProductCard({ product, index }: { product: Product; index: number }) {
    const addToCart = useCartStore((s) => s.addToCart);
    const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlistStore();
    const wishlisted = isWishlisted(product.id);

    const displayPrice = product.discount_price ?? product.price;
    const hasDiscount = product.discount_price !== null && product.discount_price < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
        : 0;

    // Always use a guaranteed-working Unsplash image.
    // API images use via.placeholder.com which is unreliable/blocked.
    const productImage = PRODUCT_FALLBACK_IMAGES[product.id % PRODUCT_FALLBACK_IMAGES.length];

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            product_id: product.id,
            quantity: 1,
            size: product.sizes[0] || null,
            color: product.colors[0] || null,
            name: product.name,
            price: displayPrice,
            image: productImage,
        });
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        wishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="card-premium group overflow-hidden"
        >
            <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                    <img
                        src={productImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {hasDiscount && (
                        <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[10px] font-bold text-black">
                            -{discountPercent}%
                        </span>
                    )}

                    {product.stock === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                            <span className="rounded-full bg-white px-5 py-2 text-xs font-bold text-black">
                                Sold Out
                            </span>
                        </div>
                    )}

                    <button
                        onClick={handleWishlistToggle}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:scale-110 dark:bg-black/80"
                        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            className={`h-4 w-4 transition-colors ${wishlisted ? "fill-gold text-gold" : "text-muted"
                                }`}
                        />
                    </button>

                    {/* Quick Add */}
                    <motion.div
                        initial={{ y: "100%" }}
                        whileHover={{ y: 0 }}
                        className="absolute bottom-0 left-0 right-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex w-full items-center justify-center gap-2 bg-foreground py-3.5 text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-gold hover:text-black disabled:opacity-40"
                        >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {product.stock === 0 ? "Sold Out" : "Add to Cart"}
                        </button>
                    </motion.div>
                </div>
            </Link>

            <div className="p-5">
                {product.category && (
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
                        {product.category.name}
                    </p>
                )}
                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-medium leading-snug transition-colors group-hover:text-gold">
                        {product.name}
                    </h3>
                </Link>
                <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-base font-bold">
                        PKR {displayPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs text-muted-foreground line-through">
                            PKR {product.price.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/* Products Content (uses useSearchParams)                              */
/* ------------------------------------------------------------------ */

function ProductsContent() {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get("category");
    const initialSearch = searchParams.get("search") || "";

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setPage(1);
    }, [categorySlug]);

    const { data: categoriesData } = useQuery<CategoryListResponse>({
        queryKey: ["categories"],
        queryFn: async () => (await api.get("/api/v1/categories/")).data,
    });

    const { data, isLoading, isError } = useQuery<ProductListResponse>({
        queryKey: ["products", categorySlug, debouncedSearch, page],
        queryFn: async () => {
            const params: Record<string, string | number> = { page, size: 20 };
            if (categorySlug) params.category_slug = categorySlug;
            if (debouncedSearch) params.search = debouncedSearch;
            return (await api.get("/api/v1/products/", { params })).data;
        },
    });

    const products = data?.items ?? [];
    const totalPages = data ? Math.ceil(data.total / data.size) : 0;
    const categories = categoriesData?.items ?? [];

    return (
        <>
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Page header */}
                    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                                Collection
                            </p>
                            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                                {categorySlug
                                    ? categories.find((c) => c.slug === categorySlug)?.name || "Products"
                                    : "All Products"}
                            </h1>
                            {data && (
                                <p className="mt-2 text-sm text-muted">
                                    {data.total} product{data.total !== 1 && "s"} found
                                </p>
                            )}
                        </div>

                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-11 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Category sidebar */}
                        {categories.length > 0 && (
                            <aside className="w-full shrink-0 lg:w-60">
                                <div className="card-premium p-5">
                                    <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                                        <SlidersHorizontal className="h-4 w-4 text-gold" />
                                        Categories
                                    </div>
                                    <nav className="flex flex-col gap-1">
                                        <Link
                                            href="/products"
                                            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${!categorySlug
                                                ? "bg-gold/10 text-gold"
                                                : "text-muted hover:bg-surface-hover hover:text-foreground"
                                                }`}
                                        >
                                            All Products
                                        </Link>
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/products?category=${cat.slug}`}
                                                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${categorySlug === cat.slug
                                                    ? "bg-gold/10 text-gold"
                                                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                                                    }`}
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </aside>
                        )}

                        {/* Grid */}
                        <div className="flex-1">
                            {isLoading && (
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="card-premium overflow-hidden">
                                            <Skeleton className="aspect-[3/4] w-full" />
                                            <div className="p-5">
                                                <Skeleton className="mb-2 h-3 w-16" />
                                                <Skeleton className="mb-3 h-4 w-3/4" />
                                                <Skeleton className="h-5 w-1/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {isError && (
                                <div className="card-premium border-red-200 p-12 text-center dark:border-red-800">
                                    <p className="font-semibold text-red-500">Failed to load products.</p>
                                    <p className="mt-1 text-sm text-muted">Ensure the backend server is running.</p>
                                </div>
                            )}

                            {!isLoading && !isError && products.length === 0 && (
                                <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border py-20 text-center">
                                    <ShoppingBag className="h-16 w-16 text-muted-foreground/20" />
                                    <p className="text-lg font-semibold">No products found</p>
                                    <p className="text-sm text-muted">
                                        {debouncedSearch
                                            ? `No results for "${debouncedSearch}"`
                                            : "Check back later for new arrivals!"}
                                    </p>
                                    {(debouncedSearch || categorySlug) && (
                                        <Link
                                            href="/products"
                                            onClick={() => setSearchTerm("")}
                                            className="btn-gold rounded-full px-8 py-3 text-sm font-semibold"
                                        >
                                            View All Products
                                        </Link>
                                    )}
                                </div>
                            )}

                            {products.length > 0 && (
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {products.map((product, i) => (
                                        <ProductCard key={product.id} product={product} index={i} />
                                    ))}
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-all hover:border-gold hover:text-gold disabled:opacity-30"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-muted">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-all hover:border-gold hover:text-gold disabled:opacity-30"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Page (Suspense wrapper)                                              */
/* ------------------------------------------------------------------ */

export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <>
                    <Header />
                    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="card-premium overflow-hidden">
                                    <Skeleton className="aspect-[3/4] w-full" />
                                    <div className="p-5">
                                        <Skeleton className="mb-2 h-3 w-16" />
                                        <Skeleton className="mb-3 h-4 w-3/4" />
                                        <Skeleton className="h-5 w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </>
            }
        >
            <ProductsContent />
        </Suspense>
    );
}
