#!/usr/bin/env node
/**
 * Prospect email harvester.
 *
 * Give it business website URLs (ones YOU picked as good prospects, e.g. from
 * Google Maps). It visits each site's homepage + common contact pages and
 * extracts the publicly listed contact email(s), producing a prospects CSV.
 *
 * This automates copying what the business itself publishes for contact.
 * Use the result for PERSONALISED one-to-one outreach, not bulk blasts:
 *  - max ~20-30 cold emails/day, each with one specific true observation
 *  - never load these into an email-marketing tool (opted-in lists only)
 *
 * Usage:
 *   node scripts/harvest-emails.mjs urls.txt > prospects.csv
 *   (urls.txt = one website URL per line, lines starting with # ignored)
 */

import { readFileSync } from "node:fs";

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const SKIP = /\.(png|jpg|jpeg|gif|webp|svg|css|js)$|@(example|sentry|wixpress|schema)\./i;
const CONTACT_PATHS = ["", "/contact", "/contact-us", "/about", "/about-us"];

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/harvest-emails.mjs urls.txt");
  process.exit(1);
}

const urls = readFileSync(file, "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));

async function fetchText(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
      headers: { "User-Agent": "Mozilla/5.0 (contact-page reader)" },
    });
    if (!res.ok) return "";
    const type = res.headers.get("content-type") || "";
    if (!type.includes("text/html")) return "";
    return await res.text();
  } catch {
    return "";
  }
}

console.log("website,emails_found,phone_hint");
for (const raw of urls) {
  const base = raw.startsWith("http") ? raw : `https://${raw}`;
  const origin = new URL(base).origin;
  const emails = new Set();
  let phone = "";

  for (const path of CONTACT_PATHS) {
    const html = await fetchText(origin + path);
    if (!html) continue;
    for (const m of html.match(EMAIL_RE) || []) {
      if (!SKIP.test(m)) emails.add(m.toLowerCase());
    }
    if (!phone) {
      const p = html.match(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/);
      if (p) phone = p[0].replace(/\s+/g, " ");
    }
    if (emails.size >= 3) break;
  }

  console.log(
    `${origin},"${[...emails].slice(0, 3).join("; ")}","${phone}"`
  );
}
