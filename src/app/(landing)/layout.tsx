import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { site } from "@/data/site";

/**
 * Minimal chrome for paid-traffic landing pages: no site navigation to leak
 * ad clicks — one goal, one CTA.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="pt-safe fixed inset-x-0 top-0 z-50 border-b border-line bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" aria-label="Kodinav — home">
            <Wordmark />
          </Link>
          <a
            href="#lead-form"
            className="inline-flex min-h-11 items-center gap-2 border border-foreground bg-foreground px-5 py-2.5 font-mono text-[0.6875rem] tracking-[0.14em] text-background uppercase transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-contrast active:scale-[0.98]"
          >
            Book Free Call <span aria-hidden>→</span>
          </a>
        </div>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <WhatsAppFab />
      <footer className="ink pb-safe border-t border-line py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 text-center">
          <p className="font-mono text-[0.625rem] tracking-[0.16em] text-faint uppercase">
            © {new Date().getFullYear()} {site.name} — {site.tagline} — founded
            by {site.founder}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="font-mono text-[0.625rem] tracking-[0.16em] text-muted uppercase hover:text-foreground"
          >
            {site.email}
          </a>
        </div>
      </footer>
    </>
  );
}
