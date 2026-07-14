import type { Metadata } from "next";
import { LandingPage, type LandingContent } from "@/components/LandingPage";
import { getProject } from "@/data/projects";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Web Development for US Businesses — Fixed USD Quotes",
  description:
    "Custom websites, e-commerce and web applications for US businesses. Senior engineering, direct with the founder, fixed quotes from $2,000 — built fast and built to rank.",
  keywords: [
    "web development company USA",
    "affordable web development USA",
    "outsource web development",
    "offshore web development company",
    "hire remote web developer",
    "e-commerce development USA",
    "Next.js developer USA",
    "website development small business USA",
  ],
  alternates: { canonical: "/web-development-usa" },
  openGraph: {
    title: "Web Development for US Businesses",
    description:
      "Senior engineering at honest prices. Custom websites, e-commerce and web apps for US businesses, from $2,000 fixed.",
    url: `${site.url}/web-development-usa`,
    type: "website",
    images: ogImage("Web development for US businesses", "Fixed USD Quotes"),
  },
};

const content: LandingContent = {
  eyebrow: "For US Businesses",
  headline: ["Agency-grade web development,", "without the agency invoice."],
  subheading:
    "Custom websites, e-commerce and web applications for US businesses, engineered by a senior developer you talk to directly. Fixed USD quotes, sub-second load times, and same-day communication — your morning is my working evening.",
  audienceLabel: "US businesses",
  orgLabel: "Company Name",
  source: "google-ads-usa",
  painPoints: [
    {
      title: "US agency prices, junior output",
      body: "American agencies quote $15,000 to $60,000 for a business website, then hand the build down the bench. You pay for the office, the sales calls and the project managers. The engineering is a line item.",
    },
    {
      title: "Freelancer roulette",
      body: "The cheap alternative is a gamble: slow replies, missed deadlines, and a marketplace profile that goes quiet the day after handover, leaving nobody accountable when something breaks.",
    },
    {
      title: "Invisible on Google",
      body: "US search results are the most competitive in the world. A slow template site with no real SEO structure never surfaces for the searches your customers make, so the website exists but never earns its keep.",
    },
  ],
  outcomes: [
    "Custom design and engineering, no templates or page builders",
    "Sub-second load times, tested on real phones and networks",
    "SEO structure built to compete in US search results",
    "E-commerce on Stripe, PayPal or your preferred gateway",
    "Fixed USD quotes in writing, no hourly billing surprises",
    "Same-day communication: calls in your morning, my evening",
    "You own everything: code, domain, hosting, data",
    "Ongoing support after launch, not a disappearing act",
  ],
  proofProject: getProject("flaming-logistics")!,
  proofNote:
    "Recent international work: Flaming Integrated Logistiks, an enterprise logistics platform for a Lagos-based freight company serving 120+ countries. Marketing site, live shipment tracking, quote pipeline and a full admin panel, delivered entirely remotely across timezones.",
  steps: [
    {
      title: "Free strategy call",
      body: "Thirty minutes on your business and what the website needs to achieve. Honest advice on what is worth building, whether or not we work together.",
    },
    {
      title: "Fixed scope & USD quote",
      body: "A written plan naming every page and feature, priced fixed from $2,000. What is agreed is what is billed. Nothing moves mid-project.",
    },
    {
      title: "Launch in weeks",
      body: "Designed, built and live, typically within 3 to 6 weeks, with progress you can see throughout and training so your team can update content.",
    },
  ],
  faqs: [
    {
      q: "What does website development cost for a US business?",
      a: "Business websites start at $2,000 with a fixed, itemised quote. E-commerce and web applications are scoped individually and also quoted fixed. A comparable custom build from a US agency typically runs $15,000 to $60,000, because their invoice carries an office, a sales team and project managers. Mine carries engineering.",
    },
    {
      q: "How does working remotely with you actually work?",
      a: "Email, scheduled video calls, and Slack or WhatsApp — whichever you already use. You get a written scope, visible progress at every stage, and direct access to the engineer building your project. India's evening lines up with the US morning, so calls happen during your business hours, and work completed during my day is waiting when you start yours.",
    },
    {
      q: "Why hire offshore instead of a local US agency or freelancer?",
      a: "You are not choosing between quality and price; you are choosing what your money buys. The work here is senior-level, the portfolio is real and clickable, and the quote is fixed in writing. What you skip is the overhead that makes up most of a US agency invoice. If a local office matters to you, pay for it. If the website is what matters, don't.",
    },
    {
      q: "Who owns the website when it's done?",
      a: "You do, completely. Code, domain, hosting and content are registered to you and documented, so you are never locked to me or anyone else.",
    },
    {
      q: "Can you build e-commerce for the US market?",
      a: "Yes. Stores run on Stripe, PayPal or the gateway you already use, priced in USD, on accounts registered to you. Unusual catalogues, personalised products and subscription flows are exactly where custom development beats template stores.",
    },
  ],
  formTitle: "Get a fixed USD quote for your project.",
  budgets: [
    "$2,000 – $5,000",
    "$5,000 – $12,000",
    "$12,000 – $25,000",
    "$25,000+",
    "Not sure yet",
  ],
};

export default function UsaLandingPage() {
  return <LandingPage content={content} />;
}
