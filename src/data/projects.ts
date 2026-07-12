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
      "A complete online language-learning platform for Urdu, English and Persian. Structured courses, live classes, a built-in dictionary and a mentor community, engineered to teach script, conversation and poetry to thousands of learners.",
    challenge:
      "Serious teachers of Urdu, English and Persian had no single home online. Lessons were scattered across YouTube links and WhatsApp groups, there was no structured path from beginner to fluency, and no way to run paid live classes or track a learner's progress.",
    solution:
      "A full learning platform: structured multi-level courses, live class scheduling, a searchable Urdu-English dictionary, teacher profiles, streaks and progress tracking, community features, and a payments-ready course catalogue, all under one fast, SEO-friendly roof.",
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
        alt: "Lighthouse Classes homepage, an online platform to learn Urdu, English and Persian, with the headline 'Every language deserves a guiding light'",
      },
      desktop: [
        {
          src: "/projects/lighthouse-classes-courses.jpg",
          alt: "Lighthouse Classes course catalogue page listing structured Urdu, English and Persian courses",
        },
        {
          src: "/projects/lighthouse-classes-dictionary.jpg",
          alt: "The built-in Urdu-English dictionary inside the Lighthouse Classes learning platform",
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
        "Lighthouse Classes is an online academy for learning Urdu, English and Persian: script, conversation, poetry and calligraphy, taught by ustads and scholars. The engagement built the entire platform. A public marketing site, a structured course catalogue, live-class scheduling, a searchable dictionary, teacher profiles, learner dashboards with streaks, and a community layer.",
      problem:
        "Demand for structured Urdu and Persian teaching was real, but the experience online was broken. Prospective students faced a maze of unlisted videos and WhatsApp groups with no clear starting point, no sense of progression, and no way to pay for and join proper live classes. Teachers had no platform that respected the craft or let them build a following.",
      research:
        "I studied how language learners actually progress and where they drop off. The first barrier is script. The second is losing momentum without feedback. Talking through the teaching methodology made it clear the platform had to support more than video. Live sessions, a reference dictionary, and visible progress were essential to keep learners going past week two.",
      planning:
        "The build was sliced so value shipped early. The public site and course catalogue came first for credibility and discovery. Live classes and payments followed for revenue. The dictionary, community and dashboards completed the retention layer. Each slice went live independently and informed the next.",
      design:
        "The design had to feel scholarly and warm rather than gamified and loud: a guiding-light metaphor, calm serif-led typography, and right-to-left-aware layouts for Urdu and Persian content. Course pages lead with what a learner will actually be able to do. The dictionary and live-class surfaces are built for daily return visits, not one-time browsing.",
      development:
        "The platform is a Next.js application with a Node and PostgreSQL backend. Course, dictionary and marketing pages are statically rendered for speed and search visibility, while dashboards, streaks and live scheduling are dynamic and authenticated. Content is structured with schema markup so individual courses and dictionary entries can rank on their own.",
      challenges: [
        {
          challenge:
            "Urdu and Persian are right-to-left scripts, which most web layouts handle badly. Mixed RTL and LTR content, fonts and punctuation break easily.",
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
        { metric: "3", label: "languages taught in depth: Urdu, English, Persian" },
        { metric: "1 home", label: "for courses, live classes, dictionary and community" },
        { metric: "SEO-ready", label: "courses and dictionary entries indexed individually" },
        { metric: "Fast", label: "statically-rendered pages built to rank and convert" },
      ],
      outcome:
        "Lighthouse Classes now has a real platform that matches the seriousness of its teaching. A place learners can find on Google, start from the right level, pay for live classes, and keep their momentum. It is the foundation for the academy's growth into new languages and cohorts.",
    },
  },
  {
    slug: "achievers-hive",
    name: "Achiever's Hive",
    industry: "Education · EdTech Platform",
    category: "LMS & E-Learning",
    year: "2025",
    summary:
      "A focused e-learning platform for CBSE Class 11 & 12 Psychology. Chapter-wise video lectures, exam-ready notes, PDFs and quizzes, engineered for a calm, distraction-free study experience.",
    challenge:
      "A specialist educator with a large student following needed to move off scattered YouTube playlists and PDF dumps into a single, credible platform. One that organised every lecture, note and quiz by chapter and felt calm to study in.",
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
        alt: "Achiever's Hive homepage with the headline 'Master Psychology, the smart way', an e-learning platform for CBSE Class 11 and 12 Psychology",
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
        "Achiever's Hive is an e-learning platform for CBSE Class 11 & 12 Psychology, built around one educator's teaching. It brings chapter-wise video lectures, exam-ready notes, PDFs and quizzes into one calm, distraction-free place, replacing the usual sprawl of YouTube links and shared folders.",
      problem:
        "The teaching was excellent and the audience was large, but the delivery was fragmented. Students hunted across playlists for the right lecture, notes lived in disorganised drives, and there was no sense of a structured course or progress. The brand looked like a channel, not a platform. That capped both trust and revenue.",
      research:
        "I looked at how exam-focused students actually study. They want the exact chapter they are on, the matching one-shot notes, and a quick quiz to check themselves, with zero distraction. Anything that adds friction or noise between them and the next lecture loses them.",
      planning:
        "Content architecture came first: everything modelled by subject, chapter and lecture, with notes and quizzes attached to each. The platform was then built to make that structure feel effortless to move through, with the marketing site and course pages designed to convert visitors into signups.",
      design:
        "A calm, confident interface. Generous spacing, a single accent, and a 'now playing' study view that keeps the focus on the lecture. The homepage leads with real proof: student base, lecture count, rating. For an educator, credibility is the conversion.",
      development:
        "Built as a statically-exported Next.js application for speed and cheap, reliable hosting. Lecture, note and quiz content is structured and searchable. The whole experience stays fast on the mid-range phones most students use, and works well even on patchy connections.",
      challenges: [
        {
          challenge:
            "Study platforms are easy to make cluttered and overwhelming, which is exactly what students are trying to escape.",
          solution:
            "Ruthless focus on one task per screen: watch, read the note, take the quiz. A distraction-free player and a clean chapter structure carry the whole experience.",
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
        "Achiever's Hive now looks and works like the serious study platform its teaching deserves. One organised home for lectures, notes and quizzes that students trust and return to, and a credible base for launching paid courses.",
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
      "A travel brand wanted more than a booking page. It wanted a genuinely editorial discovery experience across hundreds of destinations, where the team could update packages, picks and stories themselves, without a developer in the loop for every change.",
    solution:
      "A server-rendered discovery platform with a curated destination index, individual destination pages, trip packages, a gallery and blog, backed by a custom schema-driven admin CMS that controls every section, nav item and piece of content.",
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
          alt: "Triplipi destinations index titled 'Four hundred and fifty destinations, one careful index', a curated, filterable travel directory",
        },
        {
          src: "/projects/triplipi-detail.jpg",
          alt: "The Triplipi editorial travel blog with photo essays and field notes from real trips",
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
        "Triplipi is a premium travel-discovery platform for travellers who 'measure journeys in moments, not miles.' It presents 450 curated destinations as a careful, editorial index, each one visited, photographed or independently verified, alongside trip packages, a gallery and a blog, all managed through a custom admin CMS.",
      problem:
        "Most travel sites are either thin booking pages or bloated aggregators. This brand wanted the opposite: a slow, editorial experience that treats destinations like stories worth reading. It also needed the team to own its content, updating destinations, packages and picks daily, without waiting on a developer for every edit.",
      research:
        "I studied how people actually choose where to travel. They arrive from a search or a story, want honest photography and a real sense of place, then a clear next step to a package. That shaped a platform where each destination page is a self-sufficient, indexable story, not an interior page of an app.",
      planning:
        "The architecture separated the read-heavy public site from a content layer the team controls. Every section of every page maps to a schema entry in the CMS, so the same admin panel that edits the header nav also edits a destination's photo essay. One consistent, brand-styled system.",
      design:
        "The design is unapologetically editorial: full-bleed photography, a refined serif voice, generous space, and a calm rhythm that rewards slow browsing. The destination index is built to be filtered by mood, mountains for solitude, islands for slowness, rather than just by map pin.",
      development:
        "Server-rendered with Node, Express and Nunjucks so the delivered HTML is fast and fully indexable, backed by a JSON content store and a custom schema-driven admin panel. The CMS controls global brand settings, navigation, and every content section, with image uploads. It gives the team true independence.",
      challenges: [
        {
          challenge:
            "The team needed to edit every part of the site themselves, but generic CMSs would have forced the brand's editorial design into rigid templates.",
          solution:
            "A custom schema-driven CMS where each section is one schema entry. Flexible enough to edit any content, opinionated enough to keep the design consistent.",
        },
        {
          challenge:
            "450 destination pages had to be fast and individually discoverable on search engines.",
          solution:
            "Server-side rendering with per-page metadata and a sitemap means every destination is a fast, self-contained landing page that search engines index on its own.",
        },
      ],
      results: [
        { metric: "450", label: "curated destinations in one careful index" },
        { metric: "100%", label: "of content editable by the team via the custom CMS" },
        { metric: "SSR", label: "server-rendered pages, fully indexable by search engines" },
        { metric: "Editorial", label: "a discovery experience, not just a booking form" },
      ],
      outcome:
        "Triplipi launched as a genuinely editorial travel platform the team runs entirely themselves. Every destination is a fast, indexable story, packages flow from discovery, and new content ships daily without a developer. Exactly the independence the brand needed.",
    },
  },
  {
    slug: "trinket",
    name: "Trinket",
    industry: "E-Commerce · D2C Brand",
    category: "E-Commerce",
    year: "2025",
    summary:
      "A direct-to-consumer online store for a personalised-memory brand. Photo prints, journals, calendars, postcards and keepsake books, with a warm, editorial storefront designed to convert browsers into gifts.",
    challenge:
      "A young D2C brand turning people's photos into physical keepsakes needed a store as emotive as the products. One that sold the feeling, handled personalised and occasion-based products, and ran without a marketplace taking its margin.",
    solution:
      "A custom e-commerce storefront built around emotion and occasion: editorial product storytelling, shop-by-occasion browsing, personalised keepsake products, and a checkout and order flow the brand owns end to end.",
    stack: ["Next.js", "React", "Node.js", "SQLite", "Tailwind CSS", "Razorpay"],
    impact: [
      "An emotive, editorial storefront that sells the feeling",
      "Shop-by-occasion flow built around how gifts are chosen",
      "Owned store, off high-commission marketplaces, full margin",
    ],
    accent: "#d98a3d",
    images: {
      cover: {
        src: "/projects/trinket-hero.jpg",
        alt: "Trinket hero image with polaroid-style photo prints and handwritten notes on a soft blue cloth, from a personalised-memory keepsake brand",
      },
      desktop: [
        {
          src: "/projects/trinket-lifestyle.jpg",
          alt: "Trinket lifestyle image of personalised photo keepsakes styled together",
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
        "Trinket is a direct-to-consumer brand that turns people's favourite photos into physical keepsakes: prints, journals, calendars, postcards and memory books. The project built its storefront, an emotive, editorial shopping experience designed to sell the feeling behind the product and convert visitors into gifts and self-purchases.",
      problem:
        "Personalised keepsakes are an emotional purchase, but most e-commerce templates sell them like commodities, in grids of thumbnails and spec tables. Trinket needed a store that made people feel something first, handled personalised and occasion-based products, and kept the brand off high-commission marketplaces so it owned both margin and customer relationship.",
      research:
        "I looked at why people buy keepsakes. It is almost always for a moment or a person. An anniversary, a parent, 'the blurry photo everyone still laughs about.' That insight drove an occasion-first structure and product pages that lead with story and real lifestyle imagery rather than dimensions.",
      planning:
        "The store was planned around two entry points: shop-by-occasion for gifters who know the moment but not the product, and product-first browsing for returning customers. Personalisation and a clean, low-friction checkout sat at the core, with an order pipeline the brand could run itself.",
      design:
        "The design is warm and editorial. Soft colour fields, handwritten accents, and full-bleed lifestyle photography that shows the keepsakes in real homes. Every product page is built to make the customer picture the memory in their hands before they see the price.",
      development:
        "A Next.js storefront with a Node backend and payment integration, with statically-rendered product and category pages for speed and SEO. The catalogue supports personalised and occasion-tagged products, and the order flow is designed for a small team to fulfil without marketplace tooling.",
      challenges: [
        {
          challenge:
            "Emotional products lose their pull the moment they are presented like generic e-commerce SKUs.",
          solution:
            "Editorial product pages that lead with story and lifestyle photography, so the emotional case lands before any specification does.",
        },
        {
          challenge:
            "Gift buyers often know the occasion but not which product they want.",
          solution:
            "A shop-by-occasion structure guides them from 'anniversary' or 'for parents' straight to the right keepsake, cutting the choice paralysis that kills gift conversions.",
        },
      ],
      results: [
        { metric: "Own store", label: "off high-commission marketplaces, full margin retained" },
        { metric: "Occasion-first", label: "browsing built around how gifts are actually chosen" },
        { metric: "Fast + SEO", label: "statically-rendered product and category pages" },
        { metric: "Personalised", label: "keepsake products supported end to end" },
      ],
      outcome:
        "Trinket launched with a storefront that finally matches the emotion of its products. An editorial, occasion-first shopping experience the brand owns completely, from the first photograph on the homepage to the order in the fulfilment queue.",
    },
  },
  {
    slug: "kosmo-dental-clinic",
    name: "Kosmo Dental Clinic",
    industry: "Healthcare · Dental Clinic",
    category: "Business Website",
    year: "2026",
    summary:
      "A mobile-first website for a dental clinic in Arrah, Bihar, engineered to turn visitors into booked appointments and phone calls rather than simply exist online.",
    challenge:
      "A well-regarded clinic with hundreds of happy patients was almost invisible online. Prospective patients researching a dentist found nothing that reflected the standard of care, and every enquiry depended on someone answering the phone.",
    solution:
      "A premium, conversion-focused website that reads like a beautifully designed mobile app. Treatments, credentials and real patient reviews are presented the way patients actually evaluate a clinic, with booking, calling and WhatsApp always one tap away.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    impact: [
      "Appointment requests captured around the clock, not just when reception answers",
      "Call and WhatsApp always one tap away on mobile, where patients actually search",
      "Credentials and patient reviews presented the way patients evaluate a clinic",
    ],
    accent: "#22a7e0",
    images: {
      cover: {
        src: "/projects/kosmo-home.jpg",
        alt: "Kosmo Dental Clinic homepage with the headline 'Creating Beautiful Smiles with Advanced Dental Care' and a Book Appointment button",
      },
      desktop: [
        {
          src: "/projects/kosmo-treatments.jpg",
          alt: "Kosmo Dental Clinic treatments section showing dental services offered by the clinic",
        },
      ],
      mobile: [
        {
          src: "/projects/kosmo-mobile.jpg",
          alt: "Kosmo Dental Clinic website on a mobile phone with tap-to-call and booking buttons",
        },
      ],
    },
    caseStudy: {
      overview:
        "Kosmo Dental Clinic is a dental practice in Arrah, Bihar. The project built its entire public presence: a mobile-first website designed to generate appointments and phone calls, presenting treatments, dentist credentials, patient reviews and a booking flow that works in a few taps.",
      problem:
        "The clinic's reputation was strong locally, but online it barely existed. Patients researching a dentist could not judge its quality, see its treatments, or book without calling during working hours. Every enquiry depended on the phone being answered, so patients searching in the evening simply went elsewhere. For a clinic whose care is genuinely good, that gap between the real standard and the online impression was costing real patients.",
      research:
        "I looked at how patients actually choose a dentist. They want to know it will not hurt, that the dentist is experienced, that the equipment is modern, and what it will cost. They almost always look on a phone, often late at night, and they judge clinical quality by how professional the website feels. Those findings drove every decision on the page.",
      planning:
        "The site was planned as a single, well-paced journey rather than a maze of pages. Every section answers one patient question and leads to the same action: book an appointment. Mobile was designed first, because that is the device nearly every patient uses to search.",
      design:
        "The design leads with reassurance. Real patient ratings, experienced dentists, pain-free treatment and same-day emergency care are visible immediately, because those are the fears and needs patients arrive with. It is built to feel like a polished mobile app: clean, calm and clinical without being cold, so the website carries the same sense of care the clinic does.",
      development:
        "Built with Next.js and React, statically rendered for speed on the mid-range phones patients actually use. Booking, tap-to-call and WhatsApp are permanently within thumb reach. Local business schema markup helps the clinic surface for dental searches in its area.",
      challenges: [
        {
          challenge:
            "Patients search at all hours, but a clinic can only answer the phone during working hours, so out-of-hours interest was being lost entirely.",
          solution:
            "An appointment request flow captures the patient's details any time of day, so the clinic wakes up to enquiries instead of missing them. WhatsApp gives an instant channel for anyone who wants a faster answer.",
        },
        {
          challenge:
            "Medical websites easily feel either sterile and corporate or cheap and untrustworthy, and both lose patients.",
          solution:
            "A warm, confident design led by real proof, patient ratings, credentials and genuine photographs, so the site signals competence and care at the same time.",
        },
      ],
      results: [
        { metric: "4.9", label: "patient rating displayed on the live site" },
        { metric: "24/7", label: "appointment requests, not just phone hours" },
        { metric: "Mobile-first", label: "built for the device patients actually search on" },
        { metric: "1 tap", label: "to call, book or message the clinic" },
      ],
      outcome:
        "Kosmo Dental now has an online presence that finally matches the quality of its care. Patients can evaluate the clinic, trust it, and book at any hour, and the practice captures interest that used to disappear the moment nobody picked up the phone.",
    },
  },
  {
    slug: "flaming-logistics",
    name: "Flaming Integrated Logistiks",
    industry: "Logistics · Enterprise Platform",
    category: "Web Application & Admin",
    year: "2026",
    summary:
      "An enterprise logistics platform for a Lagos-based freight and customs company: a marketing site, live shipment tracking, quote intake and a full admin panel, serving clients across 120+ countries.",
    challenge:
      "A freight forwarding and customs clearance company handling shipments worldwide was running client communication through phone calls and email. Clients could not check where their cargo was, quotes were manual, and the company had no system of record for the enquiries coming in.",
    solution:
      "A complete logistics platform: a credible public site that wins enterprise trust, live shipment tracking so clients answer their own questions, structured quote intake, and an admin panel where the team runs the whole operation.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    impact: [
      "Clients track their own shipments instead of calling for updates",
      "Quote requests arrive structured, not scattered across email",
      "One admin panel where the team runs enquiries and shipments",
    ],
    accent: "#2fbf5c",
    images: {
      cover: {
        src: "/projects/flaming-home.jpg",
        alt: "Flaming Integrated Logistiks homepage: 'Your Trusted Partner For Global Freight and Logistics', a Lagos-based freight forwarding company serving 120+ countries",
      },
      desktop: [
        {
          src: "/projects/flaming-track.jpg",
          alt: "Flaming Integrated Logistiks live shipment tracking page where clients check cargo status",
        },
        {
          src: "/projects/flaming-services.jpg",
          alt: "Flaming Integrated Logistiks services page covering air and ocean freight, customs clearance and last-mile delivery",
        },
      ],
      mobile: [
        {
          src: "/projects/flaming-mobile.jpg",
          alt: "Flaming Integrated Logistiks logistics platform on a mobile phone",
        },
      ],
    },
    caseStudy: {
      overview:
        "Flaming Integrated Logistiks is a freight forwarding, customs clearance and supply chain company based in Lagos, Nigeria, moving cargo to more than 120 countries. The project delivered its entire digital operation: a public platform that wins enterprise trust, live shipment tracking, a structured quote pipeline, and an admin panel the team runs the business from.",
      problem:
        "In logistics, trust is the product. Enterprise clients hand over cargo worth far more than the shipping fee, so the company's online presence had to carry the weight of that decision, and it did not. Worse, operationally everything ran on phone calls. Clients rang to ask where their shipment was, quotes were assembled by hand, and enquiries lived in individual inboxes with no system of record. The team was spending its day answering questions the software should answer.",
      research:
        "I mapped what an enterprise logistics client actually needs before committing: proof of licensing and capability, a clear picture of the routes and services offered, and above all the ability to see where their cargo is without asking. That last one shaped the whole build, because self-service tracking removes the single largest source of inbound calls.",
      planning:
        "The platform was scoped in layers. The public site first, to establish credibility and capture quotes. Then shipment tracking, the feature that changes daily operations most. Then the admin panel, so the team could run quotes and shipments from one place rather than from memory and email.",
      design:
        "The design is deliberately serious and technical, because the audience is businesses trusting the company with valuable freight. A live global network visualisation, real operating figures and licensing credentials sit above the fold. Every route into the business, an instant quote, tracking a shipment, or speaking to a logistics expert, is offered immediately.",
      development:
        "Built with Next.js and TypeScript, backed by Prisma and a relational database. Shipment tracking, quote intake and the admin panel are authenticated and structured, so operational data lives in one system rather than in inboxes. The public pages are fast and indexable so the company can be found by clients searching internationally.",
      challenges: [
        {
          challenge:
            "The team spent much of each day answering 'where is my shipment?' by phone, which does not scale and pulls staff away from actual logistics work.",
          solution:
            "Client-facing shipment tracking lets customers answer that question themselves at any hour, in any timezone, which is precisely the point for a company shipping across 120+ countries.",
        },
        {
          challenge:
            "Quote requests arrived as free-form emails and calls, so nothing was comparable and nothing was tracked.",
          solution:
            "A structured quote intake captures the details a freight quote actually requires, and every request lands in the admin panel with an owner and a status instead of vanishing into an inbox.",
        },
      ],
      results: [
        { metric: "120+", label: "countries served (figure shown on the live platform)" },
        { metric: "Self-serve", label: "shipment tracking replaces status phone calls" },
        { metric: "1 system", label: "for quotes, shipments and enquiries" },
        { metric: "24/7", label: "clients served across every timezone" },
      ],
      outcome:
        "Flaming now runs on software rather than phone calls. Clients track their own cargo, quotes arrive structured and owned, and the company presents itself online with the seriousness that enterprise freight clients need before they trust anyone with their shipment.",
    },
  },
  {
    slug: "philosophy-machine",
    name: "The Philosophy Machine",
    industry: "Consumer Product · Web App",
    category: "Web Application",
    year: "2026",
    summary:
      "A viral self-discovery web app that maps your worldview against 17 philosophers and traditions from 18 moral dilemmas, then gives you your blend, your tribe, your rarity and a share card.",
    challenge:
      "Serious philosophy is intimidating and rarely goes anywhere near a mainstream audience. The goal was a product with the intellectual honesty of real philosophy and the shareability of a personality quiz, without becoming a shallow gimmick.",
    solution:
      "A beautifully-produced web app: answer 18 genuine moral dilemmas, get a result like '73% Nietzsche, 18% Buddha, 9% Camus', find your tribe, see exactly how rare you are, share a striking card, compare with friends, and come back for a daily dilemma.",
    stack: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL"],
    impact: [
      "Real philosophy made shareable without dumbing it down",
      "Share cards and friend comparison build in the growth loop",
      "Daily dilemmas and battles give people a reason to return",
    ],
    accent: "#6366f1",
    images: {
      cover: {
        src: "/projects/philosophy-home.jpg",
        alt: "The Philosophy Machine homepage asking 'What do you actually believe?' with the trolley problem dilemma",
      },
      desktop: [
        {
          src: "/projects/philosophy-battles.jpg",
          alt: "The Philosophy Machine battles page where philosophers are pitted against each other and users vote",
        },
      ],
      mobile: [
        {
          src: "/projects/philosophy-mobile.jpg",
          alt: "The Philosophy Machine self-discovery web app on a mobile phone",
        },
      ],
    },
    caseStudy: {
      overview:
        "The Philosophy Machine is a consumer web app that answers a question people genuinely want answered: what do I actually believe? You work through 18 moral dilemmas, and the machine maps your worldview against 17 philosophers and traditions, returning your blend, your tribe, how rare you are, and a share card built to travel.",
      problem:
        "Philosophy is one of the most interesting things humans have ever done, and almost nobody engages with it after school, because the entry points are dense books or shallow quizzes. The product had to sit in the gap: intellectually honest enough that a philosophy graduate respects the result, and immediate enough that a stranger finishes it in three minutes and sends it to a friend.",
      research:
        "The mechanics that make products like this spread are well understood: an identity-revealing result, a strong visual artefact to share, social comparison, and a reason to return. The hard part is bolting those onto content with real depth, rather than the usual empty personality quiz. So the dilemmas had to be genuine philosophical problems with no comfortable answer.",
      planning:
        "The core loop came first: dilemmas, scoring, result, share card. Everything else, the tribes, the rarity score, comparing with friends, chatting with your philosopher, the battles and the daily dilemma, exists to deepen the loop or to bring people back, and each was built only once the core felt genuinely good.",
      design:
        "The production value is the point. A dark, cosmic, serif-led interface signals seriousness rather than quiz-site frivolity, while the pacing keeps it light. The dilemmas are presented one at a time with real weight, and the result screen is designed to be screenshotted, because a share card is the product's distribution.",
      development:
        "Built with Next.js and TypeScript on Prisma and a relational database, holding the philosopher models, the scoring, user results, tribes and rarity calculations. Results are computed live, and the share cards are generated as images so they render properly wherever they are posted.",
      challenges: [
        {
          challenge:
            "Making the result intellectually credible rather than the arbitrary output of a personality quiz.",
          solution:
            "The scoring maps genuine dilemmas onto the real positions of 17 philosophers and traditions, so the blend you receive reflects the actual structure of your answers and holds up to scrutiny.",
        },
        {
          challenge:
            "A quiz is played once and forgotten, which is fatal for a consumer product.",
          solution:
            "Rarity, tribes, friend comparison, philosopher battles and a daily dilemma turn a one-time result into something people return to and argue about.",
        },
      ],
      results: [
        { metric: "18", label: "genuine moral dilemmas, no filler questions" },
        { metric: "17", label: "philosophers and traditions mapped" },
        { metric: "~3 min", label: "to a result, with no signup required" },
        { metric: "Shareable", label: "result cards built as the growth loop" },
      ],
      outcome:
        "The Philosophy Machine turns real philosophy into something people voluntarily spend three minutes on and then send to their friends. It proves the studio can build not just business software but consumer products with the production value and mechanics needed to actually spread.",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
