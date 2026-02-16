/**
 * Protected layout – redirects to /login if user is not authenticated.
 * Wraps all routes under app/(protected)/ directory.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading skeleton while checking auth
    if (isLoading) {
        return (
            <>
                <Header />
                <div className="mx-auto max-w-7xl px-4 py-12">
                    <div className="flex flex-col gap-4">
                        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                        <div className="h-64 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                </div>
            </>
        );
    }

    // Don't render children if not authenticated (redirect is happening)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Header />
            {children}
        </>
    );
}
