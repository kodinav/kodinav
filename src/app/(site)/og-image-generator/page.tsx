import type { Metadata } from "next";
import Link from "next/link";
import { OgImageMaker } from "@/components/OgImageMaker";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "OG Image Generator — Free Social Share Image Maker",
  description:
    "Make a 1200×630 Open Graph share image for your links in seconds: headline, brand, colours, download PNG. Free, in your browser, no signup.",
  keywords: [
    "og image generator",
    "open graph image generator",
    "social share image maker",
    "og image size",
    "twitter card image generator",
    "1200x630 image",
  ],
  alternates: { canonical: "/og-image-generator" },
  openGraph: {
    title: "OG Image Generator — Free Social Share Image Maker",
    description:
      "A clean 1200×630 share card from a headline and your colours. Download the PNG, point og:image at it. Free.",
    url: `${site.url}/og-image-generator`,
    type: "website",
    images: ogImage("Make your links share beautifully", "Free OG Maker"),
  },
};

const faqs = [
  {
    q: "What is an OG image?",
    a: "The picture platforms show when your link is shared — on WhatsApp, LinkedIn, Facebook, iMessage, Slack. It is declared by an og:image meta tag on your page. Links with one get a card people tap; links without get a bare grey URL.",
  },
  {
    q: "Why 1200 × 630?",
    a: "It is the 1.91:1 shape every major platform crops toward, at a resolution that stays sharp on high-density screens. One image at this size works everywhere; only X's small summary card and square formats crop it differently.",
  },
  {
    q: "How do I use the downloaded image?",
    a: "Upload it to your website (any public folder), then add <meta property=\"og:image\" content=\"https://yoursite.com/path/og-image.png\"> to the page's head — the URL must be absolute. Then verify it with the link preview checker.",
  },
  {
    q: "Text on the image or text in the tags — which matters?",
    a: "Both show: the image is the picture, og:title and og:description are the text under it. Putting your headline in the image too means it survives platforms that truncate titles — which is why this generator is headline-first.",
  },
  {
    q: "Can I make one per page?",
    a: "Ideally yes — a card that names the page outperforms a generic logo card. For sites this studio builds, per-page OG images are generated automatically from each page's title; this tool is the manual version of exactly that.",
  },
];

export default function OgImageGeneratorPage() {
  const schemas = [
    toolSchema("OG Image Generator", "/og-image-generator", "Free 1200×630 Open Graph share image maker: headline, brand and colours, drawn in the browser."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "OG Image Generator", path: "/og-image-generator" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        crumb="/og-image-generator"
        eyebrow="Free OG Image Maker"
        title={
          <>
            Make your links share <span className="text-gradient">beautifully</span>.
          </>
        }
        lead="A clean 1200×630 share card from a headline and your colours — the image WhatsApp, LinkedIn and iMessage show when someone shares your page."
        wide
        tool={<OgImageMaker />}
        middle={
          <section className="border-t border-line">
            <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
              <p className="text-center text-sm leading-relaxed text-muted">
                Made your image and wired the tag?{" "}
                <Link href="/link-preview-checker" className="u-draw text-accent">
                  Verify it with the link preview checker
                </Link>
                .
              </p>
            </div>
          </section>
        }
        faqs={faqs}
      />
    </>
  );
}
