import { Price } from "kodinav";

export const Default = () => (
  <div className="bg-background text-foreground p-8">
    <p className="font-display text-5xl uppercase">
      <Price inr="₹75,000" usd="$2,000" />
    </p>
  </div>
);

export const InSentence = () => (
  <div className="bg-background text-foreground p-8">
    <p className="text-muted leading-relaxed">
      Projects start from <Price inr="₹75,000" usd="$2,000" />, with a fixed,
      itemised quote after a free discovery call.
    </p>
  </div>
);

export const AuditPrice = () => (
  <div className="ink p-8">
    <p className="font-display text-4xl uppercase">
      <Price inr="₹3,999" usd="$49" className="text-accent" /> website audit
    </p>
  </div>
);
