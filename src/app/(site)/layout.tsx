import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { BackToTop } from "@/components/BackToTop";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-100 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:border focus:border-accent focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-[0.14em] focus:uppercase"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyCta />
      <BackToTop />
    </>
  );
}
