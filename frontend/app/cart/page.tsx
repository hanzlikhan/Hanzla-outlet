/**
 * Cart page – full cart list with item details and proceed to checkout.
 * Uses Zustand cart store for state.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { useCartStore, type CartItem } from "@/stores/cart-store";

function CartRow({ item, index }: { item: CartItem; index: number }) {
    const { removeFromCart, updateQuantity } = useCartStore();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:gap-6 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
        >
            {/* Image */}
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-32 sm:w-32 dark:bg-zinc-800">
                {item.image ? (
                    <img src={item.image} alt={item.name || ""} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-zinc-300" />
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="font-semibold">{item.name || `Product #${item.product_id}`}</h3>
                    {(item.size || item.color) && (
                        <p className="mt-1 text-sm text-zinc-500">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && " · "}
                            {item.color && `Color: ${item.color}`}
                        </p>
                    )}
                    {item.price && (
                        <p className="mt-1 text-sm font-medium text-emerald-600">
                            PKR {item.price.toLocaleString()} each
                        </p>
                    )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700">
                        <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.size, item.color)}
                            className="rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.size, item.color)}
                            className="rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="font-bold">
                            PKR {((item.price || 0) * item.quantity).toLocaleString()}
                        </span>
                        <button
                            onClick={() => removeFromCart(item.product_id, item.size, item.color)}
                            className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function CartPage() {
    const { items, clearCart, totalItems } = useCartStore();
    const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

    return (
        <>
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Shopping Cart ({totalItems()})
                        </h1>
                        {items.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-sm text-zinc-400 transition-colors hover:text-red-500"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 py-20 text-center">
                            <ShoppingBag className="h-20 w-20 text-zinc-200 dark:text-zinc-700" />
                            <p className="text-lg text-zinc-500">Your cart is empty</p>
                            <Link
                                href="/products"
                                className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Cart items */}
                            <div className="lg:col-span-2">
                                <AnimatePresence mode="popLayout">
                                    <div className="flex flex-col gap-4">
                                        {items.map((item, idx) => (
                                            <CartRow
                                                key={`${item.product_id}-${item.size}-${item.color}`}
                                                item={item}
                                                index={idx}
                                            />
                                        ))}
                                    </div>
                                </AnimatePresence>
                            </div>

                            {/* Order summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="h-fit rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
                                <div className="space-y-3 border-b border-zinc-200 pb-4 dark:border-zinc-700">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Items ({totalItems()})</span>
                                        <span>PKR {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Shipping</span>
                                        <span className="text-emerald-600 font-medium">Free</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>PKR {subtotal.toLocaleString()}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    className="mt-6 flex w-full items-center justify-center rounded-full bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-lg"
                                >
                                    Proceed to Checkout
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </main>
        </>
    );
}
