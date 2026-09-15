import { ImageResponse } from "next/og";
import { site } from "@/data/site";

/**
 * Branded Open Graph card, parameterised by ?title= and ?tag=. Matches the
 * "Meridian" site language: warm paper, ink frame, cobalt accent mark.
 * Referenced via `ogImage()` in src/lib/og.ts.
 */
const CJK = /[\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;

/**
 * The bundled OG font has no Chinese glyphs, so titles on the /zh-hk and
 * /zh-tw pages would render as empty boxes. For those, fetch a subset of
 * Noto Sans TC containing only the characters on the card (a few KB).
 * Google Fonts serves TrueType — which Satori can read — to clients that
 * don't advertise WOFF2 support. Any failure falls back to the default font.
 */
async function loadCjkFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@700&text=${encodeURIComponent(text)}`,
        { signal: AbortSignal.timeout(4000) }
      )
    ).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!src) return null;
    const font = await fetch(src[1], { signal: AbortSignal.timeout(4000) });
    return font.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || site.tagline).slice(0, 120);
  const tag = (searchParams.get("tag") || site.tagline).slice(0, 40);

  // The subset must cover every glyph on the card (Latin included), because
  // passing custom fonts can replace the bundled default font entirely.
  const cjkFont = CJK.test(`${title}${tag}`)
    ? await loadCjkFont(`${title}${tag}${site.name}kodinav.comFounded by ${site.founder}`)
    : null;

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
          fontFamily: cjkFont ? "sans-serif, Noto Sans TC" : "sans-serif",
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
      fonts: cjkFont ? [{ name: "Noto Sans TC", data: cjkFont, weight: 700, style: "normal" }] : undefined,
      headers: {
        // Deterministic per query string — cache hard at the CDN
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable",
      },
    }
  );
}
