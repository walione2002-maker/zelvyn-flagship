"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { ALL_SUBTYPES, CATEGORY_META, PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import type { Category, Gender, Product, SubType } from "@/types/store";
import { cn } from "@/lib/utils";

type GenderFilter = "all" | Gender;
type CategoryFilter = "all" | Category;
type SubTypeFilter = "all" | SubType;
type SortOption = "featured" | "price-asc" | "price-desc";

function ShopCatalogInner({
  initialQ,
  initialGender,
  initialCategory,
  initialSubType,
  initialSale,
}: {
  initialQ: string;
  initialGender: GenderFilter;
  initialCategory: CategoryFilter;
  initialSubType: SubTypeFilter;
  initialSale: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [gender, setGender] = useState<GenderFilter>(initialGender);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [subType, setSubType] = useState<SubTypeFilter>(initialSubType);
  const [onlySale, setOnlySale] = useState(initialSale);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  const availableSubTypes = useMemo(() => {
    if (category === "all") return ALL_SUBTYPES;
    return CATEGORY_META[category].subTypes;
  }, [category]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((p) => {
      if (gender === "boys" && p.gender !== "boys" && p.gender !== "unisex") {
        return false;
      }
      if (gender === "girls" && p.gender !== "girls" && p.gender !== "unisex") {
        return false;
      }
      if (gender === "unisex" && p.gender !== "unisex") {
        return false;
      }

      if (category !== "all" && p.category !== category) {
        return false;
      }

      if (subType !== "all" && p.subType !== subType) {
        return false;
      }

      if (onlySale && p.badge !== "50% OFF" && !p.originalPricePKR) {
        return false;
      }

      if (q) {
        const hay =
          `${p.name} ${p.sku} ${p.subType} ${p.category} ${p.gender} ${p.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.pricePKR - b.pricePKR);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.pricePKR - a.pricePKR);
    } else {
      sorted.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
      );
    }

    return sorted;
  }, [searchQuery, gender, category, subType, onlySale, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setGender("all");
    setCategory("all");
    setSubType("all");
    setOnlySale(false);
    setSortBy("featured");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="border-b border-black/[0.08] pb-8">
        <p className="font-mono text-[10px] font-bold tracking-[0.26em] text-[#FF4D1C] uppercase">
          ZELVYN ARCHIVE / ALL DROPS
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#0E0E14] sm:text-5xl">
            FOOTWEAR CATALOG
          </h1>
          <p className="rounded-full bg-[#EFF4FF] px-3.5 py-1.5 font-mono text-xs font-bold tracking-[0.14em] text-[#0052FF]">
            SHOWING {filteredProducts.length} OF {PRODUCTS.length} SILHOUETTES
          </p>
        </div>
      </div>

      {/* Control Bar: Search + Sort */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#757585]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sneakers, grippers, loafers, crocs, or SKU..."
            aria-label="Search products"
            className="h-11 w-full rounded-md border border-black/10 bg-white pr-4 pl-10 text-sm text-[#0E0E14] shadow-xs placeholder:text-[#8E8E9E] focus:border-[#FF4D1C] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOnlySale((v) => !v)}
            className={cn(
              "h-11 rounded-md border px-4 font-mono text-[11px] font-bold tracking-[0.14em] transition",
              onlySale
                ? "border-[#FF4D1C] bg-[#FF4D1C] text-white shadow-[0_6px_16px_rgba(255,77,28,0.28)]"
                : "border-black/10 bg-white text-[#555563] hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
            )}
          >
            11:11 ARCHIVE DEALS
          </button>

          <div className="flex h-11 items-center gap-2 rounded-md border border-black/10 bg-white px-3">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#0052FF]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort products"
              className="bg-transparent font-mono text-[11px] font-semibold tracking-[0.12em] text-[#0E0E14] focus:outline-none"
            >
              <option value="featured" className="bg-white">
                SORT: FEATURED
              </option>
              <option value="price-asc" className="bg-white">
                PRICE: LOW TO HIGH
              </option>
              <option value="price-desc" className="bg-white">
                PRICE: HIGH TO LOW
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Rows: Gender -> Category -> SubType */}
      <div className="mt-6 space-y-3 rounded-xl border border-black/[0.08] bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 w-20 font-mono text-[10px] font-bold tracking-[0.18em] text-[#555563] uppercase">
            GENDER
          </span>
          {(
            [
              { key: "all", label: "All" },
              { key: "boys", label: "Boys" },
              { key: "girls", label: "Girls" },
              { key: "unisex", label: "Unisex" },
            ] as const
          ).map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setGender(g.key)}
              className={cn(
                "rounded-md border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.14em] uppercase transition",
                gender === g.key
                  ? g.key === "girls"
                    ? "border-[#E11D74] bg-[#E11D74] text-white shadow-sm"
                    : g.key === "boys"
                      ? "border-[#0052FF] bg-[#0052FF] text-white shadow-sm"
                      : "border-[#0E0E14] bg-[#0E0E14] text-white shadow-sm"
                  : "border-black/10 bg-[#F3F4F8] text-[#555563] hover:border-black/25 hover:text-[#0E0E14]"
              )}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-3">
          <span className="mr-2 w-20 font-mono text-[10px] font-bold tracking-[0.18em] text-[#555563] uppercase">
            CATEGORY
          </span>
          {(
            [
              { key: "all", label: "All" },
              { key: "casual", label: "Casual" },
              { key: "formal", label: "Formal" },
              { key: "sports", label: "Sports" },
              { key: "slippers", label: "Slippers" },
            ] as const
          ).map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => {
                setCategory(c.key);
                setSubType("all");
              }}
              className={cn(
                "rounded-md border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.14em] uppercase transition",
                category === c.key
                  ? "border-[#FF4D1C] bg-[#FF4D1C] text-white shadow-sm"
                  : "border-black/10 bg-[#F3F4F8] text-[#555563] hover:border-[#FF4D1C] hover:text-[#0E0E14]"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-3">
          <span className="mr-2 w-20 font-mono text-[10px] font-bold tracking-[0.18em] text-[#555563] uppercase">
            SILHOUETTE
          </span>
          <button
            type="button"
            onClick={() => setSubType("all")}
            className={cn(
              "rounded-md border px-3 py-1 font-mono text-[10px] font-bold tracking-[0.14em] uppercase transition",
              subType === "all"
                ? "border-[#0052FF] bg-[#0052FF] text-white"
                : "border-black/10 bg-[#F3F4F8] text-[#555563] hover:border-[#0052FF] hover:text-[#0052FF]"
            )}
          >
            All Types
          </button>
          {availableSubTypes.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSubType(st)}
              className={cn(
                "rounded-md border px-3 py-1 font-mono text-[10px] font-bold tracking-[0.14em] uppercase transition",
                subType === st
                  ? "border-[#0052FF] bg-[#0052FF] text-white"
                  : "border-black/10 bg-[#F3F4F8] text-[#555563] hover:border-[#0052FF] hover:text-[#0052FF]"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-12 rounded-xl border border-black/10 bg-white px-6 py-16 text-center shadow-xs">
          <p className="font-display text-2xl font-bold text-[#0E0E14]">
            NO SILHOUETTES FOUND
          </p>
          <p className="mt-2 text-sm text-[#555563]">
            Try clearing active filters or searching another footwear discipline.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-[#FF4D1C] px-5 font-mono text-xs font-bold tracking-[0.14em] text-white transition hover:bg-[#0E0E14]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            RESET FILTERS
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      )}

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export function ShopCatalogClient() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const genderParam = searchParams.get("gender");
  const categoryParam = searchParams.get("category");
  const subTypeParam = searchParams.get("subType");
  const badgeParam = searchParams.get("badge");

  const initialGender: GenderFilter =
    genderParam === "boys" ||
    genderParam === "girls" ||
    genderParam === "unisex"
      ? genderParam
      : "all";

  const initialCategory: CategoryFilter =
    categoryParam === "casual" ||
    categoryParam === "formal" ||
    categoryParam === "sports" ||
    categoryParam === "slippers"
      ? categoryParam
      : "all";

  const initialSubType: SubTypeFilter =
    subTypeParam && ALL_SUBTYPES.includes(subTypeParam as SubType)
      ? (subTypeParam as SubType)
      : "all";

  const initialSale = Boolean(badgeParam && badgeParam.includes("50"));

  return (
    <ShopCatalogInner
      key={searchParams.toString()}
      initialQ={qParam}
      initialGender={initialGender}
      initialCategory={initialCategory}
      initialSubType={initialSubType}
      initialSale={initialSale}
    />
  );
}
