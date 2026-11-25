"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ruler, X } from "lucide-react";

const SIZE_CHART = [
  { eu: 36, uk: "3.5", usW: "6.0", usM: "4.5", cm: "23.0" },
  { eu: 37, uk: "4.0", usW: "6.5", usM: "5.0", cm: "23.5" },
  { eu: 38, uk: "5.0", usW: "7.5", usM: "6.0", cm: "24.2" },
  { eu: 39, uk: "5.5", usW: "8.0", usM: "6.5", cm: "24.8" },
  { eu: 40, uk: "6.5", usW: "9.0", usM: "7.5", cm: "25.5" },
  { eu: 41, uk: "7.0", usW: "9.5", usM: "8.0", cm: "26.2" },
  { eu: 42, uk: "8.0", usW: "10.5", usM: "9.0", cm: "26.9" },
  { eu: 43, uk: "9.0", usW: "11.5", usM: "10.0", cm: "27.6" },
  { eu: 44, uk: "9.5", usW: "12.0", usM: "10.5", cm: "28.3" },
  { eu: 45, uk: "10.5", usW: "13.0", usM: "11.5", cm: "29.0" },
];

export function SizeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-sm border border-white/15 bg-[#0E0E10] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Ruler className="h-4 w-4 text-white" />
                <h2 className="font-display text-lg font-bold tracking-tight text-white">
                  ZELVYN EU FIT MATRIX
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close size guide"
                className="rounded-sm border border-white/10 p-1.5 text-[#8A8A8E] transition hover:border-white/30 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#8A8A8E]">
              Measure heel-to-toe length standing flat against a wall. Between
              sizes? Select the larger EU size for chunky sneakers and slides.
            </p>

            <div className="mt-4 overflow-x-auto rounded-sm border border-white/10">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-white/10 bg-[#161619] text-[10px] tracking-[0.16em] text-[#8A8A8E] uppercase">
                  <tr>
                    <th className="px-3 py-2.5">EU</th>
                    <th className="px-3 py-2.5">UK</th>
                    <th className="px-3 py-2.5">US Men</th>
                    <th className="px-3 py-2.5">US Women</th>
                    <th className="px-3 py-2.5">CM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {SIZE_CHART.map((row) => (
                    <tr key={row.eu} className="hover:bg-white/[0.03]">
                      <td className="px-3 py-2 font-bold text-white">
                        {row.eu}
                      </td>
                      <td className="px-3 py-2 text-[#D1D1D6]">{row.uk}</td>
                      <td className="px-3 py-2 text-[#D1D1D6]">{row.usM}</td>
                      <td className="px-3 py-2 text-[#D1D1D6]">{row.usW}</td>
                      <td className="px-3 py-2 text-[#8A8A8E]">{row.cm} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
