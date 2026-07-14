import { NextResponse } from "next/server";
import { auditSite, AuditError } from "@/lib/audit";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Free instant scan. No email required — the results are the marketing. */
export async function POST(request: Request) {
  const limit = rateLimit(`scan:${clientIp(request)}`, 10, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That is a lot of scans. Try again in a few minutes." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } }
    );
  }

  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url.trim().slice(0, 300) : "";
  if (!url) {
    return NextResponse.json({ error: "Enter a website address." }, { status: 400 });
  }

  try {
    const result = await auditSite(url);
    // Every scan is an intent signal, even the ones that never leave an email.
    console.log(
      `[audit] ${result.finalUrl} → ${result.overall}/100 (${result.findings.filter((f) => f.severity === "critical").length} critical)`
    );
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AuditError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error("Audit scan failed:", err);
    return NextResponse.json(
      { error: "The scan failed unexpectedly. Please try again." },
      { status: 500 }
    );
  }
}
