import Image from "next/image";
import type { ProjectImage } from "@/data/projects";

/**
 * Real project screenshot inside a drafting "browser" frame:
 * ink chrome + registration marks + a FIG caption, wrapping the actual image.
 */
export function ProjectShot({
  image,
  caption,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 720px",
}: {
  image: ProjectImage;
  caption?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className="relative border border-line-strong bg-surface-raised">

      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-line-strong px-3 py-2.5">
        <span className="size-2 rounded-full border border-line-strong" />
        <span className="size-2 rounded-full border border-line-strong" />
        <span className="size-2 rounded-full bg-foreground/25" />
        <span className="mx-auto flex h-4 w-1/2 items-center justify-center border border-line font-mono text-[0.5rem] tracking-wider text-faint uppercase">
          {caption ?? "live"}
        </span>
      </div>

      <div className="relative aspect-16/10 w-full overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
      </div>
    </figure>
  );
}

/** Real mobile screenshot inside a drafting phone frame. */
export function PhoneShot({
  image,
  className = "",
}: {
  image: ProjectImage;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto aspect-9/19 w-full max-w-56 overflow-hidden border border-line-strong bg-surface-raised p-2 ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden border border-line-strong">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="220px"
          className="object-cover object-top"
        />
      </div>
      <span
        aria-hidden
        className="absolute top-3.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-foreground/20"
      />
    </div>
  );
}
