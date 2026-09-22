"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { services } from "@/data/services";
import { nav } from "@/data/site";
import { featuredTools, TOOL_COUNT } from "@/data/tools";
import { ButtonLink } from "./ui";
import { Wordmark } from "./Wordmark";

/**
 * One bar: the wordmark, the sections, a pill to book a call. Services and
 * Tools open panels on hover or focus; every link in them is in the HTML, so
 * crawlers see the whole site from every page. On small screens the bar
 * folds into a sheet.
 */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // close on navigation (state-during-render pattern)
  const [prev, setPrev] = useState(pathname);
  if (prev !== pathname) {
    setPrev(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.classList.add("js");
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const current = (href: string) => (pathname === href || (href !== "/" && pathname.startsWith(href + "/")) ? "page" : undefined);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="nav-inner">
        <Link href="/" aria-label="Kodinav — home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Primary">
          <ul className="nav-links">
            {nav.map((item) =>
              item.label === "Services" ? (
                <li key={item.href}>
                  <button type="button" aria-haspopup="true" aria-expanded="false">
                    Services
                  </button>
                  <div className="nav-panel cols-3" role="group" aria-label="Services">
                    <ul>
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/services/${s.slug}`} prefetch={false}>
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="all">
                      <Link href="/services" className="u-draw text-sm font-medium">
                        All {services.length} services →
                      </Link>
                    </p>
                  </div>
                </li>
              ) : "mega" in item && item.mega ? (
                <li key={item.href}>
                  <button type="button" aria-haspopup="true" aria-expanded="false">
                    Tools
                  </button>
                  <div className="nav-panel cols-2" role="group" aria-label="Free tools">
                    <ul>
                      {featuredTools.map((t) => (
                        <li key={t.href}>
                          <Link href={t.href} prefetch={false}>
                            {t.name}
                            <small>{t.blurb}</small>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="all">
                      <Link href="/free-tools" className="u-draw text-sm font-medium">
                        All {TOOL_COUNT} free tools →
                      </Link>
                    </p>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} aria-current={current(item.href)}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="nav-right">
          <ButtonLink href="/contact" className="nav-cta">
            Book a call
          </ButtonLink>
          <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-sheet" onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div id="nav-sheet" className="nav-sheet" hidden={!open}>
        <nav aria-label="Menu">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false}>
              {item.label}
            </Link>
          ))}
          <p className="annotation">Services</p>
          <div className="sub">
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} prefetch={false}>
                {s.name}
              </Link>
            ))}
          </div>
          <p className="annotation">Free tools</p>
          <div className="sub">
            {featuredTools.map((t) => (
              <Link key={t.href} href={t.href} prefetch={false}>
                {t.name}
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <ButtonLink href="/contact" size="lg">
              Book a call
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
