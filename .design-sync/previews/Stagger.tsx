import { Stagger, StaggerItem } from "kodinav";

export const Default = () => (
  <div className="bg-background text-foreground p-8">
    <Stagger className="grid gap-px border border-line bg-line sm:grid-cols-3">
      {["Discovery", "Design", "Development"].map((t) => (
        <StaggerItem key={t} className="bg-background">
          <div className="flex flex-col gap-2 p-6">
            <span className="font-mono text-[0.625rem] text-accent">01</span>
            <h3 className="font-display text-xl uppercase">{t}</h3>
            <p className="text-sm leading-relaxed text-muted">
              Children stagger in one after another as the container enters view.
            </p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  </div>
);
