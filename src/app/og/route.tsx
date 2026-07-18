import { ImageResponse } from "next/og";
import { site } from "@/data/site";

/**
 * Branded Open Graph card, parameterised by ?title= and ?tag=. Matches the
 * "Meridian" site language: warm paper, ink frame, cobalt accent mark.
 * Referenced via `ogImage()` in src/lib/og.ts.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || site.tagline).slice(0, 120);
  const tag = (searchParams.get("tag") || site.tagline).slice(0, 40);

  // Longer titles step down in size so they stay inside the frame
  const fontSize = title.length > 70 ? 54 : title.length > 40 ? 64 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f4f3ee",
          color: "#16171b",
          fontFamily: "sans-serif",
          border: "14px solid #16171b",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span style={{ fontWeight: 700 }}>Kodinav</span>
          <span style={{ color: "#52545b" }}>{tag}</span>
          <span
            style={{
              width: 20,
              height: 20,
              background: "#1b3ad6",
              display: "flex",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize,
            fontWeight: 800,
            letterSpacing: -1,
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#52545b",
          }}
        >
          <span>kodinav.com</span>
          <span>Founded by {site.founder}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Deterministic per query string — cache hard at the CDN
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable",
      },
    }
  );
}
