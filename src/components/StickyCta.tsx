"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Floating "book a call" tag that appears after meaningful scroll. */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const nearBottom =
        window.innerHeight + scrolled > document.body.scrollHeight - 600;
      setVisible(scrolled > 900 && !nearBottom);
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-2.5rem)] max-w-max -translate-x-1/2"
        >
          <Link
            href="/contact"
            className="flex min-h-12 items-center justify-center gap-3 border border-foreground bg-foreground px-6 py-3.5 font-mono text-[0.6875rem] tracking-[0.18em] text-background uppercase shadow-[6px_6px_0_0_var(--accent)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-[#efeae0] active:scale-[0.98]"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-70" />
              <span className="relative inline-flex size-1.5 bg-accent" />
            </span>
            Book a free discovery call
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
