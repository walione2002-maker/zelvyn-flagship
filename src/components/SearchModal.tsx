"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { PRODUCTS } from "@/data/products";
import { formatPKR } from "@/lib/utils";

export function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.subType.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.gender.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/35 px-4 pt-20 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-black/[0.08] px-4 py-3.5">
              <Search className="h-4 w-4 text-[#FF4D1C]" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sneakers, grippers, loafers, crocs, or SKU..."
                className="flex-1 bg-transparent text-sm text-[#0E0E14] placeholder:text-[#8E8E9E] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="rounded-md border border-black/10 p-1 text-[#555563] hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-96 divide-y divide-black/[0.06] overflow-y-auto">
              {matches.length === 0 ? (
                <div className="px-6 py-10 text-center font-mono text-xs text-[#555563]">
                  No silhouettes match &quot;{query}&quot;.
                </div>
              ) : (
                matches.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-[#F3F4F8]"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-12 w-12 rounded-md border border-black/10 bg-[#F3F4F8] object-cover"
                      />
                      <div>
                        <p className="font-display text-sm font-bold text-[#0E0E14]">
                          {p.name}
                        </p>
                        <p className="font-mono text-[10px] tracking-[0.14em] text-[#555563] uppercase">
                          {p.sku} · {p.gender} · {p.subType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#0E0E14]">
                        {formatPKR(p.pricePKR)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#FF4D1C]" />
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-black/[0.08] bg-[#F3F4F8] px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.16em] text-[#555563]">
              <span>{matches.length} RESULTS</span>
              <Link
                href={`/shop${query ? `?q=${encodeURIComponent(query)}` : ""}`}
                onClick={() => setSearchOpen(false)}
                className="text-[#0052FF] hover:underline"
              >
                OPEN FULL CATALOG →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
