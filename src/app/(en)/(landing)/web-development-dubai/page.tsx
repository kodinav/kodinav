import type { Metadata } from "next";
import { LandingPage, type LandingContent } from "@/components/LandingPage";
import { getProject } from "@/data/projects";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Web Development for Dubai & UAE Businesses — Fixed USD Quotes",
  description:
    "Premium website and web application development for Dubai and GCC businesses. Senior engineering, direct with the founder, fixed quotes from $2,000. Fast, SEO-ready, and delivered in your timezone.",
  keywords: [
    "web development company Dubai",
    "website development Dubai",
    "web developer UAE",
    "website design Dubai",
    "e-commerce development Dubai",
    "web development company UAE",
    "Next.js developer Dubai",
    "affordable web development Dubai",
  ],
  alternates: { canonical: "/web-development-dubai" },
  openGraph: {
    title: "Web Development for Dubai & UAE Businesses",
    description:
      "Senior engineering at honest prices. Custom websites, e-commerce and web apps for GCC businesses, from $2,000 fixed.",
    url: `${site.url}/web-development-dubai`,
    type: "website",
    images: ogImage("Web development for Dubai & UAE businesses", "Fixed USD Quotes"),
  },
};

const content: LandingContent = {
  eyebrow: "For Dubai & GCC Businesses",
  headline: ["Dubai-grade web development,", "at honest prices."],
  subheading:
    "Custom websites, e-commerce and web applications for UAE businesses, engineered by a senior developer you talk to directly. Fixed USD quotes, sub-second load times, and a working day that overlaps yours almost entirely.",
  audienceLabel: "Gulf businesses",
  orgLabel: "Company Name",
  source: "google-ads-uae",
  painPoints: [
    {
      title: "Agency prices, template output",
      body: "Dubai agencies quote AED 20,000 to 50,000, then deliver a purchased theme filled with your logo. You pay for their office rent and account managers, not for engineering.",
    },
    {
      title: "Freelancer roulette",
      body: "The cheap alternative is a lottery. Slow replies, missed deadlines, and a developer who disappears the day after handover, leaving nobody to call when something breaks.",
    },
    {
      title: "Invisible on Google",
      body: "UAE search results are competitive. A slow site with no real SEO structure never surfaces for the searches your customers actually make, so the website exists but earns nothing.",
    },
  ],
  outcomes: [
    "Custom design and engineering, no templates or page builders",
    "Sub-second load times, tested on real phones and networks",
    "SEO structure built to rank for UAE and GCC searches",
    "E-commerce with payment gateways that work in the Emirates",
    "WhatsApp integration, the channel Gulf business runs on",
    "Fixed USD quotes in writing, no hourly billing surprises",
    "You own everything: code, domain, hosting, data",
    "Ongoing support with a workday that overlaps yours",
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
      q: "What does website development cost for a UAE business?",
      a: "Business websites start at $2,000 (about AED 7,500) with a fixed, itemised quote. E-commerce and web applications are scoped individually and quoted fixed. That is typically a third to a half of a comparable Dubai agency quote, because you pay for senior engineering rather than an office on Sheikh Zayed Road.",
    },
    {
      q: "How does working remotely with you actually work?",
      a: "The same way you already work with your bank and suppliers: WhatsApp, email and scheduled video calls. You get a written scope, visible progress at every stage, and direct access to the engineer building your project. India's workday overlaps the Gulf's almost entirely, so replies come in your business hours, not the day after.",
    },
    {
      q: "Why hire from India instead of a local Dubai agency?",
      a: "You are not choosing between quality and price. You are choosing between paying for engineering and paying for overhead. The work is senior-level and the portfolio is real and clickable. What you skip is the agency's rent, sales team and account managers, which is most of what a Dubai invoice actually buys.",
    },
    {
      q: "Who owns the website when it's done?",
      a: "You do, completely. Code, domain, hosting and content are registered to you and documented, so you are never locked to me or anyone else.",
    },
    {
      q: "Can you handle e-commerce and payments for the UAE?",
      a: "Yes. Stores are built with payment gateways that operate in the Emirates, AED pricing, and the speed that online retail depends on. If your catalogue or flows are unusual, that is exactly where custom development earns its keep.",
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

export default function DubaiLandingPage() {
  return <LandingPage content={content} />;
}
