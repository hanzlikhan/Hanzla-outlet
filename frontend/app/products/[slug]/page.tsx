/**
 * Product Detail Page — /products/[slug]
 * Fetches a single product by slug and displays full details.
 */

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Heart,
    Loader2,
    Minus,
    Package,
    Plus,
    Shield,
    ShoppingBag,
    Star,
    Truck,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* ------------------------------------------------------------------ */
/* Fallback images                                                     */
/* ------------------------------------------------------------------ */

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    "https://images.unsplash.com/photo-1612731486606-2614b4d74921?w=800&q=80",
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
];

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
    is_active: boolean;
    category: CategoryRef | null;
    created_at: string;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const addToCart = useCartStore((s) => s.addToCart);
    const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlistStore();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const { data: product, isLoading, error } = useQuery<Product>({
        queryKey: ["product", slug],
        queryFn: async () => {
            const { data } = await api.get(`/api/v1/products/${slug}`);
            return data;
        },
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <>
                <Header />
                <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-gold" />
                        <p className="text-sm text-muted">Loading product...</p>
                    </div>
                </main>
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Header />
                <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-4 px-4 text-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                    <h1 className="text-2xl font-bold">Product Not Found</h1>
                    <p className="text-sm text-muted">The product you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/products"
                        className="btn-gold mt-2 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Shop
                    </Link>
                </main>
                <Footer />
            </>
        );
    }

    // Always use guaranteed-working Unsplash images.
    // API images use via.placeholder.com which is unreliable/blocked.
    const images = [FALLBACK_IMAGES[product.id % FALLBACK_IMAGES.length]];

    const displayPrice = product.discount_price ?? product.price;
    const hasDiscount = product.discount_price !== null && product.discount_price < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
        : 0;
    const wishlisted = isWishlisted(product.id);
    const inStock = product.stock > 0;

    const handleAddToCart = () => {
        addToCart({
            product_id: product.id,
            quantity,
            size: selectedSize,
            color: selectedColor,
            name: product.name,
            price: displayPrice,
            image: images[0],
        });
    };

    const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);

    return (
        <>
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
                    <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="transition-colors hover:text-foreground">Shop</Link>
                    {product.category && (
                        <>
                            <span>/</span>
                            <Link
                                href={`/products?category=${product.category.slug}`}
                                className="transition-colors hover:text-foreground"
                            >
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-foreground">{product.name}</span>
                </nav>

                <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* ── Left: Image Gallery ───────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-surface">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    src={images[activeImage]}
                                    alt={product.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="aspect-square w-full object-cover"
                                />
                            </AnimatePresence>

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-white"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-white"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}

                            {hasDiscount && (
                                <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-black">
                                    -{discountPercent}% OFF
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="mt-4 flex gap-3 overflow-x-auto">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${i === activeImage
                                            ? "border-gold shadow-md shadow-gold/20"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt="" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* ── Right: Product Info ────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col"
                    >
                        {product.category && (
                            <Link
                                href={`/products?category=${product.category.slug}`}
                                className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold"
                            >
                                {product.category.name}
                            </Link>
                        )}

                        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                            {product.name}
                        </h1>

                        {/* Rating placeholder */}
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                                ))}
                            </div>
                            <span className="text-sm text-muted">(No reviews yet)</span>
                        </div>

                        {/* Price */}
                        <div className="mt-6 flex items-baseline gap-3">
                            <span className="text-3xl font-bold">
                                PKR {displayPrice.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-lg text-muted line-through">
                                    PKR {product.price.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="mt-6 leading-relaxed text-muted">
                            {product.description}
                        </p>

                        {/* Sizes */}
                        {product.sizes.length > 0 && (
                            <div className="mt-6">
                                <p className="mb-3 text-sm font-semibold uppercase tracking-wider">Size</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                                            className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${selectedSize === size
                                                ? "border-gold bg-gold/10 text-gold"
                                                : "border-border hover:border-foreground/30"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        {product.colors.length > 0 && (
                            <div className="mt-6">
                                <p className="mb-3 text-sm font-semibold uppercase tracking-wider">Color</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                                            className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${selectedColor === color
                                                ? "border-gold bg-gold/10 text-gold"
                                                : "border-border hover:border-foreground/30"
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mt-6">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wider">Quantity</p>
                            <div className="inline-flex items-center gap-3 rounded-xl border border-border p-1">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-surface-hover"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-[2.5rem] text-center text-lg font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-surface-hover"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Stock status */}
                        <p className={`mt-4 text-sm font-medium ${inStock ? "text-emerald-600" : "text-red-500"}`}>
                            {inStock ? `✓ In stock (${product.stock} available)` : "✗ Out of stock"}
                        </p>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="btn-gold flex flex-1 items-center justify-center gap-2.5 rounded-full py-4 text-sm font-bold uppercase tracking-wider disabled:opacity-50"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                Add to Bag
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                                className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all ${wishlisted
                                    ? "border-red-500 bg-red-50 text-red-500 dark:bg-red-900/20"
                                    : "border-border hover:border-foreground/30"
                                    }`}
                            >
                                <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500" : ""}`} />
                            </motion.button>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-border p-5">
                            {[
                                { icon: Truck, label: "Free Delivery", desc: "Over PKR 3,000" },
                                { icon: Shield, label: "Secure Payment", desc: "100% Protected" },
                                { icon: Package, label: "Easy Returns", desc: "7-Day Policy" },
                            ].map((badge) => (
                                <div key={badge.label} className="flex flex-col items-center gap-1.5 text-center">
                                    <badge.icon className="h-5 w-5 text-gold" />
                                    <p className="text-[11px] font-semibold">{badge.label}</p>
                                    <p className="text-[10px] text-muted">{badge.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
