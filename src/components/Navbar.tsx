"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/data/site";
import { Wordmark } from "./Wordmark";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu when the route changes (state-during-render pattern)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`pt-safe fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          open
            ? "border-transparent bg-transparent"
            : scrolled
              ? "border-line bg-background/90 backdrop-blur-md"
              : "border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        >
          <Link
            href="/"
            aria-label="Kodinav — home"
            className={`relative z-50 shrink-0 ${open ? "text-[#efeae0]" : ""}`}
          >
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {nav.map((item, i) => {
              const active =
                item.href === pathname || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`u-draw font-mono text-[0.6875rem] uppercase tracking-[0.18em] transition-colors ${
                      active ? "text-accent" : "text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    <span className="mr-1.5 text-faint">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-background transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#efeae0]"
            >
              Book a Call <span aria-hidden>→</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className={`relative z-50 -m-3 min-h-11 min-w-11 p-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] active:opacity-60 lg:hidden ${
              open ? "text-[#efeae0]" : "text-foreground"
            }`}
          >
            {open ? "Close ×" : "Menu ≡"}
          </button>
        </nav>
      </header>

      {/* Full-screen ink overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="ink bg-noise fixed inset-0 z-40 flex h-dvh touch-pan-y flex-col justify-between overflow-y-auto overscroll-contain px-6 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] lg:hidden"
          >
            <ul className="flex flex-col">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line"
                >
                  <Link
                    href={item.href}
                    className="group flex items-baseline gap-4 py-4 active:opacity-70"
                  >
                    <span className="font-mono text-xs text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(2.4rem,9.5vw,3rem)] uppercase leading-none transition-colors group-hover:text-accent group-active:text-accent">
                      {item.label}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto font-mono text-lg text-faint"
                    >
                      →
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-4 pt-6"
            >
              <Link
                href="/contact"
                className="flex min-h-13 items-center justify-center gap-3 bg-accent px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-[#efeae0] active:scale-[0.98]"
              >
                Book Discovery Call →
              </Link>
              <div className="flex items-center justify-between">
                <p className="annotation">Independent Software Studio</p>
                <p className="annotation">India</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
