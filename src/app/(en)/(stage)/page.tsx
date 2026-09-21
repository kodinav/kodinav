import { Stage } from "@/components/stage/Stage";
import { stageContent } from "@/components/stage/content";
import { faqSchema } from "@/lib/schema";

/**
 * Home. One pinned stage; the copy, the choreography and the film all live in
 * components/stage. Title, description, canonical and Open Graph come from the
 * root metadata, and the organisation / founder / website JSON-LD from
 * RootDocument, exactly as before — this page adds the FAQ it now answers.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(stageContent.questions.items.map((x) => ({ q: x.q, a: x.a })))),
        }}
      />
      {/* Without JavaScript nothing can be choreographed, so un-pin the stage
          into a plain readable column instead of leaving the copy off stage. */}
      <noscript>
        <style>{`.stage{height:auto!important;background:#0a2f8c}.pin{position:static!important;height:auto!important;padding:96px 7.5vw 64px;overflow:visible}.film,.frame,.rail,.work-rule,.work-ticks,.work-pct,.plate{display:none!important}.beat{position:static!important;opacity:1!important;pointer-events:auto!important;margin:0 0 48px;width:auto!important;--v:1;--o:1}.beat *{position:static!important;max-width:60ch!important;width:auto!important}.work-track{transform:none!important}.b-sign{text-align:left}.w{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Stage content={stageContent} />
    </>
  );
}
