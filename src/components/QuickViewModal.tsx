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
      className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl md:grid-cols-2"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close quick view"
        className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white/90 text-[#0E0E14] shadow-sm transition hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Left Visual */}
      <div className="relative aspect-square bg-[#F3F4F8] md:aspect-auto">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        {product.badge && (
          <span className="absolute top-4 left-4 rounded-md bg-[#FF4D1C] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.18em] text-white uppercase shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Right Details */}
      <div className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.2em] text-[#0052FF] uppercase">
            <span>{product.sku}</span>
            <span>•</span>
            <span>{product.gender}</span>
            <span>•</span>
            <span>{product.subType}</span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#0E0E14]">
            {product.name}
          </h2>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-mono text-xl font-bold text-[#0E0E14]">
              {formatPKR(product.pricePKR)}
            </span>
            {product.originalPricePKR && (
              <span className="font-mono text-sm text-[#8E8E9E] line-through">
                {formatPKR(product.originalPricePKR)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#555563]">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="mt-5">
            <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.18em] text-[#555563] uppercase">
              <span>Finish: {selectedColor}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.12em] transition",
                    selectedColor === c.name
                      ? "border-[#0052FF] bg-[#EFF4FF] text-[#0052FF]"
                      : "border-black/10 bg-[#F6F7FA] text-[#555563] hover:border-black/30"
                  )}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Picker */}
          <div className="mt-5">
            <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.18em] text-[#555563] uppercase">
              <span>EU Size: {selectedSize}</span>
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="inline-flex items-center gap-1 text-[#FF4D1C] underline-offset-4 hover:underline"
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
                    "rounded-md border py-2 font-mono text-xs font-semibold transition",
                    selectedSize === size
                      ? "border-[#FF4D1C] bg-[#FF4D1C] font-bold text-white shadow-sm"
                      : "border-black/10 bg-[#F6F7FA] text-[#0E0E14] hover:border-[#FF4D1C]"
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
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#FF4D1C] font-mono text-xs font-bold tracking-[0.14em] text-white shadow-[0_6px_18px_rgba(255,77,28,0.28)] transition hover:bg-[#0E0E14]"
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
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#0E0E14] font-mono text-xs font-bold tracking-[0.14em] text-white transition hover:bg-[#0052FF]"
            >
              BUY NOW
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <Link
            href={`/product/${product.slug}`}
            onClick={onClose}
            className="text-center font-mono text-[10px] font-semibold tracking-[0.18em] text-[#555563] uppercase underline-offset-4 transition hover:text-[#FF4D1C] hover:underline"
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
