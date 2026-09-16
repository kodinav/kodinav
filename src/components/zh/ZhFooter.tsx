import Link from "next/link";
import { zhChrome, type ZhLocale } from "@/data/markets/chrome";
import { site } from "@/data/site";

export function ZhFooter({ locale }: { locale: ZhLocale }) {
  const t = zhChrome[locale];
  const f = t.footer;
  const link = "u-draw text-sm text-muted transition-colors hover:text-foreground";

  return (
    <footer className="ink bg-noise relative overflow-hidden">
      <div className="border-b border-line px-5 pt-16 sm:px-8">
        <p
          aria-hidden
          className="font-display mb-[-0.4vw] text-center text-[17.5vw] leading-[0.85] tracking-[-0.02em] text-foreground/95 select-none"
        >
          Kodinav<span className="text-brass">.</span>
        </p>
      </div>

      <div className="pb-safe mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <p className="max-w-sm text-sm leading-relaxed text-muted">{f.blurb}</p>
            <p className="max-w-sm text-xs leading-relaxed text-faint">{f.note}</p>
          </div>

          <div>
            <p className="annotation mb-5">{f.navTitle}</p>
            <ul className="flex flex-col gap-2.5">
              {t.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="annotation mb-5">{f.contactTitle}</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </li>
              <li>
                <a href={t.whatsappHref} target="_blank" rel="noopener noreferrer" className={link}>
                  {f.whatsapp}
                </a>
              </li>
              {/* Click-to-call: the site's own audit flagged its absence on the
                  Chinese pages — a phone number that isn't a link is a dead end on mobile. */}
              <li>
                <a href={`tel:${site.phoneRaw}`} className={link}>
                  {t.phoneLabel} {site.phone}
                </a>
              </li>
              <li>
                <Link href={t.cta.href} className="u-draw text-sm text-accent transition-colors hover:text-foreground">
                  {t.cta.label} →
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="annotation mb-5">{f.languagesTitle}</p>
            <ul className="flex flex-col gap-2.5">
              {t.languages.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} hrefLang={l.hrefLang} lang={l.hrefLang} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/" hrefLang="en" lang="en" className={link}>
                  Kodinav (English)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name} · {f.rights}
          </p>
          <p className="flex gap-4">
            {f.legal.map((l) => (
              <Link key={l.href} href={l.href} className="u-draw hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
