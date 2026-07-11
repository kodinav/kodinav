"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto w-full max-w-2xl border-t border-line-strong">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-baseline gap-4 py-5 text-left active:opacity-70"
            >
              <span className="font-mono text-[0.625rem] text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-medium text-foreground">{item.q}</span>
              <span
                aria-hidden
                className={`font-mono text-lg leading-none transition-all duration-300 ${
                  open ? "rotate-45 text-accent" : "text-faint"
                }`}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pl-9 text-pretty leading-relaxed text-muted">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
