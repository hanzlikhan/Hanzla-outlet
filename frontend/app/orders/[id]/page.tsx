/**
 * Order detail / success page.
 * Shows order info after successful placement or when visiting /orders/[id].
 * Fetches from GET /api/v1/orders/{order_id}.
 */

"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    ChevronLeft,
    Clock,
    MapPin,
    Package,
    Truck,
    XCircle,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Skeleton from "@/components/ui/Skeleton";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: number;
    size: string | null;
    color: string | null;
    product_name: string | null;
    product_slug: string | null;
    product_image: string | null;
}

interface Address {
    id: number;
    label: string;
    street: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
}

interface Order {
    id: number;
    user_id: number;
    status: string;
    total_amount: number;
    payment_method: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
    shipping_address: Address | null;
}

const STATUS_CONFIG: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
    pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    shipped: { icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    delivered: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function OrderDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const orderId = params.id;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.replace("/login");
    }, [authLoading, isAuthenticated, router]);

    const {
        data: order,
        isLoading,
        isError,
    } = useQuery<Order>({
        queryKey: ["order", orderId],
        queryFn: async () => (await api.get(`/api/v1/orders/${orderId}`)).data,
        enabled: isAuthenticated && !!orderId,
    });

    const statusCfg = order ? STATUS_CONFIG[order.status] || STATUS_CONFIG.pending : STATUS_CONFIG.pending;
    const StatusIcon = statusCfg.icon;

    return (
        <>
            <Header />
            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                {/* Back link */}
                <button
                    onClick={() => router.push("/orders")}
                    className="mb-6 flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-black dark:hover:text-white"
                >
                    <ChevronLeft className="h-4 w-4" />
                    All Orders
                </button>

                {/* Loading */}
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-60 w-full rounded-xl" />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
                        <p className="font-medium text-red-600">Order not found or access denied.</p>
                        <button
                            onClick={() => router.push("/orders")}
                            className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Back to Orders
                        </button>
                    </div>
                )}

                {/* Order detail */}
                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Success banner (for fresh orders) */}
                        {order.status === "pending" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-4 rounded-2xl bg-emerald-50 p-6 dark:bg-emerald-900/20"
                            >
                                <CheckCircle2 className="h-10 w-10 flex-shrink-0 text-emerald-600" />
                                <div>
                                    <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">
                                        Order Placed Successfully!
                                    </h2>
                                    <p className="text-sm text-emerald-600">
                                        Thank you for your purchase. We&apos;ll process it shortly.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                                <p className="text-sm text-zinc-500">
                                    Placed on{" "}
                                    {new Date(order.created_at).toLocaleDateString("en-PK", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${statusCfg.color} ${statusCfg.bg}`}
                            >
                                <StatusIcon className="h-4 w-4" />
                                {order.status}
                            </span>
                        </div>

                        {/* Items */}
                        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
                            <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50">
                                Items
                            </div>
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 border-b border-zinc-100 px-6 py-4 last:border-0 dark:border-zinc-800"
                                >
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                        {item.product_image ? (
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name || ""}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package className="h-6 w-6 text-zinc-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product_name || `Product #${item.product_id}`}</p>
                                        <p className="text-xs text-zinc-500">
                                            Qty: {item.quantity}
                                            {item.size && ` · Size: ${item.size}`}
                                            {item.color && ` · Color: ${item.color}`}
                                        </p>
                                    </div>
                                    <span className="font-bold">
                                        PKR {(item.price_at_purchase * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between bg-zinc-50 px-6 py-4 dark:bg-zinc-800/50">
                                <span className="font-bold">Total</span>
                                <span className="text-lg font-bold text-emerald-600">
                                    PKR {order.total_amount.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Shipping + Payment grid */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Shipping */}
                            {order.shipping_address && (
                                <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
                                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-400">
                                        <MapPin className="h-4 w-4" />
                                        Shipping Address
                                    </div>
                                    <p className="font-medium">{order.shipping_address.label}</p>
                                    <p className="text-sm text-zinc-500">
                                        {order.shipping_address.street}, {order.shipping_address.city},{" "}
                                        {order.shipping_address.province} {order.shipping_address.postal_code}
                                    </p>
                                    <p className="text-sm text-zinc-400">{order.shipping_address.phone}</p>
                                </div>
                            )}

                            {/* Payment */}
                            <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-400">
                                    <Package className="h-4 w-4" />
                                    Payment
                                </div>
                                <p className="font-medium capitalize">{order.payment_method.replace("_", " ")}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </>
    );
}
