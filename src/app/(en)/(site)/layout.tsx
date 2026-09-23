import { Aurora } from "@/components/Aurora";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Polish } from "@/components/Polish";
import { RevealObserver } from "@/components/RevealObserver";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Aurora />
      <SmoothScroll />
      <RevealObserver />
      <Polish />
      <div className="grain" aria-hidden />
      <i className="readline" aria-hidden />
      <a
        href="#main-content"
        className="sr-only z-100 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:rounded-full focus:border focus:border-accent focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-[0.14em] focus:uppercase"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="relative z-10 flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
