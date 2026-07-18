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
        className={`u-draw flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.15em] transition-colors ${
          active ? "text-accent" : "text-foreground/75 hover:text-foreground"
        }`}
      >
        Tools
        <span aria-hidden className={`text-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ⌄
        </span>
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onFocus={show}
            onBlur={hide}
            className="absolute top-full left-1/2 z-50 mt-4 w-[min(64rem,92vw)] -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-md border border-line-strong bg-surface-raised shadow-[0_36px_80px_-40px_rgba(22,23,27,0.45)]">
              <div className="grid gap-px bg-line lg:grid-cols-3">
                {toolGroups.map((g) => (
                  <div key={g.id} className="bg-surface-raised p-6">
                    <p className="annotation mb-4 text-accent">{g.title}</p>
                    <ul className="flex flex-col">
                      {toolsByGroup(g.id).map((t) => (
                        <li key={t.href}>
                          <Link
                            href={t.href}
                            className="group -mx-2 flex items-baseline gap-2 rounded-[3px] px-2 py-1.5 transition-colors hover:bg-surface"
                          >
                            <span aria-hidden className="translate-y-px text-faint transition-colors group-hover:text-accent">›</span>
                            <span className="text-sm text-foreground/85 transition-colors group-hover:text-accent">{t.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4">
                <p className="text-xs text-faint">
                  All {TOOL_COUNT} tools are free, no signup, and most run entirely in your browser.
                </p>
                <Link
                  href="/free-tools"
                  className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-accent transition-colors hover:text-foreground"
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
