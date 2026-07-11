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
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="annotation">The Studio</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Independent software studio. Websites, web applications and
              mobile apps — personally engineered by {site.founder}.
            </p>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
              {site.location} — working worldwide
            </p>
          </div>

          <div>
            <p className="annotation mb-5">Index</p>
            <ul className="flex flex-col gap-2.5">
              {nav.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="u-draw text-sm text-muted transition-colors hover:text-foreground"
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
                  href="/pricing"
                  className="u-draw text-sm text-muted transition-colors hover:text-foreground"
                >
                  <span className="mr-2 font-mono text-[0.625rem] text-faint">07</span>
                  Pricing
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
                  WhatsApp
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
            © {new Date().getFullYear()} {site.name} — {site.tagline}
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
