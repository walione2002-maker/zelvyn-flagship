"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="no-print pointer-events-none fixed bottom-4 left-4 z-50 flex w-[calc(100%-2rem)] max-w-xs flex-col gap-2 sm:bottom-6 sm:left-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-start justify-between gap-3 rounded-sm border border-white/20 bg-[#0E0E10]/95 p-3.5 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <div>
                <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-white uppercase">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-[#8A8A8E]">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#8A8A8E] transition hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
