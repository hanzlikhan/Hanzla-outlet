/**
 * CartDrawer – Premium slide-over cart panel.
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
            className="flex gap-4 border-b border-border px-6 py-4"
        >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-surface-hover">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name || "Product"}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <p className="text-sm font-medium leading-tight">
                        {item.name || `Product #${item.product_id}`}
                    </p>
                    {(item.size || item.color) && (
                        <p className="mt-0.5 text-xs text-muted">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && " · "}
                            {item.color && `Color: ${item.color}`}
                        </p>
                    )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-border">
                        <button
                            onClick={() =>
                                updateQuantity(item.product_id, item.quantity - 1, item.size, item.color)
                            }
                            className="rounded-full p-1.5 transition-colors hover:bg-surface-hover"
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
                            className="rounded-full p-1.5 transition-colors hover:bg-surface-hover"
                            aria-label="Increase quantity"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {item.price && (
                            <span className="text-sm font-bold">
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
        <Sheet open={open} onClose={onClose} title={`Shopping Bag (${totalItems()})`}>
            {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-hover">
                        <ShoppingBag className="h-9 w-9 text-muted-foreground/30" />
                    </div>
                    <p className="text-lg font-semibold">Your bag is empty</p>
                    <p className="text-sm text-muted">Add items to get started</p>
                    <button
                        onClick={onClose}
                        className="btn-gold rounded-full px-8 py-3 text-sm font-semibold"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto">
                        {items.map((item, idx) => (
                            <CartItemRow key={`${item.product_id}-${item.size}-${item.color}-${idx}`} item={item} />
                        ))}
                    </div>

                    <div className="border-t border-border px-6 py-5">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-muted">Subtotal</span>
                            <span className="text-lg font-bold">
                                PKR {subtotal.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <Link
                                href="/checkout"
                                onClick={onClose}
                                className="btn-gold flex items-center justify-center rounded-full py-3.5 text-sm font-bold uppercase tracking-wider"
                            >
                                Checkout
                            </Link>
                            <Link
                                href="/cart"
                                onClick={onClose}
                                className="flex items-center justify-center rounded-full border border-border py-3 text-sm font-medium transition-colors hover:bg-surface-hover"
                            >
                                View Full Cart
                            </Link>
                            <button
                                onClick={clearCart}
                                className="mt-1 text-xs text-muted-foreground transition-colors hover:text-red-500"
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
