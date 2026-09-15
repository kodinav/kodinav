import type { Metadata } from "next";
import { RedirectChecker } from "@/components/RedirectChecker";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Redirect Checker — Trace a URL's Full Redirect Chain",
  description:
    "Trace every redirect hop — status codes, 301 vs 302, total time — then check all four versions of your domain (www/bare, http/https) in one click. Free.",
  keywords: [
    "redirect checker",
    "redirect chain checker",
    "301 redirect checker",
    "url redirect trace",
    "check redirects",
    "www redirect check",
  ],
  alternates: { canonical: "/redirect-checker" },
  openGraph: {
    title: "Redirect Checker — Trace a URL's Full Redirect Chain",
    description:
      "Every hop, every status code, total time. See what happens between the click and the page. Free.",
    url: `${site.url}/redirect-checker`,
    type: "website",
    images: ogImage("Where does your URL really go?", "Free Redirect Checker"),
  },
};

const faqs = [
  {
    q: "What is a redirect chain, and why is it bad?",
    a: "A chain is a redirect pointing to another redirect: old page → http → www → final URL. Each hop is a full network round-trip before your page even begins to load, and Google's own guidance is to redirect directly to the final destination. One hop is normal; three or more is worth fixing.",
  },
  {
    q: "301 or 302 — which should I use?",
    a: "301 (or 308) means moved permanently: Google transfers the old URL's signals to the new one and updates its index. 302/307 means temporary: Google keeps the old URL indexed and waits for it to come back. If a page has moved for good — a redesign, a domain change — permanent is almost always what you want.",
  },
  {
    q: "Do redirects lose SEO value?",
    a: "A clean permanent redirect passes signals well — Google has said 301s do not bleed PageRank the way they once did. What genuinely loses value is chains, redirect loops, temporary redirects left in place for years, and redirecting everything to the homepage instead of to each page's true replacement.",
  },
  {
    q: "Why should I check www and http versions of my domain?",
    a: "Your site is reachable at up to four addresses: http/https × www/bare. All four should end at one canonical address in a single hop. If www serves the site without redirecting, search engines see duplicate sites and split your authority between them. Trace each variant here and see.",
  },
  {
    q: "Is this free and read-only?",
    a: "Yes. The trace follows the redirects exactly like a browser, reads the headers and stops. Nothing on your site is changed, and nothing is stored.",
  },
];

export default function RedirectCheckerPage() {
  const schemas = [
    toolSchema("Redirect Checker", "/redirect-checker", "Free redirect chain tracer showing every hop, status code and total time for a URL."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "Redirect Checker", path: "/redirect-checker" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        crumb="/redirect-checker"
        eyebrow="Free Redirect Checker"
        title={
          <>
            Where does your URL <span className="text-gradient">really go</span>?
          </>
        }
        lead="Trace every hop between the click and the page: status codes, permanent vs temporary, and how many round-trips your visitors pay for before anything loads."
        tool={<RedirectChecker />}
        faqs={faqs}
      />
    </>
  );
}
