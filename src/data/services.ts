export type Service = {
  slug: string;
  name: string;
  short: string;
  headline: string;
  intro: string;
  forWho: string;
  deliverables: string[];
  approach: { title: string; body: string }[];
  stack: string[];
  faqs: { q: string; a: string }[];
  /** slugs of related services — powers internal linking between service pages */
  related?: string[];
};

export const services: Service[] = [
  {
    slug: "business-websites",
    name: "Business Websites",
    short:
      "Fast, credible marketing websites that turn visitors into enquiries, built for search engines from day one.",
    headline: "A website that earns trust before you say a word.",
    intro:
      "Most business websites are slow, generic and invisible on Google. I build websites that load in under a second, read clearly on every device, and are structured so search engines understand exactly what your business does. The result works as a salesperson, not a brochure.",
    forWho:
      "Coaching institutes, clinics, schools, hotels, restaurants, real estate firms, manufacturers and any business whose website should be generating enquiries.",
    deliverables: [
      "Custom design, no templates, no page builders",
      "Performance-first build with 95+ Lighthouse scores",
      "Semantic HTML and schema markup for SEO",
      "Content structure planned around your customers' questions",
      "Analytics and conversion tracking wired in",
      "Training so your team can update content",
    ],
    approach: [
      {
        title: "Start with the business, not the design",
        body: "Before any pixels, I map who visits your site, what they need to believe before they call you, and which pages carry that weight.",
      },
      {
        title: "Engineer for speed",
        body: "Static rendering, optimised images, minimal JavaScript. Speed is a ranking factor and a trust signal. Slow sites lose both.",
      },
      {
        title: "Build for the next five years",
        body: "Clean architecture and a maintainable codebase mean the site grows with your business instead of being rebuilt every two years.",
      },
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Vercel", "Cloudflare"],
    faqs: [
      {
        q: "How long does a business website take?",
        a: "Typically 3 to 6 weeks from discovery call to launch, depending on the number of pages and how quickly content decisions are made.",
      },
      {
        q: "Will I be able to edit content myself?",
        a: "Yes. Where it makes sense, I integrate a content management system and train your team to use it. You should never need a developer to fix a typo.",
      },
      {
        q: "Do you handle hosting and domains?",
        a: "Yes. I set up hosting, DNS, SSL and email deliverability, and document everything so you always own your infrastructure.",
      },
    ],
    related: ["website-performance", "website-redesign", "landing-page-development"],
  },
  {
    slug: "web-applications",
    name: "Custom Web Applications",
    short:
      "Bespoke web software: portals, platforms and tools built around how your business actually works.",
    headline: "Software shaped around your business, not the other way around.",
    intro:
      "Off-the-shelf tools force your business into their workflow. A custom web application does the opposite. It encodes the way you already work, removes the manual steps, and gives you a system your competitors can't buy. I design and build these end to end, from database to interface.",
    forWho:
      "Businesses that have outgrown spreadsheets, are stitching together five SaaS tools, or need customer-facing portals and platforms that don't exist off the shelf.",
    deliverables: [
      "Full product architecture and data modelling",
      "Role-based access, authentication and audit trails",
      "Responsive interfaces designed for daily use",
      "REST or GraphQL APIs, documented",
      "Automated testing and CI/CD pipelines",
      "Deployment, monitoring and handover documentation",
    ],
    approach: [
      {
        title: "Model the domain first",
        body: "Bad software comes from misunderstanding the business. I spend real time learning your operations before writing a line of code.",
      },
      {
        title: "Ship in slices",
        body: "You see working software in weeks, not months. Each release is usable, so value arrives early and course corrections stay cheap.",
      },
      {
        title: "Design for the tenth user and the ten-thousandth",
        body: "Sensible architecture from the start, so scaling is a configuration change instead of a rewrite.",
      },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Supabase", "Docker", "AWS"],
    faqs: [
      {
        q: "What does a custom web application cost?",
        a: "Projects start at ₹75,000 for focused internal tools and scale with complexity. After a discovery call you get a fixed, itemised quote. No surprises mid-project.",
      },
      {
        q: "Who owns the code?",
        a: "You do. Full source code, documentation and infrastructure access are handed over at launch.",
      },
      {
        q: "What happens after launch?",
        a: "Every project includes a support period, and most clients continue on a monthly retainer for improvements. You're never locked in.",
      },
    ],
    related: ["admin-dashboards", "crm", "ai-integrations"],
  },
  {
    slug: "mobile-apps",
    name: "Mobile Apps",
    short:
      "iOS and Android apps from a single codebase. Native feel, app-store ready, built to be maintained.",
    headline: "One codebase. Both app stores. No compromise on feel.",
    intro:
      "I build mobile apps with Flutter, which means your iOS and Android apps ship together, look identical, and cost roughly half of maintaining two native codebases. From push notifications to offline mode to app store submission, the entire pipeline is handled.",
    forWho:
      "Coaching institutes launching learning apps, clinics offering appointment booking, businesses that need customer or field-staff apps.",
    deliverables: [
      "Flutter apps for iOS and Android from one codebase",
      "Push notifications, offline support, deep linking",
      "Backend APIs and admin panel to manage the app",
      "App Store and Play Store submission handled end to end",
      "Crash reporting and analytics from day one",
      "Update pipeline so releases take hours, not weeks",
    ],
    approach: [
      {
        title: "Design for thumbs, not mice",
        body: "Mobile UX is its own discipline. Navigation, gestures and information density are designed for how people actually hold phones.",
      },
      {
        title: "Backend included",
        body: "An app is only half the product. APIs, databases, admin dashboards and notification infrastructure are part of the build, not an afterthought.",
      },
      {
        title: "Plan for the app stores",
        body: "Review guidelines, signing, versioning and staged rollouts are handled so launch day is boring. Which is exactly what you want.",
      },
    ],
    stack: ["Flutter", "Firebase", "Node.js", "PostgreSQL", "Supabase"],
    faqs: [
      {
        q: "Why Flutter instead of native development?",
        a: "For most business apps, Flutter delivers indistinguishable quality at significantly lower build and maintenance cost. If your app genuinely needs native, say heavy AR or specialised hardware, I'll tell you honestly.",
      },
      {
        q: "Do you handle app store publishing?",
        a: "Yes. Developer accounts, store listings, screenshots, review process and staged rollouts are all part of the project.",
      },
    ],
    related: ["web-applications", "learning-management-systems", "ecommerce"],
  },
  {
    slug: "learning-management-systems",
    name: "Learning Management Systems",
    short:
      "Custom LMS platforms for coaching institutes and schools: courses, tests, batches, payments and progress tracking.",
    headline: "Your teaching, your platform, your data.",
    intro:
      "Generic LMS products charge per student forever and still don't fit how Indian coaching institutes actually run. Batches, test series, doubt sessions, offline-online hybrid. I build LMS platforms owned by the institute, from enrolment to test analytics, on your own infrastructure.",
    forWho:
      "Coaching institutes, schools, universities, training companies and educators who have outgrown YouTube links and WhatsApp groups.",
    deliverables: [
      "Student, teacher and admin portals",
      "Video lectures with secure streaming and DRM options",
      "Test engine: MCQ, subjective, timed mocks, negative marking",
      "Batch management, attendance and fee tracking",
      "Payment gateway integration with receipts and reminders",
      "Performance analytics for students and parents",
    ],
    approach: [
      {
        title: "Built around batches, not just courses",
        body: "Indian institutes run on batches, schedules and test series. The data model reflects that from the start instead of bolting it on.",
      },
      {
        title: "Own your students, own your data",
        body: "No per-student SaaS fees that grow with your success. The platform is yours, hosted on your infrastructure.",
      },
      {
        title: "Reliability during exam season",
        body: "The platform is load-tested for the day 2,000 students hit 'Start Test' at the same moment.",
      },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "AWS", "Cloudflare", "Flutter"],
    faqs: [
      {
        q: "Can it handle live classes?",
        a: "Yes, via integration with Zoom or a self-hosted solution, with attendance and recordings synced back to the platform.",
      },
      {
        q: "How is this better than Teachmint or Classplus?",
        a: "Those are fine to start. But you pay forever, per student, and you can't change how they work. A custom LMS is an asset you own, tailored to your teaching methodology, with no recurring per-student cost.",
      },
    ],
    related: ["mobile-apps", "web-applications", "admin-dashboards"],
  },
  {
    slug: "admin-dashboards",
    name: "Admin Dashboards",
    short:
      "Internal dashboards that turn scattered spreadsheets into one clear, real-time view of your business.",
    headline: "See your whole business on one screen.",
    intro:
      "Most businesses run on a dozen spreadsheets and someone's memory. A well-built dashboard replaces that with a single source of truth: live numbers, role-based access, and workflows your team actually follows. I design dashboards for daily use. Fast, keyboard-friendly, impossible to misread.",
    forWho:
      "Operations-heavy businesses like manufacturing, real estate, hospitals and publishers, where leadership decisions wait on someone compiling a report.",
    deliverables: [
      "Real-time metrics and reporting views",
      "Role-based access for teams and management",
      "Data import from existing spreadsheets and tools",
      "Exports, scheduled reports and alerting",
      "Audit logs for accountability",
      "Mobile-responsive for checking numbers anywhere",
    ],
    approach: [
      {
        title: "Decide what a number is for",
        body: "Every metric on screen answers a specific question someone actually asks. Vanity charts get deleted in design review.",
      },
      {
        title: "Fast enough to live in",
        body: "Sub-second loads and keyboard navigation, because a tool your team avoids is a tool that failed.",
      },
    ],
    stack: ["React", "Next.js", "Node.js", "PostgreSQL", "MongoDB", "Docker"],
    faqs: [
      {
        q: "Can it pull data from tools we already use?",
        a: "Usually, yes. Tally, Google Sheets, existing databases and most SaaS tools with APIs can feed the dashboard automatically.",
      },
    ],
    related: ["crm", "erp", "web-applications"],
  },
  {
    slug: "crm",
    name: "CRM Systems",
    short:
      "Custom CRMs that match your sales process: leads, follow-ups, pipelines and automation without per-seat pricing.",
    headline: "A CRM your team will actually use.",
    intro:
      "Most CRM rollouts fail because the tool doesn't match how the team sells. A custom CRM starts from your actual process: how leads arrive, who follows up, what a hot lead means in your business. Then it automates exactly that. No unused features, no per-seat fees, no fighting the tool.",
    forWho:
      "Real estate firms, coaching institutes, hospitals, agencies. Any business where leads leak because follow-ups live in someone's phone.",
    deliverables: [
      "Lead capture from website, ads, WhatsApp and calls",
      "Pipelines that mirror your real sales stages",
      "Automated follow-up reminders and assignment rules",
      "WhatsApp and email integration",
      "Conversion reporting by source, agent and campaign",
      "Works on mobile for field teams",
    ],
    approach: [
      {
        title: "Shadow the sales team first",
        body: "The CRM is designed around observed behaviour, not an org chart. That is why it gets adopted instead of abandoned.",
      },
      {
        title: "Automate the follow-up, not the relationship",
        body: "The system makes sure no lead is forgotten. Your team does the human part.",
      },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Supabase", "AWS"],
    faqs: [
      {
        q: "We already use a spreadsheet. Is a CRM worth it?",
        a: "If leads are slipping through, yes. The typical win isn't fancy features. It's simply that every lead gets a next action and an owner. That alone usually pays for the system.",
      },
    ],
    related: ["admin-dashboards", "erp", "ai-integrations"],
  },
  {
    slug: "erp",
    name: "ERP Systems",
    short:
      "Focused ERP software for operations: inventory, orders, billing, production. Without the enterprise bloat.",
    headline: "Run operations on software built for your operations.",
    intro:
      "Full-suite ERPs are expensive, painful to implement and mostly unused. I build focused ERP systems that cover the 20% of features that run 100% of your operations: inventory, purchase, production, billing, reporting. Designed around your actual workflow and integrated with what you already use.",
    forWho:
      "Manufacturers, distributors, publishers and multi-branch businesses coordinating operations over phone calls and registers.",
    deliverables: [
      "Inventory, purchase and order management",
      "Production planning and job tracking",
      "GST-compliant billing and reporting",
      "Multi-branch and multi-user support with roles",
      "Tally and accounting integration",
      "Barcode/QR support for stock operations",
    ],
    approach: [
      {
        title: "Digitise the process you have",
        body: "First the system mirrors how you work today. Optimisation comes after adoption. That order matters, and it is why these rollouts succeed.",
      },
      {
        title: "One module at a time",
        body: "Inventory first, then purchase, then production. Each module goes live and proves itself before the next begins.",
      },
    ],
    stack: ["Laravel", "Node.js", "PostgreSQL", "Docker", "AWS"],
    faqs: [
      {
        q: "How disruptive is switching to an ERP?",
        a: "Modules go live one at a time, in parallel with your existing process, until your team trusts the system. No big-bang cutover.",
      },
    ],
    related: ["crm", "admin-dashboards", "web-applications"],
  },
  {
    slug: "ai-integrations",
    name: "AI Integrations",
    short:
      "Practical AI inside your existing software: chat assistants, document automation, and workflows that save real hours.",
    headline: "AI that does work, not demos.",
    intro:
      "Most businesses don't need an AI strategy. They need specific slow, repetitive tasks to disappear. I integrate AI where it measurably saves time: customer-support assistants trained on your content, document processing, lead qualification, content workflows. Every integration is scoped to a task with a before and after you can measure.",
    forWho:
      "Businesses with high support volume, document-heavy processes or content operations. And anyone whose team spends hours on work a model can draft in seconds.",
    deliverables: [
      "Support assistants trained on your actual content",
      "Document extraction and processing pipelines",
      "Lead qualification and routing automation",
      "AI features embedded in your existing apps",
      "Cost monitoring and guardrails built in",
      "Clear escalation to humans when the AI is unsure",
    ],
    approach: [
      {
        title: "Task first, model second",
        body: "We pick one task, define what success looks like, and only then choose the technology. The reverse order is how AI budgets get wasted.",
      },
      {
        title: "Guardrails are the feature",
        body: "Confidence thresholds, human handoffs and monitored costs. Production AI is an engineering problem, and it gets treated like one.",
      },
    ],
    stack: ["Claude API", "Node.js", "Next.js", "PostgreSQL", "AWS"],
    faqs: [
      {
        q: "Will the AI say wrong things to my customers?",
        a: "This is the right question. Assistants are constrained to your approved content, tested against adversarial questions, and escalate to a human when uncertain. You review behaviour before anything goes live.",
      },
    ],
    related: ["web-applications", "crm", "website-performance"],
  },
  {
    slug: "ecommerce",
    name: "E-Commerce",
    short:
      "Fast, conversion-focused online stores: custom storefronts, payments, inventory and order management.",
    headline: "A store engineered to convert, not just exist.",
    intro:
      "E-commerce is unforgiving. Every second of load time and every extra checkout step costs orders. I build stores that are fast, trustworthy and easy to run: custom storefronts with payment integration, inventory sync, and an order pipeline your team can operate without training.",
    forWho:
      "Publishers selling books, D2C brands, restaurants taking orders, and businesses that want to own their store instead of renting a marketplace presence.",
    deliverables: [
      "Custom storefront designed for your catalogue",
      "Razorpay/Stripe payments with COD support",
      "Inventory and order management dashboard",
      "Shipping integration and automated notifications",
      "SEO structure for product and category pages",
      "Analytics on the full funnel, not just sales",
    ],
    approach: [
      {
        title: "Speed is revenue",
        body: "Product pages render statically and load instantly, because in e-commerce, performance is measurably conversion.",
      },
      {
        title: "Reduce steps to paid",
        body: "Every field and click between 'I want this' and payment gets challenged in design. Most stores can lose half their checkout friction.",
      },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Razorpay", "Cloudflare"],
    faqs: [
      {
        q: "Why not just use Shopify?",
        a: "Shopify is genuinely good for standard stores, and I'll say so if it fits. Custom makes sense when you need Indian payment flows, complex catalogues, regional pricing, or a store deeply integrated with your other systems.",
      },
    ],
    related: ["business-websites", "web-applications", "website-performance"],
  },
  {
    slug: "landing-page-development",
    name: "Landing Page Development",
    short:
      "High-converting landing pages for ads and campaigns. Fast, focused, and engineered to turn paid clicks into enquiries.",
    headline: "One page. One goal. No leaks.",
    intro:
      "A landing page has a harder job than any other page on the internet. A stranger arrives from an ad, gives you a few seconds, and either becomes a lead or leaves with your ad money. I design and develop landing pages around that reality: one message, one action, sub-second load times, and a lead form that reaches you instantly. No navigation to leak clicks away. Proof before promises. A form that qualifies leads before you ever pick up the phone.",
    forWho:
      "Businesses running Meta or Google ads: coaching institutes, clinics, real estate projects, D2C brands and startups. And anyone whose campaign traffic currently lands on a generic homepage that was never built to convert.",
    deliverables: [
      "Custom landing page design matched to your ad creative and audience",
      "Message hierarchy built for the 5-second first impression",
      "Lead capture forms with qualification fields and instant delivery",
      "Sub-second load times, because every 100ms of delay costs paid conversions",
      "Meta Pixel, Google Ads and analytics conversion tracking wired in",
      "A/B-testable structure so headlines and offers can be iterated",
      "Mobile-first build, since most ad clicks happen on phones",
      "WhatsApp integration for instant lead contact",
    ],
    approach: [
      {
        title: "Start from the ad, not the page",
        body: "The page must continue the exact promise of the ad that brought the visitor. Same words, same offer, same energy. Message match is the single biggest conversion factor, so I design the page and the ad angle together.",
      },
      {
        title: "Strip everything that isn't the goal",
        body: "No main navigation, no footer maze, no competing calls to action. A visitor on a landing page can do exactly two things: convert, or scroll to convince themselves and then convert.",
      },
      {
        title: "Engineer for the impatient",
        body: "Ad traffic is the least patient traffic there is. Pages render statically and load in under a second on a mid-range phone on 4G, because a spinner is where ad budgets go to die.",
      },
      {
        title: "Measure everything",
        body: "Conversion tracking is part of the build, not an afterthought. You'll know exactly which campaign, ad set and creative produced every lead in your register.",
      },
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Meta Pixel", "Google Analytics"],
    faqs: [
      {
        q: "How much does landing page development cost?",
        a: "Focused single-page campaigns start well under the studio's usual ₹75,000 project floor, since a landing page plus lead handling is a smaller scope. You get a fixed quote after a short discovery call, and the price includes conversion tracking setup.",
      },
      {
        q: "How fast can a landing page go live?",
        a: "Typically 1 to 2 weeks from brief to live, including copy, design, build and tracking. If a campaign deadline is looming, tell me on the call. Compressed timelines are often possible for single-page scopes.",
      },
      {
        q: "Do you also write the landing page copy?",
        a: "Yes. Conversion copy and design are inseparable on a landing page, so I draft the messaging with you rather than pouring your existing brochure text into a new layout.",
      },
      {
        q: "Can you improve my existing landing page instead of building new?",
        a: "Often, yes. If the foundation is sound, a conversion audit covering message match, load speed, form friction and tracking can lift results without a rebuild. I'll tell you honestly which situation you're in.",
      },
    ],
    related: ["business-websites", "website-performance", "ecommerce"],
  },
  {
    slug: "portfolio-websites",
    name: "Portfolio Websites",
    short:
      "Portfolio websites for professionals and creators, designed to win trust and enquiries, not just display work.",
    headline: "Your work deserves better than a template.",
    intro:
      "A portfolio website is a sales document that runs while you sleep. Whether you're an architect, doctor, designer, photographer, consultant or founder, the people evaluating you are quietly comparing your online presence against everyone else they're considering. I build portfolio websites that do the convincing for you: your best work presented with editorial care, your credibility signals placed where evaluators actually look, and a clear path from impressed to in touch. No themes, no page builders, nothing that looks like a thousand other portfolios.",
    forWho:
      "Independent professionals, consultants, creators, architects, doctors, lawyers, artists and agencies who need their work to speak before they enter the room.",
    deliverables: [
      "Custom portfolio design shaped around your discipline and work",
      "Case-study or gallery structures that present work with context",
      "About and credentials pages built around how clients evaluate you",
      "Contact and enquiry flows that convert interest into conversations",
      "SEO structure so your name and specialty rank on Google",
      "Fast, image-optimised delivery, since portfolios are image-heavy by nature",
      "A content structure you can update yourself as new work ships",
    ],
    approach: [
      {
        title: "Show the thinking, not just the output",
        body: "The strongest portfolios explain the problem behind each piece of work. A project with context out-converts a wall of thumbnails. It proves judgment, not just execution.",
      },
      {
        title: "Design around your discipline",
        body: "A surgeon's portfolio and a photographer's portfolio should not share a template. Layout, typography and pacing are chosen for what your evaluators need to feel: precision, warmth, boldness or restraint.",
      },
      {
        title: "Treat images as engineering",
        body: "Portfolios live and die on image quality versus load time. Modern formats, responsive sizing and lazy loading keep full-quality work loading instantly on any device.",
      },
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Vercel", "Cloudflare"],
    faqs: [
      {
        q: "What does a portfolio website cost?",
        a: "Focused personal portfolios start below the studio's usual project floor. Portfolios with case studies, blogs or booking systems are quoted by scope. Every quote is fixed and itemised after a discovery call.",
      },
      {
        q: "I already have work on Instagram and Behance. Why do I need a website?",
        a: "Platforms rank you next to your competitors and own your audience. Your own portfolio site ranks for your name on Google, presents work without an algorithm deciding the order, and captures enquiries directly. No platform sits between you and the client.",
      },
      {
        q: "Can I update the portfolio myself?",
        a: "Yes. Adding new projects, images and text is structured so you never need a developer for routine updates.",
      },
    ],
    related: ["business-websites", "landing-page-development", "website-redesign"],
  },
  {
    slug: "website-redesign",
    name: "Website Redesign",
    short:
      "Redesigns that fix what your current website is costing you: credibility, speed, Google rankings and enquiries.",
    headline: "Your website is telling people something. Is it true?",
    intro:
      "Most redesign enquiries start the same way: 'our website is embarrassing and we avoid sending people to it.' That instinct is usually right. An outdated website quietly undercuts every ad, every referral and every sales conversation you have. But a redesign done as a coat of paint wastes the opportunity. I approach redesign as re-engineering. Keep what works, including your rankings and the content that converts. Fix what doesn't: speed, mobile experience, information architecture, trust signals. And migrate carefully, so years of Google equity aren't destroyed on launch day. That mistake is the most common and most expensive one in redesigns.",
    forWho:
      "Businesses whose websites are three or more years old, slow on mobile, invisible on Google, or simply no longer representative of how good the business actually is.",
    deliverables: [
      "Audit of your current site: speed, SEO, analytics, conversion leaks",
      "Complete redesign with modern, custom design. No templates",
      "SEO-safe migration: redirects, preserved rankings, no lost pages",
      "Performance rebuild, typically 3 to 10 times faster load times",
      "Content restructuring around what customers actually search for",
      "Mobile-first rebuild for the devices your visitors really use",
      "Analytics before and after, so the improvement is measurable",
    ],
    approach: [
      {
        title: "Measure before touching anything",
        body: "Current traffic, rankings, converting pages and drop-off points get documented first. A redesign that ignores this data routinely deletes the exact pages that were quietly earning money.",
      },
      {
        title: "Protect the SEO you already own",
        body: "Every existing URL is mapped to its new home with proper redirects, metadata is carried over and improved, and search engines are told exactly what moved where. Rankings should climb after a redesign, not crater.",
      },
      {
        title: "Rebuild the engine, not just the paint",
        body: "The visible design is half the job. The other half is the rebuild underneath: modern rendering, image optimisation and clean semantic structure that makes the new site dramatically faster than the old one.",
      },
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Cloudflare", "Google Search Console"],
    faqs: [
      {
        q: "Will a redesign hurt my Google rankings?",
        a: "Done carelessly, yes, badly. It is the most common redesign disaster. Done properly, with URL mapping, redirects and improved page structure, rankings usually improve within weeks. Migration safety is a core deliverable of every redesign I take on.",
      },
      {
        q: "Can we keep some parts of the current website?",
        a: "Absolutely. That is the point of auditing first. Content that ranks and converts is preserved and improved rather than replaced for the sake of novelty.",
      },
      {
        q: "How long does a website redesign take?",
        a: "Most business site redesigns take 3 to 6 weeks including the audit, design, rebuild and SEO-safe migration. Larger platforms are scoped individually with a fixed quote.",
      },
    ],
    related: ["business-websites", "website-performance", "website-maintenance"],
  },
  {
    slug: "website-performance",
    name: "Performance & SEO Optimization",
    short:
      "Make your existing website fast and findable: Core Web Vitals, technical SEO and load-time engineering that moves rankings.",
    headline: "Speed is a feature. Google agrees.",
    intro:
      "Two websites with the same content do not rank the same, convert the same, or cost the same to advertise on. The fast, technically clean one wins on every axis. Google uses Core Web Vitals as a ranking signal, visitors abandon slow pages before they render, and ad platforms charge more for landing pages that load poorly. I take existing websites and re-engineer them for speed and search: sub-second loads, 90+ Lighthouse scores, semantic structure and schema markup that make every page legible to search engines. This is the least glamorous, highest-return work in web development. Most agencies skip it because it doesn't produce a pretty screenshot.",
    forWho:
      "Businesses whose websites load slowly, score poorly on PageSpeed Insights, rank below competitors with worse content, or burn ad budget on landing pages that lose visitors before they load.",
    deliverables: [
      "Full performance audit: Core Web Vitals (LCP, CLS, INP), load waterfall, bundle analysis",
      "Image optimisation: modern formats, responsive sizing, lazy loading",
      "JavaScript and CSS reduction, removing what the page doesn't need",
      "Caching and CDN configuration for instant repeat visits",
      "Technical SEO: semantic HTML, schema markup, canonical URLs, sitemaps",
      "Font loading optimisation without design compromise",
      "Before and after Lighthouse and PageSpeed reports. The improvement, in numbers",
    ],
    approach: [
      {
        title: "Measure like Google measures",
        body: "Optimisation targets the exact metrics Google ranks on: Largest Contentful Paint, Cumulative Layout Shift, Interaction to Next Paint. Measured on real mid-range phones on real network conditions, not on a developer's fibre connection.",
      },
      {
        title: "Fix causes, not symptoms",
        body: "A slow site is slow for specific, findable reasons: oversized images, render-blocking scripts, chatty third-party tags, cheap hosting. The audit names each one with its cost in milliseconds. The fixes are then prioritised by impact.",
      },
      {
        title: "SEO is structure, then content",
        body: "Before content can rank it must be crawlable, fast and unambiguous. One topic per URL, proper heading hierarchy, structured data telling Google exactly what your business does and where.",
      },
    ],
    stack: ["Next.js", "Cloudflare", "Lighthouse", "Google Search Console", "Schema.org"],
    faqs: [
      {
        q: "My website scores 40 on PageSpeed Insights. Can it really reach 90+?",
        a: "Almost always, yes. Most low scores come from a handful of heavy, fixable causes: unoptimised images, bloated JavaScript, slow hosting. Occasionally the honest answer is that a rebuild costs less than salvaging a broken foundation. If so, I'll say that with numbers.",
      },
      {
        q: "How is this different from hiring an SEO agency?",
        a: "SEO agencies mostly do content and links, and many quietly outsource the technical work. This is the engineering layer they depend on: making the website itself fast, crawlable and structurally sound. Content marketing works dramatically better on top of it.",
      },
      {
        q: "How quickly do results show?",
        a: "Speed improvements are instant and measurable the day they ship. Ranking movement typically follows over 4 to 12 weeks as Google recrawls and re-evaluates the site. Search Console shows the trend clearly.",
      },
    ],
    related: ["website-redesign", "website-maintenance", "business-websites"],
  },
  {
    slug: "website-maintenance",
    name: "Website Maintenance & Support",
    short:
      "Ongoing care for your website: updates, security, backups, monitoring and small improvements, handled by an engineer who knows your stack.",
    headline: "Websites aren't fire-and-forget.",
    intro:
      "Every website starts decaying the day it launches. Dependencies age, security patches pile up, content drifts out of date, and small breakages accumulate until 'the website guy disappeared' becomes a business risk. Website maintenance is the unglamorous discipline that prevents all of it. I offer ongoing maintenance and support for websites and web applications, whether I built them or you inherited them from another developer. Your site stays fast, secure, backed up and current, and there is always a real engineer who answers when something needs changing. For most businesses this costs less per month than one hour of downtime during a campaign.",
    forWho:
      "Businesses that depend on their website daily, teams whose original developer has moved on, and anyone tired of small website tasks taking weeks because nobody owns them.",
    deliverables: [
      "Security updates and dependency patching on a schedule",
      "Automated backups with tested, documented restore procedures",
      "Uptime and error monitoring with proactive fixes",
      "Content updates and small feature changes within the retainer",
      "Performance checks so the site stays fast as content grows",
      "Monthly summary of work done. No invisible retainers",
      "Priority response when something breaks",
    ],
    approach: [
      {
        title: "Take over cleanly",
        body: "Inherited websites get a documented onboarding: access audit, backup verification, dependency review and a written map of how everything fits together. From then on, nothing about your website is a mystery held in one person's head.",
      },
      {
        title: "Prevent, don't just repair",
        body: "Monitoring catches failing certificates, broken forms and creeping slowness before customers do. Most months, the best maintenance work is the incident that never happened.",
      },
      {
        title: "Keep it honest",
        body: "Every month you see exactly what was done and what it cost. Retainers are cancellable anytime. The work has to justify itself, not a lock-in clause.",
      },
    ],
    stack: ["Node.js", "Docker", "Cloudflare", "AWS", "Uptime monitoring"],
    faqs: [
      {
        q: "Can you maintain a website another developer built?",
        a: "Yes. Most maintenance clients arrive exactly this way. The onboarding audit establishes what exists, what's risky and what it costs to keep healthy, before any commitment.",
      },
      {
        q: "What does website maintenance cost?",
        a: "Retainers are scoped to the site's complexity and how much change you need monthly. Simple sites cost a few thousand rupees a month; applications with active development cost more. You get a fixed monthly number after the audit, cancellable anytime.",
      },
      {
        q: "Do I need maintenance if my site is brand new?",
        a: "New sites need less, but not zero. Dependencies, backups and monitoring matter from day one. Every Kodinav build includes a support period, after which a light retainer keeps it covered.",
      },
    ],
    related: ["website-performance", "website-redesign", "web-applications"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
