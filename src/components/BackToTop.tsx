"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Back-to-top square, bottom-right, for the site's long editorial pages. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 1600);
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
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 hidden size-11 items-center justify-center border border-line-strong bg-background font-mono text-lg text-foreground shadow-[4px_4px_0_0_rgba(22,20,15,0.2)] transition-all duration-300 hover:border-accent hover:text-accent active:scale-95 sm:flex"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
