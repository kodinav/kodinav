"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

/**
 * Floating action bar: WhatsApp (instant chat, the channel Indian businesses
 * actually use) + book-a-call, appearing after meaningful scroll. Always
 * mounted; CSS fades it and `inert` keeps it out of the tab order while
 * hidden.
 */
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
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={`float-ui fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100%-2.5rem)] max-w-max -translate-x-1/2 items-stretch gap-2 ${
        visible ? "is-visible" : ""
      }`}
    >
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp (${site.phone})`}
        className="flex min-w-12 shrink-0 items-center justify-center rounded-[2px] border border-[#1da851] bg-[#25d366] px-3.5 text-[#083a20] shadow-[0_18px_40px_-20px_rgba(22,23,27,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1da851] hover:text-[#eafff2] active:scale-[0.98]"
      >
        {/* lucide "message-circle", inlined so the homepage ships no icon library */}
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </a>
      <Link
        href="/contact"
        className="flex min-h-12 flex-1 items-center justify-center gap-3 rounded-[2px] border border-foreground bg-foreground px-5 py-3.5 font-mono text-[0.6875rem] tracking-[0.14em] text-background uppercase shadow-[0_18px_40px_-20px_rgba(22,23,27,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-contrast active:scale-[0.98] sm:px-6"
      >
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
          <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
        </span>
        <span className="whitespace-nowrap">
          Book a<span className="hidden sm:inline"> free</span> discovery call
        </span>
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
