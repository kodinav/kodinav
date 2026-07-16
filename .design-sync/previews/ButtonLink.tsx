import { ButtonLink } from "kodinav";

const Paper = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background text-foreground flex flex-wrap items-center gap-4 p-8">{children}</div>
);

export const Primary = () => (
  <Paper><ButtonLink href="/contact">Book Discovery Call</ButtonLink></Paper>
);

export const Variants = () => (
  <Paper>
    <ButtonLink href="/contact" variant="primary">Primary</ButtonLink>
    <ButtonLink href="/work" variant="outline">Outline</ButtonLink>
    <ButtonLink href="/pricing" variant="ghost">Ghost</ButtonLink>
  </Paper>
);

export const Sizes = () => (
  <Paper>
    <ButtonLink href="/contact" size="md">Medium</ButtonLink>
    <ButtonLink href="/contact" size="lg">Large</ButtonLink>
  </Paper>
);

export const OnInk = () => (
  <div className="ink flex flex-wrap items-center gap-4 p-8">
    <ButtonLink href="/contact" variant="primary">Book Discovery Call</ButtonLink>
    <ButtonLink href="/work" variant="outline">Explore Projects</ButtonLink>
  </div>
);
