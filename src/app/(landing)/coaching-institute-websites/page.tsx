import type { Metadata } from "next";
import { LandingPage, type LandingContent } from "@/components/LandingPage";
import { getProject } from "@/data/projects";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Websites for Coaching Institutes — Get More Admissions",
  description:
    "Custom websites that help coaching institutes get more admissions. Fast, credible and built to rank for local coaching searches. From ₹75,000, by Kodinav.",
  keywords: [
    "coaching institute website design",
    "website for coaching classes",
    "coaching institute website India",
    "get more admissions online",
    "education website development",
  ],
  alternates: { canonical: "/coaching-institute-websites" },
  openGraph: {
    title: "Websites That Help Coaching Institutes Get More Admissions",
    description:
      "Fast, credible websites built to rank for local coaching searches and capture admission enquiries. From ₹75,000.",
    url: "/coaching-institute-websites",
    type: "website",
    images: ogImage("More admissions for coaching institutes", "Coaching Institute Websites"),
  },
};

const content: LandingContent = {
  eyebrow: "For Coaching Institutes",
  headline: [
    "Websites that help coaching institutes",
    "get more admissions.",
  ],
  subheading:
    "Parents research every institute online before they visit. A fast, credible website that answers their questions and captures their enquiry turns that research into admissions.",
  audienceLabel: "coaching institutes",
  orgLabel: "Institute Name",
  source: "meta-ads-coaching",
  painPoints: [
    {
      title: "Invisible on Google",
      body: "Parents search 'coaching near me' and find your competitors. No proper website means no local rankings, and no share of the highest-intent channel there is.",
    },
    {
      title: "Enquiries with no follow-up",
      body: "Calls land during class hours, get noted on paper, and die there. Every forgotten follow-up during admission season is a lost admission.",
    },
    {
      title: "First impressions that undersell you",
      body: "Your teaching may be the best in the city. But if the website looks like 2012, parents assume the institute runs the same way.",
    },
  ],
  outcomes: [
    "Custom design that presents your institute like the premium option it is",
    "Results, faculty and batches presented the way parents actually evaluate",
    "Enquiry forms that qualify leads by course, batch and budget before you call",
    "Built to rank for local coaching searches with proper SEO architecture",
    "Loads in under a second on the phones parents actually use",
    "WhatsApp integration so enquiries reach you instantly",
    "Admission-season ready: handles traffic spikes without breaking",
    "You own everything: domain, code, data. No monthly platform ransom",
  ],
  proofProject: getProject("lighthouse-classes")!,
  proofNote:
    "A complete online learning platform I built for Lighthouse Classes: structured courses, live classes, a built-in dictionary and student progress tracking. The same engineering behind an admissions-driving institute website.",
  steps: [
    {
      title: "Free strategy call",
      body: "Thirty minutes about your institute, your admission goals and your current online presence. Honest advice, whether or not we work together.",
    },
    {
      title: "Fixed scope & quote",
      body: "A written plan naming every page and feature, with a fixed price from ₹75,000. No hourly billing, no mid-project surprises.",
    },
    {
      title: "Launch in weeks",
      body: "Your website designed, built and live, typically within 3 to 6 weeks, with training so your team can update content themselves.",
    },
  ],
  faqs: [
    {
      q: "How much does a coaching institute website cost?",
      a: "Projects start at ₹75,000 for a complete custom website engineered for speed and local SEO. Institutes wanting enquiry management or a student portal invest more. You'll get an exact fixed quote after the strategy call.",
    },
    {
      q: "How long until my website is live?",
      a: "Most institute websites launch within 3–6 weeks of the first call, depending on how quickly content (photos, results, faculty details) comes together.",
    },
    {
      q: "Will it actually bring admissions, or just look good?",
      a: "The design decisions are conversion decisions: what parents see first, which questions get answered, how enquiries are captured and followed up. Looking good is necessary but not the goal. Enquiries are the goal.",
    },
    {
      q: "Who will I be dealing with?",
      a: "Abhinav Saxena, the founder. The same person who designs and engineers your website. Direct communication from first call to launch and beyond.",
    },
    {
      q: "What is the free website audit?",
      a: "If you already have a website, I'll review its speed, Google visibility and enquiry flow, and send you specific findings. Useful whether or not you hire me.",
    },
  ],
  formTitle: "Get more admissions from your website.",
};

export default function CoachingLandingPage() {
  return <LandingPage content={content} />;
}
