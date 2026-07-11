export function Wordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-1 font-display uppercase leading-none tracking-wide ${
        size === "lg" ? "text-3xl" : "text-xl"
      } ${className}`}
    >
      Kodinav
      <span aria-hidden className="inline-block size-1.5 bg-accent" />
    </span>
  );
}
