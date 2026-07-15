"use client";

import { useState } from "react";

/**
 * Client-side image compressor: canvas resize + WebP/JPEG re-encode.
 * Photos never leave the visitor's browser — that privacy fact is the
 * tool's honest edge over upload-based compressors.
 */

type Item = {
  name: string;
  beforeBytes: number;
  afterBytes: number;
  url: string;
  outName: string;
};

const MAX_DIM = 1920;
const QUALITY = 0.8;

function fmtKb(n: number) {
  return n >= 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

async function compress(file: File): Promise<Item | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY)
    );
    if (!blob) return null;
    const base = file.name.replace(/\.[^.]+$/, "");
    return {
      name: file.name,
      beforeBytes: file.size,
      afterBytes: blob.size,
      url: URL.createObjectURL(blob),
      outName: `${base}-compressed.webp`,
    };
  } catch {
    return null;
  }
}

export function ImageCompressor() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(0);

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
      const item = await compress(f);
      if (item) out.push(item);
      else fails++;
    }
    setItems((prev) => [...out, ...prev]);
    setFailed(fails);
    setBusy(false);
  };

  const totalBefore = items.reduce((s, i) => s + i.beforeBytes, 0);
  const totalAfter = items.reduce((s, i) => s + i.afterBytes, 0);

  return (
    <div className="flex flex-col gap-8">
      <label
        className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-line-strong p-8 text-center transition-colors hover:border-accent"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-foreground">
          {busy ? "Compressing…" : "Drop images here, or tap to choose"}
        </span>
        <span className="text-xs text-faint">
          JPG, PNG, HEIC (where the browser supports it) — up to 20 at once.
          Resized to max {MAX_DIM}px and re-encoded as WebP. Nothing uploads;
          it all happens on your device.
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => onFiles(e.target.files)}
        />
      </label>

      {failed > 0 && (
        <p className="text-sm text-muted">
          {failed} file{failed > 1 ? "s" : ""} couldn&apos;t be read as an image and{" "}
          {failed > 1 ? "were" : "was"} skipped.
        </p>
      )}

      {items.length > 0 && (
        <div className="ink relative p-7 sm:p-8">
          <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
            <p className="font-display text-3xl uppercase sm:text-4xl">
              {fmtKb(totalBefore)} → {fmtKb(totalAfter)}
            </p>
            <p className="font-mono text-sm text-accent">
              −{Math.max(0, Math.round((1 - totalAfter / Math.max(1, totalBefore)) * 100))}%
            </p>
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
                  className="border border-accent bg-accent px-4 py-2 font-mono text-[0.625rem] tracking-[0.16em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            WebP at quality {Math.round(QUALITY * 100)} is visually
            indistinguishable from the original for photos on the web, at a
            fraction of the size. For print, keep your originals.
          </p>
        </div>
      )}
    </div>
  );
}
