/**
 * Multi-step checkout page.
 * Step 1: Select/add address
 * Step 2: Payment method
 * Step 3: Review + place order
 * On success → redirect to /orders/[id]
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    ChevronRight,
    CreditCard,
    Loader2,
    MapPin,
    ShoppingBag,
    Wallet,
} from "lucide-react";
import api from "@/lib/api";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";

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

interface OrderResponse {
    id: number;
    status: string;
    total_amount: number;
}

const STEPS = ["Address", "Payment", "Review"];

const PAYMENT_METHODS = [
    { id: "cod", label: "Cash on Delivery", icon: Wallet, desc: "Pay when you receive" },
    { id: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Coming soon", disabled: true },
    { id: "easypaisa", label: "Easypaisa", icon: Wallet, desc: "Coming soon", disabled: true },
];

/* ------------------------------------------------------------------ */
/* Step indicator                                                      */
/* ------------------------------------------------------------------ */

function StepIndicator({ current }: { current: number }) {
    return (
        <div className="mb-10 flex items-center justify-center gap-0">
            {STEPS.map((step, i) => (
                <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${i < current
                                    ? "bg-emerald-600 text-white"
                                    : i === current
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700"
                                }`}
                        >
                            {i < current ? <Check className="h-5 w-5" /> : i + 1}
                        </div>
                        <span
                            className={`mt-2 text-xs font-medium ${i <= current ? "text-black dark:text-white" : "text-zinc-400"
                                }`}
                        >
                            {step}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div
                            className={`mx-3 mt-[-1rem] h-0.5 w-12 sm:w-20 ${i < current ? "bg-emerald-600" : "bg-zinc-200 dark:bg-zinc-700"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { items, clearCart, totalItems } = useCartStore();

    const [step, setStep] = useState(0);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.replace("/login");
    }, [authLoading, isAuthenticated, router]);

    // Redirect if cart is empty
    useEffect(() => {
        if (!authLoading && items.length === 0) router.replace("/cart");
    }, [authLoading, items.length, router]);

    // Fetch addresses
    const { data: addresses, isLoading: addrLoading } = useQuery<Address[]>({
        queryKey: ["addresses"],
        queryFn: async () => (await api.get("/api/v1/addresses/")).data,
        enabled: isAuthenticated,
    });

    // Auto-select default address
    useEffect(() => {
        if (addresses && !selectedAddressId) {
            const def = addresses.find((a) => a.is_default);
            if (def) setSelectedAddressId(def.id);
            else if (addresses[0]) setSelectedAddressId(addresses[0].id);
        }
    }, [addresses, selectedAddressId]);

    // Place order mutation
    const orderMutation = useMutation({
        mutationFn: async () => {
            const body = {
                shipping_address_id: selectedAddressId,
                payment_method: paymentMethod,
                items: items.map((i) => ({
                    product_id: i.product_id,
                    quantity: i.quantity,
                    size: i.size || null,
                    color: i.color || null,
                })),
            };
            const { data } = await api.post<OrderResponse>("/api/v1/orders/", body);
            return data;
        },
        onSuccess: (data) => {
            clearCart();
            router.push(`/orders/${data.id}`);
        },
    });

    const selectedAddress = addresses?.find((a) => a.id === selectedAddressId);

    if (authLoading) return null;

    return (
        <>
            <Header />
            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="mb-2 text-center text-2xl font-bold sm:text-3xl">Checkout</h1>
                    <StepIndicator current={step} />

                    <AnimatePresence mode="wait">
                        {/* ── Step 1: Address ────────────────────────────── */}
                        {step === 0 && (
                            <motion.div
                                key="address"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                className="space-y-4"
                            >
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <MapPin className="h-5 w-5 text-emerald-600" />
                                    Shipping Address
                                </h2>

                                {addrLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
                                        ))}
                                    </div>
                                ) : addresses && addresses.length > 0 ? (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <button
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${selectedAddressId === addr.id
                                                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                                                        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold">{addr.label}</span>
                                                    {addr.is_default && (
                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-zinc-500">
                                                    {addr.street}, {addr.city}, {addr.province} {addr.postal_code}
                                                </p>
                                                <p className="text-sm text-zinc-400">{addr.phone}</p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
                                        <p className="text-zinc-500">No addresses found. Add one first.</p>
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        disabled={!selectedAddressId}
                                        className="flex items-center gap-2 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-black"
                                    >
                                        Continue <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Step 2: Payment ────────────────────────────── */}
                        {step === 1 && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                className="space-y-4"
                            >
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <CreditCard className="h-5 w-5 text-emerald-600" />
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    {PAYMENT_METHODS.map((pm) => (
                                        <button
                                            key={pm.id}
                                            onClick={() => !pm.disabled && setPaymentMethod(pm.id)}
                                            disabled={pm.disabled}
                                            className={`w-full rounded-xl border-2 p-4 text-left transition-all ${pm.disabled
                                                    ? "cursor-not-allowed opacity-50"
                                                    : paymentMethod === pm.id
                                                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                                                        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <pm.icon className="h-5 w-5" />
                                                <div>
                                                    <span className="font-semibold">{pm.label}</span>
                                                    <p className="text-xs text-zinc-500">{pm.desc}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button
                                        onClick={() => setStep(0)}
                                        className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-600"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex items-center gap-2 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black"
                                    >
                                        Continue <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Step 3: Review ─────────────────────────────── */}
                        {step === 2 && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                className="space-y-6"
                            >
                                <h2 className="text-lg font-semibold">Review Your Order</h2>

                                {/* Address summary */}
                                {selectedAddress && (
                                    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                            Shipping To
                                        </p>
                                        <p className="mt-1 font-medium">{selectedAddress.label}</p>
                                        <p className="text-sm text-zinc-500">
                                            {selectedAddress.street}, {selectedAddress.city},{" "}
                                            {selectedAddress.province} {selectedAddress.postal_code}
                                        </p>
                                        <p className="text-sm text-zinc-400">{selectedAddress.phone}</p>
                                    </div>
                                )}

                                {/* Payment */}
                                <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                        Payment
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                                    </p>
                                </div>

                                {/* Items */}
                                <div className="rounded-xl border border-zinc-200 dark:border-zinc-700">
                                    <p className="border-b border-zinc-200 p-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:border-zinc-700">
                                        Items ({totalItems()})
                                    </p>
                                    {items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 last:border-0 dark:border-zinc-800"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {item.name || `Product #${item.product_id}`}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    Qty: {item.quantity}
                                                    {item.size && ` · ${item.size}`}
                                                    {item.color && ` · ${item.color}`}
                                                </p>
                                            </div>
                                            <span className="text-sm font-bold">
                                                PKR {((item.price || 0) * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
                                        <span className="font-bold">Total</span>
                                        <span className="text-lg font-bold text-emerald-600">
                                            PKR {subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Error */}
                                {orderMutation.isError && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20">
                                        {(orderMutation.error as { response?: { data?: { detail?: string } } })
                                            ?.response?.data?.detail || "Failed to place order. Please try again."}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-600"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => orderMutation.mutate()}
                                        disabled={orderMutation.isPending}
                                        className="flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-lg disabled:opacity-60"
                                    >
                                        {orderMutation.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="h-4 w-4" />
                                                Place Order — PKR {subtotal.toLocaleString()}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </>
    );
}
