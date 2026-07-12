import type { Metadata } from "next";
import { LandingPage, type LandingContent } from "@/components/LandingPage";
import { getProject } from "@/data/projects";

export const metadata: Metadata = {
  title: "Websites for Clinics & Doctors — Get More Patient Appointments",
  description:
    "Professional websites that help clinics and doctors get more appointments. Credible, fast, and built to rank for local healthcare searches. From ₹75,000, by Kodinav.",
  keywords: [
    "clinic website design",
    "doctor website India",
    "hospital website development",
    "medical website design India",
    "appointment booking website",
  ],
  alternates: { canonical: "/clinic-websites" },
  openGraph: {
    title: "Websites That Bring Patients To Your Clinic",
    description:
      "Credible, fast websites built to rank for local healthcare searches and capture appointment requests 24/7. From ₹75,000.",
    type: "website",
  },
};

const content: LandingContent = {
  eyebrow: "For Clinics & Doctors",
  headline: ["Websites that bring patients", "to your clinic."],
  subheading:
    "Patients search online before choosing a doctor. A credible, fast website that answers their concerns and makes booking effortless is how searches become appointments.",
  audienceLabel: "clinics",
  orgLabel: "Clinic Name",
  source: "meta-ads-clinic",
  painPoints: [
    {
      title: "Patients can't find you",
      body: "Searches like 'dentist near me' or 'skin specialist in [city]' go to clinics with proper websites and local SEO. Without one, you don't exist in the moment of highest intent.",
    },
    {
      title: "Reception is the bottleneck",
      body: "Appointment requests only arrive when someone answers the phone. After-hours callers, often the most motivated patients, simply go elsewhere.",
    },
    {
      title: "Credibility decided in seconds",
      body: "Patients judge clinical quality by digital quality. An outdated or missing website quietly sends them to the competitor who looks the part.",
    },
  ],
  outcomes: [
    "Professional design that reflects the standard of care you provide",
    "Doctor profiles, specialities and timings presented the way patients evaluate",
    "Appointment requests captured 24/7, not just when reception answers",
    "Built to rank for local healthcare searches with proper SEO architecture",
    "WhatsApp integration for instant patient communication",
    "Fast on every phone: under a second, even on mobile data",
    "Patient information handled with a security-first mindset",
    "You own everything: domain, code, data. No platform lock-in",
  ],
  proofProject: getProject("triplipi")!,
  proofNote:
    "Recent work: Triplipi, a fast, editorial public platform where visitors browse, trust the brand and move to a booking. The same architecture turns clinic website visitors into booked appointments.",
  steps: [
    {
      title: "Free strategy call",
      body: "Thirty minutes about your clinic, your patient flow and your current online presence. Honest advice, whether or not we work together.",
    },
    {
      title: "Fixed scope & quote",
      body: "A written plan naming every page and feature, with a fixed price from ₹75,000. No hourly billing, no mid-project surprises.",
    },
    {
      title: "Launch in weeks",
      body: "Your website designed, built and live, typically within 3 to 6 weeks, with training so your staff can update timings and services themselves.",
    },
  ],
  faqs: [
    {
      q: "How much does a clinic website cost?",
      a: "Projects start at ₹75,000 for a complete custom website engineered for speed and local SEO. Clinics wanting online appointment booking or patient portals invest more. You'll get an exact fixed quote after the strategy call.",
    },
    {
      q: "Can patients book appointments through the website?",
      a: "Yes. Depending on your workflow, that can be a structured request form your reception confirms, or full online booking with time slots. We'll pick what fits how your clinic actually runs.",
    },
    {
      q: "How long until the website is live?",
      a: "Most clinic websites launch within 3–6 weeks of the first call, depending on how quickly content (doctor profiles, services, photos) comes together.",
    },
    {
      q: "Who will I be dealing with?",
      a: "Abhinav Saxena, the founder. The same person who designs and engineers your website. Direct communication from first call to launch and beyond.",
    },
    {
      q: "What is the free website audit?",
      a: "If you already have a website, I'll review its speed, Google visibility and appointment flow, and send you specific findings. Useful whether or not you hire me.",
    },
  ],
  formTitle: "Get more appointments from your website.",
};

export default function ClinicLandingPage() {
  return <LandingPage content={content} />;
}
