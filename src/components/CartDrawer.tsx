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
            className="fixed inset-0 bg-black/35 backdrop-blur-sm"
          />

          {/* Spring Slide-Over Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-black/10 bg-white text-[#0E0E14] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[0.08] px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-[#FF4D1C]" />
                <h2 className="font-display text-lg font-extrabold tracking-tight text-[#0E0E14]">
                  YOUR BAG ({hydrated ? cartCount : 0})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close bag drawer"
                className="rounded-md border border-black/10 p-1.5 text-[#555563] transition hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Free Delivery Progress Bar */}
            <div className="border-b border-black/[0.08] bg-[#ECFDF5] px-6 py-3.5">
              <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
                <span className="flex items-center gap-1.5 text-[#059669]">
                  <Truck className="h-3.5 w-3.5 text-[#059669]" />
                  {cart.length === 0
                    ? "FREE DELIVERY OVER PKR 8,000"
                    : freeShippingRemaining === 0
                      ? "UNLOCKED: FREE NATIONWIDE DELIVERY"
                      : `${formatPKR(freeShippingRemaining)} AWAY FROM FREE DELIVERY`}
                </span>
                <span className="text-[#059669]">{shippingProgress}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#059669]/15">
                <div
                  className="h-full bg-gradient-to-r from-[#059669] to-[#10B981] transition-all duration-500"
                  style={{ width: `${cart.length === 0 ? 0 : shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!hydrated || cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-black/10 bg-[#F3F4F8]">
                    <ShoppingBag className="h-6 w-6 text-[#FF4D1C]" />
                  </div>
                  <p className="mt-4 font-display text-lg font-bold text-[#0E0E14]">
                    YOUR BAG IS EMPTY
                  </p>
                  <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#555563]">
                    Explore Season 01 drops across Boys, Girls, and Unisex
                    silhouettes.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-[#FF4D1C] px-5 font-mono text-[11px] font-bold tracking-[0.16em] text-white shadow-[0_6px_18px_rgba(255,77,28,0.28)] transition hover:bg-[#0E0E14]"
                  >
                    EXPLORE CATALOG
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-black/[0.08]">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex gap-4 py-4"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="h-24 w-20 shrink-0 overflow-hidden rounded-md border border-black/10 bg-[#F3F4F8]"
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
                              className="font-display text-sm font-bold text-[#0E0E14] hover:text-[#FF4D1C]"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-[#555563]">
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
                            className="text-[#8E8E9E] transition hover:text-[#E11D74]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-md border border-black/10 bg-[#F3F4F8]">
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
                              className="px-2 py-1 text-[#555563] hover:text-[#0E0E14]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-7 text-center font-mono text-xs font-semibold text-[#0E0E14]">
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
                              className="px-2 py-1 text-[#555563] hover:text-[#0E0E14]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#0E0E14]">
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
              <div className="border-t border-black/[0.08] bg-[#F6F7FA] px-6 py-5">
                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#757585]" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="PROMO CODE (REAL10 / ZELVYN50)"
                      aria-label="Promo code"
                      className="h-10 w-full rounded-md border border-black/10 bg-white pr-3 pl-9 font-mono text-[11px] text-[#0E0E14] uppercase placeholder:text-[#8E8E9E] focus:border-[#FF4D1C] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-10 rounded-md bg-[#0E0E14] px-4 font-mono text-[10px] font-bold tracking-[0.16em] text-white transition hover:bg-[#0052FF]"
                  >
                    APPLY
                  </button>
                </form>

                {promoCode && promoLabel && (
                  <div className="mt-2.5 flex items-center justify-between rounded-md border border-[#059669]/25 bg-[#ECFDF5] px-3 py-1.5 font-mono text-[10px]">
                    <span className="text-[#059669]">
                      ACTIVE: <strong>{promoCode}</strong> ({promoLabel})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clearPromoCode();
                        setPromoFeedback(null);
                      }}
                      className="font-semibold text-[#059669] hover:underline"
                    >
                      REMOVE
                    </button>
                  </div>
                )}

                {promoFeedback && !promoFeedback.ok && (
                  <p className="mt-2 font-mono text-[10px] font-medium text-[#E11D74]">
                    {promoFeedback.message}
                  </p>
                )}

                {/* Summary Breakdown */}
                <div className="mt-4 space-y-2 border-t border-black/[0.08] pt-4 font-mono text-xs">
                  <div className="flex justify-between text-[#555563]">
                    <span>SUBTOTAL</span>
                    <span className="font-semibold text-[#0E0E14]">{formatPKR(subtotalPKR)}</span>
                  </div>
                  {discountPKR > 0 && (
                    <div className="flex justify-between font-semibold text-[#059669]">
                      <span>DISCOUNT ({promoCode})</span>
                      <span>−{formatPKR(discountPKR)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#555563]">
                    <span>DELIVERY</span>
                    <span className="font-semibold text-[#0E0E14]">
                      {shippingPKR === 0 ? "FREE" : formatPKR(shippingPKR)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-black/[0.08] pt-2.5 text-sm font-bold text-[#0E0E14]">
                    <span>ESTIMATED TOTAL</span>
                    <span className="text-[#FF4D1C]">{formatPKR(totalPKR)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#FF4D1C] font-mono text-xs font-bold tracking-[0.18em] text-white shadow-[0_8px_20px_rgba(255,77,28,0.3)] transition hover:bg-[#0E0E14]"
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
