import type { Metadata } from "next";
import { DownChecker } from "@/components/DownChecker";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Is My Website Down? — Free Down-or-Not Check",
  description:
    "Check if your website is down for everyone or just you: a live request from our server with the status code and response time. Free, instant.",
  keywords: [
    "is my website down",
    "website down checker",
    "is it down for everyone",
    "site down check",
    "website status check",
  ],
  alternates: { canonical: "/is-my-website-down" },
  openGraph: {
    title: "Is My Website Down? — Free Down-or-Not Check",
    description:
      "Down for everyone, or just you? A live check from our server answers in seconds. Free.",
    url: `${site.url}/is-my-website-down`,
    type: "website",
    images: ogImage("Down for everyone, or just you?", "Free Down Checker"),
  },
};

const faqs = [
  {
    q: "How does this check work?",
    a: "Our server requests your address the way a browser would, follows any redirects, and reports what happened: the status code and how long the response took. If we reach it and you can't, the problem is on your side of the internet; if we can't reach it either, it is genuinely down.",
  },
  {
    q: "It's up for you but down for me. What do I do?",
    a: "In order: try mobile data instead of Wi-Fi (isolates your network), try a private/incognito window (isolates cache and extensions), restart your router, and flush your DNS. If it fails only at your office, ask whoever manages that network.",
  },
  {
    q: "It's down for everyone. Now what?",
    a: "Check your hosting provider's status page first — most outages are theirs and resolve without you. If hosting is fine, the usual suspects are an expired domain, broken DNS records after a change, or an expired SSL certificate. Your registrar and hosting dashboards will show which.",
  },
  {
    q: "How do I stop discovering outages from customers?",
    a: "Uptime monitoring — a service that checks your site every minute and emails you the moment it fails. Sites this studio maintains get monitoring as standard; finding out from a customer is the expensive way.",
  },
  {
    q: "The site is 'up' but a specific page errors. Does this catch that?",
    a: "Check that exact page's URL here — the tool tests whatever address you give it, and a 404 or 500 on the page will show as the status code.",
  },
];

export default function IsMyWebsiteDownPage() {
  const schemas = [
    toolSchema("Is My Website Down", "/is-my-website-down", "Free down-or-not checker: a live server-side request with status code and response time."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "Is My Website Down", path: "/is-my-website-down" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        crumb="/is-my-website-down"
        eyebrow="Free Down Checker"
        title={
          <>
            Down for everyone — or <span className="text-gradient">just you</span>?
          </>
        }
        lead="A live request from our server settles it in seconds, with the status code and what to do next either way."
        tool={<DownChecker />}
        faqs={faqs}
      />
    </>
  );
}
