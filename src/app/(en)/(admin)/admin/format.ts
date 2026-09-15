/** Number formatting shared by server panels and client charts (no "use client": server components call these). */
export const fmtNum = (n: number) =>
  n >= 10_000 ? `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1)}K` : n.toLocaleString("en-US");

export const fmtDuration = (sec: number) => {
  if (!sec) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
};
