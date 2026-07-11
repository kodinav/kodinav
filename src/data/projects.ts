export type ProjectImage = { src: string; alt: string };

export type Project = {
  slug: string;
  name: string;
  industry: string;
  category: string;
  year: string;
  url?: string;
  summary: string;
  challenge: string;
  solution: string;
  stack: string[];
  impact: string[];
  accent: string;
  images: {
    cover: ProjectImage;
    desktop: ProjectImage[];
    mobile: ProjectImage[];
  };
  caseStudy: {
    overview: string;
    problem: string;
    research: string;
    planning: string;
    design: string;
    development: string;
    challenges: { challenge: string; solution: string }[];
    results: { metric: string; label: string }[];
    outcome: string;
  };
};

export const projects: Project[] = [
  {
    slug: "lighthouse-classes",
    name: "Lighthouse Classes",
    industry: "Education · Language Learning Platform",
    category: "LMS & E-Learning",
    year: "2025",
    summary:
      "A complete online language-learning platform for Urdu, English and Persian — structured courses, live classes, a built-in dictionary and a mentor community, engineered to teach script, conversation and poetry to thousands of learners.",
    challenge:
      "Serious teachers of Urdu, English and Persian had no single home online. Lessons were scattered across YouTube links and WhatsApp groups, there was no structured path from beginner to fluency, and no way to run paid live classes or track a learner's progress.",
    solution:
      "A full learning platform: structured multi-level courses, live class scheduling, a searchable Urdu–English dictionary, teacher profiles, streaks and progress tracking, community features, and a payments-ready course catalogue — all under one fast, SEO-friendly roof.",
    stack: ["Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS", "Cloudflare"],
    impact: [
      "One home for courses, live classes, dictionary and community",
      "Right-to-left support so Urdu and Persian read correctly",
      "Courses and dictionary entries built to rank on Google individually",
    ],
    accent: "#c0392b",
    images: {
      cover: {
        src: "/projects/lighthouse-classes-home.jpg",
        alt: "Lighthouse Classes homepage — an online platform to learn Urdu, English and Persian, with the headline 'Every language deserves a guiding light'",
      },
      desktop: [
        {
          src: "/projects/lighthouse-classes-courses.jpg",
          alt: "Lighthouse Classes course catalogue page listing structured Urdu, English and Persian courses",
        },
        {
          src: "/projects/lighthouse-classes-dictionary.jpg",
          alt: "The built-in Urdu–English dictionary inside the Lighthouse Classes learning platform",
        },
        {
          src: "/projects/lighthouse-classes-live.jpg",
          alt: "Lighthouse Classes live classes schedule page for online language sessions",
        },
      ],
      mobile: [
        {
          src: "/projects/lighthouse-classes-mobile.jpg",
          alt: "Lighthouse Classes language-learning platform on a mobile phone",
        },
      ],
    },
    caseStudy: {
      overview:
        "Lighthouse Classes is an online academy for learning Urdu, English and Persian — script, conversation, poetry and calligraphy — taught by ustads and scholars. The engagement built the entire platform: a public marketing site, a structured course catalogue, live-class scheduling, a searchable dictionary, teacher profiles, learner dashboards with streaks, and a community layer.",
      problem:
        "Demand for structured Urdu and Persian teaching was real, but the experience online was broken. Prospective students found a maze of unlisted videos and WhatsApp groups with no clear starting point, no sense of progression, and no way to pay for and join proper live classes. Teachers had no platform that respected the craft — script direction, poetry, calligraphy — or let them build a following.",
      research:
        "I studied how language learners actually progress and where they drop off: the first barrier is script, the second is losing momentum without feedback. Talking through the teaching methodology made it clear the platform had to support more than video — live sessions, a reference dictionary, and visible progress were essential to keep learners going past week two.",
      planning:
        "The build was sliced so value shipped early: the public site and course catalogue first (credibility and discovery), then live classes and payments (revenue), then the dictionary, community and dashboards (retention). Each slice went live independently and informed the next.",
      design:
        "The design had to feel scholarly and warm rather than gamified and loud — a guiding-light metaphor, calm serif-led typography, and right-to-left-aware layouts for Urdu and Persian content. Course pages lead with what a learner will actually be able to do; the dictionary and live-class surfaces are built for daily return visits, not one-time browsing.",
      development:
        "The platform is a Next.js application with a Node and PostgreSQL backend. Course, dictionary and marketing pages are statically rendered for speed and search visibility, while dashboards, streaks and live scheduling are dynamic and authenticated. Content is structured with schema markup so individual courses and dictionary entries can rank on their own.",
      challenges: [
        {
          challenge:
            "Urdu and Persian are right-to-left scripts, which most web layouts handle badly — mixed RTL/LTR content, fonts and punctuation break easily.",
          solution:
            "Layouts were built RTL-aware from the ground up with proper script fonts and bidirectional text handling, so Urdu, Persian and English sit correctly on the same page.",
        },
        {
          challenge:
            "Learners lose motivation fast without visible progress and a reason to return between lessons.",
          solution:
            "Streaks, a learner dashboard and a live-class calendar give a daily reason to come back, turning a passive video library into an active habit.",
        },
      ],
      results: [
        { metric: "3", label: "languages taught in depth — Urdu, English, Persian" },
        { metric: "1 home", label: "for courses, live classes, dictionary and community" },
        { metric: "SEO-ready", label: "courses and dictionary entries indexed individually" },
        { metric: "Fast", label: "statically-rendered pages built to rank and convert" },
      ],
      outcome:
        "Lighthouse Classes now has a real platform that matches the seriousness of its teaching — a place learners can find on Google, start from the right level, pay for live classes, and keep their momentum. It is the foundation for the academy's growth into new languages and cohorts.",
    },
  },
  {
    slug: "achievers-hive",
    name: "Achiever's Hive",
    industry: "Education · EdTech Platform",
    category: "LMS & E-Learning",
    year: "2025",
    summary:
      "A focused e-learning platform for CBSE Class 11 & 12 Psychology — chapter-wise video lectures, exam-ready notes, PDFs and quizzes, engineered for a calm, distraction-free study experience.",
    challenge:
      "A specialist educator with a large student following needed to move off scattered YouTube playlists and PDF dumps into a single, credible platform — one that organised every lecture, note and quiz by chapter and felt calm to study in.",
    solution:
      "A fast, distraction-free learning platform: chapter-wise video lectures with progress tracking, downloadable one-shot notes and PDFs, structured full courses, quizzes, and search across the whole library.",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Vercel"],
    impact: [
      "Scattered YouTube playlists replaced by one organised platform",
      "Chapter-wise lectures, notes and quizzes in a distraction-free view",
      "Reframed from a personal channel into a credible paid platform",
    ],
    accent: "#4f46e5",
    images: {
      cover: {
        src: "/projects/achievers-hive-home.jpg",
        alt: "Achiever's Hive homepage — 'Master Psychology, the smart way' — an e-learning platform for CBSE Class 11 and 12 Psychology",
      },
      desktop: [
        {
          src: "/projects/achievers-hive-lectures.jpg",
          alt: "Achiever's Hive lectures library with chapter-wise video lessons and notes",
        },
      ],
      mobile: [
        {
          src: "/projects/achievers-hive-mobile.jpg",
          alt: "Achiever's Hive Psychology learning platform on a mobile phone",
        },
      ],
    },
    caseStudy: {
      overview:
        "Achiever's Hive is an e-learning platform for CBSE Class 11 & 12 Psychology, built around one educator's teaching. It brings chapter-wise video lectures, exam-ready notes, PDFs and quizzes into one calm, distraction-free place — replacing the usual sprawl of YouTube links and shared folders.",
      problem:
        "The teaching was excellent and the audience was large, but the delivery was fragmented. Students hunted across playlists for the right lecture, notes lived in disorganised drives, and there was no sense of a structured course or progress. The brand looked like a channel, not a platform — which capped both trust and revenue.",
      research:
        "I looked at how exam-focused students actually study: they want the exact chapter they're on, the matching one-shot notes, and a quick quiz to check themselves — with zero distraction. Anything that adds friction or noise between them and the next lecture loses them.",
      planning:
        "Content architecture came first: everything modelled by subject → chapter → lecture, with notes and quizzes attached to each. The platform was then built to make that structure feel effortless to move through, with the marketing site and course pages designed to convert visitors into signups.",
      design:
        "A calm, confident interface — generous spacing, a single accent, and a 'now playing' study view that keeps the focus on the lecture. The homepage leads with real proof (large student base, lecture count, rating) because for an educator, credibility is the conversion.",
      development:
        "Built as a statically-exported Next.js application for speed and cheap, reliable hosting. Lecture, note and quiz content is structured and searchable; the whole experience is fast on the mid-range phones most students use, and works well even on patchy connections.",
      challenges: [
        {
          challenge:
            "Study platforms are easy to make cluttered and overwhelming, which is exactly what students are trying to escape.",
          solution:
            "Ruthless focus on one task per screen — watch, read the note, take the quiz — with a distraction-free player and a clean chapter structure.",
        },
        {
          challenge:
            "The brand needed to feel like a trustworthy platform, not a personal channel, to justify paid courses.",
          solution:
            "A polished, consistent design system and prominent real proof points reframed it from 'a teacher's videos' into 'a platform worth paying for'.",
        },
      ],
      results: [
        { metric: "1.8L+", label: "students reached (figure shown on the live site)" },
        { metric: "120+", label: "structured chapter-wise lectures" },
        { metric: "4.9", label: "learner rating displayed on the platform" },
        { metric: "Distraction-free", label: "study experience across every device" },
      ],
      outcome:
        "Achiever's Hive now looks and works like the serious study platform its teaching deserves — one organised home for lectures, notes and quizzes that students trust and return to, and a credible base for launching paid courses.",
    },
  },
  {
    slug: "triplipi",
    name: "Triplipi",
    industry: "Travel · Discovery Platform",
    category: "Web Application & CMS",
    year: "2025",
    summary:
      "An editorial travel-discovery platform with 450 curated destinations, trip packages and a brand-styled admin CMS that lets the team control every section of the site without touching code.",
    challenge:
      "A travel brand wanted more than a booking page — a genuinely editorial discovery experience across hundreds of destinations, where the team could update packages, picks and stories themselves, without a developer in the loop for every change.",
    solution:
      "A server-rendered discovery platform with a curated destination index, individual destination pages, trip packages, a gallery and blog — backed by a custom, schema-driven admin CMS that controls every section, nav item and piece of content.",
    stack: ["Node.js", "Express", "Nunjucks", "JavaScript", "Custom CMS"],
    impact: [
      "450 curated destinations in one careful, editorial index",
      "A custom CMS lets the team edit every section without code",
      "Server-rendered pages that search engines index individually",
    ],
    accent: "#c75b39",
    images: {
      cover: {
        src: "/projects/triplipi-home.jpg",
        alt: "Triplipi travel-discovery platform homepage with the word 'Slowly' over an aerial photo of a destination and a search bar",
      },
      desktop: [
        {
          src: "/projects/triplipi-destinations.jpg",
          alt: "Triplipi destinations index — 'Four hundred and fifty destinations, one careful index' — a curated, filterable travel directory",
        },
        {
          src: "/projects/triplipi-detail.jpg",
          alt: "The Triplipi editorial travel blog — photo essays and field notes from real trips",
        },
        {
          src: "/projects/triplipi-gallery.jpg",
          alt: "The Triplipi photo gallery of curated travel destinations",
        },
      ],
      mobile: [
        {
          src: "/projects/triplipi-mobile.jpg",
          alt: "Triplipi travel platform homepage on a mobile phone",
        },
        {
          src: "/projects/triplipi-mobile-2.jpg",
          alt: "The Triplipi about page on a mobile phone",
        },
      ],
    },
    caseStudy: {
      overview:
        "Triplipi is a premium travel-discovery platform for travellers who 'measure journeys in moments, not miles.' It presents 450 curated destinations as a careful, editorial index — each one visited, photographed or independently verified — alongside trip packages, a gallery and a blog, all managed through a custom admin CMS.",
      problem:
        "Most travel sites are either thin booking pages or bloated aggregators. This brand wanted the opposite: a slow, editorial experience that treats destinations like stories worth reading. It also needed the team to own its content — updating destinations, packages and picks daily — without waiting on a developer for every edit.",
      research:
        "I studied how people actually choose where to travel: they arrive from a search or a story, want honest photography and a real sense of place, then a clear next step to a package. That shaped a platform where each destination page is a self-sufficient, indexable story, not an interior page of an app.",
      planning:
        "The architecture separated the read-heavy public site from a content layer the team controls. Every section of every page maps to a schema entry in the CMS, so the same admin panel that edits the header nav also edits a destination's photo essay — one consistent, brand-styled system.",
      design:
        "The design is unapologetically editorial: full-bleed photography, a refined serif voice, generous space, and a calm rhythm that rewards slow browsing. The destination index is built to be filtered by mood — mountains for solitude, islands for slowness — rather than just by map pin.",
      development:
        "Server-rendered with Node, Express and Nunjucks so the delivered HTML is fast and fully indexable, backed by a JSON content store and a custom schema-driven admin panel. The CMS controls global brand settings, navigation, and every content section, with image uploads — giving the team true independence.",
      challenges: [
        {
          challenge:
            "The team needed to edit every part of the site themselves, but generic CMSs would have forced the brand's editorial design into rigid templates.",
          solution:
            "A custom schema-driven CMS where each section is one schema entry — flexible enough to edit any content, opinionated enough to keep the design consistent.",
        },
        {
          challenge:
            "450 destination pages had to be fast and individually discoverable on search engines.",
          solution:
            "Server-side rendering with per-page metadata and a sitemap means every destination is a fast, self-contained landing page that search engines can index on its own.",
        },
      ],
      results: [
        { metric: "450", label: "curated destinations in one careful index" },
        { metric: "100%", label: "of content editable by the team via the custom CMS" },
        { metric: "SSR", label: "server-rendered pages, fully indexable by search engines" },
        { metric: "Editorial", label: "a discovery experience, not just a booking form" },
      ],
      outcome:
        "Triplipi launched as a genuinely editorial travel platform the team runs entirely themselves. Every destination is a fast, indexable story, packages flow from discovery, and new content ships daily without a developer — exactly the independence the brand needed.",
    },
  },
  {
    slug: "trinket",
    name: "Trinket",
    industry: "E-Commerce · D2C Brand",
    category: "E-Commerce",
    year: "2025",
    summary:
      "A direct-to-consumer online store for a personalised-memory brand — photo prints, journals, calendars, postcards and keepsake books — with a warm, editorial storefront designed to convert browsers into gifts.",
    challenge:
      "A young D2C brand turning people's photos into physical keepsakes needed a store as emotive as the products — one that sold the feeling, handled personalised and occasion-based products, and ran without a marketplace taking its margin.",
    solution:
      "A custom e-commerce storefront built around emotion and occasion: editorial product storytelling, shop-by-occasion browsing, personalised keepsake products, and a checkout and order flow the brand owns end to end.",
    stack: ["Next.js", "React", "Node.js", "SQLite", "Tailwind CSS", "Razorpay"],
    impact: [
      "An emotive, editorial storefront that sells the feeling",
      "Shop-by-occasion flow built around how gifts are chosen",
      "Owned store, off high-commission marketplaces — full margin",
    ],
    accent: "#d98a3d",
    images: {
      cover: {
        src: "/projects/trinket-hero.jpg",
        alt: "Trinket hero — polaroid-style photo prints and handwritten notes on a soft blue cloth, from a personalised-memory keepsake brand",
      },
      desktop: [
        {
          src: "/projects/trinket-lifestyle.jpg",
          alt: "Trinket lifestyle image — personalised photo keepsakes styled together",
        },
        {
          src: "/projects/trinket-home-1.jpg",
          alt: "Trinket keepsakes displayed in a real home",
        },
        {
          src: "/projects/trinket-home-2.jpg",
          alt: "Trinket personalised photo products styled in a living space",
        },
      ],
      mobile: [
        {
          src: "/projects/trinket-calendar.jpg",
          alt: "Trinket personalised photo calendar product",
        },
        {
          src: "/projects/trinket-photobook.jpg",
          alt: "Trinket 'Our Forever' keepsake photo book product",
        },
      ],
    },
    caseStudy: {
      overview:
        "Trinket is a direct-to-consumer brand that turns people's favourite photos into physical keepsakes — prints, journals, calendars, postcards and memory books. The project built its storefront: an emotive, editorial shopping experience designed to sell the feeling behind the product and convert visitors into gifts and self-purchases.",
      problem:
        "Personalised keepsakes are an emotional purchase, but most e-commerce templates sell them like commodities — grids of thumbnails and spec tables. Trinket needed a store that made people feel something first, handled personalised and occasion-based products, and kept the brand off high-commission marketplaces so it owned both margin and customer relationship.",
      research:
        "I looked at why people buy keepsakes: it's almost always for a moment or a person — an anniversary, a parent, 'the blurry photo everyone still laughs about.' That insight drove an occasion-first structure and product pages that lead with story and real lifestyle imagery rather than dimensions.",
      planning:
        "The store was planned around two entry points: shop-by-occasion for gifters who know the moment but not the product, and product-first browsing for returning customers. Personalisation and a clean, low-friction checkout sat at the core, with an order pipeline the brand could run itself.",
      design:
        "The design is warm and editorial — soft colour fields, handwritten accents, and full-bleed lifestyle photography that shows the keepsakes in real homes. Every product page is built to make the customer picture the memory in their hands before they see the price.",
      development:
        "A Next.js storefront with a Node backend and payment integration, with statically-rendered product and category pages for speed and SEO. The catalogue supports personalised and occasion-tagged products, and the order flow is designed for a small team to fulfil without marketplace tooling.",
      challenges: [
        {
          challenge:
            "Emotional products lose their pull the moment they're presented like generic e-commerce SKUs.",
          solution:
            "Editorial product pages that lead with story and lifestyle photography, so the emotional case lands before any specification does.",
        },
        {
          challenge:
            "Gift buyers often know the occasion but not which product they want.",
          solution:
            "A shop-by-occasion structure guides them from 'anniversary' or 'for parents' straight to the right keepsake, reducing the choice paralysis that kills gift conversions.",
        },
      ],
      results: [
        { metric: "Own store", label: "off high-commission marketplaces, full margin retained" },
        { metric: "Occasion-first", label: "browsing built around how gifts are actually chosen" },
        { metric: "Fast + SEO", label: "statically-rendered product and category pages" },
        { metric: "Personalised", label: "keepsake products supported end to end" },
      ],
      outcome:
        "Trinket launched with a storefront that finally matches the emotion of its products — an editorial, occasion-first shopping experience the brand owns completely, from the first photograph on the homepage to the order in the fulfilment queue.",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
