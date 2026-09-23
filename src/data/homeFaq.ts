import { site } from "./site";

/** The questions people ask first. Every answer is a claim the site already stands behind. */
export const homeFaq = [
  {
    q: "Who actually builds my project?",
    a: `The founder, ${site.founder}, personally. Kodinav is an independent studio, not an agency that hands your work to juniors. You talk to, and are built for by, the same engineer throughout.`,
  },
  {
    q: "How much does a project cost?",
    a: `Indian clients start from ${site.priceFloor}; international clients from ${site.priceFloorUsd} (about HK$16,000 in Hong Kong or NT$62,000 in Taiwan). Projects scale with scope, and after a short discovery call you receive a fixed, itemised quote naming every screen and workflow. Nothing vague, nothing added mid-project.`,
  },
  {
    q: "How long does it take?",
    a: "A typical business website runs 3 to 6 weeks from discovery to launch. Web applications and platforms are sliced so you see working software in weeks, and are scoped individually with a fixed quote.",
  },
  {
    q: "Do I own the code?",
    a: "Completely. Full source code, documentation and infrastructure access are handed over at launch. Every project includes a support period, and you are never locked in.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. The studio is based in India and works with businesses in Hong Kong, Taiwan, the US, the UAE and worldwide — one engineer accountable across every timezone. Websites can be built in English, Traditional Chinese or both.",
  },
];
