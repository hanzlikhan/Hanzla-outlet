/**
 * Premium Footer — Hanzla Outlet
 * 4-column layout with links, social icons, payment methods, newsletter.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CreditCard,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from "lucide-react";

const FOOTER_LINKS = {
    shop: [
        { label: "New Arrivals", href: "/products" },
        { label: "Men's Fashion", href: "/products?category=men" },
        { label: "Women's Fashion", href: "/products?category=women" },
        { label: "Watches", href: "/products?category=watches" },
        { label: "Accessories", href: "/products?category=accessories" },
    ],
    customerCare: [
        { label: "My Account", href: "/profile" },
        { label: "Track Order", href: "/orders" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Shipping Policy", href: "#" },
        { label: "Returns & Exchange", href: "#" },
    ],
    company: [
        { label: "About Us", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
    ],
};

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="border-t border-border bg-[#0A0A0A] text-white">
            {/* Newsletter bar */}
            <div className="border-b border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg font-semibold">
                            Join the <span className="text-gold">Hanzla</span> Family
                        </h3>
                        <p className="mt-1 text-sm text-white/50">
                            Get 10% off your first order + exclusive access to new arrivals
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubscribe}
                        className="flex w-full max-w-sm items-center gap-2"
                    >
                        <div className="relative flex-1">
                            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-full border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-gold flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                        >
                            {subscribed ? "Subscribed!" : "Subscribe"}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Main footer content */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1: Brand */}
                    <div>
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-bold">
                                <span className="text-gold-shimmer">HANZLA</span>
                                <span className="ml-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                                    OUTLET
                                </span>
                            </span>
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed text-white/50">
                            Premium Pakistani fashion & lifestyle. Curated collections of
                            luxury clothing, watches, and accessories for the modern you.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            {[
                                { icon: Instagram, label: "Instagram" },
                                { icon: Facebook, label: "Facebook" },
                                { icon: Twitter, label: "Twitter" },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    aria-label={social.label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all hover:border-gold hover:text-gold"
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Shop */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                            Shop
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {FOOTER_LINKS.shop.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 transition-colors hover:text-gold"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Customer Care */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                            Customer Care
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {FOOTER_LINKS.customerCare.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 transition-colors hover:text-gold"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                            Get in Touch
                        </h4>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3 text-sm text-white/50">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/60" />
                                Lahore, Punjab, Pakistan
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/50">
                                <Phone className="h-4 w-4 shrink-0 text-gold/60" />
                                +92 300 1234567
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/50">
                                <Mail className="h-4 w-4 shrink-0 text-gold/60" />
                                hello@hanzlaoutlet.com
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
                    <p className="text-xs text-white/30">
                        © 2026 Hanzla Outlet. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3">
                        {["Visa", "Mastercard", "JazzCash", "Easypaisa"].map((method) => (
                            <span
                                key={method}
                                className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-white/40"
                            >
                                {method}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
