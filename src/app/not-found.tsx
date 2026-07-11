import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

export default function NotFound() {
  return (
    <main className="bg-noise relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 text-center">
      <div aria-hidden className="bg-grid absolute inset-0" />
      <div
        aria-hidden
        className="orb -top-24 left-1/2 h-96 w-160 -translate-x-1/2"
        style={{ background: "var(--glow-blue)", opacity: 0.35 }}
      />
      <div className="relative flex flex-col items-center gap-6">
        <Wordmark />
        <p className="font-mono text-8xl font-semibold tracking-tight text-gradient">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          This page doesn&apos;t exist.
        </h1>
        <p className="max-w-sm text-pretty text-muted">
          The link may be outdated, or the page has moved. Everything worth
          seeing is one click away.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 border border-foreground bg-foreground px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-background transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#efeae0]"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
