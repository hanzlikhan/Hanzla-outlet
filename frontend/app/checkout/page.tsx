/**
 * Multi-step checkout page.
 * Step 1: Select/add address (inline form)
 * Step 2: Payment method
 * Step 3: Review + place order
 * On success → redirect to /orders/[id]
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    ChevronRight,
    CreditCard,
    Loader2,
    MapPin,
    Plus,
    ShoppingBag,
    Wallet,
    X,
} from "lucide-react";
import api from "@/lib/api";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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

const PROVINCES = [
    "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
    "Islamabad Capital Territory", "Azad Kashmir", "Gilgit-Baltistan",
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
                                    ? "bg-gold text-black"
                                    : i === current
                                        ? "bg-foreground text-background"
                                        : "bg-surface-hover text-muted"
                                }`}
                        >
                            {i < current ? <Check className="h-5 w-5" /> : i + 1}
                        </div>
                        <span
                            className={`mt-2 text-xs font-medium ${i <= current ? "text-foreground" : "text-muted"
                                }`}
                        >
                            {step}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div
                            className={`mx-3 mt-[-1rem] h-0.5 w-12 sm:w-20 ${i < current ? "bg-gold" : "bg-border"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Add Address Form                                                    */
/* ------------------------------------------------------------------ */

function AddAddressForm({
    onCancel,
    onSuccess,
}: {
    onCancel: () => void;
    onSuccess: (addr: Address) => void;
}) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        label: "Home",
        street: "",
        city: "",
        province: "Punjab",
        postal_code: "",
        phone: "",
        is_default: true,
    });
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: async () => {
            const { data } = await api.post<Address>("/api/v1/addresses/", form);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            onSuccess(data);
        },
        onError: (err: any) => {
            setError(err?.response?.data?.detail || "Failed to add address. Please try again.");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.street || !form.city || !form.postal_code || !form.phone) {
            setError("Please fill in all required fields.");
            return;
        }
        setError("");
        mutation.mutate();
    };

    const update = (field: string, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card-premium space-y-4 p-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-base font-bold">Add New Address</h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {/* Label */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                        Label *
                    </label>
                    <select
                        value={form.label}
                        onChange={(e) => update("label", e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                        <option>Home</option>
                        <option>Work</option>
                        <option>Office</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* Phone */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                        Phone *
                    </label>
                    <input
                        type="tel"
                        placeholder="03XX-XXXXXXX"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-all placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                    />
                </div>
            </div>

            {/* Street */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                    Street Address *
                </label>
                <input
                    type="text"
                    placeholder="House #, Street, Area"
                    value={form.street}
                    onChange={(e) => update("street", e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-all placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    required
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {/* City */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                        City *
                    </label>
                    <input
                        type="text"
                        placeholder="Lahore"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-all placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                    />
                </div>

                {/* Province */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                        Province *
                    </label>
                    <select
                        value={form.province}
                        onChange={(e) => update("province", e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                        {PROVINCES.map((p) => (
                            <option key={p}>{p}</option>
                        ))}
                    </select>
                </div>

                {/* Postal */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                        Postal Code *
                    </label>
                    <input
                        type="text"
                        placeholder="54000"
                        value={form.postal_code}
                        onChange={(e) => update("postal_code", e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-all placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        required
                    />
                </div>
            </div>

            {/* Default checkbox */}
            <label className="flex cursor-pointer items-center gap-2">
                <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={(e) => update("is_default", e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-gold"
                />
                <span className="text-sm text-muted">Set as default address</span>
            </label>

            {/* Error */}
            {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20">{error}</p>
            )}

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="btn-gold flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold disabled:opacity-50"
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Address"
                    )}
                </button>
            </div>
        </motion.form>
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
    const [showAddressForm, setShowAddressForm] = useState(false);

    const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.replace("/login");
    }, [authLoading, isAuthenticated, router]);

    // Redirect if cart is empty
    useEffect(() => {
        if (!authLoading && items.length === 0) router.replace("/products");
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
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                                        <MapPin className="h-5 w-5 text-gold" />
                                        Shipping Address
                                    </h2>
                                    {!showAddressForm && (
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold transition-all hover:border-gold hover:text-gold"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add New
                                        </button>
                                    )}
                                </div>

                                {/* Address form */}
                                <AnimatePresence>
                                    {showAddressForm && (
                                        <AddAddressForm
                                            onCancel={() => setShowAddressForm(false)}
                                            onSuccess={(addr) => {
                                                setShowAddressForm(false);
                                                setSelectedAddressId(addr.id);
                                            }}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Existing addresses */}
                                {addrLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-hover" />
                                        ))}
                                    </div>
                                ) : addresses && addresses.length > 0 ? (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <button
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${selectedAddressId === addr.id
                                                        ? "border-gold bg-gold/5"
                                                        : "border-border hover:border-foreground/20"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold">{addr.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        {addr.is_default && (
                                                            <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
                                                                Default
                                                            </span>
                                                        )}
                                                        {selectedAddressId === addr.id && (
                                                            <Check className="h-4 w-4 text-gold" />
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-sm text-muted">
                                                    {addr.street}, {addr.city}, {addr.province} {addr.postal_code}
                                                </p>
                                                <p className="text-sm text-muted">{addr.phone}</p>
                                            </button>
                                        ))}
                                    </div>
                                ) : !showAddressForm ? (
                                    <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
                                        <MapPin className="mx-auto mb-3 h-8 w-8 text-muted" />
                                        <p className="mb-1 font-medium">No addresses saved</p>
                                        <p className="mb-4 text-sm text-muted">
                                            Add a delivery address to continue
                                        </p>
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Address
                                        </button>
                                    </div>
                                ) : null}

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        disabled={!selectedAddressId}
                                        className="btn-gold flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold disabled:opacity-40"
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
                                    <CreditCard className="h-5 w-5 text-gold" />
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
                                                        ? "border-gold bg-gold/5"
                                                        : "border-border hover:border-foreground/20"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <pm.icon className="h-5 w-5" />
                                                <div>
                                                    <span className="font-semibold">{pm.label}</span>
                                                    <p className="text-xs text-muted">{pm.desc}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button
                                        onClick={() => setStep(0)}
                                        className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-surface-hover"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="btn-gold flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold"
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
                                    <div className="card-premium p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                                            Shipping To
                                        </p>
                                        <p className="mt-1 font-medium">{selectedAddress.label}</p>
                                        <p className="text-sm text-muted">
                                            {selectedAddress.street}, {selectedAddress.city},{" "}
                                            {selectedAddress.province} {selectedAddress.postal_code}
                                        </p>
                                        <p className="text-sm text-muted">{selectedAddress.phone}</p>
                                    </div>
                                )}

                                {/* Payment */}
                                <div className="card-premium p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                                        Payment
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                                    </p>
                                </div>

                                {/* Items */}
                                <div className="card-premium overflow-hidden">
                                    <p className="border-b border-border p-4 text-xs font-semibold uppercase tracking-wider text-muted">
                                        Items ({totalItems()})
                                    </p>
                                    {items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {item.name || `Product #${item.product_id}`}
                                                </p>
                                                <p className="text-xs text-muted">
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
                                    <div className="flex items-center justify-between bg-surface-hover px-4 py-3">
                                        <span className="font-bold">Total</span>
                                        <span className="text-lg font-bold text-gold">
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
                                        className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-surface-hover"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => orderMutation.mutate()}
                                        disabled={orderMutation.isPending}
                                        className="btn-gold flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold disabled:opacity-60"
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
            <Footer />
        </>
    );
}
