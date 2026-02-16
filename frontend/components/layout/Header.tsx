/**
 * Header – Top navigation bar with logo, nav links, cart icon + badge.
 * Cart icon click opens CartDrawer.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Menu, ShoppingCart, User, X } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const [cartOpen, setCartOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const totalItems = useCartStore((s) => s.totalItems());
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <>
            <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight">
                            Hanzla<span className="text-emerald-600">Outlet</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <Link
                            href="/"
                            className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        >
                            Shop
                        </Link>
                        <Link
                            href="/categories"
                            className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        >
                            Categories
                        </Link>
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="relative rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            aria-label="Wishlist"
                        >
                            <Heart className="h-5 w-5" />
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            aria-label="Cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white"
                                >
                                    {totalItems > 9 ? "9+" : totalItems}
                                </motion.span>
                            )}
                        </button>

                        {/* User / Auth */}
                        {isAuthenticated ? (
                            <div className="hidden items-center gap-2 md:flex">
                                <Link
                                    href="/orders"
                                    className="rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    aria-label="My Orders"
                                >
                                    <User className="h-5 w-5" />
                                </Link>
                                <button
                                    onClick={logout}
                                    className="rounded-full px-4 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 md:block dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-full p-2 md:hidden"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-zinc-200 bg-white px-4 py-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950"
                    >
                        <nav className="flex flex-col gap-3">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Home</Link>
                            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Shop</Link>
                            <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Categories</Link>
                            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Wishlist</Link>
                            <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">My Orders</Link>
                            {isAuthenticated ? (
                                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-sm font-medium text-red-500">
                                    Logout ({user?.email})
                                </button>
                            ) : (
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-emerald-600">
                                    Login / Register
                                </Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </header>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
}
