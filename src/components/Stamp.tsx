/** Rotating circular studio seal — a drafting-stamp signature element. */
export function Stamp({
  className = "",
  size = 120,
}: {
  className?: string;
  size?: number;
}) {
  const id = "stamp-circle";
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="animate-spin-slow h-full w-full"
      >
        <defs>
          <path
            id={id}
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="1" />
        <text
          fill="currentColor"
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "8.2px",
            letterSpacing: "0.22em",
          }}
        >
          <textPath href={`#${id}`}>
            INDEPENDENT SOFTWARE STUDIO · EST. 2024 ·
          </textPath>
        </text>
        <text
          x="50"
          y="54.5"
          textAnchor="middle"
          fill="currentColor"
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "13px",
            letterSpacing: "0.04em",
          }}
        >
          KDNV
        </text>
      </svg>
    </div>
  );
}
