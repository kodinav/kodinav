"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Loader2,
  Minus,
  Search,
} from "lucide-react";
import { trackLead } from "@/lib/fbq";
import { site } from "@/data/site";
import {
  CATEGORIES,
  CATEGORY_META,
  SEVERITY_LABEL,
  scoreBand,
  type AuditResult,
  type Category,
  type Finding,
  type Severity,
  type SpeedResult,
} from "@/lib/auditTypes";

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";
const labelCls = "annotation mb-2 block";
const btnPrimary =
  "inline-flex min-h-13 items-center justify-center gap-2 border border-accent bg-accent px-8 py-4 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground hover:bg-foreground hover:text-background active:scale-[0.98] disabled:opacity-60";

/* The status channel. Colour never carries meaning alone: every severity
   ships an icon, a word, and a distinct fill (solid / hatched / solid-accent). */
const SEVERITY_ICON: Record<Severity, typeof AlertTriangle> = {
  critical: AlertTriangle,
  warning: Minus,
  pass: Check,
};

function fillClass(severity: Severity) {
  if (severity === "critical") return "bg-accent";
  if (severity === "warning") return "hatch";
  return "bg-foreground";
}

const SCAN_STEPS = [
  "Fetching the page",
  "Measuring server response",
  "Checking the mobile viewport",
  "Reading title and search description",
  "Looking for structured data",
  "Checking robots.txt and sitemap",
  "Testing HTTPS and mixed content",
  "Looking for a way to contact you",
  "Scoring",
];

