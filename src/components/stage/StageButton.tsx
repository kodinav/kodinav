import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The stage's one button: a small black slab with a tracked mono label and a
 * boxed arrow. On hover the label rolls up and a second copy rolls in behind
 * it; the arrow slides through its box. Stays black on every background.
 */
export function StageButton({
  href,
  children,
  className = "",
  external = false,
  size = "md",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  size?: "md" | "lg";
}) {
  const inner = (
    <>
      <span className="sbtn-l">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      <span className="sbtn-a" aria-hidden>
        <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M1 5h7.5M5.5 2l3 3-3 3" />
        </svg>
      </span>
    </>
  );
  const cls = `sbtn ${size === "lg" ? "sbtn--lg" : ""} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Same slab, as a real <button> (the brief form's submit). */
export function StageSubmit({
  children,
  disabled,
  className = "",
}: {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button type="submit" disabled={disabled} className={`sbtn sbtn--lg ${className}`}>
      <span className="sbtn-l">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      <span className="sbtn-a" aria-hidden>
        <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M1 5h7.5M5.5 2l3 3-3 3" />
        </svg>
      </span>
    </button>
  );
}
