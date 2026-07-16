import { Reveal, SectionHeading } from "kodinav";

export const Default = () => (
  <div className="bg-background text-foreground p-10">
    <Reveal>
      <SectionHeading
        eyebrow="Fig. 03 — Why Kodinav"
        title="Independent by design."
        lead="Wrap any block in Reveal and it fades and rises into place as it enters the viewport."
      />
    </Reveal>
  </div>
);

export const Delayed = () => (
  <div className="bg-background text-foreground flex flex-col gap-4 p-10">
    <Reveal delay={0}><p className="font-display text-3xl uppercase">First</p></Reveal>
    <Reveal delay={0.1}><p className="font-display text-3xl uppercase">Second</p></Reveal>
    <Reveal delay={0.2}><p className="font-display text-3xl uppercase">Third</p></Reveal>
  </div>
);
