import { Stagger, StaggerItem } from "kodinav";

// StaggerItem only animates inside a Stagger parent — the only true render.
export const InsideStagger = () => (
  <div className="bg-background text-foreground p-8">
    <Stagger className="flex flex-col gap-3">
      <StaggerItem>
        <div className="border border-line-strong p-5">
          <h3 className="font-display text-xl uppercase">You work with the founder</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">No account managers, no handoffs, no telephone game.</p>
        </div>
      </StaggerItem>
      <StaggerItem>
        <div className="border border-line-strong p-5">
          <h3 className="font-display text-xl uppercase">Performance-first</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">Sub-second loads and 95+ Lighthouse scores as the default.</p>
        </div>
      </StaggerItem>
    </Stagger>
  </div>
);
