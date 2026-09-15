import { RootDocument } from "@/components/RootDocument";
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
export const metadata = zhRootMetadata("zh-HK");

/** Root layout for /zh-hk: Traditional Chinese (Hong Kong), <html lang="zh-HK">. */
export default function ZhHKRootLayout({ children }: { children: React.ReactNode }) {
  const t = zhChrome["zh-HK"];
  return (
    <RootDocument lang="zh-HK">
      <SmoothScroll />
      <a
        href="#main-content"
        className="sr-only z-100 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:border focus:border-accent focus:bg-background focus:px-4 focus:py-2 focus:text-sm"
      >
        {t.skip}
      </a>
      <ZhHeader locale="zh-HK" />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <ZhFooter locale="zh-HK" />
      <WhatsAppFab label={t.whatsappAria} />
    </RootDocument>
  );
}
