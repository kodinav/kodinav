import Link from "next/link";
import type { Project } from "@/data/projects";
import { ProjectShot } from "./ProjectVisual";
import { Chip } from "./ui";

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="card-hover glass group block p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between border-b border-line pb-3">
        <p className="annotation">File {String(index + 1).padStart(3, "0")}</p>
        <p className="annotation">
          {project.industry} — {project.year}
        </p>
      </div>
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div className={index % 2 === 1 ? "lg:order-2" : ""}>
          <ProjectShot image={project.images.cover} caption={project.name} />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-display flex items-center gap-3 text-3xl uppercase tracking-wide sm:text-4xl">
            {project.name}
            <span
              aria-hidden
              className="text-2xl text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
          </h3>
          <p className="text-pretty leading-relaxed text-muted">
            {project.summary}
          </p>
          <div className="mt-1 grid gap-3 text-sm">
            <div className="border-l-2 border-accent pl-4">
              <span className="annotation mb-1 block text-foreground/70">
                Challenge
              </span>
              <span className="text-muted">{project.challenge}</span>
            </div>
            <div className="border-l-2 border-line-strong pl-4">
              <span className="annotation mb-1 block text-foreground/70">
                Solution
              </span>
              <span className="text-muted">{project.solution}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <span className="u-draw mt-2 inline-flex w-fit items-center gap-2 font-mono text-xs tracking-[0.18em] text-foreground uppercase">
            View case study
            <span aria-hidden className="text-accent">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
