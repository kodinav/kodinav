import { Eyebrow } from "kodinav";

export const Default = () => (
  <div className="bg-background text-foreground p-8">
    <Eyebrow>Fig. 01 — Selected Work</Eyebrow>
  </div>
);

export const Examples = () => (
  <div className="bg-background text-foreground flex flex-col gap-5 p-8">
    <Eyebrow>Fig. 02 — Services</Eyebrow>
    <Eyebrow>Fig. 05 — Technology</Eyebrow>
    <Eyebrow>Free Instant Website Audit</Eyebrow>
  </div>
);

export const OnInk = () => (
  <div className="ink p-8"><Eyebrow>Fig. 04 — The Studio</Eyebrow></div>
);
