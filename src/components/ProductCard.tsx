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

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-sm border border-white/[0.08] bg-[#0E0E10] transition-colors duration-300 hover:border-[#2A2A2E]"
      onMouseLeave={() => setShowSizes(false)}
    >
      {/* Visual Frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#09090B]">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Subtle studio lighting sheen on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-white/[0.04] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        {/* Top Badges & Controls */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {product.badge && (
              <span
                className={cn(
                  "inline-block rounded-sm px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.16em] uppercase",
                  product.badge === "50% OFF"
                    ? "bg-white text-[#050505]"
                    : "border border-white/20 bg-black/80 text-white backdrop-blur-md"
                )}
              >
                {product.badge}
              </span>
            )}
            <span className="inline-block w-fit rounded-sm border border-white/10 bg-black/70 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.16em] text-[#A1A1A6] uppercase backdrop-blur-md">
              {product.gender} · {product.subType}
            </span>
          </div>

          <div className="pointer-events-auto flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id, product.name)}
              aria-label={`Save ${product.name} to archive`}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-sm border backdrop-blur-md transition",
                isWishlisted
                  ? "border-white bg-white text-[#050505]"
                  : "border-white/15 bg-black/70 text-[#D1D1D6] hover:border-white/40 hover:text-white"
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
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/15 bg-black/70 text-[#D1D1D6] backdrop-blur-md transition hover:border-white/40 hover:text-white"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick-Add Size Bar (hover on desktop, tap Quick Add on mobile) */}
        <div className="absolute inset-x-3 bottom-3">
          {!showSizes ? (
            <button
              type="button"
              onClick={() => setShowSizes(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-white/20 bg-black/85 py-2 font-mono text-[10px] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-md transition hover:border-white hover:bg-white hover:text-[#050505] md:opacity-0 md:group-hover:opacity-100"
            >
              <Plus className="h-3 w-3" />
              QUICK ADD SIZE
            </button>
          ) : (
            <div className="rounded-sm border border-white/20 bg-[#050505]/95 p-2 backdrop-blur-xl">
              <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] tracking-[0.16em] text-[#8A8A8E]">
                <span>SELECT EU SIZE</span>
                <button
                  type="button"
                  onClick={() => setShowSizes(false)}
                  className="text-white hover:underline"
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
                    className="rounded-sm border border-white/15 bg-[#161619] py-1 font-mono text-[10px] text-white transition hover:border-white hover:bg-white hover:text-[#050505]"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Metadata */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E]">
              {product.sku}
            </span>
            <div className="flex items-center gap-1">
              {product.colors.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-2.5 w-2.5 rounded-full border border-white/25"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="mt-1.5 block font-display text-base font-bold tracking-tight text-[#F5F5F7] transition hover:text-white"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-3 flex items-baseline justify-between border-t border-white/[0.06] pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-white">
              {formatPKR(product.pricePKR)}
            </span>
            {product.originalPricePKR && (
              <span className="font-mono text-[11px] text-[#6E6E73] line-through">
                {formatPKR(product.originalPricePKR)}
              </span>
            )}
          </div>
          <span className="font-mono text-[10px] text-[#8A8A8E]">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  );
}
