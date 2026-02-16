/**
 * Axios instance configured for the FastAPI backend.
 * - baseURL from NEXT_PUBLIC_API_URL env var
 * - Bearer token injected automatically via request interceptor
 * - 401 responses trigger token removal (auto-logout)
 */

import axios from "axios";
import { getToken, removeToken } from "@/lib/auth";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// ── Request interceptor: attach Bearer token ──────────────────────────
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ── Response interceptor: handle 401 (expired/invalid token) ──────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeToken();
            // Optionally redirect to login — handled by components
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("auth:logout"));
            }
        }
        return Promise.reject(error);
    }
);

export default api;
