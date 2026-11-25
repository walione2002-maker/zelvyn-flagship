"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  LogOut,
  Mail,
  Package,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn, validateEmail, validatePakistaniPhone } from "@/lib/utils";

function GuestAuthForm({ onClose }: { onClose: () => void }) {
  const { loginUser } = useStore();
  const [mode, setMode] = useState<"guest" | "member">("guest");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }
    const phoneCheck = validatePakistaniPhone(phone);
    if (!phoneCheck.valid) {
      setError(
        "Enter a valid Pakistani mobile number (e.g. 0300-1234567 or +92 300 1234567)."
      );
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
    loginUser({
      fullName: fullName.trim(),
      phone: phoneCheck.display,
      email: email.trim().toLowerCase(),
      mode,
    });
    onClose();
  };

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-sm border border-white/10 bg-[#070709] p-1">
        <button
          type="button"
          onClick={() => setMode("guest")}
          className={cn(
            "rounded-sm py-2 font-mono text-[10px] font-bold tracking-[0.16em] uppercase transition",
            mode === "guest"
              ? "bg-white text-[#050505]"
              : "text-[#8A8A8E] hover:text-white"
          )}
        >
          Continue as Guest
        </button>
        <button
          type="button"
          onClick={() => setMode("member")}
          className={cn(
            "rounded-sm py-2 font-mono text-[10px] font-bold tracking-[0.16em] uppercase transition",
            mode === "member"
              ? "bg-white text-[#050505]"
              : "text-[#8A8A8E] hover:text-white"
          )}
        >
          Quick Sign-In
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[#8A8A8E]">
        Your contact info pre-fills checkout and links your order tracking
        history locally on this device.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        <div>
          <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#6E6E73]" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Bilal Ahmed"
              className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] pr-3 pl-9 text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
            Phone Number (+92 / 03XX)
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#6E6E73]" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 1234567"
              className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] pr-3 pl-9 font-mono text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#6E6E73]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="bilal@zelvyn.pk"
              className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] pr-3 pl-9 text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-sm border border-white/20 bg-white/5 px-3 py-2 font-mono text-[11px] text-white">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-sm border border-white bg-white font-mono text-xs font-bold tracking-[0.16em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
        >
          <ShieldCheck className="h-4 w-4" />
          {mode === "guest" ? "SAVE GUEST SESSION" : "SIGN IN NOW"}
        </button>
      </form>
    </>
  );
}

export function GuestAuthModal() {
  const { isAuthOpen, setAuthOpen, user, orders, logoutUser } = useStore();

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setAuthOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-sm border border-white/15 bg-[#0E0E10] p-6 text-[#F5F5F7] shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[10px] tracking-[0.22em] text-[#8A8A8E] uppercase">
                  ZELVYN CLIENT ACCESS
                </span>
                <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white">
                  {user ? "ACTIVE SESSION" : "GUEST ACCESS"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAuthOpen(false)}
                aria-label="Close guest access modal"
                className="rounded-sm border border-white/10 p-1.5 text-[#8A8A8E] transition hover:border-white/30 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {user ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-sm border border-white/10 bg-[#161619] p-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-white uppercase">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>
                      {user.mode === "guest" ? "GUEST SESSION" : "MEMBER PASS"}{" "}
                      PERSISTED
                    </span>
                  </div>
                  <p className="mt-2 font-display text-lg font-bold text-white">
                    {user.fullName}
                  </p>
                  <p className="mt-1 font-mono text-xs text-[#A1A1A6]">
                    {user.phone}
                  </p>
                  <p className="font-mono text-xs text-[#8A8A8E]">
                    {user.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/orders"
                    onClick={() => setAuthOpen(false)}
                    className="flex h-11 items-center justify-center gap-2 rounded-sm border border-white bg-white font-mono text-[11px] font-bold tracking-[0.14em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
                  >
                    <Package className="h-3.5 w-3.5" />
                    ORDERS ({orders.length})
                  </Link>
                  <button
                    type="button"
                    onClick={logoutUser}
                    className="flex h-11 items-center justify-center gap-2 rounded-sm border border-white/15 bg-[#161619] font-mono text-[11px] font-bold tracking-[0.14em] text-white transition hover:border-white"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    SIGN OUT
                  </button>
                </div>
              </div>
            ) : (
              <GuestAuthForm onClose={() => setAuthOpen(false)} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
