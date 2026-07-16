import { Stamp } from "kodinav";

export const Default = () => (
  <div className="bg-background text-foreground flex justify-center p-8"><Stamp /></div>
);

export const Sizes = () => (
  <div className="bg-background text-foreground flex items-center justify-center gap-8 p-8">
    <Stamp size={80} />
    <Stamp size={120} />
    <Stamp size={160} />
  </div>
);

export const OnInk = () => (
  <div className="ink flex justify-center p-8"><Stamp size={130} /></div>
);
