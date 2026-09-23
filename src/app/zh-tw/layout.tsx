import { RootDocument } from "@/components/RootDocument";
import { Aurora } from "@/components/Aurora";
import { Polish } from "@/components/Polish";
import { RevealObserver } from "@/components/RevealObserver";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { ZhFooter } from "@/components/zh/ZhFooter";
import { ZhHeader } from "@/components/zh/ZhHeader";
import { zhChrome } from "@/data/markets/chrome";
import { rootViewport, zhRootMetadata } from "@/lib/rootMetadata";
import "../globals.css";

// Same 5-minute CDN cap as the English root layout (see (en)/layout.tsx).
export const revalidate = 300;

export const viewport = rootViewport;
export const metadata = zhRootMetadata("zh-TW");

/** Root layout for /zh-tw: Traditional Chinese (Taiwan), <html lang="zh-TW">. */
export default function ZhTWRootLayout({ children }: { children: React.ReactNode }) {
  const t = zhChrome["zh-TW"];
  return (
    <RootDocument lang="zh-TW">
      <Aurora />
      <SmoothScroll />
      <RevealObserver />
      <Polish />
      <div className="grain" aria-hidden />
      <i className="readline" aria-hidden />
      <a
        href="#main-content"
        className="sr-only z-100 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:border focus:border-accent focus:bg-background focus:px-4 focus:py-2 focus:text-sm"
      >
        {t.skip}
      </a>
      <ZhHeader locale="zh-TW" />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <ZhFooter locale="zh-TW" />
      <WhatsAppFab label={t.whatsappAria} href={t.whatsappHref} />
    </RootDocument>
  );
}
