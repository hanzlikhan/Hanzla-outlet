/**
 * Wishlist store – Zustand with localStorage persistence.
 * Tracks product IDs the user has wishlisted.
 * Backend sync happens via API calls in components; this store is the client cache.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
    /** Set of wishlisted product IDs (fast lookup). */
    productIds: number[];
    /** Add a product to wishlist. */
    addToWishlist: (productId: number) => void;
    /** Remove a product from wishlist. */
    removeFromWishlist: (productId: number) => void;
    /** Check if a product is wishlisted. */
    isWishlisted: (productId: number) => boolean;
    /** Replace entire wishlist (e.g. after syncing with backend on login). */
    setWishlist: (productIds: number[]) => void;
    /** Clear wishlist (e.g. on logout). */
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            productIds: [],

            addToWishlist: (productId) =>
                set((state) => {
                    if (state.productIds.includes(productId)) return state;
                    return { productIds: [...state.productIds, productId] };
                }),

            removeFromWishlist: (productId) =>
                set((state) => ({
                    productIds: state.productIds.filter((id) => id !== productId),
                })),

            isWishlisted: (productId) => get().productIds.includes(productId),

            setWishlist: (productIds) => set({ productIds }),

            clearWishlist: () => set({ productIds: [] }),
        }),
        {
            name: "hanzla-wishlist", // localStorage key
        }
    )
);
