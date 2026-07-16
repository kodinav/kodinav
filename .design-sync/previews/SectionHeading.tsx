import { SectionHeading } from "kodinav";

export const Full = () => (
  <div className="bg-background text-foreground p-10">
    <SectionHeading
      eyebrow="Fig. 02 — Services"
      title="One studio. The full stack."
      lead="From a five-page business website to a full ERP. Designed, engineered, deployed and supported under one roof."
    />
  </div>
);

export const TitleOnly = () => (
  <div className="bg-background text-foreground p-10">
    <SectionHeading title="Real projects, real outcomes." />
  </div>
);

export const Centered = () => (
  <div className="bg-background text-foreground p-10">
    <SectionHeading eyebrow="FAQ" title="Fair questions." align="center" />
  </div>
);
