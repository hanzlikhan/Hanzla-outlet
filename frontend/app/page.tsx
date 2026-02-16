/**
 * Home Page — Hanzla Outlet
 * Premium landing with animated backgrounds, hero carousel, categories,
 * trending, testimonials, and CTA.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  Gem,
  Globe,
  Headphones,
  Heart,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* ================================================================
   DATA
   ================================================================ */

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80",
    badge: "New Season",
    title: "Redefine Your\nStyle Statement",
    subtitle: "Premium Pakistani fashion for the modern you. Explore luxury clothing, watches & accessories.",
    cta: "Shop New Arrivals",
    href: "/products",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80",
    badge: "Men's Collection",
    title: "Crafted for the\nModern Gentleman",
    subtitle: "From tailored suits to casual essentials — discover premium menswear that speaks confidence.",
    cta: "Explore Men's",
    href: "/products?category=men",
  },
  {
    image: "https://images.unsplash.com/photo-1539109132314-34a9c655a8c8?w=1920&q=80",
    badge: "Women's Edit",
    title: "Elegance Meets\nContemporary",
    subtitle: "Curated women's fashion blending eastern grace with western sophistication.",
    cta: "Shop Women's",
    href: "/products?category=women",
  },
];

const CATEGORIES = [
  {
    name: "Men's Fashion",
    slug: "men",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
  },
  {
    name: "Women's Fashion",
    slug: "women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  },
  {
    name: "Watches",
    slug: "watches",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  },
];

const FEATURES = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On orders above PKR 3,000",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% encrypted checkout",
    gradient: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Package,
    title: "Easy Returns",
    desc: "7-day hassle-free returns",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Dedicated customer care",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
];

const TESTIMONIALS = [
  {
    name: "Ayesha Khan",
    role: "Fashion Enthusiast",
    content: "Hanzla Outlet has become my go-to for premium Pakistani fashion. The quality is absolutely stunning, and the delivery is always on time!",
    rating: 5,
  },
  {
    name: "Ahmed Malik",
    role: "Business Professional",
    content: "Finally found a brand that understands modern Pakistani menswear. The suits are impeccably tailored and the watches are gorgeous.",
    rating: 5,
  },
  {
    name: "Sana Farooq",
    role: "Content Creator",
    content: "The blend of eastern and western fashion is perfect. Every piece I've ordered has exceeded my expectations. Highly recommend!",
    rating: 5,
  },
];

const TRENDING_IMAGES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  "https://images.unsplash.com/photo-1612731486606-2614b4d74921?w=600&q=80",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
];

/* ================================================================
   ANIMATED BACKGROUND — floating gold particles + gradient orbs
   ================================================================ */

function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-gold/[0.04] to-transparent blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 100, -50, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-32 top-1/3 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-teal/[0.03] to-transparent blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 50, -80, 0],
          y: [0, -60, 40, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 left-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-gold/[0.03] to-transparent blur-3xl"
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: 0,
          }}
          animate={{
            y: [null, `${Math.random() * -30 - 10}vh`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
          className="absolute h-1 w-1 rounded-full bg-gold/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${60 + Math.random() * 40}%`,
          }}
        />
      ))}
    </div>
  );
}

