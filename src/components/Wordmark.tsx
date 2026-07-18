export function Wordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <span
      className={`inline-flex items-baseline font-display leading-none tracking-[-0.03em] ${
        size === "lg" ? "text-3xl" : "text-[1.4rem]"
      } ${className}`}
      style={{ fontWeight: 620 }}
    >
      Kodinav
      <span aria-hidden className="text-accent">
        .
      </span>
    </span>
  );
}
