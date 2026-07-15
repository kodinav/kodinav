import type { Metadata } from "next";
import { ToolShell } from "@/components/ToolShell";
import { UtmBuilder } from "@/components/UtmBuilder";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "UTM Link Builder — Free Campaign URL Generator",
  description:
    "Build UTM-tagged campaign links that show up correctly in Google Analytics — with plain-language guidance on source, medium and campaign. Free.",
  keywords: [
    "utm builder",
    "utm link generator",
    "campaign url builder",
    "utm parameters",
    "google analytics utm",
    "utm tracking links",
  ],
  alternates: { canonical: "/utm-builder" },
  openGraph: {
    title: "UTM Link Builder — Free Campaign URL Generator",
    description:
      "Tagged campaign links that report cleanly in Google Analytics. Plain-language, free, no signup.",
    url: `${site.url}/utm-builder`,
    type: "website",
    images: ogImage("Know which campaign brought the customer", "Free UTM Builder"),
  },
};

const faqs = [
  {
    q: "What are UTM parameters?",
    a: "Small labels appended to a link — utm_source, utm_medium, utm_campaign — that tell your analytics where a visit came from. Without them, a click from your Instagram bio and a click from a paid ad can look identical in reports; with them, you know which effort actually produced the enquiry.",
  },
  {
    q: "What's the difference between source and medium?",
    a: "Source is where the click happened: google, facebook, newsletter. Medium is what kind of channel it was: cpc for paid clicks, social for organic social, email for mailers. Campaign is which specific push: diwali_offer, july_promo. Together they answer where, how and why.",
  },
  {
    q: "Why does everything become lowercase with underscores?",
    a: "Because analytics tools treat \"Facebook\", \"facebook\" and \"FaceBook\" as three different sources, silently splitting one channel into three rows. The builder normalises for you so reports stay in one piece.",
  },
  {
    q: "Should I use UTMs on links inside my own website?",
    a: "No — internal UTMs overwrite the visitor's original source, destroying the very attribution you built. Use them only on links that live outside your site: ads, social posts, emails, QR codes, directories.",
  },
  {
    q: "Where do I see the results?",
    a: "In Google Analytics 4: Reports → Acquisition → Traffic acquisition, or filter any report by session source/medium. Visits arrive labelled exactly as you tagged them.",
  },
];

export default function UtmBuilderPage() {
  const schemas = [
    toolSchema("UTM Link Builder", "/utm-builder", "Free UTM campaign link builder with automatic normalisation and plain-language guidance."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "UTM Builder", path: "/utm-builder" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        eyebrow="Free UTM Builder"
        title={
          <>
            Know which campaign <span className="text-gradient">brought the customer</span>.
          </>
        }
        lead="Tag your ad, social and QR links so Google Analytics tells you what actually worked — instead of one anonymous pile of 'direct' traffic."
        wide
        tool={<UtmBuilder />}
        faqs={faqs}
      />
    </>
  );
}
