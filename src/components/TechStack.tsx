"use client";

import { motion } from "framer-motion";

const stack = [
  { name: "React", note: "Interfaces" },
  { name: "Next.js", note: "Web platform" },
  { name: "Node.js", note: "Backend" },
  { name: "Laravel", note: "Backend" },
  { name: "Flutter", note: "Mobile apps" },
  { name: "Supabase", note: "Backend platform" },
  { name: "Firebase", note: "Realtime & auth" },
  { name: "MongoDB", note: "Database" },
  { name: "PostgreSQL", note: "Database" },
  { name: "Docker", note: "Infrastructure" },
  { name: "AWS", note: "Cloud" },
  { name: "Cloudflare", note: "Edge & security" },
];

/** Spec-sheet table: numbered rows, hover fills the row orange. */
export function TechStack() {
  return (
    <ul className="border-t border-line-strong">
      {stack.map((tech, i) => (
        <motion.li
          key={tech.name}
          initial={{ y: 12 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.45, delay: (i % 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="group border-b border-line"
        >
          <div className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 px-2 py-3.5 transition-colors duration-200 group-hover:bg-accent sm:grid-cols-[4rem_1fr_1fr_auto] sm:px-4">
            <span className="font-mono text-[0.625rem] text-faint transition-colors group-hover:text-[#16140f]/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-xl tracking-wide uppercase transition-colors group-hover:text-[#16140f] sm:text-2xl">
              {tech.name}
            </span>
            <span className="annotation hidden transition-colors group-hover:text-[#16140f]/70 sm:block">
              {tech.note}
            </span>
            <span
              aria-hidden
              className="font-mono text-sm text-faint transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#16140f]"
            >
              →
            </span>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
