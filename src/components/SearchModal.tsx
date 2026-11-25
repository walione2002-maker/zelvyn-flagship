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
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-4 pt-20 backdrop-blur-md"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-sm border border-white/15 bg-[#0E0E10] shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <Search className="h-4 w-4 text-[#8A8A8E]" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sneakers, grippers, loafers, crocs, or SKU..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-[#5C5C62] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="rounded-sm border border-white/10 p-1 text-[#8A8A8E] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-96 divide-y divide-white/[0.06] overflow-y-auto">
              {matches.length === 0 ? (
                <div className="px-6 py-10 text-center font-mono text-xs text-[#8A8A8E]">
                  No silhouettes match &quot;{query}&quot;.
                </div>
              ) : (
                matches.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-12 w-12 rounded-sm border border-white/10 object-cover"
                      />
                      <div>
                        <p className="font-display text-sm font-bold text-white">
                          {p.name}
                        </p>
                        <p className="font-mono text-[10px] tracking-[0.14em] text-[#8A8A8E] uppercase">
                          {p.sku} · {p.gender} · {p.subType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-white">
                        {formatPKR(p.pricePKR)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#8A8A8E]" />
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 bg-[#08080A] px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E]">
              <span>{matches.length} RESULTS</span>
              <Link
                href={`/shop${query ? `?q=${encodeURIComponent(query)}` : ""}`}
                onClick={() => setSearchOpen(false)}
                className="text-white hover:underline"
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
