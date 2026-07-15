import { NextResponse } from "next/server";
import { traceRedirects, AuditError } from "@/lib/audit";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const limit = rateLimit(`redirects:${clientIp(request)}`, 15, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That is a lot of traces. Try again in a few minutes." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } }
    );
  }
  const url = new URL(request.url).searchParams.get("url")?.trim().slice(0, 300);
  if (!url) return NextResponse.json({ error: "Enter a website address." }, { status: 400 });
  try {
    return NextResponse.json(await traceRedirects(url));
  } catch (err) {
    if (err instanceof AuditError) return NextResponse.json({ error: err.message }, { status: 422 });
    return NextResponse.json({ error: "The trace failed unexpectedly. Try again." }, { status: 500 });
  }
}
