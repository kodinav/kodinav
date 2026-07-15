import type { Metadata } from "next";
import { BrokenLinkChecker } from "@/components/BrokenLinkChecker";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Broken Link Checker — Free Dead-Link Scan",
  description:
    "Find broken links on any page free: every link tested, 404s and dead pages flagged with the anchor text that points to them. No signup, no email.",
  keywords: [
    "broken link checker",
    "find broken links",
    "dead link checker",
    "404 checker",
    "check links on website",
    "link checker free",
  ],
  alternates: { canonical: "/broken-link-checker" },
  openGraph: {
    title: "Broken Link Checker — Free Dead-Link Scan",
    description:
      "Every link on the page tested; 404s and dead pages named, with the anchor text pointing at them. Free.",
    url: `${site.url}/broken-link-checker`,
    type: "website",
    images: ogImage("Find the links that lead nowhere", "Free Link Checker"),
  },
};

const faqs = [
  {
    q: "Why do broken links matter?",
    a: "A visitor clicks because they were interested — and lands on an error page at the exact moment of interest. Internally, broken links also waste the crawl attention Google gives your site, and a page full of dead ends reads as neglect to both crawlers and customers.",
  },
  {
    q: "How do links break when nobody touched them?",
    a: "The web rots quietly: businesses you linked to close, blogs restructure their URLs, suppliers migrate domains. Your own redesigns break old internal paths too. That is why link-checking is periodic maintenance, not a one-time fix.",
  },
  {
    q: "Why are some links marked \"couldn't verify\"?",
    a: "Some sites answer automated requests with 403 or 429 regardless of whether the page exists — LinkedIn and many news sites do this. Calling those \"broken\" would be false. This checker only says broken when the server itself says the page is gone (404/410); everything ambiguous is listed for you to check by hand.",
  },
  {
    q: "How many links does the scan test?",
    a: "Every unique link on the page you enter, up to 40, tested concurrently with redirects followed. For a whole-site crawl, run key pages one at a time — homepage, services, contact — which is where broken links do the most damage anyway.",
  },
  {
    q: "What should I do with the broken ones?",
    a: "Internal links: fix the path or redirect the old URL to its replacement. External links: update to the new destination or remove the link. If the list is long, that is exactly the kind of quiet upkeep a maintenance plan exists for.",
  },
];

export default function BrokenLinkCheckerPage() {
  const schemas = [
    toolSchema("Broken Link Checker", "/broken-link-checker", "Free broken link checker testing every link on a page and naming the 404s and dead pages."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "Broken Link Checker", path: "/broken-link-checker" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        eyebrow="Free Link Checker"
        title={
          <>
            Find the links that lead <span className="text-gradient">nowhere</span>.
          </>
        }
        lead="Every link on your page, tested. The dead ones named — with the exact anchor text pointing at them, so they take seconds to find and fix."
        tool={<BrokenLinkChecker />}
        faqs={faqs}
      />
    </>
  );
}
