"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  PackageCheck,
  Receipt,
  Search,
  Sparkles,
  Truck,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ReceiptView } from "@/components/ReceiptView";
import { ORDER_STAGE_LABELS, cn, formatPKR } from "@/lib/utils";

const STAGE_ICONS = [Receipt, Box, Truck, PackageCheck];

export default function OrdersPage() {
  const { hydrated, orders, user, advanceOrderStage, setAuthOpen } = useStore();
  const [query, setQuery] = useState("");
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(
    null
  );

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

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-10 w-64 animate-pulse rounded-sm bg-[#161619]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="border-b border-white/[0.08] pb-7">
        <p className="font-mono text-[10px] tracking-[0.26em] text-[#8A8A8E] uppercase">
          LIVE DISPATCH &amp; ARCHIVE RECEIPTS
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              ORDER TRACKING
            </h1>
            {user && (
              <p className="mt-2 font-mono text-xs text-[#8A8A8E]">
                ACTIVE CLIENT: <span className="text-white">{user.fullName}</span>{" "}
                · {user.phone}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8A8E]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ZLV-26-XXXX..."
                aria-label="Search order history"
                className="h-10 rounded-sm border border-white/10 bg-[#0E0E10] pr-3 pl-9 font-mono text-xs text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
              />
            </div>
            {!user && (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="h-10 rounded-sm border border-white/15 bg-[#0E0E10] px-4 font-mono text-[10px] tracking-[0.14em] text-white transition hover:border-white"
              >
                GUEST ACCESS
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="mt-12 rounded-sm border border-white/10 bg-[#0E0E10] px-6 py-16 text-center">
          <p className="font-display text-2xl font-bold text-white">
            {orders.length === 0
              ? "NO ORDERS PLACED YET"
              : "NO MATCHING ORDERS"}
          </p>
          <p className="mt-2 text-sm text-[#8A8A8E]">
            {orders.length === 0
              ? "Once you place an order at checkout, your live tracking timeline and printable digital receipt will appear here."
              : "Try clearing your Order ID search query."}
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-sm border border-white bg-white px-7 font-mono text-xs font-bold tracking-[0.16em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
          >
            EXPLORE COLLECTION
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {filteredOrders.map((order) => {
            const isReceiptOpen = expandedReceiptId === order.orderId;
            return (
              <div
                key={order.orderId}
                className="overflow-hidden rounded-sm border border-white/[0.1] bg-[#0E0E10]"
              >
                {/* Order Summary Bar */}
                <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] bg-[#131316] px-6 py-4 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <span className="block font-mono text-[9px] tracking-[0.18em] text-[#8A8A8E]">
                        ORDER ID
                      </span>
                      <span className="font-mono text-sm font-bold text-white">
                        {order.orderId}
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] tracking-[0.18em] text-[#8A8A8E]">
                        DESTINATION
                      </span>
                      <span className="text-xs text-[#D1D1D6]">
                        {order.customer.fullName} · {order.customer.city}
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] tracking-[0.18em] text-[#8A8A8E]">
                        PAYMENT
                      </span>
                      <span className="font-mono text-xs text-[#D1D1D6]">
                        {order.paymentSummary}
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] tracking-[0.18em] text-[#8A8A8E]">
                        TOTAL
                      </span>
                      <span className="font-mono text-sm font-bold text-white">
                        {formatPKR(order.totalPKR)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.statusStage < 3 && (
                      <button
                        type="button"
                        onClick={() => advanceOrderStage(order.orderId)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-white/25 bg-[#0A0A0C] px-3 font-mono text-[10px] font-semibold tracking-[0.12em] text-white transition hover:border-white hover:bg-white hover:text-[#050505]"
                      >
                        <Sparkles className="h-3 w-3" />
                        ADVANCE STAGE
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedReceiptId(
                          isReceiptOpen ? null : order.orderId
                        )
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-white bg-white px-3.5 font-mono text-[10px] font-bold tracking-[0.14em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
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
                            "relative flex items-center gap-3 rounded-sm border p-3.5 transition",
                            completed
                              ? "border-white/25 bg-[#161619]"
                              : "border-white/[0.06] bg-[#0A0A0C] opacity-55"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border",
                              completed
                                ? "border-white bg-white text-[#050505]"
                                : "border-white/15 bg-[#0E0E10] text-[#8A8A8E]"
                            )}
                          >
                            {completed && !current ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <StageIcon className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <span className="block font-mono text-[9px] tracking-[0.18em] text-[#8A8A8E]">
                              0{idx + 1}
                              {current ? " · ACTIVE" : ""}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-white">
                              {label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Items Strip */}
                  <div className="mt-5 flex flex-wrap gap-3 border-t border-white/[0.06] pt-4">
                    {order.items.map((item) => (
                      <Link
                        key={`${item.productId}-${item.size}-${item.color}`}
                        href={`/product/${item.slug}`}
                        className="flex items-center gap-3 rounded-sm border border-white/[0.08] bg-[#0A0A0C] p-2 pr-4 transition hover:border-white/30"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-sm object-cover"
                        />
                        <div>
                          <p className="font-display text-xs font-bold text-white">
                            {item.name}
                          </p>
                          <p className="font-mono text-[10px] text-[#8A8A8E]">
                            EU {item.size} · {item.color} · x{item.quantity}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Expandable Printable Digital Receipt */}
                {isReceiptOpen && (
                  <div className="border-t border-white/10 bg-[#050505] p-6">
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
