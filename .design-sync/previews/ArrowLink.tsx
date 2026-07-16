import { ArrowLink } from "kodinav";

export const Default = () => (
  <div className="bg-background text-foreground p-8">
    <ArrowLink href="/work">All case files</ArrowLink>
  </div>
);

export const InContext = () => (
  <div className="bg-background text-foreground flex flex-col gap-4 p-8">
    <ArrowLink href="/services">Explore all services</ArrowLink>
    <ArrowLink href="/free-tools">Browse the free tools</ArrowLink>
    <ArrowLink href="/about">More about the studio</ArrowLink>
  </div>
);

export const OnInk = () => (
  <div className="ink p-8">
    <ArrowLink href="/process">See the 09-step process</ArrowLink>
  </div>
);
