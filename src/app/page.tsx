"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Box,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { CATEGORY_META, PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import type { Category, Product } from "@/types/store";
import { cn } from "@/lib/utils";

const CATEGORY_BENTO: {
  key: Category;
  title: string;
  subtitle: string;
  image: string;
  count: number;
}[] = [
  {
    key: "casual",
    title: "CASUAL",
    subtitle: "SNEAKERS & JOGGERS",
    image: "/images/products/apex-obsidian-runner.png",
    count: PRODUCTS.filter((p) => p.category === "casual").length,
  },
  {
    key: "formal",
    title: "FORMAL",
    subtitle: "LOAFERS & FORMAL SHOES",
    image: "/images/products/sovereign-matte-loafer.png",
    count: PRODUCTS.filter((p) => p.category === "formal").length,
  },
  {
    key: "sports",
    title: "SPORTS",
    subtitle: "GRIPPERS & SPORTS SHOES",
    image: "/images/products/vortex-turf-gripper.png",
    count: PRODUCTS.filter((p) => p.category === "sports").length,
  },
  {
    key: "slippers",
    title: "SLIPPERS",
    subtitle: "SLIPPERS & CROCS",
    image: "/images/products/lunar-molded-croc.png",
    count: PRODUCTS.filter((p) => p.category === "slippers").length,
  },
];

const emptySubscribe = () => () => {};

