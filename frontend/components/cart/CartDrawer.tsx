/**
 * CartDrawer – Slide-over cart panel using Sheet component.
 * Shows cart items from Zustand store with quantity controls.
 */

"use client";

import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import Sheet from "@/components/ui/Sheet";
import { useCartStore, type CartItem } from "@/stores/cart-store";

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
}

function CartItemRow({ item }: { item: CartItem }) {
    const { removeFromCart, updateQuantity } = useCartStore();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="flex gap-4 border-b border-zinc-100 px-6 py-4 dark:border-zinc-800"
        >
            {/* Image placeholder */}
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name || "Product"}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-zinc-300" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <p className="text-sm font-medium leading-tight">
                        {item.name || `Product #${item.product_id}`}
                    </p>
                    {(item.size || item.color) && (
                        <p className="mt-0.5 text-xs text-zinc-500">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && " · "}
                            {item.color && `Color: ${item.color}`}
                        </p>
                    )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700">
                        <button
                            onClick={() =>
                                updateQuantity(item.product_id, item.quantity - 1, item.size, item.color)
                            }
                            className="rounded-full p-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[1.25rem] text-center text-sm font-medium">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() =>
                                updateQuantity(item.product_id, item.quantity + 1, item.size, item.color)
                            }
                            className="rounded-full p-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            aria-label="Increase quantity"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {item.price && (
                            <span className="text-sm font-semibold">
                                PKR {(item.price * item.quantity).toLocaleString()}
                            </span>
                        )}
                        <button
                            onClick={() => removeFromCart(item.product_id, item.size, item.color)}
                            className="rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                            aria-label="Remove item"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
    const { items, clearCart, totalItems } = useCartStore();
    const subtotal = items.reduce(
        (sum, i) => sum + (i.price || 0) * i.quantity,
        0
    );

    return (
        <Sheet open={open} onClose={onClose} title={`Cart (${totalItems()})`}>
            {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12 text-center">
                    <ShoppingBag className="h-16 w-16 text-zinc-300" />
                    <p className="text-lg font-medium text-zinc-500">Your cart is empty</p>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex-1">
                        {items.map((item, idx) => (
                            <CartItemRow key={`${item.product_id}-${item.size}-${item.color}-${idx}`} item={item} />
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-zinc-200 px-6 py-5 dark:border-zinc-700">
                        <div className="mb-4 flex items-center justify-between text-base">
                            <span className="font-medium text-zinc-600 dark:text-zinc-400">
                                Subtotal
                            </span>
                            <span className="text-lg font-bold">
                                PKR {subtotal.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/checkout"
                                onClick={onClose}
                                className="flex items-center justify-center rounded-full bg-black py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            >
                                Proceed to Checkout
                            </Link>
                            <Link
                                href="/cart"
                                onClick={onClose}
                                className="flex items-center justify-center rounded-full border border-zinc-300 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                            >
                                View Full Cart
                            </Link>
                            <button
                                onClick={clearCart}
                                className="mt-1 text-xs text-zinc-400 transition-colors hover:text-red-500"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </>
            )}
        </Sheet>
    );
}
