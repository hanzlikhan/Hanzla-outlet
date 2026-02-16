/**
 * useAuth – TanStack Query hook for the current authenticated user.
 *
 * Fetches GET /api/v1/users/me using the stored JWT token.
 * Returns { user, isLoading, isError, refetch, logout }.
 *
 * Only fires if a token exists in localStorage (enabled option).
 */

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import api from "@/lib/api";
import { isLoggedIn, removeToken } from "@/lib/auth";

/** User shape from the backend /users/me endpoint. */
export interface User {
    id: number;
    email: string;
    full_name: string | null;
    phone: string | null;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
}

async function fetchCurrentUser(): Promise<User> {
    const { data } = await api.get<User>("/api/v1/users/me");
    return data;
}

export function useAuth() {
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
        isError,
        refetch,
    } = useQuery<User>({
        queryKey: ["currentUser"],
        queryFn: fetchCurrentUser,
        /** Only attempt to fetch if a token exists. */
        enabled: typeof window !== "undefined" && isLoggedIn(),
        /** Don't retry on 401 — token is invalid. */
        retry: (failureCount, error: unknown) => {
            const status = (error as { response?: { status?: number } })?.response?.status;
            if (status === 401) return false;
            return failureCount < 2;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    /** Logout: remove token, clear query cache. */
    const logout = useCallback(() => {
        removeToken();
        queryClient.removeQueries({ queryKey: ["currentUser"] });
    }, [queryClient]);

    return {
        user: user ?? null,
        isLoading,
        isError,
        isAuthenticated: !!user,
        refetch,
        logout,
    };
}
