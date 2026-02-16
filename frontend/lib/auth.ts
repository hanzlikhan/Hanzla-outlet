/**
 * Auth token helpers.
 * Stores JWT in localStorage under "access_token".
 * All functions are client-side only (use "use client" in consuming components).
 */

const TOKEN_KEY = "access_token";

/** Get JWT token from localStorage (null if missing). */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Store JWT token in localStorage. */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Remove JWT token from localStorage (logout). */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Check if user has a stored token (quick client-side check, NOT validated). */
export function isLoggedIn(): boolean {
  return !!getToken();
}
