"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { validateEmail } from "@/lib/utils";

const PAYMENT_BADGES = [
  "CASH ON DELIVERY",
  "VISA / MASTERCARD",
  "EASYPAISA",
  "JAZZCASH",
  "BANK TRANSFER",
];

export function Footer() {
  const { pushToast } = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      pushToast("Invalid Email", "Enter a valid email address for drop alerts.");
      return;
    }
    setSubscribed(true);
    setEmail("");
    pushToast(
      "Added to Archive List",
      "You will receive early access to Season 02 drops."
    );
  };

  return (
    <footer className="border-t border-black/[0.08] bg-[#F3F4F8] text-[#0E0E14]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <div className="font-display text-3xl font-extrabold tracking-[-0.06em] text-[#0E0E14]">
                ZELVYN
              </div>
              <div className="mt-1 font-mono text-[10px] font-semibold tracking-[0.32em] text-[#FF4D1C]">
                KEEPIN&apos; IT REAL
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#555563]">
              Vibrant luxury streetwear footwear engineered for the streets of
              Karachi, Lahore, and Islamabad. Small-batch drops delivered in
              signature collector packaging.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] font-semibold tracking-[0.15em]">
              <span className="rounded-md border border-[#059669]/25 bg-[#ECFDF5] px-2.5 py-1 text-[#059669]">
                FREE SHIPPING &gt; PKR 8,000
              </span>
              <span className="rounded-md border border-[#0052FF]/25 bg-[#EFF4FF] px-2.5 py-1 text-[#0052FF]">
                7-DAY SIZE EXCHANGE
              </span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            <div>
              <h3 className="font-mono text-[10px] font-bold tracking-[0.22em] text-[#FF4D1C] uppercase">
                Collections
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm font-medium text-[#3F3F4E]">
                <li>
                  <Link href="/shop" className="transition hover:text-[#0E0E14]">
                    All Footwear
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?gender=boys"
                    className="transition hover:text-[#0052FF]"
                  >
                    Boys Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?gender=girls"
                    className="transition hover:text-[#E11D74]"
                  >
                    Girls Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?gender=unisex"
                    className="transition hover:text-[#7C3AED]"
                  >
                    Unisex Archive
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-[10px] font-bold tracking-[0.22em] text-[#0052FF] uppercase">
                Categories
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm font-medium text-[#3F3F4E]">
                <li>
                  <Link
                    href="/shop?category=casual"
                    className="transition hover:text-[#FF4D1C]"
                  >
                    Casual &amp; Joggers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=formal"
                    className="transition hover:text-[#0052FF]"
                  >
                    Loafers &amp; Formal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=sports"
                    className="transition hover:text-[#059669]"
                  >
                    Grippers &amp; Sports
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=slippers"
                    className="transition hover:text-[#E11D74]"
                  >
                    Slippers &amp; Crocs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-[10px] font-bold tracking-[0.22em] text-[#E11D74] uppercase">
                Client Care
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm font-medium text-[#3F3F4E]">
                <li>
                  <Link href="/orders" className="transition hover:text-[#0E0E14]">
                    Track Orders
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className="transition hover:text-[#0E0E14]">
                    Checkout
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?badge=50%25%20OFF"
                    className="transition hover:text-[#FF4D1C]"
                  >
                    11:11 Archive Sale
                  </Link>
                </li>
                <li>
                  <span className="inline-block rounded bg-[#FF4D1C]/10 px-1.5 py-0.5 font-mono text-xs font-bold text-[#FF4D1C]">
                    PROMO: REAL10
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="font-mono text-[10px] font-bold tracking-[0.22em] text-[#0E0E14] uppercase">
              Private Drop Alerts
            </h3>
            <p className="mt-4 text-sm text-[#555563]">
              First-access codes for numbered vibrant releases and restocks.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                aria-label="Newsletter email address"
                className="h-11 flex-1 rounded-md border border-black/10 bg-white px-3.5 font-mono text-xs text-[#0E0E14] placeholder:text-[#8E8E9E] focus:border-[#FF4D1C] focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-1.5 rounded-md bg-[#FF4D1C] px-4 font-mono text-[11px] font-bold tracking-[0.14em] text-white shadow-[0_6px_16px_rgba(255,77,28,0.28)] transition hover:bg-[#0E0E14]"
              >
                {subscribed ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    JOINED
                  </>
                ) : (
                  <>
                    JOIN
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Payment Badges + Copyright */}
        <div className="mt-14 flex flex-col gap-6 border-t border-black/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENT_BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-md border border-black/10 bg-white px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.16em] text-[#3F3F4E]"
              >
                {badge}
              </span>
            ))}
          </div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#757585]">
            © 2026 ZELVYN FOOTWEAR. KEEPIN&apos; IT REAL. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
