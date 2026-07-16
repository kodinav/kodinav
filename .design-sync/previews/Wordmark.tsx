import { Wordmark } from "kodinav";

export const Default = () => (
  <div className="bg-background text-foreground p-8"><Wordmark /></div>
);

export const Sizes = () => (
  <div className="bg-background text-foreground flex items-baseline gap-8 p-8">
    <Wordmark size="md" />
    <Wordmark size="lg" />
  </div>
);

export const OnInk = () => (
  <div className="ink p-8"><Wordmark size="lg" /></div>
);
