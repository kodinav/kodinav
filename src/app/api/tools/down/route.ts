import { NextResponse } from "next/server";
import { traceRedirects, AuditError } from "@/lib/audit";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** "Is it down for everyone, or just me?" — answered from this server. */
export async function GET(request: Request) {
  const limit = rateLimit(`down:${clientIp(request)}`, 15, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That is a lot of checks. Try again in a few minutes." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } }
    );
  }
  const url = new URL(request.url).searchParams.get("url")?.trim().slice(0, 300);
  if (!url) return NextResponse.json({ error: "Enter a website address." }, { status: 400 });
  try {
    const trace = await traceRedirects(url);
    return NextResponse.json({
      up: trace.finalStatus < 400,
      status: trace.finalStatus,
      finalUrl: trace.finalUrl,
      ms: trace.totalMs,
    });
  } catch (err) {
    if (err instanceof AuditError) {
      // Unreachable is a legitimate answer here, not an error state.
      return NextResponse.json({ up: false, status: null, finalUrl: null, ms: null, reason: err.message });
    }
    return NextResponse.json({ error: "The check failed unexpectedly. Try again." }, { status: 500 });
  }
}