/** Meter: one ratio against a fixed limit of 100. Not a chart. */
function Meter({ category, score }: { category: Category; score: number }) {
  const meta = CATEGORY_META[category];
  const band = scoreBand(score);

  return (
    <div className="flex flex-col gap-3 bg-background p-6">
      <div className="flex items-baseline justify-between gap-3">
        <span className="annotation">{meta.label}</span>
        <span className="font-mono text-sm text-foreground">{score}</span>
      </div>

      <div
        className="h-2 w-full border border-line-strong"
        role="img"
        aria-label={`${meta.label}: ${score} out of 100. ${band.word}.`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full ${fillClass(band.severity)}`}
        />
      </div>

      <p className="text-xs leading-relaxed text-muted">
        <span className="text-foreground">{band.word}.</span> {meta.blurb}
      </p>
    </div>
  );
}

function FindingRow({ finding }: { finding: Finding }) {
  const Icon = SEVERITY_ICON[finding.severity];
  return (
    <div className="flex gap-4 border-t border-line py-5 first:border-t-0">
      <span
        aria-hidden
        className={`mt-0.5 flex size-5 flex-none items-center justify-center border border-line-strong ${
          finding.severity === "critical" ? "bg-accent" : finding.severity === "warning" ? "hatch" : ""
        }`}
      >
        <Icon
          className={`size-3 ${
            finding.severity === "critical" ? "text-[#efeae0]" : "text-foreground"
          }`}
          strokeWidth={3}
        />
      </span>
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h4 className="font-display text-lg leading-none uppercase">{finding.title}</h4>
          <span className="annotation">{SEVERITY_LABEL[finding.severity]}</span>
        </div>
        <p className="text-sm leading-relaxed text-muted">{finding.detail}</p>
        {finding.fix && (
          <p className="mt-1 border-l-2 border-accent pl-3 text-sm leading-relaxed text-foreground">
            {finding.fix}
          </p>
        )}
      </div>
    </div>
  );
}

/** Google's number, folded in when it lands. Never blocks the result. */
function SpeedPanel({ speed, loading }: { speed: SpeedResult | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 border border-line p-6">
        <Loader2 className="size-4 animate-spin text-accent" />
        <p className="annotation">Asking Google for its own mobile speed score…</p>
      </div>
    );
  }
  if (!speed || speed.performance === null) return null;

  const band = scoreBand(speed.performance);
  const lcp = speed.lcpMs ? (speed.lcpMs / 1000).toFixed(1) : null;

  return (
    <div className="border border-line-strong p-6 sm:p-8">
      <p className="annotation mb-5">Google PageSpeed · real mobile device</p>
      <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
        <div>
          <p className="font-display text-6xl leading-none">{speed.performance}</p>
          <p className="annotation mt-2">Speed score / 100</p>
        </div>
        {lcp && (
          <div>
            <p className="font-display text-6xl leading-none">{lcp}s</p>
            <p className="annotation mt-2">Until the page looks loaded</p>
          </div>
        )}
      </div>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
        <span className="text-foreground">{band.word}.</span>{" "}
        {lcp && Number(lcp) > 2.5
          ? `Most people give up on a page that takes more than three seconds. Yours takes ${lcp}.`
          : "This is Google's own measurement, taken on a simulated mid-range phone on 4G."}
      </p>
    </div>
  );
}

function ReportForm({ result }: { result: AuditResult }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const criticals = result.findings.filter((f) => f.severity === "critical").length;
  const warnings = result.findings.filter((f) => f.severity === "warning").length;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "free-audit",
          website: result.finalUrl,
          message: `Free scan: ${result.overall}/100 — ${criticals} critical, ${warnings} to fix. Top issue: ${result.headline}`,
        }),
      });
      if (!res.ok) throw new Error("failed");
      trackLead("free-audit");
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
        <h3 className="font-display text-3xl uppercase">On its way.</h3>
        <p className="max-w-md text-pretty text-muted">
          I will send the written breakdown, in order of what to fix first, within
          a few hours. It comes from me, not a robot, and there is nothing to buy
          at the end of it.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="fa-name" className={labelCls}>
          Your name *
        </label>
        <input
          id="fa-name"
          name="name"
          required
          autoComplete="name"
          placeholder="Full name"
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="fa-email" className={labelCls}>
          Email *
        </label>
        <input
          id="fa-email"
          name="email"
          required
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputCls}
        />
      </div>
      <button type="submit" disabled={status === "sending"} className={`${btnPrimary} sm:col-span-2`}>
        {status === "sending" && <Loader2 className="size-4 animate-spin" />}
        {status === "sending" ? "Sending…" : "Send Me The Written Breakdown →"}
      </button>
      {status === "error" && (
        <p className="text-sm text-accent sm:col-span-2">
          Something went wrong. Please{" "}
          <a href={site.whatsapp} className="underline" target="_blank" rel="noopener noreferrer">
            WhatsApp me
          </a>{" "}
          instead.
        </p>
      )}
      <p className="text-center text-xs text-faint sm:col-span-2">
        One email from a real person. No list, no sequence, no newsletter.
      </p>
    </form>
  );
}

export function AuditScanner() {
  const [status, setStatus] = useState<"idle" | "scanning" | "done">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [speed, setSpeed] = useState<SpeedResult | null>(null);
  const [speedLoading, setSpeedLoading] = useState(false);
  const [step, setStep] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Walk the readout while the scan runs. Cosmetic, but the checks named are
  // the checks actually running, so it is not a fake progress bar.
  useEffect(() => {
    if (status !== "scanning") return;
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1)),
      420
    );
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === "done" && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  async function onScan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = String(new FormData(e.currentTarget).get("url") ?? "").trim();
    if (!url) return;

    setStatus("scanning");
    setStep(0);
    setError("");
    setResult(null);
    setSpeed(null);

    try {
      const res = await fetch("/api/audit/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "The scan failed. Please try again.");
        setStatus("idle");
        return;
      }
      setResult(data as AuditResult);
      setStatus("done");

      // Google's lab run is slow and often unavailable. Fire and forget.
      setSpeedLoading(true);
      fetch(`/api/audit/speed?url=${encodeURIComponent((data as AuditResult).finalUrl)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((s) => setSpeed(s as SpeedResult | null))
        .catch(() => setSpeed(null))
        .finally(() => setSpeedLoading(false));
    } catch {
      setError("Could not run the scan. Check your connection and try again.");
      setStatus("idle");
    }
  }

  /* ---------- The form ---------- */

  if (status !== "done" || !result) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={onScan} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="audit-url" className="sr-only">
            Your website address
          </label>
          <input
            id="audit-url"
            name="url"
            required
            type="text"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            disabled={status === "scanning"}
            placeholder="yourwebsite.com"
            className="min-h-13 w-full border border-line-strong bg-background px-5 py-4 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent disabled:opacity-60"
          />
          <button type="submit" disabled={status === "scanning"} className={`${btnPrimary} flex-none`}>
            {status === "scanning" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {status === "scanning" ? "Scanning…" : "Scan My Site"}
          </button>
        </form>

        {status === "scanning" && (
          <div className="mt-8 border border-line p-6 text-left">
            <ul className="flex flex-col gap-2">
              {SCAN_STEPS.slice(0, step + 1).map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="annotation flex items-center gap-3 text-foreground"
                >
                  {i < step ? (
                    <Check className="size-3 text-accent" strokeWidth={3} />
                  ) : (
                    <span className="crosshair text-accent" />
                  )}
                  {s}
                  {i === step && <span className="animate-blink">_</span>}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <p className="mt-6 border border-accent p-4 text-sm leading-relaxed text-accent">
            {error}
          </p>
        )}

        {status === "idle" && (
          <p className="annotation mt-6 text-center">
            Free · No email required to see the result · About 10 seconds
          </p>
        )}
      </div>
    );
  }

  /* ---------- The result ---------- */

  const band = scoreBand(result.overall);
  const problems = result.findings.filter((f) => f.severity !== "pass");
  const passes = result.findings.filter((f) => f.severity === "pass");
  const criticals = problems.filter((f) => f.severity === "critical");
  const host = (() => {
    try {
      return new URL(result.finalUrl).hostname.replace(/^www\./, "");
    } catch {
      return result.finalUrl;
    }
  })();

  return (
    <div ref={resultsRef} className="scroll-mt-24 text-left">
      {/* Hero figure — the one number this page leads with */}
      <div className="flex flex-col gap-8 border border-line-strong p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <p className="annotation mb-4">Report for {host}</p>
          <div className="flex items-end gap-4">
            <p className="font-display text-7xl leading-none sm:text-8xl">{result.overall}</p>
            <p className="annotation mb-2">out of 100</p>
          </div>
          <p className="mt-4 font-display text-2xl uppercase leading-none text-accent">
            {band.word}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <p className="annotation">
            {criticals.length} critical · {problems.length - criticals.length} worth fixing ·{" "}
            {passes.length} passed
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setResult(null);
              setError("");
            }}
            className="inline-flex items-center gap-2 border border-line-strong px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowLeft className="size-3" />
            Scan another site
          </button>
        </div>
      </div>

      {/* The single most damning true sentence */}
      <div className="ink bg-noise relative overflow-hidden mt-4 p-7 sm:p-10">
        <p className="annotation mb-5">The one thing to fix first</p>
        <p className="font-serif text-2xl italic leading-snug text-pretty sm:text-3xl">
          {result.headline}
        </p>
      </div>

      {/* Google's number */}
      <div className="mt-4">
        <SpeedPanel speed={speed} loading={speedLoading} />
      </div>

      {/* KPI row of meters */}
      <div className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((c) => (
          <Meter key={c} category={c} score={result.scores[c]} />
        ))}
      </div>
      <p className="annotation mt-3">
        Each score starts at 100. A critical issue costs 30, a smaller one costs 12.
      </p>

      {/* Findings */}
      {problems.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display text-3xl uppercase sm:text-4xl">
            What is <span className="text-gradient">wrong</span>
          </h3>
          <div className="mt-6 border border-line px-6 sm:px-8">
            {problems.map((f) => (
              <FindingRow key={f.id} finding={f} />
            ))}
          </div>
        </div>
      )}

      {passes.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-2xl uppercase">What already works</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {passes.map((f) => (
              <li key={f.id} className="flex items-start gap-3 text-sm text-muted">
                <Check className="mt-0.5 size-4 flex-none text-accent" strokeWidth={3} />
                <span>
                  <span className="text-foreground">{f.title}.</span> {f.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lead capture */}
      <div className="glass mt-12 p-7 sm:p-10">
        <p className="annotation mb-4">Free, and that is the whole offer</p>
        <h3 className="font-display text-3xl uppercase leading-none sm:text-4xl">
          Want this written up{" "}
          <span className="text-gradient">properly</span>?
        </h3>
        <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted">
          This scan is automated, so it only sees what a machine can see. I will go
          through {host} by hand and send you a short written breakdown: what is
          actually costing you enquiries, in the order I would fix it, in plain
          language. No charge, no call required.
        </p>
        <div className="mt-8">
          <ReportForm result={result} />
        </div>
      </div>

      {/* Ladder to the paid work */}
      <div className="mt-6 flex flex-col gap-4 border border-line p-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted">
          Want the deep version, with a walkthrough call?{" "}
          <span className="text-foreground">
            The paid audit goes far past what a scanner can reach.
          </span>
        </p>
        <Link
          href="/website-audit"
          className="inline-flex flex-none items-center justify-center gap-2 border border-line-strong px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          See the paid audit →
        </Link>
      </div>
    </div>
  );
}
