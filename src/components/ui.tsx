import Link from "next/link";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Buttons: pills. The primary is solid ink; on .ink sections the tokens
 * invert it to a light pill automatically. The arrow sits in its own disc
 * and slides on hover.
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
    "group relative inline-flex items-center justify-center gap-3 rounded-full border font-sans font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] active:scale-[0.98]";
  const sizes = {
    md: "h-11 pl-5 pr-1.5 text-[0.9rem]",
    lg: "h-13 pl-6 pr-2 text-[0.95rem]",
  };
  const variants = {
    primary: "border-foreground bg-foreground text-background hover:bg-accent hover:border-accent hover:text-white",
    outline: "border-line-strong bg-transparent text-foreground hover:border-foreground",
    ghost: "border-transparent text-muted hover:text-foreground hover:border-line",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const arrow = (
    <span
      aria-hidden
      className={`grid size-8 place-items-center overflow-hidden rounded-full ${
        variant === "primary" ? "bg-background/15" : "bg-foreground/8"
      }`}
    >
      <span className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
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
  const cls = `u-draw group inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-foreground ${className}`;
  const arrow = (
    <span aria-hidden className="text-accent transition-transform duration-300 group-hover:translate-x-1">
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

/* Eyebrow: a register mark and a mono label. Opens most sections. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`annotation flex items-center gap-3 ${className}`}>
      <span className="crosshair" aria-hidden />
      {children}
    </p>
  );
}

/* Section heading: eyebrow, display title, optional lead paragraph. */
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
    <div className={`flex flex-col gap-5 ${alignCls} ${className}`} data-reveal>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-balance text-[clamp(2rem,4.6vw,4rem)] leading-[1.0] text-foreground">{title}</h2>
      {lead && (
        <p className={`max-w-2xl text-pretty leading-relaxed text-muted sm:text-lg ${align === "center" ? "mx-auto" : ""}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

/* Small outlined mono chip (tech tags, filters). */
export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line px-2.5 py-1 font-mono text-[0.5625rem] leading-none uppercase tracking-[0.14em] text-muted ${className}`}
    >
      {children}
    </span>
  );
}

/* Badge: a filled status/emphasis pill (e.g. "Taking projects"). */
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

/* Live pulse dot: the "available" signal, reused across hero and nav. */
export function PulseDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex size-1.5 ${className}`}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
      <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
    </span>
  );
}
