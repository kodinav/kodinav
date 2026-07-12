"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";
const labelCls = "annotation mb-2 block";

const concerns = [
  "It's too slow",
  "It doesn't rank on Google",
  "It looks outdated",
  "It doesn't get enquiries",
  "It breaks on mobile",
  "Not sure — that's why I want the audit",
];

export function AuditForm() {
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
        body: JSON.stringify({ ...data, source: "website-audit" }),
      });
      if (!res.ok) throw new Error("failed");
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
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <CheckCircle2 className="size-12 text-accent" />
        <h3 className="font-display text-3xl uppercase">Request received.</h3>
        <p className="max-w-sm text-pretty text-muted">
          You&apos;ll get a secure payment link and next steps by email within a
          few hours. Your audit report and walkthrough follow within 3 business
          days of payment.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="a-name" className={labelCls}>
          Your Name *
        </label>
        <input id="a-name" name="name" required autoComplete="name" placeholder="Full name" className={inputCls} />
      </div>
      <div>
        <label htmlFor="a-email" className={labelCls}>
          Email *
        </label>
        <input id="a-email" name="email" required type="email" autoComplete="email" placeholder="you@example.com" className={inputCls} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="a-website" className={labelCls}>
          Website to audit *
        </label>
        <input
          id="a-website"
          name="website"
          required
          type="text"
          inputMode="url"
          placeholder="https://yourwebsite.com"
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="a-concern" className={labelCls}>
          Biggest concern *
        </label>
        <select id="a-concern" name="message" required className={inputCls} defaultValue="">
          <option value="" disabled>
            What worries you most about it?
          </option>
          {concerns.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex min-h-13 w-full items-center justify-center gap-2 border border-accent bg-accent px-8 py-4 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground hover:bg-foreground hover:text-background active:scale-[0.98] disabled:opacity-60 sm:col-span-2"
      >
        {status === "sending" && <Loader2 className="size-4 animate-spin" />}
        {status === "sending" ? "Sending…" : "Order My Audit →"}
      </button>
      {status === "error" && (
        <p className="text-sm text-accent sm:col-span-2">
          Something went wrong. Please try again, or email us directly.
        </p>
      )}
      <p className="text-center text-xs text-faint sm:col-span-2">
        No account needed. You&apos;ll receive a secure payment link by email
        before any work begins.
      </p>
    </form>
  );
}
