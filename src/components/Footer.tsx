import Link from "next/link";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { featuredTools, TOOL_COUNT } from "@/data/tools";
import { ButtonLink } from "./ui";
import { Wordmark } from "./Wordmark";

/** The footer: "Let's connect", then every part of the site in serif-headed columns, then the legal line. */
const siteLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Process", href: "/process" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Website audit", href: "/free-website-audit" },
  { label: "Audit report", href: "/website-audit" },
];
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
    <footer className="foot">
      <div className="foot-top">
        <div>
          <h2 className="foot-title">Let’s connect</h2>
          <p className="foot-sub">Start with a free, no-obligation call about your website</p>
          <div className="foot-actions">
            <ButtonLink href={`mailto:${site.email}`} variant="outline" external>
              Send me an email
            </ButtonLink>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="foot-round" aria-label="WhatsApp">
              W
            </a>
            <a href={`tel:${site.phoneRaw}`} className="foot-round" aria-label={`Call ${site.phone}`}>
              ☏
            </a>
          </div>
        </div>
        <div className="foot-cols">
          <div>
            <p className="foot-h">Services</p>
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} prefetch={false}>
                {s.name}
              </Link>
            ))}
          </div>
          <div>
            <p className="foot-h">Free tools</p>
            {featuredTools.map((t) => (
              <Link key={t.href} href={t.href} prefetch={false}>
                {t.name}
              </Link>
            ))}
            <Link href="/free-tools" prefetch={false}>
              All {TOOL_COUNT} tools →
            </Link>
          </div>
          <div>
            <p className="foot-h">Site</p>
            {siteLinks.map((l) => (
              <Link key={l.href} href={l.href} prefetch={false}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="foot-h">Markets</p>
            {markets.map((m) => (
              <Link key={m.href} href={m.href} prefetch={false} lang={m.lang} hrefLang={m.lang}>
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <div className="foot-brand">
          <Wordmark size="lg" />
          <p>
            {site.name} is an independent software studio based in {site.serviceAreas[4]}, {site.location}, building websites, web
            apps and mobile apps for businesses in India, Hong Kong, Taiwan and worldwide. Designed, engineered and supported
            by {site.founder}.
          </p>
        </div>
        <div className="foot-legal">
          <p>
            {site.tagline} · © {year} {site.name}. All rights reserved.
          </p>
          <p>
            <Link href="/privacy-policy" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="/terms" prefetch={false}>
              Terms
            </Link>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phoneRaw}`}>{site.phone}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
