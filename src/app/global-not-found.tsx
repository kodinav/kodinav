import type { Metadata } from "next";
import { NotFoundView } from "@/components/NotFoundView";
import { RootDocument } from "@/components/RootDocument";
import { rootViewport } from "@/lib/rootMetadata";
import "./globals.css";

/**
 * 404 for URLs that match no route at all. The site has one root layout per
 * language, so there is no single layout for Next to compose a 404 from —
 * this file renders the whole document itself (enabled by
 * experimental.globalNotFound in next.config.ts).
 */
export const viewport = rootViewport;

export const metadata: Metadata = {
  title: "Page not found — Kodinav",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <NotFoundView />
    </RootDocument>
  );
}