function useCountdown(targetHours = 11, targetMins = 42, targetSecs = 18) {
  const [secondsLeft, setSecondsLeft] = useState(
    targetHours * 3600 + targetMins * 60 + targetSecs
  );
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 42000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const s = String(secondsLeft % 60).padStart(2, "0");

  return { mounted, h, m, s };
}

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  const [dropFilter, setDropFilter] = useState<
    "all" | "boys" | "girls" | "unisex"
  >("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  const countdown = useCountdown();

  const featuredProducts = useMemo(() => {
    const pool = PRODUCTS.filter((p) => {
      if (dropFilter === "all") return p.featured;
      if (dropFilter === "boys")
        return p.gender === "boys" || p.gender === "unisex";
      if (dropFilter === "girls")
        return p.gender === "girls" || p.gender === "unisex";
      return p.gender === "unisex";
    });
    return pool.slice(0, 8);
  }, [dropFilter]);

  return (
    <div className="bg-[#050505] text-[#F5F5F7]">
      {/* 1. FULL-VIEWPORT EDITORIAL HERO */}
      <section
        ref={heroRef}
        className="film-grain relative flex min-h-[calc(100vh-6rem)] items-end overflow-hidden border-b border-white/[0.08] bg-[#050505]"
      >
        <motion.div
          style={{ y: heroImageY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <img
            src="/images/hero/hero-editorial.png"
            alt="ZELVYN Season 01 luxury monochrome footwear editorial"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/55 to-[#050505]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 pb-14 sm:px-6 sm:pb-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2.5 rounded-sm border border-white/15 bg-black/65 px-3 py-1.5 font-mono text-[10px] tracking-[0.26em] text-[#D1D1D6] uppercase backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              SEASON 01 ARCHIVE · 24 SILHOUETTES LIVE
            </div>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.88] tracking-[-0.05em] text-white sm:text-8xl lg:text-[7.5rem]">
              ZELVYN
            </h1>
            <p className="mt-3 font-display text-xl font-bold tracking-[0.18em] text-[#D1D1D6] uppercase sm:text-3xl">
              KEEPIN&apos; IT REAL
            </p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#A1A1A6] sm:text-base">
              Monochrome luxury streetwear footwear engineered in obsidian
              calfskin, sculpted Phylon, and high-traction carbon composites.
              Built for Boys, Girls, and Unisex rotations across Pakistan.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/shop?gender=boys"
                className="inline-flex h-12 items-center gap-2.5 rounded-sm border border-white bg-white px-7 font-mono text-xs font-bold tracking-[0.18em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
              >
                SHOP BOYS
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop?gender=girls"
                className="inline-flex h-12 items-center gap-2.5 rounded-sm border border-white/30 bg-black/70 px-7 font-mono text-xs font-bold tracking-[0.18em] text-white backdrop-blur-md transition hover:border-white hover:bg-white hover:text-[#050505]"
              >
                SHOP GIRLS
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center px-3 font-mono text-[11px] tracking-[0.18em] text-[#A1A1A6] underline-offset-4 transition hover:text-white hover:underline"
              >
                VIEW ALL 24 DROPS
              </Link>
            </div>
          </motion.div>

          {/* Subtle scroll indicator */}
          <div className="mt-10 hidden items-center justify-between border-t border-white/10 pt-5 sm:flex">
            <div className="flex items-center gap-8 font-mono text-[10px] tracking-[0.2em] text-[#8A8A8E]">
              <span>EU 36 — EU 45</span>
              <span>PKR 4,900 — PKR 24,500</span>
              <span>COD · CARDS · EASYPAISA · JAZZCASH</span>
            </div>
            <a
              href="#gender-showcase"
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-[#D1D1D6] transition hover:text-white"
            >
              SCROLL TO EXPLORE
              <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. SPLIT GENDER SHOWCASE (50/50) */}
      <section
        id="gender-showcase"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] tracking-[0.26em] text-[#8A8A8E] uppercase">
              DUAL COLLECTION ARCHITECTURE
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              BUILT FOR EVERY ROTATION
            </h2>
          </div>
          <Link
            href="/shop?gender=unisex"
            className="font-mono text-xs tracking-[0.16em] text-[#A1A1A6] transition hover:text-white"
          >
            EXPLORE UNISEX ARCHIVE →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* BOYS CARD */}
          <Link
            href="/shop?gender=boys"
            className="group relative flex min-h-[460px] items-end overflow-hidden rounded-sm border border-white/[0.08] bg-[#0E0E10] p-7 transition-all duration-500 hover:border-white/30 sm:min-h-[540px] sm:p-10"
          >
            <img
              src="/images/hero/split-boys.png"
              alt="ZELVYN Boys Footwear Collection"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-transparent" />
            <div className="relative z-10 w-full">
              <span className="inline-block rounded-sm border border-white/20 bg-black/75 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white backdrop-blur-md">
                EU 40 — EU 45 · 14 SILHOUETTES
              </span>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    BOYS
                  </h3>
                  <p className="mt-1.5 text-sm text-[#D1D1D6]">
                    Chunky Runners, Commando Loafers, Turf Grippers &amp; Slides.
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-white bg-white text-[#050505] transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* GIRLS CARD */}
          <Link
            href="/shop?gender=girls"
            className="group relative flex min-h-[460px] items-end overflow-hidden rounded-sm border border-white/[0.08] bg-[#0E0E10] p-7 transition-all duration-500 hover:border-white/30 sm:min-h-[540px] sm:p-10"
          >
            <img
              src="/images/hero/split-girls.png"
              alt="ZELVYN Girls Footwear Collection"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-transparent" />
            <div className="relative z-10 w-full">
              <span className="inline-block rounded-sm border border-white/20 bg-black/75 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white backdrop-blur-md">
                EU 36 — EU 41 · 14 SILHOUETTES
              </span>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    GIRLS
                  </h3>
                  <p className="mt-1.5 text-sm text-[#D1D1D6]">
                    Sculpted Platforms, Penny Loafers, Studio Grippers &amp; Crocs.
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-white bg-white text-[#050505] transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. 4-PILLAR CATEGORY BENTO GRID */}
      <section className="border-y border-white/[0.08] bg-[#08080A] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] tracking-[0.26em] text-[#8A8A8E] uppercase">
                FOUR DISCIPLINES
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                SHOP BY SILHOUETTE
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#8A8A8E]">
              Every discipline is stocked across both Boys and Girls sizing
              with deep monochrome finishing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_BENTO.map((cat) => (
              <Link
                key={cat.key}
                href={`/shop?category=${cat.key}`}
                className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-sm border border-white/[0.08] bg-[#0E0E10] p-6 transition hover:border-white/30"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-[#050505]/70" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#D1D1D6]">
                    {cat.subtitle}
                  </span>
                  <span className="rounded-sm border border-white/15 bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white">
                    {cat.count}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-display text-3xl font-extrabold tracking-tight text-white">
                    {cat.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs text-[#A1A1A6]">
                    {CATEGORY_META[cat.key].description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.18em] text-white uppercase">
                    EXPLORE {cat.title}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED DROP GRID (FILTERABLE + QUICK ADD) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] tracking-[0.26em] text-[#8A8A8E] uppercase">
              CURATED RELEASE MATRIX
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              FEATURED DROPS
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: "all", label: "FEATURED" },
                { key: "boys", label: "BOYS" },
                { key: "girls", label: "GIRLS" },
                { key: "unisex", label: "UNISEX" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setDropFilter(tab.key)}
                className={cn(
                  "rounded-sm border px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.16em] transition",
                  dropFilter === tab.key
                    ? "border-white bg-white text-[#050505]"
                    : "border-white/10 bg-[#0E0E10] text-[#8A8A8E] hover:border-white/30 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center gap-3 rounded-sm border border-white/25 bg-[#0E0E10] px-8 font-mono text-xs font-bold tracking-[0.18em] text-white transition hover:border-white hover:bg-white hover:text-[#050505]"
          >
            OPEN COMPLETE 24-SHOE CATALOG
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 5. EDITORIAL CAMPAIGN BANNER (11:11 ARCHIVE SALE) */}
      <section className="film-grain relative overflow-hidden border-y border-white/[0.08] bg-[#070709]">
        <img
          src="/images/hero/campaign-1111.png"
          alt="ZELVYN Season 01 11:11 Archive Drop"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-[#050505]/60" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-between gap-10 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-block rounded-sm bg-white px-3 py-1 font-mono text-[10px] font-bold tracking-[0.22em] text-[#050505]">
              LIMITED ARCHIVE EVENT · CODE: ZELVYN50
            </span>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl">
              SEASON 01 / 11:11 ARCHIVE SALE — UP TO 50% OFF
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#A1A1A6]">
              Selected Kinetix Joggers, Tactical Court Grippers, Chalk Noir
              Lows, and Cloud Contour Slides marked down for 24 hours. Use promo{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-white">
                REAL10
              </code>{" "}
              for an extra 10% off any drop in your bag.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop?badge=50%25%20OFF"
                className="inline-flex h-12 items-center gap-2 rounded-sm border border-white bg-white px-7 font-mono text-xs font-bold tracking-[0.18em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
              >
                SHOP 50% OFF VAULT
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-sm border border-white/25 bg-black/60 px-6 font-mono text-xs font-bold tracking-[0.18em] text-white transition hover:border-white"
              >
                BROWSE ALL DROPS
              </Link>
            </div>
          </div>

          {/* Live Countdown Timer */}
          <div className="rounded-sm border border-white/15 bg-black/75 p-6 backdrop-blur-xl sm:p-8">
            <p className="font-mono text-[10px] tracking-[0.22em] text-[#8A8A8E] uppercase">
              ARCHIVE WINDOW CLOSES IN
            </p>
            <div className="mt-4 flex items-center gap-3 font-mono">
              {[
                { label: "HRS", val: countdown.mounted ? countdown.h : "11" },
                { label: "MIN", val: countdown.mounted ? countdown.m : "42" },
                { label: "SEC", val: countdown.mounted ? countdown.s : "18" },
              ].map((unit, idx) => (
                <React.Fragment key={unit.label}>
                  <div className="flex min-w-20 flex-col items-center rounded-sm border border-white/10 bg-[#0E0E10] px-4 py-3">
                    <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {unit.val}
                    </span>
                    <span className="mt-1 text-[9px] tracking-[0.2em] text-[#8A8A8E]">
                      {unit.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <span className="text-2xl font-bold text-white/40">:</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE ZELVYN STANDARD (PACKAGING & CRAFT) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="overflow-hidden rounded-sm border border-white/10 bg-[#0E0E10] lg:col-span-6">
            <img
              src="/images/hero/zelvyn-box.png"
              alt="Matte black embossed ZELVYN luxury shoebox"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="lg:col-span-6 lg:pl-6">
            <span className="font-mono text-[10px] tracking-[0.26em] text-[#8A8A8E] uppercase">
              THE ZELVYN STANDARD
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              MATTE EMBOSSED. BUILT TO ARRIVE CLEAN.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#A1A1A6]">
              Every pair ships inside ZELVYN&apos;s rigid 900gsm matte obsidian
              shoebox finished with tonal blind-embossed lettering, protective
              charcoal tissue wrap, and a serialized digital receipt.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Box,
                  title: "COLLECTOR PACKAGING",
                  desc: "Rigid matte black & titanium grey box with tonal embossing.",
                },
                {
                  icon: Truck,
                  title: "NATIONWIDE DISPATCH",
                  desc: "Free delivery across Pakistan on orders above PKR 8,000.",
                },
                {
                  icon: ShieldCheck,
                  title: "4 VERIFIED PAYMENTS",
                  desc: "Cash on Delivery, Cards, Easypaisa / JazzCash & Bank IBAN.",
                },
                {
                  icon: Sparkles,
                  title: "AUTHENTIC MATERIALS",
                  desc: "Tumbled calfskin, carbon weave, and storm-welted lugs.",
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="rounded-sm border border-white/[0.08] bg-[#0E0E10] p-4"
                >
                  <feat.icon className="h-4 w-4 text-white" />
                  <h3 className="mt-3 font-mono text-[11px] font-bold tracking-[0.14em] text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#8A8A8E]">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/orders"
                className="inline-flex h-11 items-center gap-2 rounded-sm border border-white bg-white px-6 font-mono text-xs font-bold tracking-[0.16em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                TRACK LIVE ORDERS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
