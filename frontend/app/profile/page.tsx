/**
 * User Profile Page — /profile
 * Displays and allows editing of user details (full name, phone).
 * Also lists user addresses and links to orders.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Package,
    Loader2,
    Save,
    ArrowLeft,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface Address {
    id: number;
    label: string;
    street: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
    is_default: boolean;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Sync state with user data
    useEffect(() => {
        if (user) {
            setFullName(user.full_name || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch addresses
    const { data: addresses, isLoading: addrLoading } = useQuery<Address[]>({
        queryKey: ["addresses"],
        queryFn: async () => (await api.get("/api/v1/addresses/")).data,
        enabled: isAuthenticated,
    });

    // Update profile mutation
    const updateMutation = useMutation({
        mutationFn: async (data: { full_name?: string; phone?: string }) => {
            const { data: updatedUser } = await api.patch("/api/v1/users/me", data);
            return updatedUser;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            setSuccessMsg("Profile updated successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        },
        onError: (err: any) => {
            setErrorMsg(err?.response?.data?.detail || "Failed to update profile.");
            setTimeout(() => setErrorMsg(""), 3000);
        },
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({ full_name: fullName, phone });
    };

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <>
            <Header />
            <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                        <p className="mt-1 text-sm text-muted">Manage your account settings and addresses.</p>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            router.push("/");
                        }}
                        className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-surface-hover hover:text-red-500"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left: Account Details */}
                    <div className="lg:col-span-2">
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-premium p-6 sm:p-8"
                        >
                            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                                <User className="h-5 w-5 text-gold" />
                                Account Details
                            </h2>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                {/* Email (Read-only) */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                                        Email Address
                                    </label>
                                    <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-border bg-surface-hover px-4 text-sm text-foreground/50">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </div>
                                    <p className="mt-1.5 text-[10px] text-muted-foreground">Email cannot be changed.</p>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Full Name */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Your full name"
                                            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="03XX XXXXXXX"
                                                className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {successMsg && (
                                    <p className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-600 dark:bg-emerald-900/20">
                                        {successMsg}
                                    </p>
                                )}
                                {errorMsg && (
                                    <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-900/20">
                                        {errorMsg}
                                    </p>
                                )}

                                <div className="flex justify-end b-0">
                                    <button
                                        type="submit"
                                        disabled={updateMutation.isPending}
                                        className="btn-gold flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold disabled:opacity-50"
                                    >
                                        {updateMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.section>

                        {/* Recent Activity / Orders Link */}
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface"
                        >
                            <Link
                                href="/orders"
                                className="flex items-center justify-between p-6 transition-colors hover:bg-surface-hover"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Order History</h3>
                                        <p className="text-sm text-muted">View your recent orders and tracking.</p>
                                    </div>
                                </div>
                                <ArrowLeft className="h-5 w-5 rotate-180 text-muted" />
                            </Link>
                        </motion.section>
                    </div>

                    {/* Right: Addresses */}
                    <div className="space-y-6">
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card-premium p-6"
                        >
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                                <MapPin className="h-5 w-5 text-gold" />
                                Addresses
                            </h2>

                            {addrLoading ? (
                                <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-hover" />
                                    ))}
                                </div>
                            ) : addresses && addresses.length > 0 ? (
                                <div className="space-y-4">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            className="rounded-xl border border-border p-4 transition-colors hover:bg-surface-hover"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold">{addr.label}</span>
                                                {addr.is_default && (
                                                    <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs text-muted">
                                                {addr.street}, {addr.city}, {addr.province}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted/60">{addr.phone}</p>
                                        </div>
                                    ))}
                                    <Link
                                        href="/checkout"
                                        className="mt-4 block text-center text-xs font-bold uppercase tracking-widest text-gold hover:underline"
                                    >
                                        Manage Addresses at Checkout
                                    </Link>
                                </div>
                            ) : (
                                <div className="py-4 text-center">
                                    <p className="text-sm text-muted">No addresses saved yet.</p>
                                    <Link
                                        href="/checkout"
                                        className="mt-2 block text-xs font-bold uppercase tracking-widest text-gold hover:underline"
                                    >
                                        Add address at checkout
                                    </Link>
                                </div>
                            )}
                        </motion.section>

                        <div className="rounded-2xl bg-gold/5 p-6 border border-gold/10">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gold">Membership Status</h3>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gold flex items-center justify-center text-black font-bold text-lg">
                                    P
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Premium Gold Member</p>
                                    <p className="text-xs text-muted">Since Feb 2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
