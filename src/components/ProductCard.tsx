"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, Eye, Plus } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import type { Product } from "@/types/store";
import { cn, formatPKR } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist, hydrated } = useStore();
  const [showSizes, setShowSizes] = useState(false);

  const isWishlisted = hydrated && wishlist.includes(product.id);
  const primaryImage = product.images[0] || product.image;
  const secondaryImage = product.images[1] || primaryImage;
  const isGirls = product.gender === "girls";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-black/[0.08] bg-white transition-all duration-300 hover:-translate-y-0.5",
        isGirls
          ? "hover:border-[#E11D74]/45 hover:shadow-[0_18px_40px_-14px_rgba(225,29,116,0.22)]"
          : "hover:border-[#FF4D1C]/40 hover:shadow-[0_18px_40px_-14px_rgba(255,77,28,0.2)]"
      )}
      onMouseLeave={() => setShowSizes(false)}
    >
      {/* Visual Frame with Primary -> Secondary Angle Hover Swap */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3F4F8]">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-0"
          />
          <img
            src={secondaryImage}
            alt={`${product.name} side profile`}
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        {/* Top Badges & Controls */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {product.badge && (
              <span
                className={cn(
                  "inline-block rounded-md px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.16em] text-white uppercase shadow-sm",
                  product.badge === "50% OFF"
                    ? "bg-[#FF4D1C]"
                    : product.badge === "NEW DROP"
                      ? isGirls
                        ? "bg-[#E11D74]"
                        : "bg-[#0052FF]"
                      : product.badge === "LIMITED"
                        ? "bg-[#7C3AED]"
                        : "bg-[#0E0E14]"
                )}
              >
                {product.badge}
              </span>
            )}
            <span className="inline-block w-fit rounded-md border border-black/10 bg-white/90 px-2 py-0.5 font-mono text-[8px] font-semibold tracking-[0.16em] text-[#3F3F4E] uppercase backdrop-blur-md">
              {product.gender} · {product.subType}
            </span>
          </div>

          <div className="pointer-events-auto flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id, product.name)}
              aria-label={`Save ${product.name} to archive`}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border backdrop-blur-md transition",
                isWishlisted
                  ? "border-[#E11D74] bg-[#E11D74] text-white shadow-sm"
                  : "border-black/10 bg-white/90 text-[#3F3F4E] hover:border-[#E11D74] hover:text-[#E11D74]"
              )}
            >
              <Bookmark
                className={cn("h-3.5 w-3.5", isWishlisted && "fill-current")}
              />
            </button>
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                aria-label={`Quick view ${product.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-black/10 bg-white/90 text-[#3F3F4E] backdrop-blur-md transition hover:border-[#0052FF] hover:text-[#0052FF]"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Top-center badge removed to prevent badge overlap; angle count is shown cleanly in card footer */}

        {/* Quick-Add Size Bar (hover on desktop, tap Quick Add on mobile) */}
        <div className="absolute inset-x-3 bottom-3">
          {!showSizes ? (
            <button
              type="button"
              onClick={() => setShowSizes(true)}
              className={cn(
                "flex w-full items-center justify-center gap-1.5 rounded-md bg-[#0E0E14]/92 py-2.5 font-mono text-[10px] font-bold tracking-[0.18em] text-white uppercase shadow-lg backdrop-blur-md transition md:opacity-0 md:group-hover:opacity-100",
                isGirls ? "hover:bg-[#E11D74]" : "hover:bg-[#FF4D1C]"
              )}
            >
              <Plus className="h-3 w-3" />
              QUICK ADD SIZE
            </button>
          ) : (
            <div className="rounded-md border border-black/10 bg-white/95 p-2.5 shadow-xl backdrop-blur-xl">
              <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] font-semibold tracking-[0.16em] text-[#555563]">
                <span>SELECT EU SIZE</span>
                <button
                  type="button"
                  onClick={() => setShowSizes(false)}
                  className="text-[#FF4D1C] hover:underline"
                >
                  CLOSE
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {product.sizes.slice(0, 5).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      addToCart(product, size, product.colors[0]?.name, 1, true);
                      setShowSizes(false);
                    }}
                    className="rounded border border-black/10 bg-[#F3F4F8] py-1 font-mono text-[10px] font-semibold text-[#0E0E14] transition hover:border-[#FF4D1C] hover:bg-[#FF4D1C] hover:text-white"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Metadata (Zero fake ratings/reviews) */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.16em] text-[#757585]">
              {product.sku}
            </span>
            <div className="flex items-center gap-1">
              {product.colors.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-2.5 w-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className={cn(
              "mt-1.5 block font-display text-base font-bold tracking-tight text-[#0E0E14] transition",
              isGirls ? "hover:text-[#E11D74]" : "hover:text-[#FF4D1C]"
            )}
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-3 flex items-baseline justify-between border-t border-black/[0.06] pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-bold text-[#0E0E14]">
              {formatPKR(product.pricePKR)}
            </span>
            {product.originalPricePKR && (
              <span className="font-mono text-[11px] text-[#8E8E9E] line-through">
                {formatPKR(product.originalPricePKR)}
              </span>
            )}
          </div>
          <span className="font-mono text-[9px] font-semibold tracking-[0.12em] text-[#555563] uppercase">
            {product.images.length} ANGLES
          </span>
        </div>
      </div>
    </article>
  );
}
