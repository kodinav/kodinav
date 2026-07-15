export const site = {
  name: "Kodinav",
  tagline: "Independent Software Studio",
  founder: "Abhinav Saxena",
  url: "https://kodinav.com",
  email: "hello@kodinav.com",
  phone: "+91 81266 61493",
  phoneRaw: "+918126661493",
  whatsapp:
    "https://wa.me/918126661493?text=Hi%20Abhinav%2C%20I%27m%20interested%20in%20discussing%20a%20software%20project.",
  // Booking link. Empty = booking UI hidden and booking CTAs fall back to the
  // contact form. TODO: paste the real Calendly URL once the account exists.
  calendly: "",
  location: "India",
  serviceAreas: ["Delhi", "Noida", "Gurgaon", "Ghaziabad", "Delhi NCR", "India"],
  // ≤160 chars — Google truncates longer meta descriptions (own audit tool flagged the old 255-char one)
  description:
    "Independent software studio serving the US, the Gulf and clients worldwide. Founder Abhinav Saxena personally builds fast websites, web apps and mobile apps.",
  priceFloor: "₹75,000",
  priceFloorUsd: "$2,000",
  priceCeil: "₹20 lakh",
  priceCeilUsd: "$25,000",
  // Productized front-door offer: a paid website audit. Buyable by cold global
  // traffic, converts into full projects. Set auditPaymentUrl to a Razorpay/
  // Stripe/PayPal payment link to make the button charge directly; leave empty
  // and the button routes to the order form (you send a payment link on reply).
  audit: {
    priceUsd: "$49",
    priceInr: "₹3,999",
    turnaround: "3 business days",
    paymentUrl: "", // TODO: paste a Stripe/Razorpay/PayPal payment link here
  },
  keywords: [
    // Primary markets: USA & UAE
    "web development company USA",
    "hire remote web developer USA",
    "offshore web development company",
    "outsource web development",
    "web development company Dubai",
    "website development Dubai",
    "web developer UAE",
    "freelance web developer",
    "hire freelance web developer",
    "remote web developer",
    "website development services",
    "Next.js development services",
    "React development services",
    "hire full stack developer",
    "freelance web developer India",
    "freelance web developer Delhi NCR",
    "website development India",
    "custom website development",
    "business website development",
    "website developer Delhi",
    "website developer Noida",
    "website developer Gurgaon",
    "website developer Ghaziabad",
    "website design India",
    "landing page development",
    "e-commerce website development",
    "portfolio website development",
    "React developer India",
    "Next.js developer India",
    "full stack developer India",
    "freelance software developer",
    "SEO friendly website development",
    "fast website development",
    "independent software studio",
    "Abhinav Saxena",
    "Kodinav",
  ],
} as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  // The free-audit lead magnet earns a top-level slot; Navbar/Footer render it in accent
  { label: "Free Audit", href: "/free-website-audit" },
  { label: "Contact", href: "/contact" },
] as const;
