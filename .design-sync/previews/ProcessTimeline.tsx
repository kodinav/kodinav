import { ProcessTimeline } from "kodinav";

export const Full = () => (
  <div className="bg-background text-foreground p-8"><ProcessTimeline /></div>
);

export const Compact = () => (
  <div className="bg-background text-foreground p-8"><ProcessTimeline compact /></div>
);
