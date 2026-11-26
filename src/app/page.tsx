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
    <div className="bg-[#FAFAFC] text-[#0E0E14]">
      {/* 1. FULL-VIEWPORT VIBRANT EDITORIAL HERO */}
      <section
        ref={heroRef}
        className="vibrant-mesh relative flex min-h-[calc(100vh-6rem)] items-end overflow-hidden border-b border-black/[0.08] bg-[#FFF8F4]"
      >
        <motion.div
          style={{ y: heroImageY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <img
            src="/images/hero/hero-editorial.png"
            alt="ZELVYN Season 01 vibrant streetwear footwear editorial"
            className="h-full w-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFC] via-white/75 to-white/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFC]/95 via-[#FFF6F2]/65 to-transparent" />
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 pb-14 sm:px-6 sm:pb-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#FF4D1C]/25 bg-white/90 px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.24em] text-[#FF4D1C] uppercase shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#FF4D1C]" />
              SEASON 01 ARCHIVE · 24 SILHOUETTES LIVE
            </div>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.88] tracking-[-0.05em] text-[#0E0E14] sm:text-8xl lg:text-[7.5rem]">
              ZELVYN
            </h1>
            <p className="mt-3 bg-gradient-to-r from-[#FF4D1C] via-[#E11D74] to-[#0052FF] bg-clip-text font-display text-xl font-extrabold tracking-[0.18em] text-transparent uppercase sm:text-3xl">
              KEEPIN&apos; IT REAL
            </p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#3F3F4E] sm:text-base">
              Vibrant luxury streetwear footwear engineered in full-grain
              leather, sculpted Phylon, and high-traction carbon composites.
              Built for Boys, Girls, and Unisex rotations across Pakistan.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/shop?gender=boys"
                className="inline-flex h-12 items-center gap-2.5 rounded-md bg-[#0052FF] px-7 font-mono text-xs font-bold tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(0,82,255,0.28)] transition hover:bg-[#0E0E14]"
              >
                SHOP BOYS
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop?gender=girls"
                className="inline-flex h-12 items-center gap-2.5 rounded-md bg-[#E11D74] px-7 font-mono text-xs font-bold tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(225,29,116,0.28)] transition hover:bg-[#0E0E14]"
              >
                SHOP GIRLS
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center rounded-md border border-black/15 bg-white/90 px-5 font-mono text-[11px] font-bold tracking-[0.18em] text-[#0E0E14] backdrop-blur-md transition hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
              >
                VIEW ALL 24 DROPS
              </Link>
            </div>
          </motion.div>

          {/* Subtle scroll indicator */}
          <div className="mt-10 hidden items-center justify-between border-t border-black/10 pt-5 sm:flex">
            <div className="flex items-center gap-8 font-mono text-[10px] font-semibold tracking-[0.2em] text-[#555563]">
              <span>EU 36 — EU 45</span>
              <span className="text-[#FF4D1C]">PKR 4,900 — PKR 24,500</span>
              <span>COD · CARDS · EASYPAISA · JAZZCASH</span>
            </div>
            <a
              href="#gender-showcase"
              className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.22em] text-[#0E0E14] transition hover:text-[#FF4D1C]"
            >
              SCROLL TO EXPLORE
              <ArrowDown className="h-3.5 w-3.5 animate-bounce text-[#FF4D1C]" />
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
            <p className="font-mono text-[10px] font-bold tracking-[0.26em] text-[#FF4D1C] uppercase">
              DUAL COLLECTION ARCHITECTURE
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0E0E14] sm:text-4xl">
              BUILT FOR EVERY ROTATION
            </h2>
          </div>
          <Link
            href="/shop?gender=unisex"
            className="font-mono text-xs font-semibold tracking-[0.16em] text-[#0052FF] transition hover:underline"
          >
            EXPLORE UNISEX ARCHIVE →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* BOYS CARD */}
          <Link
            href="/shop?gender=boys"
            className="group relative flex min-h-[460px] items-end overflow-hidden rounded-xl border-2 border-[#0052FF]/20 bg-[#EFF4FF] p-7 shadow-sm transition-all duration-500 hover:border-[#0052FF] hover:shadow-[0_20px_50px_-14px_rgba(0,82,255,0.3)] sm:min-h-[540px] sm:p-10"
          >
            <img
              src="/images/hero/split-boys.png"
              alt="ZELVYN Boys Footwear Collection"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061539]/90 via-[#061539]/35 to-transparent" />
            <div className="relative z-10 w-full">
              <span className="inline-block rounded-md bg-[#0052FF] px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-white shadow-sm">
                EU 40 — EU 45 · 14 SILHOUETTES
              </span>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    BOYS
                  </h3>
                  <p className="mt-1.5 text-sm text-white/90">
                    Chunky Runners, Commando Loafers, Turf Grippers &amp; Slides.
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-[#0052FF] shadow-md transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* GIRLS CARD */}
          <Link
            href="/shop?gender=girls"
            className="group relative flex min-h-[460px] items-end overflow-hidden rounded-xl border-2 border-[#E11D74]/20 bg-[#FFF1F6] p-7 shadow-sm transition-all duration-500 hover:border-[#E11D74] hover:shadow-[0_20px_50px_-14px_rgba(225,29,116,0.3)] sm:min-h-[540px] sm:p-10"
          >
            <img
              src="/images/hero/split-girls.png"
              alt="ZELVYN Girls Footwear Collection"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3E0822]/90 via-[#3E0822]/35 to-transparent" />
            <div className="relative z-10 w-full">
              <span className="inline-block rounded-md bg-[#E11D74] px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-white shadow-sm">
                EU 36 — EU 41 · 14 SILHOUETTES
              </span>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    GIRLS
                  </h3>
                  <p className="mt-1.5 text-sm text-white/90">
                    Sculpted Platforms, Penny Loafers, Studio Grippers &amp; Crocs.
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-[#E11D74] shadow-md transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. 4-PILLAR CATEGORY BENTO GRID */}
      <section className="border-y border-black/[0.08] bg-[#F3F4F8] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[0.26em] text-[#0052FF] uppercase">
                FOUR DISCIPLINES
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0E0E14] sm:text-4xl">
                SHOP BY SILHOUETTE
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#555563]">
              Every discipline is stocked across both Boys and Girls sizing
              with vibrant street-ready finishing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_BENTO.map((cat, idx) => {
              const badgeColor =
                idx === 0
                  ? "bg-[#FF4D1C]"
                  : idx === 1
                    ? "bg-[#0052FF]"
                    : idx === 2
                      ? "bg-[#059669]"
                      : "bg-[#E11D74]";
              return (
                <Link
                  key={cat.key}
                  href={`/shop?category=${cat.key}`}
                  className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E14]/90 via-[#0E0E14]/40 to-[#0E0E14]/25" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="rounded bg-white/90 px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.18em] text-[#0E0E14] backdrop-blur-md">
                      {cat.subtitle}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 font-mono text-[10px] font-bold text-white",
                        badgeColor
                      )}
                    >
                      {cat.count}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-display text-3xl font-extrabold tracking-tight text-white">
                      {cat.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs text-white/85">
                      {CATEGORY_META[cat.key].description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.18em] text-white uppercase">
                      EXPLORE {cat.title}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED DROP GRID (FILTERABLE + QUICK ADD) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold tracking-[0.26em] text-[#E11D74] uppercase">
              CURATED RELEASE MATRIX
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0E0E14] sm:text-4xl">
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
                  "rounded-md border px-4 py-2 font-mono text-[11px] font-bold tracking-[0.16em] transition",
                  dropFilter === tab.key
                    ? "border-[#FF4D1C] bg-[#FF4D1C] text-white shadow-[0_6px_16px_rgba(255,77,28,0.28)]"
                    : "border-black/10 bg-white text-[#555563] hover:border-[#FF4D1C] hover:text-[#0E0E14]"
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
            className="inline-flex h-12 items-center gap-3 rounded-md bg-[#0E0E14] px-8 font-mono text-xs font-bold tracking-[0.18em] text-white shadow-md transition hover:bg-[#FF4D1C]"
          >
            OPEN COMPLETE 24-SHOE CATALOG
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 5. EDITORIAL CAMPAIGN BANNER (11:11 ARCHIVE SALE) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FF4D1C] via-[#E11D74] to-[#0052FF] text-white">
        <img
          src="/images/hero/campaign-1111.png"
          alt="ZELVYN Season 01 11:11 Archive Drop"
          className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-between gap-10 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-block rounded-md bg-white px-3 py-1 font-mono text-[10px] font-bold tracking-[0.22em] text-[#FF4D1C] shadow-sm">
              LIMITED ARCHIVE EVENT · CODE: ZELVYN50
            </span>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl">
              SEASON 01 / 11:11 ARCHIVE SALE — UP TO 50% OFF
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/90">
              Selected Kinetix Joggers, Tactical Court Grippers, Chalk Noir
              Lows, and Cloud Contour Slides marked down for 24 hours. Use promo{" "}
              <code className="rounded bg-white/20 px-1.5 py-0.5 font-mono font-bold text-white">
                REAL10
              </code>{" "}
              for an extra 10% off any drop in your bag.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop?badge=50%25%20OFF"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-7 font-mono text-xs font-bold tracking-[0.18em] text-[#0E0E14] shadow-lg transition hover:bg-[#0E0E14] hover:text-white"
              >
                SHOP 50% OFF VAULT
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/50 bg-white/15 px-6 font-mono text-xs font-bold tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white hover:text-[#0E0E14]"
              >
                BROWSE ALL DROPS
              </Link>
            </div>
          </div>

          {/* Live Countdown Timer */}
          <div className="rounded-xl border border-white/25 bg-white/15 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <p className="font-mono text-[10px] font-bold tracking-[0.22em] text-white/90 uppercase">
              ARCHIVE WINDOW CLOSES IN
            </p>
            <div className="mt-4 flex items-center gap-3 font-mono">
              {[
                { label: "HRS", val: countdown.mounted ? countdown.h : "11" },
                { label: "MIN", val: countdown.mounted ? countdown.m : "42" },
                { label: "SEC", val: countdown.mounted ? countdown.s : "18" },
              ].map((unit, idx) => (
                <React.Fragment key={unit.label}>
                  <div className="flex min-w-20 flex-col items-center rounded-lg bg-white px-4 py-3 text-[#0E0E14] shadow-md">
                    <span className="text-3xl font-bold tracking-tight text-[#0E0E14] sm:text-4xl">
                      {unit.val}
                    </span>
                    <span className="mt-1 text-[9px] font-bold tracking-[0.2em] text-[#FF4D1C]">
                      {unit.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <span className="text-2xl font-bold text-white">:</span>
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
          <div className="overflow-hidden rounded-xl border border-black/10 bg-[#FFF6F2] shadow-sm lg:col-span-6">
            <img
              src="/images/hero/zelvyn-box.png"
              alt="Signature ZELVYN collector shoebox"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="lg:col-span-6 lg:pl-6">
            <span className="font-mono text-[10px] font-bold tracking-[0.26em] text-[#FF4D1C] uppercase">
              THE ZELVYN STANDARD
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0E0E14] sm:text-5xl">
              COLLECTOR BOXED. BUILT TO ARRIVE CLEAN.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#555563]">
              Every pair ships inside ZELVYN&apos;s rigid 900gsm collector
              shoebox finished with crisp embossed lettering, protective
              tissue wrap, and a serialized digital receipt.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Box,
                  color: "text-[#FF4D1C] bg-[#FFF1EC]",
                  title: "COLLECTOR PACKAGING",
                  desc: "Rigid 900gsm collector box with embossed ZELVYN branding.",
                },
                {
                  icon: Truck,
                  color: "text-[#059669] bg-[#ECFDF5]",
                  title: "NATIONWIDE DISPATCH",
                  desc: "Free delivery across Pakistan on orders above PKR 8,000.",
                },
                {
                  icon: ShieldCheck,
                  color: "text-[#0052FF] bg-[#EFF4FF]",
                  title: "4 VERIFIED PAYMENTS",
                  desc: "Cash on Delivery, Cards, Easypaisa / JazzCash & Bank IBAN.",
                },
                {
                  icon: Sparkles,
                  color: "text-[#E11D74] bg-[#FFF1F6]",
                  title: "AUTHENTIC MATERIALS",
                  desc: "Tumbled calfskin, carbon weave, and storm-welted lugs.",
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="rounded-lg border border-black/[0.08] bg-white p-4 shadow-sm"
                >
                  <div
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-md",
                      feat.color
                    )}
                  >
                    <feat.icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 font-mono text-[11px] font-bold tracking-[0.14em] text-[#0E0E14]">
                    {feat.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#555563]">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/orders"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-[#0052FF] px-6 font-mono text-xs font-bold tracking-[0.16em] text-white shadow-[0_8px_20px_rgba(0,82,255,0.28)] transition hover:bg-[#0E0E14]"
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
