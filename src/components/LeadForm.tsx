"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { trackLead } from "@/lib/fbq";
import { getAttribution } from "@/lib/attribution";

const inputCls =
  // text-base on mobile: 16px stops iOS Safari from zooming into focused fields
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

const labelCls = "annotation mb-2 block";

/** A select option whose submitted value can differ from its visible label. */
export type LeadOption = string | { value: string; label: string };

/**
 * Visible copy for the form. Translated pages (zh-HK / zh-TW) pass their own;
 * option *values* stay English so every lead reads the same in /admin.
 */
export type LeadFormLabels = {
  name: string;
  namePlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  email: string;
  website: string;
  websiteOptional: string;
  budget: string;
  budgetPlaceholder: string;
  timeline: string;
  timelinePlaceholder: string;
  sending: string;
  error: string;
  privacy: string;
  successTitle: string;
  successBody: string;
};

const englishLabels: LeadFormLabels = {
  name: "Your Name",
  namePlaceholder: "Full name",
  phone: "Phone / WhatsApp",
  phonePlaceholder: "+91",
  email: "Email",
  website: "Current Website",
  websiteOptional: "(if any)",
  budget: "Budget Range",
  budgetPlaceholder: "Select budget",
  timeline: "Timeline",
  timelinePlaceholder: "Select timeline",
  sending: "Sending…",
  error: "Something went wrong. Please try again, or WhatsApp directly.",
  privacy: "No spam, no obligation. Your details are used only to respond to this enquiry.",
  successTitle: "Request received.",
  successBody:
    "You'll hear back from Abhinav personally within one business day, usually much sooner.",
};

const optionValue = (o: LeadOption) => (typeof o === "string" ? o : o.value);
const optionLabel = (o: LeadOption) => (typeof o === "string" ? o : o.label);

export function LeadForm({
  orgLabel = "Company Name",
  source = "website",
  budgets = ["₹75,000 – ₹1.5 lakh", "₹1.5 – ₹4 lakh", "₹4 – ₹10 lakh", "₹10 lakh+", "Not sure yet"],
  timelines = ["As soon as possible", "Within 1 month", "1–3 months", "Just exploring"],
  submitLabel = "Book Free Strategy Call",
  labels,
}: {
  orgLabel?: string;
  source?: string;
  budgets?: LeadOption[];
  timelines?: LeadOption[];
  submitLabel?: string;
  labels?: Partial<LeadFormLabels>;
}) {
  const t = { ...englishLabels, ...labels };
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source, attribution: getAttribution() }),
      });
      if (!res.ok) throw new Error("failed");
      trackLead(source);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-16 text-center"
      >
        <CheckCircle2 className="size-12 text-accent" />
        <h3 className="font-display text-3xl">{t.successTitle}</h3>
        <p className="max-w-sm text-pretty text-muted">{t.successBody}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="lead-name" className={labelCls}>
          {t.name} *
        </label>
        <input
          id="lead-name"
          name="name"
          required
          autoComplete="name"
          placeholder={t.namePlaceholder}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="lead-phone" className={labelCls}>
          {t.phone} *
        </label>
        <input
          id="lead-phone"
          name="phone"
          required
          type="tel"
          autoComplete="tel"
          placeholder={t.phonePlaceholder}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="lead-email" className={labelCls}>
          {t.email} *
        </label>
        <input
          id="lead-email"
          name="email"
          required
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="lead-org" className={labelCls}>
          {orgLabel} *
        </label>
        <input
          id="lead-org"
          name="organization"
          required
          autoComplete="organization"
          placeholder={orgLabel}
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="lead-website" className={labelCls}>
          {t.website} <span className="text-faint">{t.websiteOptional}</span>
        </label>
        <input
          id="lead-website"
          name="website"
          type="text"
          inputMode="url"
          placeholder="https://"
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="lead-budget" className={labelCls}>
          {t.budget} *
        </label>
        <select id="lead-budget" name="budget" required className={inputCls} defaultValue="">
          <option value="" disabled>
            {t.budgetPlaceholder}
          </option>
          {budgets.map((b) => (
            <option key={optionValue(b)} value={optionValue(b)}>
              {optionLabel(b)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lead-timeline" className={labelCls}>
          {t.timeline} *
        </label>
        <select id="lead-timeline" name="timeline" required className={inputCls} defaultValue="">
          <option value="" disabled>
            {t.timelinePlaceholder}
          </option>
          {timelines.map((o) => (
            <option key={optionValue(o)} value={optionValue(o)}>
              {optionLabel(o)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex w-full items-center justify-center gap-3 border border-foreground bg-foreground px-8 py-4 font-mono text-xs uppercase tracking-[0.14em] text-background transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-contrast disabled:opacity-60 sm:col-span-2"
      >
        {status === "sending" && <Loader2 className="size-4 animate-spin" />}
        {status === "sending" ? t.sending : submitLabel}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-400 sm:col-span-2">
          {t.error}
        </p>
      )}
      <p className="text-center text-xs text-faint sm:col-span-2">
        {t.privacy}
      </p>
    </form>
  );
}
