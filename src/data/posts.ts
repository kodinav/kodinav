export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readingTime: string;
  tag: string;
  sections: { heading?: string; paragraphs: string[] }[];
};

export const posts: Post[] = [
  {
    slug: "why-your-business-website-is-slow",
    title: "Why Your Business Website Is Slow, and What It's Costing You",
    excerpt:
      "Speed is not a technical vanity metric. It decides whether visitors stay, whether Google ranks you, and whether your ad spend converts.",
    date: "2026-06-18",
    readingTime: "6 min",
    tag: "Performance",
    sections: [
      {
        paragraphs: [
          "Open your website on a phone, on mobile data, outside your office Wi-Fi. Count the seconds before you can read the headline. If it takes more than two, you are paying for that delay every single day. You pay in visitors who leave, in rankings you never get, and in ad clicks that never become enquiries.",
          "Most business owners never feel this problem. They visit their own site on a fast connection with everything cached. Your customers never get that version.",
        ],
      },
      {
        heading: "Where the seconds actually go",
        paragraphs: [
          "The slow business websites I audit share the same causes almost every time: page builders that ship megabytes of JavaScript for a simple page, uncompressed images straight from a phone camera, a dozen tracking scripts nobody remembers adding, and cheap shared hosting that takes a full second before sending the first byte.",
          "None of these are exotic problems. They are the default outcome of building a website without engineering discipline. And that is how most business websites get built.",
        ],
      },
      {
        heading: "What speed is worth in rupees",
        paragraphs: [
          "Google uses page speed as a ranking signal. A slow site therefore pays twice: fewer visitors arrive, and more of them leave. If you run Meta or Google ads it gets worse, because you have already paid for the click before the visitor abandons your loading spinner.",
          "The arithmetic is blunt. If your landing page loses a third of ad clicks to load time, your effective cost per lead is fifty percent higher than it should be. Speed is the cheapest conversion optimisation that exists.",
        ],
      },
      {
        heading: "What a fast site looks like technically",
        paragraphs: [
          "The sites I build render pages on the server or at build time, so the browser receives finished HTML instead of a JavaScript bundle that assembles the page on the customer's phone. Images are compressed and sized for the device requesting them. Third-party scripts load after the content, or get cut entirely.",
          "The result is measurable: pages that become readable in under a second on a mid-range phone, and Lighthouse performance scores above 95. Not as a stunt. As the default.",
        ],
      },
      {
        heading: "How to check your own site today",
        paragraphs: [
          "Run your homepage through PageSpeed Insights. It is free, and it is what Google itself uses. Look at the mobile score, not desktop. Below 70 means you have a real problem that is costing you leads. Below 50 means fixing it is probably the highest-return change you can make to your marketing this year.",
        ],
      },
    ],
  },
  {
    slug: "custom-software-vs-saas",
    title: "Custom Software vs. Off-the-Shelf SaaS: An Honest Framework",
    excerpt:
      "Custom software is not always the answer. Sometimes a ₹2,000-a-month subscription is genuinely better. Here is how I advise clients to decide.",
    date: "2026-05-27",
    readingTime: "7 min",
    tag: "Strategy",
    sections: [
      {
        paragraphs: [
          "I build custom software for a living, so you would expect me to always recommend it. I don't. Some of the best advice I give in discovery calls is to not hire me and use a ₹2,000-a-month tool instead. Custom software is a serious investment, and it is only the right one under specific conditions.",
        ],
      },
      {
        heading: "When off-the-shelf wins",
        paragraphs: [
          "If your process is standard, SaaS products have refined it over thousands of customers. Invoicing, basic appointment booking, email marketing: you will not beat these tools on features per rupee, and you should not try.",
          "The rule is simple. If you can change your process slightly to fit a good tool, and that tool costs less per year than a custom build costs once, use the tool.",
        ],
      },
      {
        heading: "When custom software wins",
        paragraphs: [
          "Custom wins when your process is your competitive advantage. A coaching institute whose batch and test methodology differs from everyone else should not flatten it to fit a generic LMS. A manufacturer whose scheduling logic took a decade to refine should not outsource it to a tool that treats every factory identically.",
          "Custom also wins on arithmetic at scale. Per-student, per-seat and per-order pricing means your software costs grow with your success. At some point, and it can be calculated exactly, owning the asset becomes cheaper than renting it forever.",
          "And custom wins when integration is the real problem. When your team spends hours copying data between five tools that refuse to talk to each other, the glue is the product.",
        ],
      },
      {
        heading: "The questions I ask in discovery calls",
        paragraphs: [
          "Is this process genuinely different from your competitors, or does it just feel that way? What does the SaaS alternative cost over five years at your projected scale? What happens to your data and workflow if that vendor doubles prices or shuts down? How many hours per week does your team spend working around your current tools?",
          "Honest answers to those four questions usually make the decision obvious, in one direction or the other.",
        ],
      },
      {
        heading: "The hybrid path most businesses actually take",
        paragraphs: [
          "In practice the best architecture is often boring: use excellent off-the-shelf tools for standard functions, and build custom software only for the core process that makes you money. That is where an engineer who understands business earns their fee.",
        ],
      },
    ],
  },
  {
    slug: "what-coaching-institutes-get-wrong-online",
    title: "What Coaching Institutes Get Wrong Online",
    excerpt:
      "Parents research institutes the way they research schools. Most institute websites answer none of their real questions.",
    date: "2026-04-30",
    readingTime: "5 min",
    tag: "Education",
    sections: [
      {
        paragraphs: [
          "Working with coaching institutes has taught me one consistent lesson: the institutes are excellent at teaching and poor at being findable and credible online. The gap between how good the institute is and how good it looks online is usually enormous. That gap costs admissions every season.",
        ],
      },
      {
        heading: "Parents are researching you right now",
        paragraphs: [
          "Before a parent ever calls, they have searched your institute's name, looked for results and reviews, and compared you against two competitors. If your website is a single page with a phone number, or if the top result is a stale social media page, you lost credibility before the first conversation.",
        ],
      },
      {
        heading: "The questions your website must answer",
        paragraphs: [
          "Parents decide on a shortlist of concrete questions. What results has this institute actually produced? Who teaches, and what are their credentials? What are the batch timings and sizes? What does it cost, at least approximately? How do I visit or talk to someone?",
          "Most institute websites answer none of these. Or they bury the answers under stock photos of students who never attended. Answering these questions plainly, with real photos and real names, beats every design trick ever invented.",
        ],
      },
      {
        heading: "Enquiries die without a system",
        paragraphs: [
          "The second failure is invisible: what happens after a parent fills a form or calls. In most institutes the answer is that someone writes it in a register and hopefully calls back. During admission season, hopefully is not a system. Institutes I have worked with found that simply guaranteeing every enquiry a same-day, tracked follow-up raised admissions more than any increase in advertising.",
        ],
      },
      {
        heading: "Local search is your highest-intent channel",
        paragraphs: [
          "Searches like 'NEET coaching in your city' carry more intent than any ad audience. Ranking for them requires a website with real content structure, location schema markup, and pages that answer course-specific questions. A homepage with an image slider will never do it. This is unglamorous engineering, and it compounds every month you have it.",
        ],
      },
    ],
  },
  {
    slug: "ai-in-business-software-2026",
    title: "Where AI Actually Belongs in Business Software",
    excerpt:
      "Past the hype, AI is genuinely transforming a narrow set of business tasks. Here is what's real, what's not, and how to tell the difference.",
    date: "2026-03-25",
    readingTime: "6 min",
    tag: "AI",
    sections: [
      {
        paragraphs: [
          "Every business owner I talk to now asks about AI, usually in one of two modes: anxiety about falling behind, or scepticism about whether any of it is real. Both are reasonable. The truthful answer is that AI is transformative for a specific shape of task and a distraction elsewhere. Knowing the difference is worth real money.",
        ],
      },
      {
        heading: "The shape of a good AI task",
        paragraphs: [
          "AI earns its keep on tasks that are high-volume, language-heavy, and tolerant of review. Answering the same fifty customer questions. Extracting fields from documents. Drafting first versions of content. Qualifying and routing incoming leads. Summarising long records for the humans who decide.",
          "Notice what these share. A human currently spends hours on them, the cost of an occasional imperfect draft is low, and there is a clear checkpoint before anything irreversible happens.",
        ],
      },
      {
        heading: "Where AI does not belong yet",
        paragraphs: [
          "Anywhere a wrong answer is expensive and unreviewable: final pricing decisions, medical or legal conclusions, irreversible customer commitments. The technology can assist in all of these by drafting, flagging and summarising. But a system that lets a model act unsupervised in high-stakes flows was designed by someone who will not be answering the phone when it goes wrong.",
        ],
      },
      {
        heading: "What implementation actually looks like",
        paragraphs: [
          "The successful AI projects I have built are unglamorous. A support assistant strictly limited to the client's documented content that hands off to a human the moment it is unsure. A pipeline that reads incoming documents and pre-fills a form a person confirms. Each one scoped to a single task and measured against the hours it saves.",
          "The failed projects I have seen share a pattern too. They started with 'we need AI' instead of 'this task wastes twenty hours a week.'",
        ],
      },
      {
        heading: "A sober way to start",
        paragraphs: [
          "List the tasks your team repeats most. Pick the one that is language-heavy, high-volume and low-stakes. Automate that single task, measure the hours saved, and only then decide on the next. AI adoption that works looks like compound interest, not a moonshot.",
        ],
      },
    ],
  },
  {
    slug: "how-i-scope-software-projects",
    title: "How I Scope a Software Project (and Why Fixed Quotes Are Possible)",
    excerpt:
      "Software projects have a reputation for blown budgets and moving deadlines. That reputation comes from bad scoping, not bad luck.",
    date: "2026-02-19",
    readingTime: "6 min",
    tag: "Process",
    sections: [
      {
        paragraphs: [
          "The horror stories are real. Projects that doubled in cost. Agencies that vanished after the advance. Software delivered eighteen months late that nobody could use. Almost every one of these stories begins the same way: a vague scope agreed too quickly by two parties imagining different products.",
        ],
      },
      {
        heading: "Why vague scopes fail",
        paragraphs: [
          "'A website with a student portal' means fifty different products depending on unstated assumptions. Does the portal include payments? Test analytics? Parent logins? Each assumption gap becomes a mid-project negotiation, and mid-project negotiations are where budgets and relationships die.",
        ],
      },
      {
        heading: "What proper discovery looks like",
        paragraphs: [
          "Before quoting anything, I run a structured discovery: who uses the system, what they do in it screen by screen, what data flows in and out, and what existing systems it must talk to. This produces a written scope where both of us can point at the same document and see the same product.",
          "Discovery is also where I will tell you if part of what you want should not be built. Sometimes a tool already exists. Sometimes a simpler version proves the idea for a fifth of the cost.",
        ],
      },
      {
        heading: "Slices, not phases",
        paragraphs: [
          "I structure builds as usable slices rather than abstract phases. 'Backend in month one, frontend in month two' means nothing works until everything works. A slice is different: enquiries flow end to end, then payments, then reporting. You see working software within weeks. If priorities change, we reorder slices instead of renegotiating a monolith.",
        ],
      },
      {
        heading: "What this means for you as a buyer",
        paragraphs: [
          "Whoever you hire, insist on three things: a written scope that names every screen and workflow, delivery in working slices you can actually use, and clarity on who owns the code and infrastructure. Any professional will welcome these questions. The ones who dodge them are telling you something important.",
        ],
      },
    ],
  },
  {
    slug: "seo-is-an-engineering-problem",
    title: "SEO Is an Engineering Problem Before It's a Marketing Problem",
    excerpt:
      "Before content and backlinks matter, your website has to be technically legible to search engines. Most business sites fail at that first step.",
    date: "2026-01-22",
    readingTime: "5 min",
    tag: "SEO",
    sections: [
      {
        paragraphs: [
          "Businesses spend on SEO agencies while their website remains technically illegible to Google: slow, unstructured, and rendered in ways crawlers struggle with. That is like hiring a publicist for a book that has not been printed. The engineering has to come first.",
        ],
      },
      {
        heading: "What Google actually needs from your site",
        paragraphs: [
          "Search engines reward pages that load fast, declare their structure in semantic HTML, describe themselves with schema markup, and answer one specific query per page. These are engineering properties. They get decided when the site is built, and no amount of content marketing retrofits them onto a bad foundation.",
        ],
      },
      {
        heading: "The failures I see most",
        paragraphs: [
          "Single-page sites where every service lives on one URL, so no page can rank for a specific search. Client-side rendering that serves crawlers an empty shell. Heading structures chosen for font size rather than meaning. Missing or generic metadata. Images with no descriptions. Each one is invisible to the owner and glaring to a crawler.",
        ],
      },
      {
        heading: "Schema markup: the unfair advantage nobody uses",
        paragraphs: [
          "Structured data tells search engines explicitly what your business is: its services, location, hours, reviews, and how pages relate. It is how results earn star ratings, FAQ dropdowns and rich cards. It costs almost nothing to add during a build, and it remains one of the most neglected advantages in local business SEO.",
        ],
      },
      {
        heading: "The compounding effect",
        paragraphs: [
          "A technically sound site compounds. Every article published sits on a foundation that lets it rank, and every month accrues authority. A technically broken site makes every marketing rupee work against gravity. If you invest in one thing first, invest in the foundation.",
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
