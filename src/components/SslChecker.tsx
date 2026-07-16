"use client";

import { useState } from "react";
import Link from "next/link";
import { type SslInfo } from "@/lib/auditTypes";

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

export function SslChecker() {
  const [host, setHost] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [info, setInfo] = useState<SslInfo | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!host.trim() || state === "running") return;
    setState("running");
    setError("");
    try {
      const res = await fetch(`/api/tools/ssl?host=${encodeURIComponent(host.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed. Try again.");
      setInfo(data as SslInfo);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check failed. Try again.");
      setState("error");
    }
  };

  const expiringSoon = info && info.daysRemaining <= 21 && info.daysRemaining >= 0;
  const expired = info && info.daysRemaining < 0;

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          placeholder="yourwebsite.com"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          aria-label="Domain to check"
          className={inputCls}
        />
        <button
          type="submit"
          disabled={state === "running"}
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-accent bg-accent px-7 py-3.5 font-mono text-xs tracking-[0.14em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "running" ? "Checking…" : "Check certificate"}
        </button>
      </form>

      {state === "error" && <p className="text-sm text-accent">{error}</p>}

      {state === "done" && info && (
        <div className="ink relative p-7 sm:p-8">
          <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
 <p className="font-display text-4xl sm:text-5xl">
            {expired
              ? "Certificate expired"
              : !info.trusted
                ? "Not trusted"
                : expiringSoon
                  ? `Valid — ${info.daysRemaining} days left`
                  : "Valid & trusted"}
          </p>

          <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="annotation text-faint">Domain</dt>
              <dd className="font-mono text-xs text-foreground/90">{info.host}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="annotation text-faint">Issued by</dt>
              <dd className="font-mono text-xs text-foreground/90">{info.issuer ?? "Unknown"}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="annotation text-faint">Expires</dt>
              <dd className={`font-mono text-xs ${expired || expiringSoon ? "text-accent" : "text-foreground/90"}`}>
                {new Date(info.validTo).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                {" "}({info.daysRemaining} days)
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="annotation text-faint">Chain</dt>
              <dd className={`font-mono text-xs ${info.trusted ? "text-foreground/90" : "text-accent"}`}>
                {info.trusted ? "Trusted" : (info.trustError ?? "Failed verification")}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 text-sm leading-relaxed text-muted">
            {expired && (
              <p>
                Every browser is currently showing your visitors a full-screen
                security warning instead of your website. Renewing the
                certificate is the most urgent fix a site can have.
              </p>
            )}
            {!expired && !info.trusted && (
              <p>
                The certificate exists but browsers don&apos;t trust it —
                usually a self-signed certificate or an incomplete chain. Many
                visitors will see a warning and leave.
              </p>
            )}
            {!expired && info.trusted && expiringSoon && (
              <p>
                Renewal is due soon. Most modern hosting renews automatically —
                if yours doesn&apos;t, calendar it now; an expired certificate
                takes the whole site down for practical purposes.
              </p>
            )}
            {!expired && info.trusted && !expiringSoon && (
              <p>
                HTTPS is in order. Certificates from providers like
                Let&apos;s Encrypt renew roughly every 90 days — a healthy
                &ldquo;days left&rdquo; number here means automation is doing
                its job.
              </p>
            )}
          </div>

          {!expired && (
            <div className="mt-6 border-t border-line pt-5">
              <button
                type="button"
                onClick={() => {
                  const remind = new Date(new Date(info.validTo).getTime() - 14 * 86_400_000);
                  const d = remind.toISOString().slice(0, 10).replaceAll("-", "");
                  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
                  const ics = [
                    "BEGIN:VCALENDAR",
                    "VERSION:2.0",
                    "PRODID:-//Kodinav//SSL Checker//EN",
                    "BEGIN:VEVENT",
                    `UID:ssl-${info.host}-${d}@kodinav.com`,
                    `DTSTAMP:${stamp}`,
                    `DTSTART;VALUE=DATE:${d}`,
                    `SUMMARY:Renew SSL certificate for ${info.host}`,
                    `DESCRIPTION:Certificate expires ${new Date(info.validTo).toDateString()}. Check auto-renewal or renew manually. (Reminder created with kodinav.com/ssl-checker)`,
                    "END:VEVENT",
                    "END:VCALENDAR",
                  ].join("\r\n");
                  const a = document.createElement("a");
                  a.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
                  a.download = `renew-ssl-${info.host}.ics`;
                  a.click();
                }}
                className="border border-line-strong px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Add renewal reminder to my calendar (.ics)
              </button>
              <p className="mt-2 text-xs text-faint">
                Creates a calendar event 14 days before expiry — works with
                Google Calendar, Apple Calendar and Outlook.
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-line pt-5">
            <Link href="/free-website-audit" className="u-draw font-mono text-xs uppercase tracking-[0.14em] text-accent">
              Check everything else too — run the full free audit →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
