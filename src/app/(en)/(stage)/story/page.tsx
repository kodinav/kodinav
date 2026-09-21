import { Stage } from "@/components/stage/Stage";
import { stageContent } from "@/components/stage/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Story",
  description:
    "Becoming human took six million years; a good website takes weeks. Kodinav's long-form story, told in seven public-domain paintings.",
  alternates: { canonical: "/story" },
};

/**
 * The long version: one pinned stage; the copy, the choreography and the film
 * all live in components/stage. The homepage is the short version, for buyers.
 */
export default function Story() {
  return (
    <>
      {/* Without JavaScript nothing can be choreographed, so un-pin the stage
          into a plain readable column instead of leaving the copy off stage. */}
      <noscript>
        <style>{`.stage{height:auto!important;background:#0a2f8c}.pin{position:static!important;height:auto!important;padding:96px 7.5vw 64px;overflow:visible}.film,.frame,.rail,.work-rule,.work-ticks,.work-pct,.plate{display:none!important}.beat{position:static!important;opacity:1!important;pointer-events:auto!important;margin:0 0 48px;width:auto!important;--v:1;--o:1}.beat *{position:static!important;max-width:60ch!important;width:auto!important}.work-track{transform:none!important}.b-sign{text-align:left}.w{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Stage content={stageContent} />
    </>
  );
}
