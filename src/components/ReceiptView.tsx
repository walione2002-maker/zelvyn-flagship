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
    <div className="print-receipt rounded-sm border border-white/15 bg-[#0E0E10] p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-[-0.06em] text-white">
            ZELVYN
          </p>
          <p className="font-mono text-[10px] tracking-[0.26em] text-[#8A8A8E]">
            KEEPIN&apos; IT REAL — OFFICIAL RECEIPT
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-mono text-xs font-bold text-white">
            {order.orderId}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[#8A8A8E]">
            {new Date(order.createdAt).toLocaleString("en-PK", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 border-b border-white/10 pb-6 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#8A8A8E] uppercase">
            Recipient &amp; Dispatch
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            {order.customer.fullName}
          </p>
          <p className="mt-1 font-mono text-xs text-[#D1D1D6]">
            {order.customer.phone}
          </p>
          <p className="font-mono text-xs text-[#8A8A8E]">
            {order.customer.email}
          </p>
          <p className="mt-2 text-xs text-[#A1A1A6]">
            {order.customer.address}, {order.customer.city}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#8A8A8E] uppercase">
            Payment &amp; Fulfillment
          </p>
          <p className="mt-2 font-mono text-xs font-semibold text-white">
            {order.paymentSummary}
          </p>
          <p className="mt-2 inline-block rounded-sm border border-white/15 bg-[#161619] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-white uppercase">
            STAGE: {ORDER_STAGE_LABELS[order.statusStage]}
          </p>
        </div>
      </div>

      <div className="mt-6 divide-y divide-white/[0.07]">
        {order.items.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex items-center justify-between gap-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium text-white">{item.name}</p>
              <p className="font-mono text-[10px] tracking-[0.14em] text-[#8A8A8E]">
                {item.sku} · EU {item.size} · {item.color} · QTY {item.quantity}
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-white">
              {formatPKR(item.pricePKR * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-white/10 pt-4 font-mono text-xs">
        <div className="flex justify-between text-[#8A8A8E]">
          <span>SUBTOTAL</span>
          <span className="text-white">{formatPKR(order.subtotalPKR)}</span>
        </div>
        {order.discountPKR > 0 && (
          <div className="flex justify-between text-[#D1D1D6]">
            <span>PROMO ({order.promoCode})</span>
            <span>−{formatPKR(order.discountPKR)}</span>
          </div>
        )}
        <div className="flex justify-between text-[#8A8A8E]">
          <span>DELIVERY</span>
          <span className="text-white">
            {order.shippingPKR === 0 ? "FREE" : formatPKR(order.shippingPKR)}
          </span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-3 text-base font-bold text-white">
          <span>TOTAL</span>
          <span>{formatPKR(order.totalPKR)}</span>
        </div>
      </div>

      <div className="no-print mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-sm border border-white bg-white px-4 font-mono text-[11px] font-bold tracking-[0.14em] text-[#050505] transition hover:bg-[#050505] hover:text-white"
        >
          <Printer className="h-3.5 w-3.5" />
          PRINT RECEIPT
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-10 items-center gap-2 rounded-sm border border-white/20 bg-[#161619] px-4 font-mono text-[11px] font-bold tracking-[0.14em] text-white transition hover:border-white"
        >
          <Download className="h-3.5 w-3.5" />
          DOWNLOAD (.TXT)
        </button>
      </div>
    </div>
  );
}
