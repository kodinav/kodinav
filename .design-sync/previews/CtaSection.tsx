import { CtaSection } from "kodinav";

export const Default = () => <CtaSection />;

export const Custom = () => (
  <CtaSection
    title="Want the real number?"
    lead="A discovery call costs nothing. You describe the project, I ask the questions that matter, and you get a fixed, itemised quote in writing."
    primaryLabel="Get a fixed quote"
    primaryHref="/contact"
  />
);
