"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { trackLead } from "@/lib/fbq";

const inputCls =
  // text-base on mobile: 16px stops iOS Safari from zooming into focused fields
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

const labelCls = "annotation mb-2 block";

export function LeadForm({
  orgLabel = "Company Name",
  source = "website",
  budgets = ["₹75,000 – ₹1.5 lakh", "₹1.5 – ₹4 lakh", "₹4 – ₹10 lakh", "₹10 lakh+", "Not sure yet"],
  timelines = ["As soon as possible", "Within 1 month", "1–3 months", "Just exploring"],
  submitLabel = "Book Free Strategy Call",
}: {
  orgLabel?: string;
  source?: string;
  budgets?: string[];
  timelines?: string[];
  submitLabel?: string;
}) {
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
        body: JSON.stringify({ ...data, source }),
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
        <h3 className="font-display text-3xl uppercase">Request received.</h3>
        <p className="max-w-sm text-pretty text-muted">
          You&apos;ll hear back from Abhinav personally within one business day,
          usually much sooner.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="lead-name" className={labelCls}>
          Your Name *
        </label>
        <input
          id="lead-name"
          name="name"
          required
          autoComplete="name"
          placeholder="Full name"
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="lead-phone" className={labelCls}>
          Phone / WhatsApp *
        </label>
        <input
          id="lead-phone"
          name="phone"
          required
          type="tel"
          autoComplete="tel"
          placeholder="+91"
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="lead-email" className={labelCls}>
          Email *
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
          Current Website <span className="text-faint">(if any)</span>
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
          Budget Range *
        </label>
        <select id="lead-budget" name="budget" required className={inputCls} defaultValue="">
          <option value="" disabled>
            Select budget
          </option>
          {budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lead-timeline" className={labelCls}>
          Timeline *
        </label>
        <select id="lead-timeline" name="timeline" required className={inputCls} defaultValue="">
          <option value="" disabled>
            Select timeline
          </option>
          {timelines.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex w-full items-center justify-center gap-3 border border-foreground bg-foreground px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-background transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#efeae0] disabled:opacity-60 sm:col-span-2"
      >
        {status === "sending" && <Loader2 className="size-4 animate-spin" />}
        {status === "sending" ? "Sending…" : submitLabel}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-400 sm:col-span-2">
          Something went wrong. Please try again, or WhatsApp directly.
        </p>
      )}
      <p className="text-center text-xs text-faint sm:col-span-2">
        No spam, no obligation. Your details are used only to respond to this enquiry.
      </p>
    </form>
  );
}
