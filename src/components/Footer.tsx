import Link from "next/link";
import { services } from "@/data/services";
import { nav, site } from "@/data/site";
import { featuredTools, TOOL_COUNT } from "@/data/tools";
import { Price } from "./Price";

/**
 * The footer: the wordmark at full width, then every part of the site in
 * columns (index, services, tools, markets, contact) so each page links to
 * all the others, and the legal line.
 */
const markets = [
  { label: "Hong Kong", href: "/web-development-hong-kong" },
  { label: "Taiwan", href: "/web-development-taiwan" },
  { label: "Dubai & UAE", href: "/web-development-dubai" },
  { label: "United States", href: "/web-development-usa" },
  { label: "Coaching institutes", href: "/coaching-institute-websites" },
  { label: "Clinics", href: "/clinic-websites" },
  { label: "香港（繁中）", href: "/zh-hk", lang: "zh-HK" },
  { label: "台灣（繁中）", href: "/zh-tw", lang: "zh-TW" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="ink border-t border-line">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <p className="foot-word" aria-hidden>
          Kodinav<i>.</i>
        </p>
        <div className="mt-8 flex flex-col justify-between gap-6 border-t border-line pt-8 lg:flex-row lg:items-end">
          <p className="max-w-md text-pretty leading-relaxed text-muted">
            Independent software studio. Websites, web apps and mobile apps designed, engineered and supported by{" "}
            {site.founder}. Projects from <Price inr={site.priceFloor} usd={site.priceFloorUsd} />, fixed in writing.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
            <a href={`mailto:${site.email}`} className="u-draw text-foreground">
              {site.email}
            </a>
            <a href={`tel:${site.phoneRaw}`} className="u-draw text-foreground">
              {site.phone}
            </a>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="u-draw text-foreground">
              WhatsApp
            </a>
          </div>
        </div>

        <div className="foot-cols mt-14">
          <div>
            <p className="annotation mb-4">Index</p>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} prefetch={false}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/process" prefetch={false}>
                  Process
                </Link>
              </li>
              <li>
                <Link href="/free-website-audit" prefetch={false}>
                  Website audit
                </Link>
              </li>
              <li>
                <Link href="/website-audit" prefetch={false}>
                  Audit report
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="annotation mb-4">Services</p>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} prefetch={false}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="annotation mb-4">Free tools</p>
            <ul>
              {featuredTools.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} prefetch={false}>
                    {t.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/free-tools" prefetch={false} className="text-foreground!">
                  All {TOOL_COUNT} tools →
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="annotation mb-4">Markets</p>
            <ul>
              {markets.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} prefetch={false} lang={m.lang} hrefLang={m.lang}>
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="annotation mb-4">Studio</p>
            <ul>
              <li>
                <Link href="/about" prefetch={false}>
                  {site.founder}
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={false}>
                  Book a discovery call
                </Link>
              </li>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={`tel:${site.phoneRaw}`}>{site.phone}</a>
              </li>
              <li>
                <Link href="/privacy-policy" prefetch={false}>
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" prefetch={false}>
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="font-mono text-[0.625rem] tracking-[0.16em] uppercase text-faint">
            © {year} {site.name} · {site.tagline} · {site.serviceAreas[4]}, {site.location}
          </p>
          <p className="font-mono text-[0.625rem] tracking-[0.16em] uppercase text-faint">
            Designed and built by {site.founder}. Response within one business day.
          </p>
        </div>
      </div>
    </footer>
  );
}
