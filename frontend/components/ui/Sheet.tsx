/**
 * Sheet – Slide-over panel component (similar to shadcn Sheet).
 * Slides in from the right with backdrop overlay.
 * Uses Framer Motion for smooth animation.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SheetProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function Sheet({ open, onClose, title, children }: SheetProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    {/* Panel */}
                    <motion.div
                        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-zinc-900"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
                            <h2 className="text-lg font-semibold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
