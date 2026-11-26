"use client";

import React from "react";
import { Download, Printer } from "lucide-react";
import type { OrderRecord } from "@/types/store";
import { ORDER_STAGE_LABELS, formatPKR } from "@/lib/utils";

export function ReceiptView({ order }: { order: OrderRecord }) {
  const handleDownload = () => {
    const lines = [
      "=========================================",
      "         ZELVYN — KEEPIN' IT REAL        ",
      "       LUXURY FOOTWEAR DIGITAL RECEIPT   ",
      "=========================================",
      `Order ID   : ${order.orderId}`,
      `Date       : ${new Date(order.createdAt).toLocaleString()}`,
      `Status     : ${ORDER_STAGE_LABELS[order.statusStage]}`,
      "-----------------------------------------",
      `Customer   : ${order.customer.fullName}`,
      `Phone      : ${order.customer.phone}`,
      `Email      : ${order.customer.email}`,
      `Address    : ${order.customer.address}, ${order.customer.city}`,
      `Payment    : ${order.paymentSummary}`,
      "-----------------------------------------",
      "ITEMS:",
      ...order.items.map(
        (i) =>
          ` - ${i.name} (${i.sku}) | EU ${i.size} | ${i.color} x${i.quantity} = ${formatPKR(
            i.pricePKR * i.quantity
          )}`
      ),
      "-----------------------------------------",
      `Subtotal   : ${formatPKR(order.subtotalPKR)}`,
      ...(order.discountPKR > 0
        ? [`Discount   : -${formatPKR(order.discountPKR)} (${order.promoCode})`]
        : []),
      `Delivery   : ${
        order.shippingPKR === 0 ? "FREE" : formatPKR(order.shippingPKR)
      }`,
      `TOTAL PAID : ${formatPKR(order.totalPKR)}`,
      "=========================================",
      "Thank you for keeping it real with ZELVYN.",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order.orderId}-receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="print-receipt rounded-xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-black/[0.08] pb-6 sm:flex-row sm:items-start">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-[-0.06em] text-[#0E0E14]">
            ZELVYN
          </p>
          <p className="font-mono text-[10px] font-bold tracking-[0.26em] text-[#FF4D1C]">
            KEEPIN&apos; IT REAL — OFFICIAL RECEIPT
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-mono text-xs font-bold text-[#0052FF]">
            {order.orderId}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[#555563]">
            {new Date(order.createdAt).toLocaleString("en-PK", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 border-b border-black/[0.08] pb-6 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#555563] uppercase">
            Recipient &amp; Dispatch
          </p>
          <p className="mt-2 text-sm font-bold text-[#0E0E14]">
            {order.customer.fullName}
          </p>
          <p className="mt-1 font-mono text-xs text-[#3F3F4E]">
            {order.customer.phone}
          </p>
          <p className="font-mono text-xs text-[#555563]">
            {order.customer.email}
          </p>
          <p className="mt-2 text-xs text-[#555563]">
            {order.customer.address}, {order.customer.city}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#555563] uppercase">
            Payment &amp; Fulfillment
          </p>
          <p className="mt-2 font-mono text-xs font-semibold text-[#0E0E14]">
            {order.paymentSummary}
          </p>
          <p className="mt-2 inline-block rounded-md border border-[#059669]/25 bg-[#ECFDF5] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.14em] text-[#059669] uppercase">
            STAGE: {ORDER_STAGE_LABELS[order.statusStage]}
          </p>
        </div>
      </div>

      <div className="mt-6 divide-y divide-black/[0.06]">
        {order.items.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex items-center justify-between gap-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[#0E0E14]">{item.name}</p>
              <p className="font-mono text-[10px] tracking-[0.14em] text-[#555563]">
                {item.sku} · EU {item.size} · {item.color} · QTY {item.quantity}
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#0E0E14]">
              {formatPKR(item.pricePKR * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-black/[0.08] pt-4 font-mono text-xs">
        <div className="flex justify-between text-[#555563]">
          <span>SUBTOTAL</span>
          <span className="font-semibold text-[#0E0E14]">{formatPKR(order.subtotalPKR)}</span>
        </div>
        {order.discountPKR > 0 && (
          <div className="flex justify-between font-semibold text-[#059669]">
            <span>PROMO ({order.promoCode})</span>
            <span>−{formatPKR(order.discountPKR)}</span>
          </div>
        )}
        <div className="flex justify-between text-[#555563]">
          <span>DELIVERY</span>
          <span className="font-semibold text-[#0E0E14]">
            {order.shippingPKR === 0 ? "FREE" : formatPKR(order.shippingPKR)}
          </span>
        </div>
        <div className="flex justify-between border-t border-black/[0.08] pt-3 text-base font-bold text-[#0E0E14]">
          <span>TOTAL</span>
          <span className="text-[#FF4D1C]">{formatPKR(order.totalPKR)}</span>
        </div>
      </div>

      <div className="no-print mt-6 flex flex-wrap gap-3 border-t border-black/[0.08] pt-6">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#FF4D1C] px-4 font-mono text-[11px] font-bold tracking-[0.14em] text-white transition hover:bg-[#0E0E14]"
        >
          <Printer className="h-3.5 w-3.5" />
          PRINT RECEIPT
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-black/15 bg-[#F3F4F8] px-4 font-mono text-[11px] font-bold tracking-[0.14em] text-[#0E0E14] transition hover:border-[#0052FF] hover:text-[#0052FF]"
        >
          <Download className="h-3.5 w-3.5" />
          DOWNLOAD (.TXT)
        </button>
      </div>
    </div>
  );
}
