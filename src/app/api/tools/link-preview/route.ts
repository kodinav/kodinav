import { NextResponse } from "next/server";
import { fetchLinkPreview, AuditError } from "@/lib/audit";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Free link preview check. Same guard rails as the audit scan. */
export async function GET(request: Request) {
  const limit = rateLimit(`preview:${clientIp(request)}`, 10, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That is a lot of checks. Try again in a few minutes." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } }
    );
  }

  const url = new URL(request.url).searchParams.get("url")?.trim().slice(0, 300);
  if (!url) {
    return NextResponse.json({ error: "Enter a link to check." }, { status: 400 });
  }

  try {
    return NextResponse.json(await fetchLinkPreview(url));
  } catch (err) {
    if (err instanceof AuditError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    return NextResponse.json(
      { error: "The check failed unexpectedly. Try again in a moment." },
      { status: 500 }
    );
  }
}
