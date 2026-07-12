"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

const budgetsInr = ["₹75,000 – ₹1.5 lakh", "₹1.5 – ₹4 lakh", "₹4 – ₹10 lakh", "₹10 lakh+"];
const budgetsUsd = ["$2,000 – $5,000", "$5,000 – $12,000", "$12,000 – $25,000", "$25,000+"];

const inputCls =
  // text-base on mobile: 16px stops iOS Safari from zooming into focused fields
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";
const labelCls = "annotation mb-2 block";

const projectTypes = [
  "Business Website",
  "Web Application",
  "Mobile App",
  "LMS / Education Platform",
  "CRM / ERP / Dashboard",
  "E-Commerce",
  "AI Integration",
  "Something else",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  // Default to INR (home market); swap to USD after mount for non-India visitors.
  // The dropdown is collapsed, so there is no visible flash.
  const [budgets, setBudgets] = useState(budgetsInr);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (document.documentElement.dataset.region === "intl") {
        setBudgets(budgetsUsd);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact-page" }),
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
        className="flex flex-col items-center gap-4 py-16 text-center"
      >
        <CheckCircle2 className="size-12 text-accent" />
        <h3 className="font-display text-3xl uppercase">Message received.</h3>
        <p className="max-w-sm text-pretty text-muted">
          Abhinav will reply personally within one business day.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="c-name" className={labelCls}>
          Your Name *
        </label>
        <input id="c-name" name="name" required autoComplete="name" placeholder="Full name" className={inputCls} />
      </div>
      <div>
        <label htmlFor="c-email" className={labelCls}>
          Email *
        </label>
        <input id="c-email" name="email" required type="email" autoComplete="email" placeholder="you@example.com" className={inputCls} />
      </div>
      <div>
        <label htmlFor="c-phone" className={labelCls}>
          Phone / WhatsApp
        </label>
        <input id="c-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91" className={inputCls} />
      </div>
      <div>
        <label htmlFor="c-type" className={labelCls}>
          Project Type *
        </label>
        <select id="c-type" name="projectType" required className={inputCls} defaultValue="">
          <option value="" disabled>
            What do you need?
          </option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className={labelCls}>
          About Your Project *
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={5}
          placeholder="What does your business do, and what problem should this project solve?"
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-budget" className={labelCls}>
          Approximate Budget
        </label>
        <select id="c-budget" name="budget" className={inputCls} defaultValue="">
          <option value="">Prefer to discuss</option>
          {budgets.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex w-full items-center justify-center gap-3 border border-foreground bg-foreground px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-background transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#efeae0] disabled:opacity-60 sm:col-span-2"
      >
        {status === "sending" && <Loader2 className="size-4 animate-spin" />}
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400 sm:col-span-2">
          Something went wrong. Please try again, or email directly.
        </p>
      )}
    </form>
  );
}
