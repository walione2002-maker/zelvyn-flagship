"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import {
  FREE_DELIVERY_THRESHOLD_PKR,
  formatPKR,
} from "@/lib/utils";

export function CartDrawer() {
  const {
    hydrated,
    cart,
    cartCount,
    subtotalPKR,
    discountPKR,
    shippingPKR,
    totalPKR,
    promoCode,
    promoLabel,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    clearPromoCode,
  } = useStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const afterDiscount = Math.max(0, subtotalPKR - discountPKR);
  const freeShippingRemaining = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD_PKR - afterDiscount
  );
  const shippingProgress = Math.min(
    100,
    Math.round((afterDiscount / FREE_DELIVERY_THRESHOLD_PKR) * 100)
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.ok) setPromoInput("");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Spring Slide-Over Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-white/15 bg-[#0A0A0C] text-[#F5F5F7] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-white" />
                <h2 className="font-display text-lg font-extrabold tracking-tight">
                  YOUR BAG ({hydrated ? cartCount : 0})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close bag drawer"
                className="rounded-sm border border-white/10 p-1.5 text-[#8A8A8E] transition hover:border-white/30 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Free Delivery Progress Bar */}
            <div className="border-b border-white/[0.08] bg-[#0E0E10] px-6 py-3.5">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase">
                <span className="flex items-center gap-1.5 text-[#D1D1D6]">
                  <Truck className="h-3.5 w-3.5 text-white" />
                  {cart.length === 0
                    ? "FREE DELIVERY OVER PKR 8,000"
                    : freeShippingRemaining === 0
                      ? "UNLOCKED: FREE NATIONWIDE DELIVERY"
                      : `${formatPKR(freeShippingRemaining)} AWAY FROM FREE DELIVERY`}
                </span>
                <span className="text-[#8A8A8E]">{shippingProgress}%</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${cart.length === 0 ? 0 : shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!hydrated || cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-white/10 bg-[#161619]">
                    <ShoppingBag className="h-6 w-6 text-[#8A8A8E]" />
                  </div>
                  <p className="mt-4 font-display text-lg font-bold text-white">
                    YOUR BAG IS EMPTY
                  </p>
                  <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#8A8A8E]">
                    Explore Season 01 drops across Boys, Girls, and Unisex
                    silhouettes.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="mt-6 inline-flex h-10 items-center gap-2 rounded-sm border border-white bg-white px-5 font-mono text-[11px] font-bold tracking-[0.16em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
                  >
                    EXPLORE CATALOG
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.08]">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex gap-4 py-4"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="h-24 w-20 shrink-0 overflow-hidden rounded-sm border border-white/10 bg-[#161619]"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="font-display text-sm font-bold text-white hover:underline"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-[#8A8A8E]">
                              EU {item.size} · {item.color.toUpperCase()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.productId,
                                item.size,
                                item.color
                              )
                            }
                            aria-label={`Remove ${item.name}`}
                            className="text-[#6E6E73] transition hover:text-white"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-sm border border-white/15 bg-[#161619]">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.size,
                                  item.color,
                                  -1
                                )
                              }
                              aria-label="Decrease quantity"
                              className="px-2 py-1 text-[#A1A1A6] hover:text-white"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-7 text-center font-mono text-xs text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.size,
                                  item.color,
                                  1
                                )
                              }
                              aria-label="Increase quantity"
                              className="px-2 py-1 text-[#A1A1A6] hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-mono text-xs font-semibold text-white">
                            {formatPKR(item.pricePKR * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Totals & Promo */}
            {hydrated && cart.length > 0 && (
              <div className="border-t border-white/10 bg-[#0E0E10] px-6 py-5">
                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8A8E]" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="PROMO CODE (REAL10 / ZELVYN50)"
                      aria-label="Promo code"
                      className="h-10 w-full rounded-sm border border-white/10 bg-[#161619] pr-3 pl-9 font-mono text-[11px] text-white uppercase placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-10 rounded-sm border border-white/20 bg-[#161619] px-4 font-mono text-[10px] font-bold tracking-[0.16em] text-white transition hover:border-white hover:bg-white hover:text-[#050505]"
                  >
                    APPLY
                  </button>
                </form>

                {promoCode && promoLabel && (
                  <div className="mt-2.5 flex items-center justify-between rounded-sm border border-white/15 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px]">
                    <span className="text-white">
                      ACTIVE: <strong>{promoCode}</strong> ({promoLabel})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clearPromoCode();
                        setPromoFeedback(null);
                      }}
                      className="text-[#8A8A8E] hover:text-white"
                    >
                      REMOVE
                    </button>
                  </div>
                )}

                {promoFeedback && !promoFeedback.ok && (
                  <p className="mt-2 font-mono text-[10px] text-[#A1A1A6]">
                    {promoFeedback.message}
                  </p>
                )}

                {/* Summary Breakdown */}
                <div className="mt-4 space-y-2 border-t border-white/[0.08] pt-4 font-mono text-xs">
                  <div className="flex justify-between text-[#8A8A8E]">
                    <span>SUBTOTAL</span>
                    <span className="text-white">{formatPKR(subtotalPKR)}</span>
                  </div>
                  {discountPKR > 0 && (
                    <div className="flex justify-between text-[#D1D1D6]">
                      <span>DISCOUNT ({promoCode})</span>
                      <span>−{formatPKR(discountPKR)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#8A8A8E]">
                    <span>DELIVERY</span>
                    <span className="text-white">
                      {shippingPKR === 0 ? "FREE" : formatPKR(shippingPKR)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2.5 text-sm font-bold text-white">
                    <span>ESTIMATED TOTAL</span>
                    <span>{formatPKR(totalPKR)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-white bg-white font-mono text-xs font-bold tracking-[0.18em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
