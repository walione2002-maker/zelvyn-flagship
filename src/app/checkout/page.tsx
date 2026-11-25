"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Tag,
  Truck,
  UserCheck,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ReceiptView } from "@/components/ReceiptView";
import type { OrderRecord, PaymentMethod } from "@/types/store";
import {
  PAKISTAN_CITIES,
  cn,
  formatPKR,
  validateEmail,
  validatePakistaniPhone,
} from "@/lib/utils";

const BANK_DETAILS = {
  bankName: "Meezan Bank Limited",
  accountTitle: "ZELVYN FOOTWEAR PRIVATE LTD",
  accountNo: "02810104829103",
  iban: "PK42MEZN0002810104829103",
};

export default function CheckoutPage() {
  const { hydrated, user } = useStore();
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-10 w-60 animate-pulse rounded-sm bg-[#161619]" />
      </div>
    );
  }
  return <CheckoutFlow key={user?.loggedInAt || "anon"} />;
}

function CheckoutFlow() {
  const {
    cart,
    subtotalPKR,
    discountPKR,
    shippingPKR,
    totalPKR,
    promoCode,
    user,
    setAuthOpen,
    applyPromoCode,
    placeOrder,
    pushToast,
  } = useStore();

  // Step 1: Customer & Shipping (pre-filled cleanly from persisted Guest Session)
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.savedAddress || "");
  const [city, setCity] = useState<string>(user?.savedCity || "Karachi");
  const [notes, setNotes] = useState("");

  // Promo input inside summary
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<string | null>(null);

  // Step 2: Payment Method (cod | card | wallet | bank)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  // Card Fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);

  // Wallet Fields (Easypaisa / JazzCash)
  const [walletProvider, setWalletProvider] = useState<
    "Easypaisa" | "JazzCash"
  >("Easypaisa");
  const [walletNumber, setWalletNumber] = useState("");
  const [walletPromptState, setWalletPromptState] = useState<
    "idle" | "sending" | "sent"
  >("idle");

  // Bank Transfer Fields
  const [ibanCopied, setIbanCopied] = useState(false);
  const [bankRefId, setBankRefId] = useState("");

  // Order Submission States
  const [formError, setFormError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(
    null
  );

  const handleCardNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setCardExpiry(digits);
    }
  };

  const handleSendWalletPrompt = () => {
    const check = validatePakistaniPhone(walletNumber);
    if (!check.valid) {
      setFormError(
        `Enter a valid 11-digit Pakistani ${walletProvider} mobile number (e.g. 0300-1234567).`
      );
      return;
    }
    setFormError(null);
    setWalletPromptState("sending");
    setTimeout(() => {
      setWalletPromptState("sent");
      pushToast(
        `${walletProvider} Prompt Sent`,
        `Authorize MPIN request on ${check.display}.`
      );
    }, 650);
  };

  const handleCopyIban = async () => {
    try {
      await navigator.clipboard.writeText(BANK_DETAILS.iban);
    } catch {
      // Fallback ignored if clipboard blocked
    }
    setIbanCopied(true);
    pushToast("IBAN Copied", BANK_DETAILS.iban);
    setTimeout(() => setIbanCopied(false), 2400);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (fullName.trim().length < 2) {
      setFormError("Full name is required.");
      return;
    }
    if (!validateEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    const phoneCheck = validatePakistaniPhone(phone);
    if (!phoneCheck.valid) {
      setFormError(
        "Please enter a valid Pakistani mobile number (03XX-XXXXXXX or +92 3XX XXXXXXX)."
      );
      return;
    }
    if (address.trim().length < 6) {
      setFormError("Please enter your complete street address.");
      return;
    }

    let paymentSummary = "";

    if (paymentMethod === "cod") {
      paymentSummary = "Cash on Delivery (COD · Rs. 0 Fee)";
    } else if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length < 12) {
        setFormError("Enter at least 12 card digits for test authorization.");
        return;
      }
      if (cardName.trim().length < 2) {
        setFormError("Enter the cardholder name.");
        return;
      }
      if (cardExpiry.length < 4 || cardCvv.replace(/\D/g, "").length < 3) {
        setFormError("Enter valid card expiry (MM/YY) and 3-digit CVV.");
        return;
      }
      const last4 = digits.slice(-4);
      const brand = digits.startsWith("4") ? "VISA" : "MASTERCARD";
      paymentSummary = `${brand} •••• ${last4}`;
    } else if (paymentMethod === "wallet") {
      const wCheck = validatePakistaniPhone(walletNumber);
      if (!wCheck.valid) {
        setFormError(
          `Enter a valid 11-digit ${walletProvider} mobile wallet number.`
        );
        return;
      }
      paymentSummary = `${walletProvider} (${wCheck.display})`;
    } else if (paymentMethod === "bank") {
      if (bankRefId.trim().length < 4) {
        setFormError(
          "Enter your Bank Transfer Transaction Reference / STAN ID."
        );
        return;
      }
      paymentSummary = `Bank Transfer · Ref ${bankRefId.trim().toUpperCase()}`;
    }

    setFormError(null);
    setProcessing(true);

    setTimeout(() => {
      const record = placeOrder({
        customer: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phoneCheck.display,
          address: address.trim(),
          city,
          notes: notes.trim() || undefined,
        },
        paymentMethod,
        paymentSummary,
      });
      setProcessing(false);
      setConfirmedOrder(record);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  if (confirmedOrder) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 rounded-sm border border-white/20 bg-[#0E0E10] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-white text-[#050505]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.24em] text-[#8A8A8E] uppercase">
                ORDER CONFIRMED · KEEPIN&apos; IT REAL
              </p>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                THANK YOU, {confirmedOrder.customer.fullName.toUpperCase()}
              </h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#A1A1A6]">
            Your order{" "}
            <strong className="font-mono text-white">
              {confirmedOrder.orderId}
            </strong>{" "}
            is locked in and queued for matte-box packing. Track live dispatch
            updates anytime on your Orders page.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/orders"
              className="inline-flex h-11 items-center gap-2 rounded-sm border border-white bg-white px-6 font-mono text-xs font-bold tracking-[0.16em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
            >
              TRACK ORDER LIVE
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center gap-2 rounded-sm border border-white/20 bg-[#161619] px-6 font-mono text-xs font-bold tracking-[0.16em] text-white transition hover:border-white"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>

        <ReceiptView order={confirmedOrder} />
      </div>
    );
  }

  // Empty Bag Guard
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="font-mono text-[10px] tracking-[0.26em] text-[#8A8A8E] uppercase">
          CHECKOUT
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
          YOUR BAG IS EMPTY
        </h1>
        <p className="mt-3 text-sm text-[#8A8A8E]">
          Add a silhouette from the Season 01 collection before checking out.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-sm border border-white bg-white px-7 font-mono text-xs font-bold tracking-[0.16em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
        >
          GO TO CATALOG
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const cardDigitsOnly = cardNumber.replace(/\D/g, "");
  const cardBrandLabel = cardDigitsOnly.startsWith("4")
    ? "VISA"
    : cardDigitsOnly.startsWith("5")
      ? "MASTERCARD"
      : "ZELVYN PAY";

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="mt-5 font-mono text-xs tracking-[0.24em] text-white uppercase">
            AUTHORIZING ORDER &amp; SECURING MATTE BOX...
          </p>
        </div>
      )}

      <div className="border-b border-white/[0.08] pb-6">
        <p className="font-mono text-[10px] tracking-[0.26em] text-[#8A8A8E] uppercase">
          ENCRYPTED CLIENT CHECKOUT
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            CHECKOUT
          </h1>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex w-fit items-center gap-2 rounded-sm border border-white/15 bg-[#0E0E10] px-3.5 py-2 font-mono text-[10px] tracking-[0.16em] text-white transition hover:border-white/40"
          >
            <UserCheck className="h-3.5 w-3.5" />
            {user
              ? `SESSION: ${user.fullName.toUpperCase()}`
              : "GUEST LOGIN / SIGN IN"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12"
      >
        {/* LEFT COLUMN: STEP 1 + STEP 2 */}
        <div className="space-y-8 lg:col-span-7">
          {/* STEP 1 — CONTACT & SHIPPING */}
          <section className="rounded-sm border border-white/[0.08] bg-[#0E0E10] p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#8A8A8E]">
                  STEP 01
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  CONTACT &amp; DELIVERY DETAILS
                </h2>
              </div>
              {user && (
                <span className="rounded-sm border border-white/15 bg-[#161619] px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] text-white">
                  PRE-FILLED FROM SESSION
                </span>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Bilal Ahmed"
                  className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bilal@zelvyn.pk"
                  className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                  Mobile Number (+92 / 03XX) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 font-mono text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House 14-B, Street 7, DHA Phase 6"
                  className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-label="Delivery city"
                  className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 text-sm text-white focus:border-white/40 focus:outline-none"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0E0E10]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                  Courier Note (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Call before arrival"
                  className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* STEP 2 — 4 PAYMENT METHODS */}
          <section className="rounded-sm border border-white/[0.08] bg-[#0E0E10] p-6 sm:p-7">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#8A8A8E]">
                STEP 02
              </span>
              <h2 className="font-display text-xl font-bold text-white">
                SELECT PAYMENT METHOD
              </h2>
            </div>

            {/* 4 Payment Selector Tabs */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {(
                [
                  {
                    key: "cod",
                    label: "COD",
                    sub: "Cash on Delivery",
                    icon: Truck,
                  },
                  {
                    key: "card",
                    label: "CARD",
                    sub: "Visa / Mastercard",
                    icon: CreditCard,
                  },
                  {
                    key: "wallet",
                    label: "WALLET",
                    sub: "Easypaisa / JazzCash",
                    icon: Smartphone,
                  },
                  {
                    key: "bank",
                    label: "BANK",
                    sub: "IBAN Transfer",
                    icon: Building2,
                  },
                ] as const
              ).map((m) => {
                const active = paymentMethod === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(m.key);
                      setFormError(null);
                    }}
                    className={cn(
                      "flex flex-col items-start rounded-sm border p-3.5 text-left transition",
                      active
                        ? "border-white bg-white text-[#050505]"
                        : "border-white/10 bg-[#161619] text-[#D1D1D6] hover:border-white/35"
                    )}
                  >
                    <m.icon className="h-4 w-4" />
                    <span className="mt-2.5 font-mono text-xs font-bold tracking-[0.14em]">
                      {m.label}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 text-[10px]",
                        active ? "text-[#050505]/80" : "text-[#8A8A8E]"
                      )}
                    >
                      {m.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* PAYMENT METHOD DETAILS */}
            <div className="mt-6 rounded-sm border border-white/10 bg-[#0A0A0C] p-5">
              {/* 1. CASH ON DELIVERY */}
              {paymentMethod === "cod" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold tracking-[0.14em] text-white">
                      CASH ON DELIVERY (NATIONWIDE)
                    </span>
                    <span className="rounded-sm bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-[#050505]">
                      RS. 0 EXTRA FEE
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#A1A1A6]">
                    Pay in cash directly to our courier rider when your sealed
                    ZELVYN matte box arrives at your doorstep. Our dispatch desk
                    will confirm via SMS/call on{" "}
                    <span className="font-mono text-white">
                      {phone || "your phone number"}
                    </span>
                    .
                  </p>
                </div>
              )}

              {/* 2. CREDIT / DEBIT CARD WITH LIVE VIRTUAL CARD PREVIEW */}
              {paymentMethod === "card" && (
                <div className="space-y-5">
                  {/* Interactive Dark Monochrome Virtual Card */}
                  <div className="relative mx-auto max-w-sm overflow-hidden rounded-md border border-white/20 bg-gradient-to-br from-[#1C1C20] via-[#0E0E10] to-[#050505] p-5 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-extrabold tracking-[-0.04em] text-white">
                        ZELVYN
                      </span>
                      <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#D1D1D6]">
                        {cardBrandLabel}
                      </span>
                    </div>

                    {!cardFlipped ? (
                      <>
                        {/* EMV Chip */}
                        <div className="mt-5 h-7 w-10 rounded-sm border border-white/25 bg-gradient-to-br from-[#3A3A40] to-[#1A1A1E]" />
                        <p className="mt-4 font-mono text-lg tracking-[0.22em] text-white">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </p>
                        <div className="mt-5 flex items-end justify-between font-mono text-[10px] tracking-[0.16em]">
                          <div>
                            <span className="block text-[8px] text-[#8A8A8E]">
                              CARDHOLDER
                            </span>
                            <span className="text-white uppercase">
                              {cardName || "YOUR NAME"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[8px] text-[#8A8A8E]">
                              EXPIRES
                            </span>
                            <span className="text-white">
                              {cardExpiry || "MM/YY"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-5">
                        <div className="h-8 w-full bg-black/80" />
                        <div className="mt-4 flex items-center justify-between bg-white/10 px-3 py-2 font-mono text-xs">
                          <span className="text-[#8A8A8E]">SECURITY CVV</span>
                          <span className="font-bold tracking-[0.25em] text-white">
                            {cardCvv || "•••"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Form Inputs */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                        Card Number
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cardNumber}
                        onFocus={() => setCardFlipped(false)}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 font-mono text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onFocus={() => setCardFlipped(false)}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="BILAL AHMED"
                        className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 text-sm text-white uppercase placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cardExpiry}
                        onFocus={() => setCardFlipped(false)}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="08/29"
                        className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 font-mono text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                        CVV
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={cardCvv}
                        onFocus={() => setCardFlipped(true)}
                        onBlur={() => setCardFlipped(false)}
                        onChange={(e) =>
                          setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        placeholder="123"
                        className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 font-mono text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. EASYPAISA / JAZZCASH */}
              {paymentMethod === "wallet" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {(["Easypaisa", "JazzCash"] as const).map((provider) => (
                      <button
                        key={provider}
                        type="button"
                        onClick={() => {
                          setWalletProvider(provider);
                          setWalletPromptState("idle");
                        }}
                        className={cn(
                          "rounded-sm border py-2.5 font-mono text-xs font-bold tracking-[0.14em] transition",
                          walletProvider === provider
                            ? "border-white bg-white text-[#050505]"
                            : "border-white/10 bg-[#161619] text-[#A1A1A6] hover:border-white/30"
                        )}
                      >
                        {provider.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                      11-Digit {walletProvider} Account Number
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="tel"
                        value={walletNumber}
                        onChange={(e) => {
                          setWalletNumber(e.target.value);
                          setWalletPromptState("idle");
                        }}
                        placeholder="03001234567"
                        className="h-11 flex-1 rounded-sm border border-white/10 bg-[#161619] px-3.5 font-mono text-sm text-white placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSendWalletPrompt}
                        disabled={walletPromptState === "sending"}
                        className="h-11 rounded-sm border border-white/25 bg-[#161619] px-4 font-mono text-[10px] font-bold tracking-[0.14em] text-white transition hover:border-white hover:bg-white hover:text-[#050505] disabled:opacity-50"
                      >
                        {walletPromptState === "sending"
                          ? "SENDING PROMPT..."
                          : walletPromptState === "sent"
                            ? "PROMPT SENT ✓"
                            : "SEND VERIFICATION PROMPT"}
                      </button>
                    </div>
                  </div>

                  {walletPromptState === "sent" && (
                    <div className="flex items-center gap-2 rounded-sm border border-white/20 bg-white/[0.04] px-3.5 py-2.5 font-mono text-[11px] text-white">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        MPIN push notification queued on {walletNumber}. Click
                        Place Order to finalize.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 4. BANK TRANSFER */}
              {paymentMethod === "bank" && (
                <div className="space-y-4">
                  <div className="rounded-sm border border-white/10 bg-[#161619] p-4 font-mono text-xs">
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A8A8E]">BANK</span>
                      <span className="text-white">{BANK_DETAILS.bankName}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A8A8E]">ACCOUNT TITLE</span>
                      <span className="text-white">
                        {BANK_DETAILS.accountTitle}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A8A8E]">ACCOUNT NO</span>
                      <span className="text-white">{BANK_DETAILS.accountNo}</span>
                    </div>
                    <div className="mt-2 flex flex-col justify-between gap-2 border-t border-white/10 pt-3 sm:flex-row sm:items-center">
                      <div>
                        <span className="block text-[9px] text-[#8A8A8E]">
                          IBAN
                        </span>
                        <span className="font-bold text-white">
                          {BANK_DETAILS.iban}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyIban}
                        className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-white bg-white px-3 font-mono text-[10px] font-bold tracking-[0.14em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
                      >
                        {ibanCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            COPIED
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            COPY IBAN
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                      Transaction Reference / STAN ID *
                    </label>
                    <input
                      type="text"
                      value={bankRefId}
                      onChange={(e) => setBankRefId(e.target.value)}
                      placeholder="e.g. IBFT-948271"
                      className="h-11 w-full rounded-sm border border-white/10 bg-[#161619] px-3.5 font-mono text-sm text-white uppercase placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
        <aside className="lg:col-span-5">
          <div className="sticky top-28 rounded-sm border border-white/[0.08] bg-[#0E0E10] p-6 sm:p-7">
            <h2 className="border-b border-white/[0.08] pb-4 font-display text-xl font-bold text-white">
              ORDER SUMMARY
            </h2>

            <div className="mt-4 max-h-72 divide-y divide-white/[0.07] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex items-center gap-3.5 py-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-14 rounded-sm border border-white/10 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-sm font-bold text-white">
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] text-[#8A8A8E]">
                      EU {item.size} · {item.color} · x{item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-white">
                    {formatPKR(item.pricePKR * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Inline Promo Input */}
            <div className="mt-4 border-t border-white/[0.08] pt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8A8E]" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="REAL10 or ZELVYN50"
                    className="h-10 w-full rounded-sm border border-white/10 bg-[#161619] pr-3 pl-9 font-mono text-[11px] text-white uppercase placeholder:text-[#5C5C62] focus:border-white/40 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const res = applyPromoCode(promoInput);
                    setPromoMsg(res.message);
                    if (res.ok) setPromoInput("");
                  }}
                  className="h-10 rounded-sm border border-white/20 bg-[#161619] px-4 font-mono text-[10px] font-bold tracking-[0.14em] text-white transition hover:border-white hover:bg-white hover:text-[#050505]"
                >
                  APPLY
                </button>
              </div>
              {promoMsg && (
                <p className="mt-1.5 font-mono text-[10px] text-[#A1A1A6]">
                  {promoMsg}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-2 border-t border-white/[0.08] pt-4 font-mono text-xs">
              <div className="flex justify-between text-[#8A8A8E]">
                <span>SUBTOTAL</span>
                <span className="text-white">{formatPKR(subtotalPKR)}</span>
              </div>
              {discountPKR > 0 && (
                <div className="flex justify-between text-[#D1D1D6]">
                  <span>PROMO ({promoCode})</span>
                  <span>−{formatPKR(discountPKR)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8A8A8E]">
                <span>DELIVERY</span>
                <span className="text-white">
                  {shippingPKR === 0 ? "FREE" : formatPKR(shippingPKR)}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-base font-bold text-white">
                <span>TOTAL PAYABLE</span>
                <span>{formatPKR(totalPKR)}</span>
              </div>
            </div>

            {formError && (
              <div className="mt-4 rounded-sm border border-white/25 bg-white/[0.06] px-3.5 py-2.5 font-mono text-[11px] text-white">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-white bg-white font-mono text-xs font-bold tracking-[0.18em] text-[#050505] transition hover:bg-[#050505] hover:text-white disabled:opacity-50"
            >
              <Lock className="h-3.5 w-3.5" />
              PLACE ORDER · {formatPKR(totalPKR)}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[10px] text-[#8A8A8E]">
              <ShieldCheck className="h-3.5 w-3.5" />
              PERSISTED LOCALLY · STATIC EXPORT READY
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
