"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { featuredTools, TOOL_COUNT } from "@/data/tools";
import { Wordmark } from "./Wordmark";

/**
 * The chrome: a dark pill bar across the top holding the wordmark, a round
 * WhatsApp button and the "Start a project" pill; and, in the middle, a
 * second pill with a gradient hairline holding the sections. On the first
 * screen that pill sits in the bar; once the page is scrolled it docks to
 * the bottom of the screen and stays there. "More" opens a sheet with every
 * service and tool, so each page links to the whole site.
 */
const primary = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Free tools", href: "/free-tools" },
];
const more = [
  { label: "Pricing", href: "/pricing" },
  { label: "Process", href: "/process" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Website audit", href: "/free-website-audit" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [docked, setDocked] = useState(false);

  const [prev, setPrev] = useState(pathname);
  if (prev !== pathname) {
    setPrev(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.classList.add("js");
    const onScroll = () => setDocked(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const current = (href: string) => (pathname === href || pathname.startsWith(href + "/") ? "page" : undefined);

  return (
    <>
      <header className="bar">
        <div className="bar-pill">
          <Link href="/" aria-label="Kodinav — home" className="bar-logo">
            <span className="bar-mark" aria-hidden>
              K
            </span>
            <Wordmark />
          </Link>
          <div className="bar-right">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="bar-wa" aria-label={`Chat on WhatsApp (${site.phone})`}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.2.2 2 3.1 4.9 4.2 2.4.9 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4l-.6-.3-2-1c-.3-.1-.5-.2-.7.2l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5.3-.5v-.5l-.9-2.2c-.2-.5-.5-.5-.7-.5h-.6z"
                />
              </svg>
            </a>
            <button type="button" className="bar-more" aria-expanded={open} aria-controls="site-sheet" onClick={() => setOpen((v) => !v)}>
              <span className="bar-more-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              {open ? "Close" : "Menu"}
            </button>
            <Link href="/contact" className="bar-cta">
              <span className="bar-cta-orb" aria-hidden />
              Start a project
            </Link>
          </div>
        </div>
      </header>

      <nav className={`dock ${docked ? "is-docked" : ""}`} aria-label="Primary">
        <ul className="dock-pill">
          {primary.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={current(l.href)} prefetch={false}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <button type="button" className="dock-more" aria-expanded={open} aria-controls="site-sheet" onClick={() => setOpen((v) => !v)}>
              More
            </button>
          </li>
        </ul>
      </nav>

      <div id="site-sheet" className={`sheet ${open ? "is-open" : ""}`} inert={!open} aria-hidden={!open} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
        <div className="sheet-panel">
          <div className="sheet-cols">
            <div>
              <p className="sheet-h">Site</p>
              {[...primary, ...more].map((l) => (
                <Link key={l.href} href={l.href} prefetch={false}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div>
              <p className="sheet-h">Services</p>
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} prefetch={false}>
                  {s.name}
                </Link>
              ))}
            </div>
            <div>
              <p className="sheet-h">Free tools</p>
              {featuredTools.map((t) => (
                <Link key={t.href} href={t.href} prefetch={false}>
                  {t.name}
                </Link>
              ))}
              <Link href="/free-tools" prefetch={false} className="sheet-all">
                All {TOOL_COUNT} tools →
              </Link>
            </div>
          </div>
          <div className="sheet-foot">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phoneRaw}`}>{site.phone}</a>
          </div>
        </div>
      </div>
    </>
  );
}
