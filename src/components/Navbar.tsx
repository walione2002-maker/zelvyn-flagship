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
  "11:11 DROP LIVE — UP TO 50% OFF",
  "COD, EASYPAISA, JAZZCASH & CARDS ACCEPTED",
  "USE CODE REAL10 FOR 10% OFF",
];

const NAV_LINKS = [
  { label: "SHOP ALL", href: "/shop" },
  { label: "BOYS", href: "/shop?gender=boys" },
  { label: "GIRLS", href: "/shop?gender=girls" },
  { label: "11:11 DROP", href: "/shop?badge=50%25%20OFF" },
  { label: "ORDERS", href: "/orders" },
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
      {/* Announcement Marquee */}
      <div className="w-full overflow-hidden border-b border-white/[0.08] bg-[#08080A] py-2">
        <div className="animate-zelvyn-marquee flex items-center gap-8 whitespace-nowrap font-mono text-[10px] tracking-[0.22em] text-[#A1A1A6] uppercase">
          {[...ANNOUNCEMENT_ITEMS, ...ANNOUNCEMENT_ITEMS].map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
            </span>
          ))}
        </div>
      </div>

      {/* Glassmorphic Main Navbar */}
      <nav
        className={cn(
          "w-full border-b transition-colors duration-300 backdrop-blur-xl",
          scrolled
            ? "border-white/15 bg-black/85 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
            : "border-white/10 bg-black/75"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile trigger + Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-[#F5F5F7] transition hover:border-white/30 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <Link
              href="/"
              className="group flex flex-col leading-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="font-display text-lg font-extrabold tracking-[-0.06em] text-[#F5F5F7] sm:text-2xl">
                ZELVYN
              </span>
              <span className="font-mono text-[7.5px] tracking-[0.24em] text-[#8A8A8E] transition-colors group-hover:text-white sm:text-[8px] sm:tracking-[0.28em]">
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
                    "relative font-mono text-[11px] tracking-[0.18em] transition-colors",
                    isActive
                      ? "text-white"
                      : "text-[#8A8A8E] hover:text-[#F5F5F7]"
                  )}
                >
                  {link.label}
                  {link.href === "/orders" && hydrated && orders.length > 0 && (
                    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full border border-white/20 bg-white/10 px-1 font-mono text-[9px] text-white">
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
              className="inline-flex h-9 items-center gap-2 rounded-sm border border-white/10 bg-[#0E0E10] px-2.5 text-xs text-[#8A8A8E] transition hover:border-white/30 hover:text-white sm:px-3"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden font-mono text-[10px] tracking-[0.15em] lg:inline">
                SEARCH
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              aria-label="Guest login or account"
              className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-white/10 bg-[#0E0E10] px-2.5 text-xs text-[#F5F5F7] transition hover:border-white/35 sm:gap-2 sm:px-3"
            >
              <User className="h-3.5 w-3.5 text-[#8A8A8E]" />
              <span className="hidden font-mono text-[10px] tracking-[0.14em] uppercase sm:inline">
                {hydrated && user
                  ? userInitials || "GUEST"
                  : "GUEST"}
              </span>
              {hydrated && user && (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open shopping bag"
              className="group relative inline-flex h-9 items-center gap-1.5 rounded-sm border border-white bg-white px-2.5 text-[#050505] transition hover:bg-[#050505] hover:text-white sm:gap-2 sm:px-3"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.14em]">
                BAG
              </span>
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#050505] px-1 font-mono text-[9px] font-bold text-white transition-colors group-hover:bg-white group-hover:text-[#050505]">
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
              className="overflow-hidden border-t border-white/10 bg-[#070709] md:hidden"
            >
              <div className="flex flex-col divide-y divide-white/[0.06] px-4 py-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 font-mono text-xs tracking-[0.2em] text-[#F5F5F7]"
                  >
                    <span>{link.label}</span>
                    {link.href === "/orders" && (
                      <Package className="h-3.5 w-3.5 text-[#8A8A8E]" />
                    )}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthOpen(true);
                  }}
                  className="flex items-center justify-between py-3.5 text-left font-mono text-xs tracking-[0.2em] text-[#8A8A8E]"
                >
                  <span>
                    {hydrated && user
                      ? `SESSION: ${user.fullName.toUpperCase()}`
                      : "GUEST LOGIN / ACCOUNT"}
                  </span>
                  <User className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
