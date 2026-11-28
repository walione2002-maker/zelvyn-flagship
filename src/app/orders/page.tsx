"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  Copy,
  PackageCheck,
  Receipt,
  RefreshCw,
  Search,
  Sparkles,
  Truck,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ReceiptView } from "@/components/ReceiptView";
import { EXCHANGE_POLICY } from "@/data/products";
import { ORDER_STAGE_LABELS, cn, formatPKR } from "@/lib/utils";

const STAGE_ICONS = [Receipt, Box, Truck, PackageCheck];

function OrdersInner({ initialOrderQuery }: { initialOrderQuery: string }) {
  const {
    hydrated,
    orders,
    user,
    advanceOrderStage,
    setAuthOpen,
    pushToast,
  } = useStore();
  const [query, setQuery] = useState(initialOrderQuery);
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(
    initialOrderQuery || null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q) ||
        o.customer.city.toLowerCase().includes(q)
    );
  }, [orders, query]);

  const handleCopyOrderNo = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId);
    } catch {
      // Ignore clipboard failure
    }
    setCopiedId(orderId);
    pushToast("Order No. Copied", orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-10 w-64 animate-pulse rounded-md bg-[#E6E8F0]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="border-b border-black/[0.08] pb-7">
        <p className="font-mono text-[10px] font-bold tracking-[0.26em] text-[#FF4D1C] uppercase">
          ORDER NO. LOOKUP &amp; LIVE DISPATCH
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#0E0E14] sm:text-5xl">
              TRACK ORDER
            </h1>
            {user && (
              <p className="mt-2 font-mono text-xs text-[#555563]">
                ACTIVE CLIENT:{" "}
                <span className="font-bold text-[#0052FF]">
                  {user.fullName}
                </span>{" "}
                · {user.phone}
              </p>
            )}
          </div>

          {!user && (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="h-10 w-fit rounded-md border border-black/10 bg-white px-4 font-mono text-[10px] font-bold tracking-[0.14em] text-[#0E0E14] transition hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
            >
              GUEST ACCESS
            </button>
          )}
        </div>

        {/* Dedicated Track by Order No. Bar */}
        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:p-5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#0052FF]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order No. (e.g. ZLV-26-8492) or Mobile Number to track..."
              aria-label="Track order by Order No. or phone"
              className="h-11 w-full rounded-md border border-black/10 bg-[#F6F7FA] pr-3 pl-10 font-mono text-xs text-[#0E0E14] placeholder:text-[#8E8E9E] focus:border-[#0052FF] focus:bg-white focus:outline-none"
            />
          </div>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="h-11 rounded-md border border-black/10 bg-[#F3F4F8] px-4 font-mono text-[10px] font-bold tracking-[0.14em] text-[#0E0E14] transition hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
            >
              SHOW ALL ({orders.length})
            </button>
          )}
          <div className="flex items-center gap-1.5 rounded-md bg-[#FFF6F2] px-3 py-2 font-mono text-[10px] font-semibold text-[#FF4D1C]">
            <RefreshCw className="h-3.5 w-3.5 shrink-0" />
            <span>{EXCHANGE_POLICY.short}</span>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="mt-12 rounded-xl border border-black/10 bg-white px-6 py-16 text-center shadow-xs">
          <p className="font-display text-2xl font-bold text-[#0E0E14]">
            {orders.length === 0
              ? "NO ORDERS PLACED YET"
              : `NO ORDER FOUND FOR "${query.toUpperCase()}"`}
          </p>
          <p className="mt-2 mx-auto max-w-md text-sm text-[#555563]">
            {orders.length === 0
              ? "We do not display fake or sample orders. Once you place an order at checkout, your real Order No., live tracking timeline, and printable receipt appear right here."
              : "Double-check your Order No. (e.g. ZLV-26-XXXX) or phone number."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {orders.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-black/15 bg-[#F3F4F8] px-6 font-mono text-xs font-bold tracking-[0.16em] text-[#0E0E14] transition hover:border-[#0052FF]"
              >
                VIEW YOUR {orders.length} ORDER{orders.length > 1 ? "S" : ""}
              </button>
            )}
            <Link
              href="/shop"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[#FF4D1C] px-7 font-mono text-xs font-bold tracking-[0.16em] text-white shadow-[0_8px_20px_rgba(255,77,28,0.28)] transition hover:bg-[#0E0E14]"
            >
              EXPLORE COLLECTION
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {filteredOrders.map((order) => {
            const isReceiptOpen = expandedReceiptId === order.orderId;
            return (
              <div
                key={order.orderId}
                className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm"
              >
                {/* Order Summary Bar */}
                <div className="flex flex-col justify-between gap-4 border-b border-black/[0.08] bg-[#F3F4F8] px-6 py-4 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <span className="block font-mono text-[9px] font-bold tracking-[0.18em] text-[#555563]">
                        ORDER NO.
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm font-bold text-[#0052FF]">
                          {order.orderId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyOrderNo(order.orderId)}
                          aria-label={`Copy Order No. ${order.orderId}`}
                          className="rounded border border-black/10 bg-white p-1 text-[#555563] transition hover:border-[#0052FF] hover:text-[#0052FF]"
                        >
                          {copiedId === order.orderId ? (
                            <Check className="h-3 w-3 text-[#059669]" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] font-bold tracking-[0.18em] text-[#555563]">
                        DESTINATION
                      </span>
                      <span className="text-xs font-medium text-[#0E0E14]">
                        {order.customer.fullName} · {order.customer.city}
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] font-bold tracking-[0.18em] text-[#555563]">
                        PAYMENT
                      </span>
                      <span className="font-mono text-xs font-medium text-[#0E0E14]">
                        {order.paymentSummary}
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] font-bold tracking-[0.18em] text-[#555563]">
                        TOTAL
                      </span>
                      <span className="font-mono text-sm font-bold text-[#FF4D1C]">
                        {formatPKR(order.totalPKR)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.statusStage < 3 && (
                      <button
                        type="button"
                        onClick={() => advanceOrderStage(order.orderId)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#0052FF]/25 bg-[#EFF4FF] px-3 font-mono text-[10px] font-bold tracking-[0.12em] text-[#0052FF] transition hover:bg-[#0052FF] hover:text-white"
                      >
                        <Sparkles className="h-3 w-3" />
                        UPDATE DISPATCH STAGE
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedReceiptId(
                          isReceiptOpen ? null : order.orderId
                        )
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0E0E14] px-3.5 font-mono text-[10px] font-bold tracking-[0.14em] text-white transition hover:bg-[#FF4D1C]"
                    >
                      {isReceiptOpen ? "HIDE RECEIPT" : "VIEW RECEIPT"}
                    </button>
                  </div>
                </div>

                {/* Live 4-Stage Status Timeline */}
                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    {ORDER_STAGE_LABELS.map((label, idx) => {
                      const StageIcon = STAGE_ICONS[idx];
                      const completed = idx <= order.statusStage;
                      const current = idx === order.statusStage;

                      return (
                        <div
                          key={label}
                          className={cn(
                            "relative flex items-center gap-3 rounded-lg border p-3.5 transition",
                            completed
                              ? "border-[#059669]/30 bg-[#ECFDF5]"
                              : "border-black/[0.06] bg-[#F6F7FA] opacity-60"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border",
                              completed
                                ? "border-[#059669] bg-[#059669] text-white"
                                : "border-black/10 bg-white text-[#757585]"
                            )}
                          >
                            {completed && !current ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <StageIcon className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <span className="block font-mono text-[9px] font-bold tracking-[0.18em] text-[#555563]">
                              0{idx + 1}
                              {current ? " · ACTIVE" : ""}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-[#0E0E14]">
                              {label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Items Strip */}
                  <div className="mt-5 flex flex-wrap gap-3 border-t border-black/[0.06] pt-4">
                    {order.items.map((item) => (
                      <Link
                        key={`${item.productId}-${item.size}-${item.color}`}
                        href={`/product/${item.slug}`}
                        className="flex items-center gap-3 rounded-lg border border-black/10 bg-[#F6F7FA] p-2 pr-4 transition hover:border-[#FF4D1C]"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-display text-xs font-bold text-[#0E0E14]">
                            {item.name}
                          </p>
                          <p className="font-mono text-[10px] text-[#555563]">
                            EU {item.size} · {item.color} · x{item.quantity}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Expandable Printable Digital Receipt */}
                {isReceiptOpen && (
                  <div className="border-t border-black/[0.08] bg-[#FAFAFC] p-6">
                    <ReceiptView order={order} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrdersWithSearchParams() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  return <OrdersInner key={orderId} initialOrderQuery={orderId} />;
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="h-10 w-64 animate-pulse rounded-md bg-[#E6E8F0]" />
        </div>
      }
    >
      <OrdersWithSearchParams />
    </Suspense>
  );
}
