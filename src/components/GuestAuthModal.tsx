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
      <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-md border border-black/10 bg-[#F3F4F8] p-1">
        <button
          type="button"
          onClick={() => setMode("guest")}
          className={cn(
            "rounded py-2 font-mono text-[10px] font-bold tracking-[0.16em] uppercase transition",
            mode === "guest"
              ? "bg-[#FF4D1C] text-white shadow-sm"
              : "text-[#555563] hover:text-[#0E0E14]"
          )}
        >
          Continue as Guest
        </button>
        <button
          type="button"
          onClick={() => setMode("member")}
          className={cn(
            "rounded py-2 font-mono text-[10px] font-bold tracking-[0.16em] uppercase transition",
            mode === "member"
              ? "bg-[#0052FF] text-white shadow-sm"
              : "text-[#555563] hover:text-[#0E0E14]"
          )}
        >
          Quick Sign-In
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[#555563]">
        Your contact info pre-fills checkout and links your order tracking
        history locally on this device.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        <div>
          <label className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.16em] text-[#555563] uppercase">
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#757585]" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Bilal Ahmed"
              className="h-11 w-full rounded-md border border-black/10 bg-[#F6F7FA] pr-3 pl-9 text-sm text-[#0E0E14] placeholder:text-[#8E8E9E] focus:border-[#FF4D1C] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.16em] text-[#555563] uppercase">
            Phone Number (+92 / 03XX)
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#757585]" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 1234567"
              className="h-11 w-full rounded-md border border-black/10 bg-[#F6F7FA] pr-3 pl-9 font-mono text-sm text-[#0E0E14] placeholder:text-[#8E8E9E] focus:border-[#FF4D1C] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.16em] text-[#555563] uppercase">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#757585]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="bilal@zelvyn.pk"
              className="h-11 w-full rounded-md border border-black/10 bg-[#F6F7FA] pr-3 pl-9 text-sm text-[#0E0E14] placeholder:text-[#8E8E9E] focus:border-[#FF4D1C] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-[#E11D74]/30 bg-[#FFF1F5] px-3 py-2 font-mono text-[11px] font-medium text-[#E11D74]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#FF4D1C] font-mono text-xs font-bold tracking-[0.16em] text-white shadow-[0_8px_20px_rgba(255,77,28,0.28)] transition hover:bg-[#0E0E14]"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm"
          onClick={() => setAuthOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-black/10 bg-white p-6 text-[#0E0E14] shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between border-b border-black/[0.08] pb-4">
              <div>
                <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-[#FF4D1C] uppercase">
                  ZELVYN CLIENT ACCESS
                </span>
                <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[#0E0E14]">
                  {user ? "ACTIVE SESSION" : "GUEST ACCESS"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAuthOpen(false)}
                aria-label="Close guest access modal"
                className="rounded-md border border-black/10 p-1.5 text-[#555563] transition hover:border-[#FF4D1C] hover:text-[#FF4D1C]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {user ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-[#059669]/25 bg-[#ECFDF5] p-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.16em] text-[#059669] uppercase">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>
                      {user.mode === "guest" ? "GUEST SESSION" : "MEMBER PASS"}{" "}
                      PERSISTED
                    </span>
                  </div>
                  <p className="mt-2 font-display text-lg font-bold text-[#0E0E14]">
                    {user.fullName}
                  </p>
                  <p className="mt-1 font-mono text-xs text-[#3F3F4E]">
                    {user.phone}
                  </p>
                  <p className="font-mono text-xs text-[#555563]">
                    {user.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/orders"
                    onClick={() => setAuthOpen(false)}
                    className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#0052FF] font-mono text-[11px] font-bold tracking-[0.14em] text-white transition hover:bg-[#0E0E14]"
                  >
                    <Package className="h-3.5 w-3.5" />
                    ORDERS ({orders.length})
                  </Link>
                  <button
                    type="button"
                    onClick={logoutUser}
                    className="flex h-11 items-center justify-center gap-2 rounded-md border border-black/15 bg-[#F3F4F8] font-mono text-[11px] font-bold tracking-[0.14em] text-[#0E0E14] transition hover:border-[#E11D74] hover:text-[#E11D74]"
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
