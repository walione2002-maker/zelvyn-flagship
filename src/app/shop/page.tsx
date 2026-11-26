import React, { Suspense } from "react";
import { ShopCatalogClient } from "@/components/ShopCatalogClient";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="h-10 w-64 animate-pulse rounded-md bg-[#E6E8F0]" />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-lg border border-black/[0.06] bg-[#F3F4F8]"
              />
            ))}
          </div>
        </div>
      }
    >
      <ShopCatalogClient />
    </Suspense>
  );
}
