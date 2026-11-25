"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Ruler, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import type { Product } from "@/types/store";
import { cn, formatPKR } from "@/lib/utils";
import { SizeGuideModal } from "@/components/SizeGuideModal";

function QuickViewContent({
  product,
  onClose,
  onOpenSizeGuide,
}: {
  product: Product;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}) {
  const router = useRouter();
  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<number>(
    product.sizes[Math.floor(product.sizes.length / 2)] || product.sizes[0]
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || "Obsidian"
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => e.stopPropagation()}
      className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-sm border border-white/15 bg-[#0E0E10] shadow-2xl md:grid-cols-2"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close quick view"
        className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 bg-black/80 text-white transition hover:border-white"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Left Visual */}
      <div className="relative aspect-square bg-[#070709] md:aspect-auto">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {product.badge && (
          <span className="absolute top-4 left-4 rounded-sm border border-white/20 bg-black/80 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.18em] text-white uppercase">
            {product.badge}
          </span>
        )}
      </div>

      {/* Right Details */}
      <div className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#8A8A8E] uppercase">
            <span>{product.sku}</span>
            <span>•</span>
            <span>{product.gender}</span>
            <span>•</span>
            <span>{product.subType}</span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white">
            {product.name}
          </h2>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-mono text-xl font-bold text-white">
              {formatPKR(product.pricePKR)}
            </span>
            {product.originalPricePKR && (
              <span className="font-mono text-sm text-[#6E6E73] line-through">
                {formatPKR(product.originalPricePKR)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#A1A1A6]">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="mt-5">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-[#8A8A8E] uppercase">
              <span>Finish: {selectedColor}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={cn(
                    "flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] transition",
                    selectedColor === c.name
                      ? "border-white bg-white/10 text-white"
                      : "border-white/10 bg-[#161619] text-[#8A8A8E] hover:border-white/30"
                  )}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-white/25"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Picker */}
          <div className="mt-5">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-[#8A8A8E] uppercase">
              <span>EU Size: {selectedSize}</span>
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="inline-flex items-center gap-1 text-white underline-offset-4 hover:underline"
              >
                <Ruler className="h-3 w-3" />
                SIZE GUIDE
              </button>
            </div>
            <div className="mt-2 grid grid-cols-6 gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "rounded-sm border py-2 font-mono text-xs transition",
                    selectedSize === size
                      ? "border-white bg-white font-bold text-[#050505]"
                      : "border-white/10 bg-[#161619] text-[#D1D1D6] hover:border-white/35"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                addToCart(product, selectedSize, selectedColor, 1, true);
                onClose();
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-sm border border-white bg-white font-mono text-xs font-bold tracking-[0.14em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              ADD TO BAG
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(product, selectedSize, selectedColor, 1, false);
                onClose();
                router.push("/checkout");
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-sm border border-white/25 bg-[#161619] font-mono text-xs font-bold tracking-[0.14em] text-white transition hover:border-white"
            >
              BUY NOW
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <Link
            href={`/product/${product.slug}`}
            onClick={onClose}
            className="text-center font-mono text-[10px] tracking-[0.18em] text-[#8A8A8E] uppercase underline-offset-4 transition hover:text-white hover:underline"
          >
            VIEW FULL SPECIFICATION &amp; DETAILS →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {product && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={onClose}
          >
            <QuickViewContent
              key={product.id}
              product={product}
              onClose={onClose}
              onOpenSizeGuide={() => setSizeGuideOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </>
  );
}
