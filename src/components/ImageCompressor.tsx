"use client";

import { useState } from "react";
import { zipSync } from "fflate";

/**
 * Client-side image compressor v2: quality, format and size are the
 * visitor's choice, with a one-click ZIP of everything. Photos never
 * leave the device — the honest edge over every upload-based competitor.
 */

type Item = {
  name: string;
  beforeBytes: number;
  afterBytes: number;
  blob: Blob;
  url: string;
  outName: string;
};

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-accent sm:text-sm";
const labelCls = "annotation mb-2 block";

function fmtKb(n: number) {
  return n >= 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

async function compress(
  file: File,
  maxDim: number,
  format: "webp" | "jpeg",
  quality: number
): Promise<Item | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = maxDim === 0 ? 1 : Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    if (format === "jpeg") {
      // JPEG has no alpha — flatten onto white instead of black
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, `image/${format}`, quality)
    );
    if (!blob) return null;
    const base = file.name.replace(/\.[^.]+$/, "");
    const ext = format === "webp" ? "webp" : "jpg";
    return {
      name: file.name,
      beforeBytes: file.size,
      afterBytes: blob.size,
      blob,
      url: URL.createObjectURL(blob),
      outName: `${base}-compressed.${ext}`,
    };
  } catch {
    return null;
  }
}

export function ImageCompressor() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(0);
  const [quality, setQuality] = useState(80);
  const [maxDim, setMaxDim] = useState(1920);
  const [format, setFormat] = useState<"webp" | "jpeg">("webp");

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || busy) return;
    setBusy(true);
    setFailed(0);
    const picked = [...files].slice(0, 20);
    const out: Item[] = [];
    let fails = 0;
    for (const f of picked) {
      if (!f.type.startsWith("image/")) {
        fails++;
        continue;
      }
      const item = await compress(f, maxDim, format, quality / 100);
      if (item) out.push(item);
      else fails++;
    }
    setItems((prev) => [...out, ...prev]);
    setFailed(fails);
    setBusy(false);
  };

  const downloadAll = () => {
    const files: Record<string, Uint8Array> = {};
    const seen = new Set<string>();
    for (const i of items) {
      let name = i.outName;
      let n = 1;
      while (seen.has(name)) name = i.outName.replace(/(\.\w+)$/, `-${++n}$1`);
      seen.add(name);
      files[name] = new Uint8Array(0); // placeholder; filled below
    }
    // Read blobs then zip
    Promise.all(items.map((i) => i.blob.arrayBuffer())).then((buffers) => {
      const names = Object.keys(files);
      buffers.forEach((b, idx) => {
        files[names[idx]] = new Uint8Array(b);
      });
      const zipped = zipSync(files, { level: 0 }); // images are already compressed
      const blob = new Blob([zipped.buffer as ArrayBuffer], { type: "application/zip" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "compressed-images.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    });
  };

  const totalBefore = items.reduce((s, i) => s + i.beforeBytes, 0);
  const totalAfter = items.reduce((s, i) => s + i.afterBytes, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="ic-quality" className={labelCls}>Quality — {quality}%</label>
          <input
            id="ic-quality"
            type="range"
            min={40}
            max={95}
            step={5}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-[#175a3d]"
          />
          <p className="mt-1 text-xs text-faint">80% is invisible for photos on screens.</p>
        </div>
        <div>
          <label htmlFor="ic-dim" className={labelCls}>Longest side</label>
          <select id="ic-dim" className={inputCls} value={maxDim} onChange={(e) => setMaxDim(Number(e.target.value))}>
            <option value={1200}>1200 px — content images</option>
            <option value={1920}>1920 px — full-width web</option>
            <option value={2560}>2560 px — retina hero</option>
            <option value={0}>Original size — no resize</option>
          </select>
        </div>
        <div>
          <label htmlFor="ic-format" className={labelCls}>Format</label>
          <select id="ic-format" className={inputCls} value={format} onChange={(e) => setFormat(e.target.value as typeof format)}>
            <option value="webp">WebP — smallest, all modern browsers</option>
            <option value="jpeg">JPEG — for old software &amp; email</option>
          </select>
        </div>
      </div>

      <label
        className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-line-strong p-8 text-center transition-colors hover:border-accent"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-foreground">
          {busy ? "Compressing…" : "Drop images here, or tap to choose"}
        </span>
        <span className="text-xs text-faint">
          JPG, PNG, HEIC (where the browser supports it) — up to 20 at once.
          Everything happens on your device; nothing uploads, ever.
        </span>
        <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
      </label>

      {failed > 0 && (
        <p className="text-sm text-muted">
          {failed} file{failed > 1 ? "s" : ""} couldn&apos;t be read as an image and {failed > 1 ? "were" : "was"} skipped.
        </p>
      )}

      {items.length > 0 && (
        <div className="ink relative p-7 sm:p-8">
          <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
 <p className="font-display text-3xl sm:text-4xl">
              {fmtKb(totalBefore)} → {fmtKb(totalAfter)}
            </p>
            <div className="flex items-baseline gap-4">
              <p className="font-mono text-sm text-accent">
                −{Math.max(0, Math.round((1 - totalAfter / Math.max(1, totalBefore)) * 100))}%
              </p>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={downloadAll}
                  className="border border-accent bg-accent px-4 py-2 font-mono text-[0.625rem] tracking-[0.16em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5"
                >
                  Download all (.zip)
                </button>
              )}
            </div>
          </div>
          <ul className="mt-6 flex flex-col gap-3">
            {items.map((i) => (
              <li key={i.url} className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs text-foreground/90">{i.name}</p>
                  <p className="text-xs text-muted">
                    {fmtKb(i.beforeBytes)} → {fmtKb(i.afterBytes)}
                    {i.afterBytes < i.beforeBytes
                      ? ` (−${Math.round((1 - i.afterBytes / i.beforeBytes) * 100)}%)`
                      : " (already small — keep the original)"}
                  </p>
                </div>
                <a
                  href={i.url}
                  download={i.outName}
                  className="border border-accent bg-accent px-4 py-2 font-mono text-[0.625rem] tracking-[0.16em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            Settings apply to the next batch you drop. For print, keep your
            originals — this output is sized for the web.
          </p>
        </div>
      )}
    </div>
  );
}
