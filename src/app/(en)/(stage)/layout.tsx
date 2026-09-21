import { Chrome } from "@/components/stage/Chrome";

/**
 * The homepage has its own layout: no link bar and no footer band, because the
 * stage carries its own frame, rail and sign-off. `data-tone` starts dark (the
 * opening sky) so the chrome is right on first paint; the stage flips it to
 * light whenever the film turns to paper.
 */
export default function StageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="stage-scope" data-tone="dark">
      <a
        href="#main-content"
        className="sr-only z-100 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:border focus:border-white focus:bg-black focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-[0.14em] focus:text-white focus:uppercase"
      >
        Skip to content
      </a>
      <Chrome stage />
      <main id="main-content">{children}</main>
    </div>
  );
}
