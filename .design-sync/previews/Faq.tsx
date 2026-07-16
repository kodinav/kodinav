import { Faq } from "kodinav";

const items = [
  { q: "How long does a business website take?", a: "Typically 3 to 6 weeks from discovery call to launch, depending on the number of pages and how quickly content decisions are made." },
  { q: "Will I be able to edit content myself?", a: "Yes. Where it makes sense, I integrate a content management system and train your team to use it. You should never need a developer to fix a typo." },
  { q: "Do you handle hosting and domains?", a: "Yes. I set up hosting, DNS, SSL and email deliverability, and document everything so you always own your infrastructure." },
];

export const Default = () => (
  <div className="bg-background text-foreground p-8"><Faq items={items} /></div>
);

export const SingleQuestion = () => (
  <div className="bg-background text-foreground p-8">
    <Faq items={[{ q: "Is this really free?", a: "Yes, and you do not need to give an email to see the result. I would rather earn the conversation than trap it." }]} />
  </div>
);
