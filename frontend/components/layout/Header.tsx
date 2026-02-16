/**
 * Premium Header v3 — Hanzla Outlet
 * Ultra-modern header with animated underlines, slide-down search,
 * premium user menu, improved icons, and gold accent system.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    Heart,
    LogOut,
    Menu,
    Package,
    Search,
    ShoppingBag,
    User,
    X,
    Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/stores/cart-store";
import CartDrawer from "@/components/cart/CartDrawer";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "Categories", href: "/categories" },
];

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const [cartOpen, setCartOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    const cartItems = useCartStore((s) => s.items);
    const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const { isAuthenticated, user, logout } = useAuth();

    const userMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setSearchExpanded(false);
    }, [pathname]);

    useEffect(() => {
        if (searchExpanded) searchInputRef.current?.focus();
    }, [searchExpanded]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchExpanded(false);
            setSearchQuery("");
        }
    };

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        router.push("/");
    };

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            {/* ── Promo bar ───────────────────────────────────── */}
            <div className="bg-[#0A0A0A] text-center">
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2">
                    <Sparkles className="h-3.5 w-3.5 text-gold" />
                    <p className="text-[11px] font-medium tracking-wide text-white/70">
                        FREE SHIPPING ON ORDERS ABOVE PKR 3,000 —{" "}
                        <Link href="/products" className="font-semibold text-gold underline-offset-2 hover:underline">
                            SHOP NOW
                        </Link>
                    </p>
                    <Sparkles className="h-3.5 w-3.5 text-gold" />
                </div>
            </div>

            {/* ── Main header ─────────────────────────────────── */}
            <header
                className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
                        ? "border-b border-white/[0.06] bg-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:bg-[#0A0A0A]/85"
                        : "border-b border-border bg-white dark:bg-[#0A0A0A]"
                    }`}
            >
                <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* ── Left: Logo ──────────────────────────── */}
                    <Link href="/" className="group relative z-10 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-dark shadow-md shadow-gold/20 transition-transform group-hover:scale-105">
                            <span className="text-sm font-black text-black">H</span>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-base font-bold leading-none tracking-tight">
                                HANZLA
                            </p>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-muted">
                                OUTLET
                            </p>
                        </div>
                    </Link>

                    {/* ── Center: Nav links ────────────────────── */}
                    <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group relative px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors ${isActive(link.href)
                                        ? "text-foreground"
                                        : "text-muted hover:text-foreground"
                                    }`}
                            >
                                {link.label}
                                <motion.span
                                    className="absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gold"
                                    initial={false}
                                    animate={{ width: isActive(link.href) ? "60%" : "0%" }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* ── Right: Improved Action Icons ─────────── */}
                    <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                        {/* Search */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSearchExpanded(!searchExpanded)}
                            className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 ${searchExpanded
                                    ? "border-gold/30 bg-gold/10 text-gold shadow-sm shadow-gold/10"
                                    : "border-transparent text-foreground/50 hover:border-border hover:bg-surface-hover hover:text-gold"
                                }`}
                            aria-label="Search"
                        >
                            <AnimatePresence mode="wait">
                                {searchExpanded ? (
                                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <X className="h-[20px] w-[20px]" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="s" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <Search className="h-[20px] w-[20px]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Wishlist */}
                        <motion.div whileTap={{ scale: 0.9 }}>
                            <Link
                                href="/wishlist"
                                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-foreground/50 transition-all duration-200 hover:border-border hover:bg-surface-hover hover:text-red-500"
                                aria-label="Wishlist"
                            >
                                <Heart className="h-[20px] w-[20px] transition-transform group-hover:scale-110" />
                            </Link>
                        </motion.div>

                        {/* Cart */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCartOpen(true)}
                            className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-foreground/50 transition-all duration-200 hover:border-border hover:bg-surface-hover hover:text-gold"
                            aria-label="Cart"
                        >
                            <ShoppingBag className="h-[20px] w-[20px] transition-transform group-hover:scale-110" />
                            {mounted && totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black shadow-md shadow-gold/30 ring-2 ring-white dark:ring-[#0A0A0A]"
                                >
                                    {totalItems > 9 ? "9+" : totalItems}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Gradient divider */}
                        <div className="mx-1 hidden h-7 w-px bg-gradient-to-b from-transparent via-border to-transparent sm:block" />

                        {/* User */}
                        {isAuthenticated ? (
                            <div ref={userMenuRef} className="relative">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className={`flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-3 transition-all ${userMenuOpen
                                            ? "bg-gold/10"
                                            : "hover:bg-surface-hover"
                                        }`}
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-dark text-xs font-bold text-black shadow-sm">
                                        {user?.email?.charAt(0).toUpperCase() || "U"}
                                    </span>
                                    <ChevronDown
                                        className={`hidden h-3.5 w-3.5 text-muted transition-transform sm:block ${userMenuOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </motion.button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                            transition={{ duration: 0.12 }}
                                            className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/[0.08]"
                                        >
                                            <div className="bg-gradient-to-r from-gold/5 to-transparent px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dark text-sm font-bold text-black">
                                                        {user?.email?.charAt(0).toUpperCase() || "U"}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold">{user?.email}</p>
                                                        <p className="text-[11px] text-muted">Premium Member</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-1.5">
                                                {[
                                                    { icon: User, label: "My Profile", href: "/profile" },
                                                    { icon: Package, label: "My Orders", href: "/orders" },
                                                    { icon: Heart, label: "Wishlist", href: "/wishlist" },
                                                ].map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-surface-hover hover:text-foreground"
                                                    >
                                                        <item.icon className="h-4 w-4" />
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="border-t border-border py-1.5">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Sign out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-[13px] font-semibold text-background transition-all hover:bg-foreground/85 sm:flex"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Mobile menu */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-foreground/50 transition-all hover:border-border hover:bg-surface-hover hover:text-foreground md:hidden"
                            aria-label="Menu"
                        >
                            <AnimatePresence mode="wait">
                                {mobileMenuOpen ? (
                                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <X className="h-5 w-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <Menu className="h-5 w-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* ── Expandable search bar ────────────────────── */}
                <AnimatePresence>
                    {searchExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden border-t border-border"
                        >
                            <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
                                <form onSubmit={handleSearch} className="relative">
                                    <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search for products, categories, brands..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-2xl border border-border bg-surface py-3.5 pl-12 pr-12 text-sm transition-all placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="submit"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-gold px-3 py-1.5 text-[11px] font-bold text-black transition-colors hover:bg-gold-light"
                                        >
                                            Search
                                        </button>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Mobile nav ───────────────────────────────── */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden border-t border-border md:hidden"
                        >
                            <nav className="px-4 py-4">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${isActive(link.href)
                                                ? "bg-gold/10 text-gold"
                                                : "hover:bg-surface-hover"
                                            }`}
                                    >
                                        {link.label}
                                        {isActive(link.href) && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                                        )}
                                    </Link>
                                ))}
                                {!isAuthenticated && (
                                    <Link
                                        href="/login"
                                        className="btn-gold mt-3 block rounded-full px-6 py-3.5 text-center text-sm font-bold uppercase tracking-wider"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
}
