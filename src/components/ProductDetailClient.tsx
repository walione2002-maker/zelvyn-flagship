"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
  ZoomIn,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ANGLE_LABELS, EXCHANGE_POLICY, PRODUCTS } from "@/data/products";
import type { Product } from "@/types/store";
import { ProductCard } from "@/components/ProductCard";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { cn, formatPKR } from "@/lib/utils";

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist, hydrated } = useStore();

  const gallery = product.images.length > 0 ? product.images : [product.image];
  const [activeAngle, setActiveAngle] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<number>(
    product.sizes[Math.floor(product.sizes.length / 2)] || product.sizes[0]
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || "Default"
  );
  const [studioZoom, setStudioZoom] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const isWishlisted = hydrated && wishlist.includes(product.id);
  const isGirls = product.gender === "girls";

  const related = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.category === product.category || p.gender === product.gender)
  ).slice(0, 4);

  const prevAngle = () =>
    setActiveAngle((i) => (i - 1 + gallery.length) % gallery.length);
  const nextAngle = () =>
    setActiveAngle((i) => (i + 1) % gallery.length);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.18em] text-[#555563] uppercase"
      >
        <Link href="/" className="hover:text-[#FF4D1C]">
          HOME
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-[#FF4D1C]">
          SHOP
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/shop?gender=${product.gender}`}
          className="hover:text-[#FF4D1C]"
        >
          {product.gender}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-[#FF4D1C]"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#0E0E14]">{product.name}</span>
      </nav>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: Multi-Angle Studio Gallery */}
        <div className="space-y-4 lg:col-span-7">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-black/10 bg-[#F3F4F8] shadow-sm">
            <img
              src={gallery[activeAngle]}
              alt={`${product.name} — ${ANGLE_LABELS[activeAngle] || "View"}`}
              className={cn(
                "h-full w-full object-cover transition-transform duration-700 ease-out",
                studioZoom ? "scale-125" : "group-hover:scale-105"
              )}
            />

            {product.badge && (
              <span
                className={cn(
                  "absolute top-4 left-4 rounded-md px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-white shadow-sm",
                  isGirls ? "bg-[#E11D74]" : "bg-[#FF4D1C]"
                )}
              >
                {product.badge}
              </span>
            )}

            <span className="absolute bottom-4 left-4 rounded-md border border-black/10 bg-white/90 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-[#0E0E14] uppercase shadow-xs backdrop-blur-md">
              {ANGLE_LABELS[activeAngle] || `ANGLE ${activeAngle + 1}`} (
              {activeAngle + 1}/{gallery.length})
            </span>

            {/* Angle Left / Right Controls */}
            {gallery.length > 1 && (
              <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between pointer-events-none">
                <button
                  type="button"
                  onClick={prevAngle}
                  aria-label="Previous angle"
                  className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#0E0E14] shadow-md backdrop-blur-md transition hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={nextAngle}
                  aria-label="Next angle"
                  className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#0E0E14] shadow-md backdrop-blur-md transition hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStudioZoom((v) => !v)}
              className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-white/90 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-[#0E0E14] shadow-sm backdrop-blur-md transition hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
            >
              <ZoomIn className="h-3.5 w-3.5" />
              {studioZoom ? "RESET VIEW" : "DETAIL ZOOM"}
            </button>
          </div>

          {/* 4-Angle Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((imgSrc, idx) => (
              <button
                key={imgSrc}
                type="button"
                onClick={() => {
                  setActiveAngle(idx);
                  setStudioZoom(false);
                }}
                className={cn(
                  "group relative overflow-hidden rounded-lg border-2 bg-[#F3F4F8] transition",
                  activeAngle === idx
                    ? isGirls
                      ? "border-[#E11D74] shadow-md"
                      : "border-[#FF4D1C] shadow-md"
                    : "border-black/10 opacity-75 hover:opacity-100"
                )}
              >
                <img
                  src={imgSrc}
                  alt={`${product.name} ${ANGLE_LABELS[idx] || ""}`}
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="block border-t border-black/[0.06] bg-white py-1.5 text-center font-mono text-[9px] font-bold tracking-[0.12em] text-[#0E0E14] uppercase">
                  {ANGLE_LABELS[idx] || `Angle ${idx + 1}`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Configuration & Specs */}
        <div className="flex flex-col lg:col-span-5">
          <div className="flex items-center justify-between font-mono text-[11px] font-semibold tracking-[0.2em] text-[#0052FF] uppercase">
            <span>
              {product.sku} · {product.gender} · {product.subType}
            </span>
            <span className="rounded bg-[#EFF4FF] px-2 py-0.5 text-[10px] font-bold text-[#0052FF]">
              {gallery.length} STUDIO ANGLES
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#0E0E14] sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3 border-b border-black/[0.08] pb-6">
            <span className="font-mono text-2xl font-bold text-[#0E0E14]">
              {formatPKR(product.pricePKR)}
            </span>
            {product.originalPricePKR && (
              <span className="font-mono text-sm text-[#8E8E9E] line-through">
                {formatPKR(product.originalPricePKR)}
              </span>
            )}
            <span className="ml-auto rounded bg-[#ECFDF5] px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.14em] text-[#059669]">
              INCL. COLLECTOR BOX
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-[#555563]">
            {product.description}
          </p>

          {/* Finish / Color */}
          <div className="mt-6">
            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#555563] uppercase">
              COLORWAY:{" "}
              <strong className="text-[#0E0E14]">{selectedColor}</strong>
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-3.5 py-2 font-mono text-[11px] font-semibold transition",
                    selectedColor === c.name
                      ? "border-[#0052FF] bg-[#EFF4FF] text-[#0052FF]"
                      : "border-black/10 bg-white text-[#555563] hover:border-black/30"
                  )}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* EU Size Grid */}
          <div className="mt-6">
            <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.2em] text-[#555563] uppercase">
              <span>
                SELECT SIZE:{" "}
                <strong className="text-[#0E0E14]">EU {selectedSize}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="inline-flex items-center gap-1.5 text-[#FF4D1C] underline-offset-4 hover:underline"
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
                    "rounded-md border py-2.5 font-mono text-xs font-semibold transition",
                    selectedSize === size
                      ? isGirls
                        ? "border-[#E11D74] bg-[#E11D74] font-bold text-white shadow-sm"
                        : "border-[#FF4D1C] bg-[#FF4D1C] font-bold text-white shadow-sm"
                      : "border-black/10 bg-white text-[#0E0E14] hover:border-[#FF4D1C]"
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
                className={cn(
                  "flex h-12 flex-1 items-center justify-center gap-2 rounded-md font-mono text-xs font-bold tracking-[0.18em] text-white transition hover:bg-[#0E0E14]",
                  isGirls
                    ? "bg-[#E11D74] shadow-[0_8px_22px_rgba(225,29,116,0.3)]"
                    : "bg-[#FF4D1C] shadow-[0_8px_22px_rgba(255,77,28,0.3)]"
                )}
              >
                <ShoppingBag className="h-4 w-4" />
                ADD TO BAG
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id, product.name)}
                aria-label="Toggle wishlist"
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-md border transition",
                  isWishlisted
                    ? "border-[#E11D74] bg-[#E11D74] text-white"
                    : "border-black/10 bg-white text-[#0E0E14] hover:border-[#E11D74] hover:text-[#E11D74]"
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
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#0E0E14] font-mono text-xs font-bold tracking-[0.18em] text-white transition hover:bg-[#0052FF]"
            >
              BUY NOW — EXPRESS CHECKOUT
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Service Assurances + Strict Exchange-Only Policy */}
          <div className="mt-6 space-y-2.5 rounded-lg border border-black/[0.08] bg-[#F3F4F8] p-4 font-mono text-[10px] font-semibold tracking-[0.12em] text-[#3F3F4E]">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-[#059669]" />
                <span>FREE DELIVERY &gt; PKR 8,000</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#0052FF]" />
                <span>COD, CARDS &amp; WALLETS</span>
              </div>
            </div>
            <div className="flex items-start gap-2 border-t border-black/[0.06] pt-2.5 text-[#FF4D1C]">
              <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{EXCHANGE_POLICY.detail}</span>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mt-7 border-t border-black/[0.08] pt-6">
            <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#0E0E14] uppercase">
              TECHNICAL SPECIFICATION
            </h2>
            <dl className="mt-4 divide-y divide-black/[0.06] rounded-lg border border-black/[0.08] bg-white">
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
                  <dt className="font-mono text-[10px] font-semibold tracking-[0.18em] text-[#555563]">
                    {spec.label}
                  </dt>
                  <dd className="flex items-center gap-1.5 text-xs font-medium text-[#0E0E14]">
                    <Check className="h-3 w-3 text-[#059669]" />
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-20 border-t border-black/[0.08] pt-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-[#FF4D1C] uppercase">
              CONTINUE ROTATION
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-[#0E0E14] sm:text-3xl">
              SIMILAR SILHOUETTES
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-mono text-xs font-semibold tracking-[0.16em] text-[#0052FF] hover:underline"
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
