import { ProjectCard } from "kodinav";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <rect width="640" height="400" fill="#efeae0"/>
  <rect x="0" y="0" width="640" height="52" fill="#16140f"/>
  <rect x="40" y="110" width="380" height="34" fill="#16140f"/>
  <rect x="40" y="160" width="120" height="16" fill="#ff4400"/>
  <rect x="40" y="250" width="560" height="110" fill="rgba(22,20,15,0.10)"/>
</svg>`;

const project = {
  slug: "triplipi",
  name: "Triplipi",
  industry: "Travel · Consumer Platform",
  category: "Web Platform",
  year: "2025",
  summary:
    "A travel discovery platform where trips are planned around destinations, not spreadsheets. Editorial browsing, rich galleries and a booking pipeline the brand owns end to end.",
  stack: ["Next.js", "React", "Node.js", "PostgreSQL"],
  accent: "#ff4400",
  images: { cover: { src: "data:image/svg+xml;utf8," + encodeURIComponent(svg), alt: "Triplipi homepage" } },
};

export const Default = () => (
  <div className="bg-background p-8"><ProjectCard project={project} /></div>
);

export const Indexed = () => (
  <div className="bg-background p-8"><ProjectCard project={project} index={2} /></div>
);
