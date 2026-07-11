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
};

export const services: Service[] = [
  {
    slug: "business-websites",
    name: "Business Websites",
    short:
      "Fast, credible marketing websites that turn visitors into enquiries — built for search engines from day one.",
    headline: "A website that earns trust before you say a word.",
    intro:
      "Most business websites are slow, generic and invisible on Google. I build websites that load in under a second, read clearly on every device and are structured so search engines understand exactly what your business does. The result is a site that works as a salesperson, not a brochure.",
    forWho:
      "Coaching institutes, clinics, schools, hotels, restaurants, real estate firms, manufacturers and any business whose website should be generating enquiries.",
    deliverables: [
      "Custom design — no templates, no page builders",
      "Performance-first build (95+ Lighthouse scores)",
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
        body: "Static rendering, optimised images, minimal JavaScript. Speed is a ranking factor and a trust signal — slow sites lose both.",
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
        a: "Typically 3–6 weeks from discovery call to launch, depending on the number of pages and how quickly content decisions are made.",
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
  },
  {
    slug: "web-applications",
    name: "Custom Web Applications",
    short:
      "Bespoke web software — portals, platforms and tools built around how your business actually works.",
    headline: "Software shaped around your business, not the other way around.",
    intro:
      "Off-the-shelf tools force your business into their workflow. A custom web application does the opposite: it encodes the way you already work, removes the manual steps and gives you a system your competitors can't buy. I design and build these end-to-end — database to interface.",
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
        body: "You see working software in weeks, not months. Each release is usable, so value arrives early and course corrections are cheap.",
      },
      {
        title: "Design for the tenth user and the ten-thousandth",
        body: "Sensible architecture from the start — so scaling is a configuration change, not a rewrite.",
      },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Supabase", "Docker", "AWS"],
    faqs: [
      {
        q: "What does a custom web application cost?",
        a: "Projects start at ₹75,000 for focused internal tools and scale with complexity. After a discovery call you get a fixed, itemised quote — no surprises mid-project.",
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
  },
  {
    slug: "mobile-apps",
    name: "Mobile Apps",
    short:
      "iOS and Android apps from a single codebase — native feel, app-store ready, built to be maintained.",
    headline: "One codebase. Both app stores. No compromise on feel.",
    intro:
      "I build mobile apps with Flutter, which means your iOS and Android apps ship together, look identical and cost roughly half of maintaining two native codebases. From push notifications to offline mode to app store submission, the entire pipeline is handled.",
    forWho:
      "Coaching institutes launching learning apps, clinics offering appointment booking, businesses that need customer or field-staff apps.",
    deliverables: [
      "Flutter apps for iOS and Android from one codebase",
      "Push notifications, offline support, deep linking",
      "Backend APIs and admin panel to manage the app",
      "App Store and Play Store submission handled end-to-end",
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
        body: "Review guidelines, signing, versioning and staged rollouts are handled so launch day is boring — which is exactly what you want.",
      },
    ],
    stack: ["Flutter", "Firebase", "Node.js", "PostgreSQL", "Supabase"],
    faqs: [
      {
        q: "Why Flutter instead of native development?",
        a: "For most business apps, Flutter delivers indistinguishable quality at significantly lower build and maintenance cost. If your app genuinely needs native (heavy AR, specialised hardware), I'll tell you honestly.",
      },
      {
        q: "Do you handle app store publishing?",
        a: "Yes — developer accounts, store listings, screenshots, review process and staged rollouts are all part of the project.",
      },
    ],
  },
  {
    slug: "learning-management-systems",
    name: "Learning Management Systems",
    short:
      "Custom LMS platforms for coaching institutes and schools — courses, tests, batches, payments and progress tracking.",
    headline: "Your teaching, your platform, your data.",
    intro:
      "Generic LMS products charge per student forever and still don't fit how Indian coaching institutes actually run — batches, test series, doubt sessions, offline-online hybrid. I build LMS platforms owned by the institute: enrolment to test analytics, on your own infrastructure.",
    forWho:
      "Coaching institutes, schools, universities, training companies and educators who have outgrown YouTube links and WhatsApp groups.",
    deliverables: [
      "Student, teacher and admin portals",
      "Video lectures with secure streaming and DRM options",
      "Test engine — MCQ, subjective, timed mocks, negative marking",
      "Batch management, attendance and fee tracking",
      "Payment gateway integration with receipts and reminders",
      "Performance analytics for students and parents",
    ],
    approach: [
      {
        title: "Built around batches, not just courses",
        body: "Indian institutes run on batches, schedules and test series. The data model reflects that from the start — not bolted on.",
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
        a: "Yes — via integration with Zoom or a self-hosted solution, with attendance and recordings synced back to the platform.",
      },
      {
        q: "How is this better than Teachmint or Classplus?",
        a: "Those are fine to start. But you pay forever, per student, and you can't change how they work. A custom LMS is an asset you own, tailored to your teaching methodology, with no recurring per-student cost.",
      },
    ],
  },
  {
    slug: "admin-dashboards",
    name: "Admin Dashboards",
    short:
      "Internal dashboards that turn scattered spreadsheets into one clear, real-time view of your business.",
    headline: "See your whole business on one screen.",
    intro:
      "Most businesses run on a dozen spreadsheets and someone's memory. A well-built dashboard replaces that with a single source of truth — live numbers, role-based access, and workflows your team actually follows. I design dashboards for daily use: fast, keyboard-friendly and impossible to misread.",
    forWho:
      "Operations-heavy businesses — manufacturing, real estate, hospitals, publishers — where leadership decisions wait on someone compiling a report.",
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
        body: "Every metric on screen answers a specific question someone actually asks. Vanity charts are deleted in design review.",
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
        a: "Usually, yes — Tally, Google Sheets, existing databases and most SaaS tools with APIs can feed the dashboard automatically.",
      },
    ],
  },
  {
    slug: "crm",
    name: "CRM Systems",
    short:
      "Custom CRMs that match your sales process — leads, follow-ups, pipelines and automation without per-seat pricing.",
    headline: "A CRM your team will actually use.",
    intro:
      "Most CRM rollouts fail because the tool doesn't match how the team sells. A custom CRM starts from your actual process — how leads arrive, who follows up, what a 'hot' lead means in your business — and automates exactly that. No unused features, no per-seat fees, no fighting the tool.",
    forWho:
      "Real estate firms, coaching institutes, hospitals, agencies — any business where leads leak because follow-ups live in someone's phone.",
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
        body: "The CRM is designed around observed behaviour, not an org chart — which is why it gets adopted instead of abandoned.",
      },
      {
        title: "Automate the follow-up, not the relationship",
        body: "The system makes sure no lead is forgotten; your team does the human part.",
      },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Supabase", "AWS"],
    faqs: [
      {
        q: "We already use a spreadsheet. Is a CRM worth it?",
        a: "If leads are slipping through — yes. The typical win isn't fancy features, it's simply that every lead gets a next action and an owner. That alone usually pays for the system.",
      },
    ],
  },
  {
    slug: "erp",
    name: "ERP Systems",
    short:
      "Focused ERP software for operations — inventory, orders, billing, production — without the enterprise bloat.",
    headline: "Run operations on software built for your operations.",
    intro:
      "Full-suite ERPs are expensive, painful to implement and mostly unused. I build focused ERP systems that cover the 20% of features that run 100% of your operations — inventory, purchase, production, billing, reporting — designed around your actual workflow and integrated with what you already use.",
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
        body: "First the system mirrors how you work today. Optimisation comes after adoption — that order matters, and it's why these rollouts succeed.",
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
  },
  {
    slug: "ai-integrations",
    name: "AI Integrations",
    short:
      "Practical AI inside your existing software — chat assistants, document automation, and workflows that save real hours.",
    headline: "AI that does work, not demos.",
    intro:
      "Most businesses don't need an 'AI strategy' — they need specific slow, repetitive tasks to disappear. I integrate AI where it measurably saves time: customer-support assistants trained on your content, document processing, lead qualification, content workflows. Every integration is scoped to a task with a before/after you can measure.",
    forWho:
      "Businesses with high support volume, document-heavy processes or content operations — and anyone whose team spends hours on work a model can draft in seconds.",
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
        body: "Confidence thresholds, human handoffs and monitored costs — production AI is an engineering problem, and it's treated like one.",
      },
    ],
    stack: ["Claude API", "Node.js", "Next.js", "PostgreSQL", "AWS"],
    faqs: [
      {
        q: "Will the AI say wrong things to my customers?",
        a: "This is the right question. Assistants are constrained to your approved content, tested against adversarial questions, and escalate to a human when uncertain. You review behaviour before anything goes live.",
      },
    ],
  },
  {
    slug: "ecommerce",
    name: "E-Commerce",
    short:
      "Fast, conversion-focused online stores — custom storefronts, payments, inventory and order management.",
    headline: "A store engineered to convert, not just exist.",
    intro:
      "E-commerce is unforgiving: every second of load time and every extra checkout step costs orders. I build stores that are fast, trustworthy and easy to run — custom storefronts with payment integration, inventory sync and an order pipeline your team can operate without training.",
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
        body: "Product pages render statically and load instantly — because in e-commerce, performance is measurably conversion.",
      },
      {
        title: "Reduce steps to paid",
        body: "Every field and click between 'I want this' and payment is challenged in design. Most stores can lose half their checkout friction.",
      },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Razorpay", "Cloudflare"],
    faqs: [
      {
        q: "Why not just use Shopify?",
        a: "Shopify is genuinely good for standard stores, and I'll say so if it fits. Custom makes sense when you need Indian payment flows, complex catalogues, regional pricing, or a store deeply integrated with your other systems.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
