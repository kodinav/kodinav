import { NextResponse } from "next/server";
import { checkPageLinks, AuditError } from "@/lib/audit";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Each run probes up to 40 links, so the per-IP allowance is tighter here.
export async function GET(request: Request) {
  const limit = rateLimit(`brokenlinks:${clientIp(request)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That is a lot of scans. Try again in a few minutes." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } }
    );
  }
  const url = new URL(request.url).searchParams.get("url")?.trim().slice(0, 300);
  if (!url) return NextResponse.json({ error: "Enter a website address." }, { status: 400 });
  try {
    return NextResponse.json(await checkPageLinks(url));
  } catch (err) {
    if (err instanceof AuditError) return NextResponse.json({ error: err.message }, { status: 422 });
    return NextResponse.json({ error: "The check failed unexpectedly. Try again." }, { status: 500 });
  }
}
