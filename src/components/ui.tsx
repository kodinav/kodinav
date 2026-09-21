import Link from "next/link";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Buttons — crisp editorial rectangles with a mono label. The primary
 * is a solid ink fill that flips to cobalt on hover; on .ink sections
 * the tokens invert it to a light button automatically.
 * ------------------------------------------------------------------ */

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  size?: "md" | "lg";
  className?: string;
  external?: boolean;
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-4 rounded-[3px] font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-[background-color,border-color,color,transform] duration-300 whitespace-nowrap border active:scale-[0.98]";
  const sizes = {
    md: "h-11 pl-5 pr-2.5",
    lg: "h-12 pl-6 pr-3",
  };
  const variants = {
    primary: "bg-black text-[#f2f1ed] border-black hover:bg-[#1d1c19]",
    outline:
      "border-line-strong text-foreground hover:border-foreground bg-transparent",
    ghost:
      "border-transparent text-muted hover:text-foreground hover:border-line",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const arrow = (
    <span
      aria-hidden
      className={`grid size-6 place-items-center overflow-hidden rounded-[3px] border ${
        variant === "primary" ? "border-white/40" : "border-current/40"
      }`}
    >
      <span className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5">
        →
      </span>
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {arrow}
    </Link>
  );
}

/* Text link with a mono label and an underline that draws on hover. */
export function ArrowLink({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = `u-draw group inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground ${className}`;
  const arrow = (
    <span
      aria-hidden
      className="text-accent transition-transform duration-300 group-hover:translate-x-1"
    >
      →
    </span>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {arrow}
    </Link>
  );
}

/* Eyebrow — a register mark + a mono label. Opens most sections. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`annotation flex items-center gap-3 text-foreground/70 ${className}`}>
      <span className="crosshair" aria-hidden />
      {children}
    </p>
  );
}

/* Section heading — eyebrow, display title, optional lead paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const alignCls = align === "center" ? "items-center text-center" : "";
  return (
    <div className={`flex flex-col gap-5 ${alignCls} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-balance text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] text-foreground">
        {title}
      </h2>
      {lead && (
        <p
          className={`max-w-2xl text-pretty leading-relaxed text-muted sm:text-lg ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* Small outlined mono chip (tech tags, filters). */
export function Chip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-[2px] bg-foreground/[0.07] px-2 py-1.5 font-mono text-[0.5625rem] leading-none uppercase tracking-[0.2em] text-foreground/80 ${className}`}
    >
      {children}
    </span>
  );
}

/* Badge — a filled status/emphasis pill (e.g. "Taking projects"). */
export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent";
  className?: string;
}) {
  const tones = {
    neutral: "border-line-strong text-foreground/80",
    accent: "border-accent/30 bg-accent/8 text-accent",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* Live pulse dot — the "available" signal, reused across hero/nav. */
export function PulseDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex size-1.5 ${className}`}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
      <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
    </span>
  );
}
