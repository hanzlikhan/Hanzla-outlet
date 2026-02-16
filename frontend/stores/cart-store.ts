/**
 * Cart store – Zustand with localStorage persistence.
 * Manages cart items (product_id, quantity, size, color).
 * Used by the frontend to build the order payload sent to POST /api/v1/orders/.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** A single item in the shopping cart. */
export interface CartItem {
    product_id: number;
    quantity: number;
    size?: string | null;
    color?: string | null;
    /** Denormalized product info for display (not sent to API). */
    name?: string;
    price?: number;
    image?: string;
}

interface CartState {
    items: CartItem[];
    /** Add item or increase quantity if same product+size+color exists. */
    addToCart: (item: CartItem) => void;
    /** Remove item by product_id + size + color combo. */
    removeFromCart: (productId: number, size?: string | null, color?: string | null) => void;
    /** Update quantity for a specific cart item. */
    updateQuantity: (productId: number, quantity: number, size?: string | null, color?: string | null) => void;
    /** Clear entire cart (e.g. after successful order). */
    clearCart: () => void;
    /** Total number of items in cart. */
    totalItems: () => number;
}

/** Match helper: same product + same variant (size/color). */
function matches(a: CartItem, productId: number, size?: string | null, color?: string | null) {
    return (
        a.product_id === productId &&
        (a.size ?? null) === (size ?? null) &&
        (a.color ?? null) === (color ?? null)
    );
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (item) =>
                set((state) => {
                    const existing = state.items.find((i) =>
                        matches(i, item.product_id, item.size, item.color)
                    );
                    if (existing) {
                        // Increase quantity of existing variant
                        return {
                            items: state.items.map((i) =>
                                matches(i, item.product_id, item.size, item.color)
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),

            removeFromCart: (productId, size, color) =>
                set((state) => ({
                    items: state.items.filter((i) => !matches(i, productId, size, color)),
                })),

            updateQuantity: (productId, quantity, size, color) =>
                set((state) => ({
                    items:
                        quantity <= 0
                            ? state.items.filter((i) => !matches(i, productId, size, color))
                            : state.items.map((i) =>
                                matches(i, productId, size, color) ? { ...i, quantity } : i
                            ),
                })),

            clearCart: () => set({ items: [] }),

            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        {
            name: "hanzla-cart", // localStorage key
        }
    )
);
