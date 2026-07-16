import { WhatsAppFab } from "kodinav";

// position:fixed — the transform ancestor keeps it inside the card.
export const OnPage = () => (
  <div className="bg-background text-foreground relative h-72 overflow-hidden p-8" style={{ transform: "translateZ(0)" }}>
    <p className="font-display text-2xl uppercase">Landing page</p>
    <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
      The floating WhatsApp button sits bottom-right on every landing page —
      the channel Gulf and Indian business actually runs on.
    </p>
    <WhatsAppFab />
  </div>
);
