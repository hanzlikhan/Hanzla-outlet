/**
 * Home page – Landing page for Hanzla Outlet.
 * Shows hero section, featured categories, and CTA.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Truck, Shield, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";

const FEATURES = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above PKR 3,000" },
  { icon: Shield, title: "Secure Checkout", desc: "100% protected payments" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Always here to help" },
  { icon: ShoppingBag, title: "Easy Returns", desc: "7-day return policy" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-emerald-900">
          <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-32 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-4 inline-block rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                New Collection 2026
              </span>
              <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                Elevate Your Style with{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Hanzla Outlet
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-300">
                Discover premium fashion at unbeatable prices. From casual wear
                to formal attire — everything you need, delivered to your
                doorstep.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/products"
                  className="group flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/20"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/categories"
                  className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Browse Categories
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Decorative blur */}
          <div className="absolute -bottom-10 left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full bg-emerald-600/20 blur-3xl" />
        </section>

        {/* Features strip */}
        <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                  <f.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold">{f.title}</h3>
                <p className="text-xs text-zinc-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick links */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-center text-2xl font-bold sm:text-3xl"
          >
            Start Shopping
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Men's Collection",
                desc: "Kurta, Shalwar Kameez, Formal & Casual Wear",
                href: "/products",
                gradient: "from-blue-600 to-indigo-700",
              },
              {
                title: "New Arrivals",
                desc: "Freshest styles just landed",
                href: "/products",
                gradient: "from-emerald-600 to-teal-700",
              },
              {
                title: "Sale & Offers",
                desc: "Up to 50% off on selected items",
                href: "/products",
                gradient: "from-rose-600 to-pink-700",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
              >
                <Link
                  href={card.href}
                  className={`group flex h-48 flex-col justify-end rounded-2xl bg-gradient-to-br ${card.gradient} p-6 transition-all hover:shadow-xl`}
                >
                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{card.desc}</p>
                  <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-white/90">
                    Shop now{" "}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-zinc-500">
            © 2026 Hanzla Outlet. All rights reserved.
          </div>
        </footer>
      </main>
    </>
  );
}
