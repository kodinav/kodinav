"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { zhChrome, type ZhLocale } from "@/data/markets/chrome";

/**
 * Header for the Traditional Chinese sections. Deliberately lighter than the
 * English Navbar: four links, a language switch and one call to action.
 */
export function ZhHeader({ locale }: { locale: ZhLocale }) {
  const t = zhChrome[locale];
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Close the menu on navigation (state-during-render pattern, as in Navbar)
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

  const languageLinks = (className: string) =>
    t.languages.map((l) => (
      <Link key={l.href} href={l.href} hrefLang={l.hrefLang} lang={l.hrefLang} className={className}>
        {l.label}
      </Link>
    ));

  return (
    <header
      className={`pt-safe fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-line bg-background/95 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="主選單" className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4 sm:px-8">
        <Link href={t.home} aria-label={t.homeAria} className="shrink-0">
          <Wordmark />
        </Link>

        <ul className="ml-auto hidden items-center gap-7 lg:flex">
          {t.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`u-draw text-sm transition-colors ${
                  pathname === item.href ? "text-accent" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 font-mono text-[0.7rem] tracking-[0.08em] text-muted lg:flex">
          {languageLinks("u-draw transition-colors hover:text-foreground")}
        </div>

        <Link
          href={t.cta.href}
          className="hidden shrink-0 items-center gap-2 rounded-[3px] border border-foreground bg-foreground px-5 py-2.5 text-sm text-background transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-contrast lg:inline-flex"
        >
          {t.cta.label}
          <span aria-hidden>→</span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="zh-menu"
          className="-m-3 ml-auto min-h-11 min-w-11 p-3 text-sm text-foreground active:opacity-60 lg:hidden"
        >
          {open ? `${t.close} ×` : `${t.menu} ≡`}
        </button>
      </nav>

      {open && (
        <div
          id="zh-menu"
          className="flex h-[calc(100dvh-4.5rem)] flex-col justify-between overflow-y-auto overscroll-contain border-t border-line bg-background px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] lg:hidden"
        >
          <ul className="flex flex-col">
            {t.nav.map((item) => (
              <li key={item.href} className="border-b border-line">
                {/* onClick: in-page anchors (#services) don't change the pathname */}
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 text-2xl active:opacity-70"
                >
                  {item.label}
                  <span aria-hidden className="text-faint">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-5 pt-6">
            <div className="flex gap-5 text-base text-muted">
              {languageLinks("underline-offset-4 active:text-accent")}
            </div>
            <Link
              href={t.cta.href}
              onClick={() => setOpen(false)}
              className="flex min-h-13 items-center justify-center gap-3 rounded-[3px] bg-accent px-6 py-4 text-base text-accent-contrast active:scale-[0.98]"
            >
              {t.cta.label} →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
