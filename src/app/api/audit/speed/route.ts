import { NextResponse } from "next/server";
import { fetchSpeed, AuditError } from "@/lib/audit";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Google's own mobile speed score, fetched on its own so a slow or failing
 * Lighthouse run degrades to "unavailable" instead of breaking the scan.
 */
export async function GET(request: Request) {
  const limit = rateLimit(`speed:${clientIp(request)}`, 10, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limited." }, { status: 429 });
  }

  const url = new URL(request.url).searchParams.get("url")?.trim().slice(0, 300);
  if (!url) {
    return NextResponse.json({ error: "Missing url." }, { status: 400 });
  }

  try {
    return NextResponse.json(await fetchSpeed(url));
  } catch (err) {
    if (err instanceof AuditError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    // PSI is flaky and rate-limited without a key. A miss is not an error the
    // visitor should ever see: the scan already stands on its own.
    console.warn("PageSpeed lookup unavailable:", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
