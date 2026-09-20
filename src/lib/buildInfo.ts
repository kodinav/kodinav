/**
 * Facts about this build, captured by next.config.ts at build time from git
 * and the installed Next.js — see the `env` block there. Anything git could
 * not answer (a builder without a checkout) is an empty string, and the UI
 * hides that field rather than showing a placeholder.
 */
export type BuildInfo = {
  /** Short commit SHA, or "" when git was unavailable at build. */
  commit: string;
  /** Commit date (YYYY-MM-DD), falling back to the build date. */
  date: string;
  /** Installed Next.js version. */
  next: string;
  /** Node.js version the build ran on. */
  node: string;
  /** ISO timestamp of the build itself. */
  at: string;
};

const EMPTY: BuildInfo = { commit: "", date: "", next: "", node: "", at: "" };

export const buildInfo: BuildInfo = (() => {
  try {
    return { ...EMPTY, ...JSON.parse(process.env.NEXT_PUBLIC_BUILD_INFO || "{}") };
  } catch {
    return EMPTY;
  }
})();
