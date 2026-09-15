import { RootDocument } from "@/components/RootDocument";
import { rootMetadata, rootViewport } from "@/lib/rootMetadata";
import "../globals.css";

// Re-generate prerendered pages at most every 5 minutes. This caps the
// s-maxage sent to Hostinger's CDN, so a fresh deploy stops being masked by
// year-long cached HTML that references deleted asset chunks.
export const revalidate = 300;

export const viewport = rootViewport;
export const metadata = rootMetadata;

/** Root layout for every English route: the main site, ad landing pages and admin. */
export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
