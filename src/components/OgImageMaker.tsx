"use client";

import { useEffect, useRef, useState } from "react";

/**
 * OG share-image maker — draws a 1200×630 card on a canvas in the browser.
 * Companion to the link preview checker: that tool diagnoses the missing
 * og:image, this one produces it.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";
const labelCls = "annotation mb-2 block";

const THEMES = [
  { id: "paper", label: "Paper", bg: "#efeae0", fg: "#16140f", accent: "#ff4400" },
  { id: "ink", label: "Ink", bg: "#16140f", fg: "#efeae0", accent: "#ff4400" },
  { id: "custom", label: "Custom", bg: "#ffffff", fg: "#111111", accent: "#2563eb" },
] as const;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const trial = line ? `${line} ${w}` : w;
    if (ctx.measureText(trial).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = trial;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

export function OgImageMaker() {
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [domain, setDomain] = useState("");
  const [theme, setTheme] = useState<(typeof THEMES)[number]["id"]>("paper");
  const [bg, setBg] = useState("#ffffff");
  const [fg, setFg] = useState("#111111");
  const [accent, setAccent] = useState("#2563eb");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState("");

  const t = THEMES.find((x) => x.id === theme)!;
  const colors = theme === "custom" ? { bg, fg, accent } : t;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, 1200, 630);
    ctx.strokeStyle = colors.fg;
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, 1184, 614);

    // top row
    ctx.fillStyle = colors.fg;
    ctx.font = "700 26px Arial, sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText((brand || "Your Brand").toUpperCase(), 72, 64);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(1108, 64, 22, 22);

    // headline
    ctx.fillStyle = colors.fg;
    const headline = (title || "Your headline goes here").toUpperCase();
    let size = 84;
    ctx.font = `800 ${size}px Arial, sans-serif`;
    let lines = wrap(ctx, headline, 1056);
    while (lines.length > 3 && size > 48) {
      size -= 8;
      ctx.font = `800 ${size}px Arial, sans-serif`;
      lines = wrap(ctx, headline, 1056);
    }
    const lineH = size * 1.08;
    const startY = 315 - (lines.length * lineH) / 2;
    lines.forEach((l, i) => ctx.fillText(l, 72, startY + i * lineH));

    // bottom row
    ctx.font = "24px Arial, sans-serif";
    ctx.fillStyle = colors.fg;
    ctx.globalAlpha = 0.7;
    ctx.fillText((domain || "yourwebsite.com").toUpperCase(), 72, 540);
    ctx.globalAlpha = 1;

    setDataUrl(canvas.toDataURL("image/png"));
  }, [title, brand, domain, colors.bg, colors.fg, colors.accent]);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="og-title" className={labelCls}>Headline</label>
          <textarea id="og-title" rows={2} maxLength={120} className={`${inputCls} resize-y`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The headline people see when your link is shared" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="og-brand" className={labelCls}>Brand name</label>
            <input id="og-brand" className={inputCls} value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Sunrise Dental" />
          </div>
          <div>
            <label htmlFor="og-domain" className={labelCls}>Domain</label>
            <input id="og-domain" className={inputCls} value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="sunrisedental.com" />
          </div>
        </div>
        <fieldset>
          <legend className={labelCls}>Theme</legend>
          <div className="flex flex-wrap gap-2.5">
            {THEMES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={theme === x.id}
                onClick={() => setTheme(x.id)}
                className={`border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                  theme === x.id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
          {theme === "custom" && (
            <div className="mt-4 flex flex-wrap gap-5">
              {(
                [
                  ["Background", bg, setBg],
                  ["Text", fg, setFg],
                  ["Accent", accent, setAccent],
                ] as const
              ).map(([label, val, set]) => (
                <label key={label} className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="color"
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    className="h-8 w-10 cursor-pointer border border-line-strong bg-transparent"
                  />
                  {label}
                </label>
              ))}
            </div>
          )}
        </fieldset>
      </div>

      <div className="ink relative h-fit self-start p-7 sm:p-8">
        <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
        <p className="annotation mb-4">1200 × 630 — the standard every platform crops to</p>
        <canvas
          ref={canvasRef}
          width={1200}
          height={630}
          className="w-full border border-line-strong"
          aria-label="Preview of your share image"
        />
        {dataUrl && (
          <a
            href={dataUrl}
            download="og-image.png"
            className="mt-5 inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5"
          >
            Download PNG →
          </a>
        )}
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Upload it to your site, then point your og:image tag at its absolute
          URL. Check the result with the link preview checker. Drawn in your
          browser; nothing is stored.
        </p>
      </div>
    </div>
  );
}
