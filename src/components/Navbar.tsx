"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  Package,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

const ANNOUNCEMENT_ITEMS = [
  "KEEPIN' IT REAL",
  "FREE DELIVERY OVER PKR 8,000",
  "EXCHANGE ONLY (SIZE ISSUES OR DAMAGE) · NO RETURNS",
  "GIRLS PASTEL & BOYS DROPS LIVE",
  "COD, EASYPAISA, JAZZCASH & CARDS ACCEPTED",
];

const NAV_LINKS = [
  { label: "SHOP ALL", href: "/shop" },
  { label: "BOYS", href: "/shop?gender=boys" },
  { label: "GIRLS", href: "/shop?gender=girls" },
  { label: "11:11 DROP", href: "/shop?badge=50%25%20OFF" },
  { label: "TRACK ORDER", href: "/orders" },
];

export function Navbar() {
  const pathname = usePathname();
  const {
    hydrated,
    cartCount,
    orders,
    user,
    setCartOpen,
    setAuthOpen,
    setSearchOpen,
  } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setSearchOpen]);

  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : null;

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Vibrant Announcement Marquee */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-[#FF4D1C] via-[#E11D74] to-[#0052FF] py-2">
        <div className="animate-zelvyn-marquee flex items-center gap-8 whitespace-nowrap font-mono text-[10px] font-semibold tracking-[0.22em] text-white uppercase">
          {[...ANNOUNCEMENT_ITEMS, ...ANNOUNCEMENT_ITEMS].map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            </span>
          ))}
        </div>
      </div>

      {/* Frosted Light Glassmorphic Main Navbar */}
      <nav
        className={cn(
          "w-full border-b transition-all duration-300 backdrop-blur-xl",
          scrolled
            ? "border-black/10 bg-white/92 shadow-[0_10px_30px_rgba(14,14,20,0.08)]"
            : "border-black/[0.06] bg-white/80"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile trigger + Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white text-[#0E0E14] transition hover:border-[#FF4D1C] hover:text-[#FF4D1C] md:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <Link
              href="/"
              className="group flex flex-col leading-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="font-display text-lg font-extrabold tracking-[-0.06em] text-[#0E0E14] sm:text-2xl">
                ZELVYN
              </span>
              <span className="font-mono text-[7.5px] font-semibold tracking-[0.24em] text-[#FF4D1C] transition-colors group-hover:text-[#0052FF] sm:text-[8px] sm:tracking-[0.28em]">
                KEEPIN&apos; IT REAL
              </span>
            </Link>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/orders"
                  ? pathname === "/orders"
                  : link.href === "/shop"
                    ? pathname === "/shop"
                    : false;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative font-mono text-[11px] font-semibold tracking-[0.18em] transition-colors",
                    isActive
                      ? "text-[#FF4D1C]"
                      : "text-[#555563] hover:text-[#0E0E14]"
                  )}
                >
                  {link.label}
                  {link.href === "/orders" && hydrated && orders.length > 0 && (
                    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0052FF] px-1 font-mono text-[9px] font-bold text-white">
                      {orders.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Search, Guest Auth, Bag */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search footwear catalog"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-black/10 bg-[#F3F4F8] px-2.5 text-xs text-[#555563] transition hover:border-[#0052FF] hover:bg-white hover:text-[#0052FF] sm:px-3"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden font-mono text-[10px] font-semibold tracking-[0.15em] lg:inline">
                SEARCH
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              aria-label="Guest login or account"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-black/10 bg-[#F3F4F8] px-2.5 text-xs text-[#0E0E14] transition hover:border-[#E11D74] hover:bg-white hover:text-[#E11D74] sm:gap-2 sm:px-3"
            >
              <User className="h-3.5 w-3.5 text-[#555563]" />
              <span className="hidden font-mono text-[10px] font-semibold tracking-[0.14em] uppercase sm:inline">
                {hydrated && user
                  ? userInitials || "GUEST"
                  : "GUEST"}
              </span>
              {hydrated && user && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open shopping bag"
              className="group relative inline-flex h-9 items-center gap-1.5 rounded-md bg-[#FF4D1C] px-2.5 text-white shadow-[0_6px_18px_rgba(255,77,28,0.28)] transition hover:bg-[#0E0E14] hover:shadow-[0_6px_18px_rgba(14,14,20,0.2)] sm:gap-2 sm:px-3"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.14em]">
                BAG
              </span>
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 font-mono text-[9px] font-bold text-[#FF4D1C] transition-colors group-hover:text-[#0E0E14]">
                {hydrated ? cartCount : 0}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-black/10 bg-white md:hidden"
            >
              <div className="flex flex-col divide-y divide-black/[0.06] px-4 py-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 font-mono text-xs font-semibold tracking-[0.2em] text-[#0E0E14] hover:text-[#FF4D1C]"
                  >
                    <span>{link.label}</span>
                    {link.href === "/orders" && (
                      <Package className="h-3.5 w-3.5 text-[#0052FF]" />
                    )}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthOpen(true);
                  }}
                  className="flex items-center justify-between py-3.5 text-left font-mono text-xs font-semibold tracking-[0.2em] text-[#555563]"
                >
                  <span>
                    {hydrated && user
                      ? `SESSION: ${user.fullName.toUpperCase()}`
                      : "GUEST LOGIN / ACCOUNT"}
                  </span>
                  <User className="h-3.5 w-3.5 text-[#E11D74]" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
