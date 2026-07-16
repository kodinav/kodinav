"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toolGroups, toolsByGroup, TOOL_COUNT } from "@/data/tools";

/**
 * Desktop mega-menu over the free-tools suite. Opens on hover and on
 * keyboard focus; a short close delay stops it flickering shut when the
 * pointer crosses the gap between trigger and panel.
 */
export function ToolsMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href="/free-tools"
        onFocus={show}
        aria-expanded={open}
        className={`u-draw flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors ${
          active ? "text-accent" : "text-foreground/80 hover:text-foreground"
        }`}
      >
        <span className="text-faint">03</span>
        Tools
        <span aria-hidden className={`text-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ⌄
        </span>
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onFocus={show}
            onBlur={hide}
            className="absolute top-full left-1/2 z-50 mt-4 w-[min(64rem,90vw)] -translate-x-1/2"
          >
            <div className="ink bg-noise relative border border-line-strong p-6 shadow-[0_28px_60px_-30px_rgba(14,26,20,0.6)]">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr]">
                {toolGroups.map((g) => (
                  <div key={g.id}>
                    <p className="annotation mb-3 border-b border-line pb-2">{g.title}</p>
                    <ul className="flex flex-col">
                      {toolsByGroup(g.id).map((t) => (
                        <li key={t.href}>
                          <Link
                            href={t.href}
                            className="group flex items-baseline gap-2 py-1.5 text-sm text-muted transition-colors hover:text-accent"
                          >
                            <span aria-hidden className="text-faint transition-colors group-hover:text-accent">›</span>
                            {t.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="text-xs text-faint">
                  All {TOOL_COUNT} tools are free, no signup, and most run entirely in your browser.
                </p>
                <Link
                  href="/free-tools"
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent transition-colors hover:text-foreground"
                >
                  Browse all tools →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
