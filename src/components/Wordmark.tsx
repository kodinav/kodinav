export function Wordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <span
      className={`inline-flex items-baseline font-sans leading-none tracking-[-0.05em] ${
        size === "lg" ? "text-3xl" : "text-[1.4rem]"
      } ${className}`}
      style={{ fontWeight: 700 }}
    >
      Kodinav
      <span aria-hidden className="text-accent">
        .
      </span>
    </span>
  );
}
