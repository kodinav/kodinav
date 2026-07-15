import Link from "next/link";
import { site, nav } from "@/data/site";
import { services } from "@/data/services";

export function Footer() {
  return (
    <footer className="ink bg-noise relative overflow-hidden">
      {/* Giant wordmark */}
      <div className="border-b border-line px-5 pt-16 sm:px-8">
        <p
          aria-hidden
          className="font-display mb-[-0.5vw] text-center text-[19.5vw] uppercase leading-[0.78] tracking-[0.01em] text-foreground/95 select-none"
        >
          Kodinav
        </p>
      </div>

      <div className="pb-safe mx-auto max-w-7xl px-5 py-14 sm:px-8">
        {/* 2-col on mobile so short link lists sit side by side instead of
            stacking as sparse full-width columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] md:gap-10">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <p className="annotation">The Studio</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Independent software studio. Website development, web
              applications and mobile apps, personally engineered by{" "}
              {site.founder} with React, Next.js and Node.js.
            </p>
            <p className="max-w-xs text-xs leading-relaxed text-faint">
              Working with ambitious businesses worldwide. Every timezone,
              one engineer accountable.
            </p>
            {/* Region pages need internal links to rank organically —
                without these they exist only in the sitemap */}
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/web-development-usa"
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  For US businesses →
                </Link>
              </li>
              <li>
                <Link
                  href="/web-development-dubai"
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  For Dubai &amp; UAE businesses →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="annotation mb-5">Index</p>
            <ul className="flex flex-col gap-2.5">
              {nav.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`u-draw text-sm transition-colors hover:text-foreground ${
                      item.href === "/free-website-audit" ? "text-accent" : "text-muted"
                    }`}
                  >
                    <span className="mr-2 font-mono text-[0.625rem] text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/website-audit"
                  className="u-draw text-sm text-accent transition-colors hover:text-foreground"
                >
                  <span className="mr-2 font-mono text-[0.625rem] text-faint">09</span>
                  Website Audit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="annotation mb-5">Services</p>
            <ul className="flex flex-col gap-2.5">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="annotation mb-5">Free Tools</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href="/website-cost-calculator"
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  Cost Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/website-speed-test"
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  Website Speed Test
                </Link>
              </li>
              <li>
                <Link
                  href="/mobile-friendly-test"
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  Mobile-Friendly Test
                </Link>
              </li>
              <li>
                <Link
                  href="/whatsapp-link-generator"
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  WhatsApp Link Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/google-review-link-generator"
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  Review Link Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/free-tools"
                  className="u-draw text-sm text-accent transition-colors hover:text-foreground"
                >
                  All free tools →
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="annotation mb-5">Contact</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  WhatsApp · {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phoneRaw}`}
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="u-draw text-sm text-accent transition-colors hover:text-foreground"
                >
                  Book a discovery call →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
            © {new Date().getFullYear()} {site.name} · {site.tagline}
          </p>
          {/* barcode ornament */}
          <div aria-hidden className="flex h-5 items-stretch gap-0.75 opacity-50">
            {[2, 1, 3, 1, 1, 2, 1, 4, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3].map((w, i) => (
              <span key={i} className="bg-foreground" style={{ width: w }} />
            ))}
          </div>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
            Designed &amp; engineered by {site.founder}
          </p>
        </div>
      </div>
    </footer>
  );
}
