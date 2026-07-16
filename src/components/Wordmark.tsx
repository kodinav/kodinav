export function Wordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <span
 className={`inline-flex items-baseline font-display leading-none tracking-tight ${
        size === "lg" ? "text-3xl" : "text-[1.35rem]"
      } ${className}`}
      style={{ fontWeight: 560 }}
    >
      Kodinav
      <span aria-hidden className="text-brass">
        .
      </span>
    </span>
  );
}
