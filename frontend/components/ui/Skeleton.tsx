/**
 * Skeleton – Animated loading placeholder.
 * Usage: <Skeleton className="h-6 w-32" />
 */

export default function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700 ${className}`}
        />
    );
}
