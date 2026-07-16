import { Chip } from "kodinav";

export const Default = () => (
  <div className="bg-background text-foreground p-8"><Chip>Performance</Chip></div>
);

export const Set = () => (
  <div className="bg-background text-foreground flex flex-wrap gap-2.5 p-8">
    <Chip>Performance</Chip>
    <Chip>SEO</Chip>
    <Chip>Pricing</Chip>
    <Chip>E-Commerce · D2C</Chip>
    <Chip>2025</Chip>
  </div>
);
