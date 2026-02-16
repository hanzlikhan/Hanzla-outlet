/**
 * Login page – email/password login using POST /api/v1/auth/jwt/login.
 * Stores JWT token and redirects to home.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import api from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default function LoginPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // FastAPI-users expects form-encoded login
            const formData = new URLSearchParams();
            formData.append("grant_type", "password");
            formData.append("username", email);
            formData.append("password", password);

            const { data } = await api.post("/api/v1/auth/jwt/login", formData.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            setToken(data.access_token);
            await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            router.push("/");
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number; data?: { detail?: string } } };
            if (axiosErr.response?.status === 400) {
                setError("Invalid email or password.");
            } else {
                setError(axiosErr.response?.data?.detail || "Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold">Welcome Back</h1>
                            <p className="mt-2 text-sm text-zinc-500">
                                Sign in to your Hanzla Outlet account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 pr-12 text-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-lg disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-4 w-4" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-zinc-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-medium text-emerald-600 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </main>
        </>
    );
}
