"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
  ZoomIn,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/types/store";
import { ProductCard } from "@/components/ProductCard";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { cn, formatPKR } from "@/lib/utils";

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist, hydrated } = useStore();

  const [selectedSize, setSelectedSize] = useState<number>(
    product.sizes[Math.floor(product.sizes.length / 2)] || product.sizes[0]
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || "Obsidian"
  );
  const [studioZoom, setStudioZoom] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const isWishlisted = hydrated && wishlist.includes(product.id);

  const related = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.category === product.category || p.gender === product.gender)
  ).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-[#8A8A8E] uppercase"
      >
        <Link href="/" className="hover:text-white">
          HOME
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-white">
          SHOP
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-white"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white">{product.name}</span>
      </nav>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: High-res Studio Visual */}
        <div className="lg:col-span-7">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 bg-[#0A0A0C]">
            <img
              src={product.image}
              alt={product.name}
              className={cn(
                "h-full w-full object-cover transition-transform duration-700 ease-out",
                studioZoom ? "scale-125" : "group-hover:scale-105"
              )}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-white/[0.03]" />

            {product.badge && (
              <span className="absolute top-4 left-4 rounded-sm border border-white/20 bg-black/80 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-md">
                {product.badge}
              </span>
            )}

            <button
              type="button"
              onClick={() => setStudioZoom((v) => !v)}
              className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-sm border border-white/20 bg-black/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-white backdrop-blur-md transition hover:border-white"
            >
              <ZoomIn className="h-3.5 w-3.5" />
              {studioZoom ? "RESET VIEW" : "DETAIL ZOOM"}
            </button>
          </div>
        </div>

        {/* Right: Configuration & Specs */}
        <div className="flex flex-col lg:col-span-5">
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-[#8A8A8E] uppercase">
            <span>
              {product.sku} · {product.gender} · {product.subType}
            </span>
            <span className="text-white">
              ★ {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3 border-b border-white/[0.08] pb-6">
            <span className="font-mono text-2xl font-bold text-white">
              {formatPKR(product.pricePKR)}
            </span>
            {product.originalPricePKR && (
              <span className="font-mono text-sm text-[#6E6E73] line-through">
                {formatPKR(product.originalPricePKR)}
              </span>
            )}
            <span className="ml-auto font-mono text-[10px] tracking-[0.14em] text-[#8A8A8E]">
              INCL. MATTE BOX
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-[#A1A1A6]">
            {product.description}
          </p>

          {/* Finish / Color */}
          <div className="mt-6">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#8A8A8E] uppercase">
              COLORWAY:{" "}
              <strong className="text-white">{selectedColor}</strong>
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={cn(
                    "flex items-center gap-2 rounded-sm border px-3.5 py-2 font-mono text-[11px] transition",
                    selectedColor === c.name
                      ? "border-white bg-white/10 text-white"
                      : "border-white/10 bg-[#0E0E10] text-[#8A8A8E] hover:border-white/30"
                  )}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/25"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* EU Size Grid */}
          <div className="mt-6">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#8A8A8E] uppercase">
              <span>
                SELECT SIZE: <strong className="text-white">EU {selectedSize}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="inline-flex items-center gap-1.5 text-white underline-offset-4 hover:underline"
              >
                <Ruler className="h-3.5 w-3.5" />
                SIZE GUIDE
              </button>
            </div>
            <div className="mt-2.5 grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "rounded-sm border py-2.5 font-mono text-xs transition",
                    selectedSize === size
                      ? "border-white bg-white font-bold text-[#050505]"
                      : "border-white/10 bg-[#0E0E10] text-[#D1D1D6] hover:border-white/35"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Actions */}
          <div className="mt-7 flex flex-col gap-3">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() =>
                  addToCart(product, selectedSize, selectedColor, 1, true)
                }
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-sm border border-white bg-white font-mono text-xs font-bold tracking-[0.18em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                ADD TO BAG
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id, product.name)}
                aria-label="Toggle wishlist"
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-sm border transition",
                  isWishlisted
                    ? "border-white bg-white text-[#050505]"
                    : "border-white/15 bg-[#0E0E10] text-white hover:border-white/40"
                )}
              >
                <Bookmark
                  className={cn("h-4 w-4", isWishlisted && "fill-current")}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                addToCart(product, selectedSize, selectedColor, 1, false);
                router.push("/checkout");
              }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-white/25 bg-[#161619] font-mono text-xs font-bold tracking-[0.18em] text-white transition hover:border-white"
            >
              BUY NOW — EXPRESS CHECKOUT
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Service Assurances */}
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-sm border border-white/[0.08] bg-[#0E0E10] p-4 font-mono text-[10px] tracking-[0.12em] text-[#A1A1A6]">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0 text-white" />
              <span>FREE DELIVERY &gt; PKR 8,000</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-white" />
              <span>COD, CARDS &amp; WALLETS</span>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mt-7 border-t border-white/10 pt-6">
            <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] text-white uppercase">
              TECHNICAL SPECIFICATION
            </h2>
            <dl className="mt-4 divide-y divide-white/[0.06] rounded-sm border border-white/[0.08] bg-[#0A0A0C]">
              {[
                { label: "UPPER", value: product.specs.upper },
                { label: "OUTSOLE", value: product.specs.sole },
                { label: "LINING", value: product.specs.lining },
                { label: "FIT PROFILE", value: product.specs.fit },
                { label: "WEIGHT", value: product.specs.weight },
                { label: "EDITION", value: product.specs.origin },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col justify-between gap-1 px-4 py-3 sm:flex-row sm:items-center"
                >
                  <dt className="font-mono text-[10px] tracking-[0.18em] text-[#8A8A8E]">
                    {spec.label}
                  </dt>
                  <dd className="flex items-center gap-1.5 text-xs text-[#F5F5F7]">
                    <Check className="h-3 w-3 text-[#8A8A8E]" />
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-20 border-t border-white/[0.08] pt-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.24em] text-[#8A8A8E] uppercase">
              CONTINUE ROTATION
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              SIMILAR SILHOUETTES
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-mono text-xs tracking-[0.16em] text-[#A1A1A6] hover:text-white"
          >
            VIEW ALL →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
}
