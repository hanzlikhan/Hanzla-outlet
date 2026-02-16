/**
 * Orders list page – shows all orders for the current user.
 * Fetches from GET /api/v1/orders/ via TanStack Query.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Package, ShoppingBag, Truck, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Skeleton from "@/components/ui/Skeleton";

interface OrderListItem {
    id: number;
    status: string;
    total_amount: number;
    payment_method: string;
    created_at: string;
    items: { id: number; product_name: string | null; quantity: number }[];
}

interface OrderListResponse {
    total: number;
    items: OrderListItem[];
    page: number;
    size: number;
}

const STATUS_ICONS: Record<string, typeof Clock> = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle2,
    cancelled: XCircle,
};

const STATUS_COLORS: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
    processing: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    shipped: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
    delivered: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    cancelled: "text-red-600 bg-red-50 dark:bg-red-900/20",
};

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.replace("/login");
    }, [authLoading, isAuthenticated, router]);

    const { data, isLoading, isError } = useQuery<OrderListResponse>({
        queryKey: ["orders"],
        queryFn: async () => (await api.get("/api/v1/orders/")).data,
        enabled: isAuthenticated,
    });

    const StatusIcon = (status: string) => STATUS_ICONS[status] || Clock;

    return (
        <>
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="mb-8 text-2xl font-bold sm:text-3xl">My Orders</h1>

                    {isLoading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
                            <p className="text-red-600">Failed to load orders.</p>
                        </div>
                    )}

                    {!isLoading && !isError && data?.items.length === 0 && (
                        <div className="flex flex-col items-center gap-4 py-20 text-center">
                            <ShoppingBag className="h-20 w-20 text-zinc-200 dark:text-zinc-700" />
                            <p className="text-lg text-zinc-500">No orders yet</p>
                            <Link
                                href="/products"
                                className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}

                    {data && data.items.length > 0 && (
                        <div className="space-y-4">
                            {data.items.map((order, idx) => {
                                const Icon = StatusIcon(order.status);
                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                                        >
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="font-bold">Order #{order.id}</span>
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.pending
                                                            }`}
                                                    >
                                                        <Icon className="h-3 w-3" />
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-zinc-500">
                                                    {new Date(order.created_at).toLocaleDateString("en-PK", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                    {" · "}
                                                    {order.items.length} item{order.items.length !== 1 && "s"}
                                                    {" · "}
                                                    <span className="font-medium text-black dark:text-white">
                                                        PKR {order.total_amount.toLocaleString()}
                                                    </span>
                                                </p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-zinc-400" />
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </main>
        </>
    );
}
