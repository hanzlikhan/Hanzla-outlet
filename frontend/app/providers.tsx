/**
 * App-level providers wrapper.
 * Wraps children with TanStack React Query's QueryClientProvider.
 * Must be a Client Component since QueryClientProvider uses React Context.
 */

"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    // Create QueryClient inside state so it's not re-created on every render.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Don't refetch on window focus in dev (annoying).
                        refetchOnWindowFocus: false,
                        // Retry once on failure.
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
        </QueryClientProvider>
    );
}
