/**
 * Categories page – Premium category showcase.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, FolderOpen, Layers } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Skeleton from "@/components/ui/Skeleton";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parent_id: number | null;
}

interface CategoryListResponse {
    total: number;
    items: CategoryItem[];
    page: number;
    size: number;
}

/* ------------------------------------------------------------------ */
/* Images for categories                                                */
/* ------------------------------------------------------------------ */

const CATEGORY_IMAGES: Record<string, string> = {
    men: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
    women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    watches: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    accessories: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    ethnic: "https://images.unsplash.com/photo-1610030469668-7e40673c2cd0?w=800&q=80",
    western: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CategoriesPage() {
    const { data, isLoading, isError } = useQuery<CategoryListResponse>({
        queryKey: ["categories"],
        queryFn: async () => (await api.get("/api/v1/categories/")).data,
    });

    const categories = data?.items ?? [];

    return (
        <>
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                            Collections
                        </p>
                        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                            Browse Categories
                        </h1>
                        <p className="mt-3 text-muted">
                            Explore our curated collections for every style and occasion
                        </p>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
                            ))}
                        </div>
                    )}

                    {/* Error */}
                    {isError && (
                        <div className="card-premium border-red-200 p-12 text-center dark:border-red-800">
                            <p className="font-semibold text-red-500">Failed to load categories.</p>
                            <p className="mt-1 text-sm text-muted">Ensure the backend server is running.</p>
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && !isError && categories.length === 0 && (
                        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border py-20 text-center">
                            <FolderOpen className="h-16 w-16 text-muted-foreground/20" />
                            <p className="text-lg font-semibold">No categories yet</p>
                            <Link
                                href="/products"
                                className="btn-gold rounded-full px-8 py-3 text-sm font-semibold"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    )}

                    {/* Category grid */}
                    {categories.length > 0 && (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {categories.map((cat, i) => (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                >
                                    <Link
                                        href={`/products?category=${cat.slug}`}
                                        className="group relative block overflow-hidden rounded-2xl"
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden">
                                            <Image
                                                src={CATEGORY_IMAGES[cat.slug] || DEFAULT_IMAGE}
                                                alt={cat.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-8">
                                            <h3 className="text-2xl font-bold text-white">
                                                {cat.name}
                                            </h3>
                                            {cat.description && (
                                                <p className="mt-2 line-clamp-2 text-sm text-white/60">
                                                    {cat.description}
                                                </p>
                                            )}
                                            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                                                Shop Collection
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
            <Footer />
        </>
    );
}
