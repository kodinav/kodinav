import Link from "next/link";
import type { ReactNode } from "react";

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
    "group inline-flex items-center justify-center gap-3 rounded-xs font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-300 whitespace-nowrap border active:scale-[0.99]";
  const sizes = {
    md: "px-6 py-3.5",
    lg: "px-8 py-4.5",
  };
  const variants = {
    primary:
      "bg-accent text-accent-contrast border-accent hover:bg-foreground hover:border-foreground hover:text-background",
    outline:
      "border-line-strong text-foreground hover:border-accent hover:text-accent",
    ghost: "border-transparent text-muted hover:text-foreground",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const arrow = (
    <span
      aria-hidden
      className="transition-transform duration-300 group-hover:translate-x-1"
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

export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`u-draw group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-foreground ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="text-brass transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="annotation flex items-center gap-3 text-foreground/70">
      <span className="crosshair text-brass" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "text-center items-center" : "";
  return (
    <div className={`flex flex-col gap-6 ${alignCls}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-balance text-4xl text-foreground sm:text-[3.4rem] sm:leading-[1.06]">
        {title}
      </h2>
      {lead && (
        <p className="max-w-2xl text-pretty leading-relaxed text-muted sm:text-lg">
          {lead}
        </p>
      )}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-xs border border-line px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
      {children}
    </span>
  );
}