/* ================================================================
   ANIMATION HELPERS
   ================================================================ */

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   PAGE
   ================================================================ */

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(id);
  }, [autoplay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % HERO_SLIDES.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />

        {/* ═══════════════════════════════════════════════════
                    HERO CAROUSEL
                   ═══════════════════════════════════════════════════ */}
        <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={HERO_SLIDES[currentSlide].image}
                alt={HERO_SLIDES[currentSlide].title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Hero content */}
          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 sm:px-8 lg:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-2xl"
              >
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold backdrop-blur-sm"
                >
                  <Sparkles className="h-3 w-3" />
                  {HERO_SLIDES[currentSlide].badge}
                </motion.span>
                <h1 className="mt-3 whitespace-pre-line text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  {HERO_SLIDES[currentSlide].title}
                </h1>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                  {HERO_SLIDES[currentSlide].subtitle}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href={HERO_SLIDES[currentSlide].href}
                    className="btn-gold flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wide"
                  >
                    {HERO_SLIDES[currentSlide].cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/categories"
                    className="flex items-center gap-2.5 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
                  >
                    Browse Categories
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur-sm transition-all hover:border-gold hover:text-gold sm:left-8"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur-sm transition-all hover:border-gold hover:text-gold sm:right-8"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Slide progress */}
          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? "w-10 bg-gold" : "w-4 bg-white/30 hover:bg-white/50"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
                    FEATURES STRIP — Redesigned with gradient cards
                   ═══════════════════════════════════════════════════ */}
        <section className="relative border-b border-border">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:gap-5 lg:px-8 lg:py-8">
            {FEATURES.map((f, i) => (
              <FadeInSection key={f.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="card-premium flex flex-col items-center gap-3 p-5 text-center sm:flex-row sm:text-left lg:p-6"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient}`}>
                    <f.icon className={`h-5 w-5 ${f.iconColor}`} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{f.title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted">{f.desc}</p>
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
                    SHOP BY CATEGORY
                   ═══════════════════════════════════════════════════ */}
        <section className="section-padding mx-auto max-w-7xl">
          <FadeInSection>
            <div className="mb-10 text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-gold/50" />
                <Crown className="h-4 w-4 text-gold" />
                <span className="h-px w-8 bg-gold/50" />
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Shop by Category
              </h2>
              <p className="mt-3 text-muted">
                Discover curated collections crafted for every occasion
              </p>
            </div>
          </FadeInSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <FadeInSection key={cat.slug} delay={i * 0.1}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative block overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all group-hover:from-black/80" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                    <motion.span
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-gold"
                      whileHover={{ x: 4 }}
                    >
                      Shop Now
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </motion.span>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
                    TRENDING THIS WEEK
                   ═══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#0A0A0A] text-white">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-gold/[0.04] blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-teal/[0.04] blur-[100px]" />
          </div>

          <div className="section-padding relative mx-auto max-w-7xl">
            <FadeInSection>
              <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gold" />
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                      Trending
                    </p>
                  </div>
                  <h2 className="text-3xl font-bold sm:text-4xl">
                    Trending This Week
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-gold transition-all hover:border-gold hover:bg-gold/5"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeInSection>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TRENDING_IMAGES.map((img, i) => (
                <FadeInSection key={i} delay={i * 0.1}>
                  <Link href="/products" className="group relative block overflow-hidden rounded-2xl">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={img}
                        alt={`Trending item ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                        Trending #{i + 1}
                      </span>
                      <motion.span
                        whileHover={{ scale: 1.15 }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-black shadow-lg shadow-gold/20"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </div>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
                    BRAND BANNER
                   ═══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="relative h-[50vh] min-h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80"
              alt="Fashion editorial"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <FadeInSection className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
              <div className="mb-4 flex items-center gap-2">
                <Gem className="h-5 w-5 text-gold" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                  Premium Quality
                </p>
                <Gem className="h-5 w-5 text-gold" />
              </div>
              <h2 className="max-w-3xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Where Pakistani Heritage
                <br />
                Meets Modern Luxury
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                Every piece at Hanzla Outlet tells a story of craftsmanship, quality,
                and timeless style. Experience fashion that speaks to your soul.
              </p>
              <Link
                href="/products"
                className="btn-gold mt-8 flex items-center gap-2.5 rounded-full px-10 py-4 text-sm font-bold uppercase tracking-wide"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </FadeInSection>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
                    TESTIMONIALS
                   ═══════════════════════════════════════════════════ */}
        <section className="section-padding mx-auto max-w-7xl">
          <FadeInSection>
            <div className="mb-10 text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-gold/50" />
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span className="h-px w-8 bg-gold/50" />
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                What Our Customers Say
              </h2>
            </div>
          </FadeInSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeInSection key={t.name} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="card-premium flex flex-col gap-4 p-8"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark text-sm font-bold text-black">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
                    CTA SECTION
                   ═══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#141414] to-[#0A0A0A] text-white">
          {/* Animated glow */}
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-gold/[0.06] via-transparent to-teal/[0.04] blur-3xl"
            />
          </div>

          <div className="section-padding relative mx-auto max-w-3xl text-center">
            <FadeInSection>
              <Sparkles className="mx-auto mb-4 h-8 w-8 text-gold" />
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Ready to Elevate Your Style?
              </h2>
              <p className="mt-4 text-white/50">
                Join thousands of satisfied customers who trust Hanzla Outlet for
                premium Pakistani fashion.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/products"
                  className="btn-gold flex items-center gap-2.5 rounded-full px-10 py-4 text-sm font-bold uppercase tracking-wide"
                >
                  Shop Now
                  <ShoppingBag className="h-4 w-4" />
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2.5 rounded-full border border-white/20 px-10 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:border-gold hover:text-gold"
                >
                  Create Account
                </Link>
              </div>
            </FadeInSection>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
