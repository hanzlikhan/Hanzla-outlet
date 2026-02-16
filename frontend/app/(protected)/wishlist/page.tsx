/**
 * Wishlist page – shows user's wishlisted products.
 * Fetches from GET /api/v1/wishlist/ via TanStack Query.
 * Protected route (inside (protected) group).
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import Skeleton from "@/components/ui/Skeleton";

interface WishlistProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
    images: string[];
    sizes: string[];
    colors: string[];
}

interface WishlistItem {
    product_id: number;
    added_at: string;
    product: WishlistProduct;
}

export default function WishlistPage() {
    const queryClient = useQueryClient();
    const addToCart = useCartStore((s) => s.addToCart);
    const removeFromWishlistStore = useWishlistStore((s) => s.removeFromWishlist);

    // Fetch wishlist from backend
    const { data: items, isLoading, isError } = useQuery<WishlistItem[]>({
        queryKey: ["wishlist"],
        queryFn: async () => {
            const { data } = await api.get("/api/v1/wishlist/");
            return data;
        },
    });

    // Remove mutation
    const removeMutation = useMutation({
        mutationFn: async (productId: number) => {
            await api.delete(`/api/v1/wishlist/remove/${productId}`);
            return productId;
        },
        onSuccess: (productId) => {
            removeFromWishlistStore(productId);
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
    });

    // Add to cart handler
    const handleAddToCart = (product: WishlistProduct) => {
        addToCart({
            product_id: product.id,
            quantity: 1,
            size: product.sizes[0] || null,
            color: product.colors[0] || null,
            name: product.name,
            price: product.discount_price ?? product.price,
            image: product.images[0] || undefined,
        });
    };

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="mb-8 flex items-center gap-3">
                    <Heart className="h-7 w-7 text-rose-500" />
                    <h1 className="text-2xl font-bold sm:text-3xl">My Wishlist</h1>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                                <Skeleton className="mb-4 h-48 w-full rounded-xl" />
                                <Skeleton className="mb-2 h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
                        <p className="font-medium text-red-600">Failed to load wishlist.</p>
                        <button
                            onClick={() => queryClient.invalidateQueries({ queryKey: ["wishlist"] })}
                            className="mt-3 rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !isError && items?.length === 0 && (
                    <div className="flex flex-col items-center gap-4 py-20 text-center">
                        <Heart className="h-20 w-20 text-zinc-200 dark:text-zinc-700" />
                        <p className="text-lg text-zinc-500">Your wishlist is empty</p>
                        <a
                            href="/products"
                            className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
                        >
                            Browse Products
                        </a>
                    </div>
                )}

                {/* Product grid */}
                {items && items.length > 0 && (
                    <AnimatePresence mode="popLayout">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map((item) => (
                                <motion.div
                                    key={item.product_id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                        {item.product.images[0] ? (
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Heart className="h-12 w-12 text-zinc-300" />
                                            </div>
                                        )}

                                        {/* Remove btn */}
                                        <button
                                            onClick={() => removeMutation.mutate(item.product_id)}
                                            disabled={removeMutation.isPending}
                                            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-red-50 hover:text-red-500 dark:bg-zinc-900/90"
                                            aria-label="Remove from wishlist"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="mb-1 text-sm font-semibold leading-tight">
                                            {item.product.name}
                                        </h3>
                                        <div className="mb-3 flex items-center gap-2">
                                            {item.product.discount_price ? (
                                                <>
                                                    <span className="font-bold text-emerald-600">
                                                        PKR {item.product.discount_price.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-zinc-400 line-through">
                                                        PKR {item.product.price.toLocaleString()}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="font-bold">
                                                    PKR {item.product.price.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(item.product)}
                                            className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                        >
                                            <ShoppingCart className="h-3.5 w-3.5" />
                                            Add to Cart
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </motion.div>
        </main>
    );
}
