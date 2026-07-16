import { Breadcrumbs } from "kodinav";

export const TwoLevels = () => (
  <div className="bg-background text-foreground p-8">
    <Breadcrumbs items={[{ name: "Free Tools", href: "/free-tools" }, { name: "QR Code Generator" }]} />
  </div>
);

export const OneLevel = () => (
  <div className="bg-background text-foreground p-8">
    <Breadcrumbs items={[{ name: "Free Tools" }]} />
  </div>
);

export const Deep = () => (
  <div className="bg-background text-foreground p-8">
    <Breadcrumbs items={[
      { name: "Services", href: "/services" },
      { name: "Business Websites", href: "/services/business-websites" },
      { name: "Pricing" },
    ]} />
  </div>
);
