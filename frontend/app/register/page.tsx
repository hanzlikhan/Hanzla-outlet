/**
 * Register page – Premium design with gold accents.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import api from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default function RegisterPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        email: "",
        password: "",
        full_name: "",
        phone: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await api.post("/api/v1/auth/register", form);

            const loginData = new URLSearchParams();
            loginData.append("grant_type", "password");
            loginData.append("username", form.email);
            loginData.append("password", form.password);

            const { data } = await api.post("/api/v1/auth/jwt/login", loginData.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            setToken(data.access_token);
            await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            router.push("/");
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number; data?: { detail?: string } } };
            if (axiosErr.response?.status === 400) {
                setError(axiosErr.response?.data?.detail || "Registration failed. User may already exist.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClasses =
        "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

    return (
        <>
            <Header />
            <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="card-premium p-8 sm:p-10">
                        <div className="mb-8 text-center">
                            <Link href="/" className="mb-4 inline-block">
                                <span className="text-2xl font-bold">
                                    <span className="text-gold-shimmer">HANZLA</span>
                                    <span className="ml-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-muted">
                                        OUTLET
                                    </span>
                                </span>
                            </Link>
                            <h1 className="text-2xl font-bold">Create Account</h1>
                            <p className="mt-2 text-sm text-muted">
                                Join the Hanzla family today
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                                <input
                                    type="text"
                                    value={form.full_name}
                                    onChange={(e) => update("full_name", e.target.value)}
                                    required
                                    placeholder="Muhammad Hanzla"
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">Phone</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => update("phone", e.target.value)}
                                    placeholder="03001234567"
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={(e) => update("password", e.target.value)}
                                        required
                                        minLength={8}
                                        placeholder="Min 8 characters"
                                        className={`${inputClasses} pr-12`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-gold flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold uppercase tracking-wider disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4" />
                                        Create Account
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-gold transition-colors hover:text-gold-light">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </main>
        </>
    );
}
