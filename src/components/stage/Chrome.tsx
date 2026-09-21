"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { site } from "@/data/site";
import { chapters } from "./content";
import { StageButton } from "./StageButton";

/**
 * The fixed chrome shared by every page: the logo cell top-left, the four-dot
 * menu button, the one call button top-right, and the menu — a framed panel
 * of chapters over a dimmed page. There is no link bar; the menu is the
 * navigation, and it is always in the HTML so crawlers see every link in it.
 *
 * On the homepage the chapters scroll the stage; elsewhere they link to it.
 */

const pages = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Free tools", href: "/free-tools" },
  { label: "Pricing", href: "/pricing" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Free website audit", href: "/free-website-audit" },
  { label: "Hong Kong", href: "/web-development-hong-kong" },
  { label: "Taiwan", href: "/web-development-taiwan" },
  { label: "香港（繁中）", href: "/zh-hk", lang: "zh-HK" },
  { label: "台灣（繁中）", href: "/zh-tw", lang: "zh-TW" },
];

export function Chrome({ stage = false }: { stage?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // close on navigation (state-during-render pattern)
  const [prev, setPrev] = useState(pathname);
  if (prev !== pathname) {
    setPrev(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    // the page's own copy recedes so the panel sits on the film alone
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  const goChapter = (at: number) => (e: React.MouseEvent) => {
    if (!stage) return; // elsewhere it is a real link to /#chapter
    e.preventDefault();
    setOpen(false);
    window.dispatchEvent(new CustomEvent("stage:go", { detail: at + 0.008 }));
  };

  return (
    <>
      {!stage && <div className="chrome-bar" aria-hidden />}
      <header className="chrome">
      <Link href="/" className="chrome-logo" aria-label="Kodinav — home">
        <span className="chrome-mark" aria-hidden>
          K<i>.</i>
        </span>
      </Link>
      <button
        type="button"
        className="chrome-dots"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <i />
        <i />
        <i />
        <i />
      </button>
      <StageButton href="/contact" className="chrome-cta">
        Book a call
      </StageButton>
      </header>

      <div
        id="site-menu"
        className={`menu ${open ? "is-open" : ""}`}
        inert={!open}
        aria-hidden={!open}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <nav className="menu-panel" aria-label="Site">
          <p className="menu-word" aria-hidden>
            Kodinav<i>.</i>
          </p>
          {chapters.map((c, i) => (
            <Link
              key={c.id}
              href={`/#${c.id}`}
              className="menu-ch"
              style={{ "--i": i } as CSSProperties}
              onClick={goChapter(c.at)}
            >
              <b>Ch. {c.no}</b>
              <em>{c.label}</em>
            </Link>
          ))}
          <div className="menu-index">
            {pages.map((p) => (
              <Link key={p.href} href={p.href} lang={p.lang} hrefLang={p.lang} prefetch={false}>
                {p.label}
              </Link>
            ))}
          </div>
          <div className="menu-legal">
            <p>{site.name} · Independent software studio</p>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
