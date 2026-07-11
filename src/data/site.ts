export const site = {
  name: "Kodinav",
  tagline: "Independent Software Studio",
  founder: "Abhinav Saxena",
  url: "https://kodinav.com",
  email: "hello@kodinav.com",
  phone: "+91 81266 61393",
  phoneRaw: "+918126661393",
  whatsapp:
    "https://wa.me/918126661393?text=Hi%20Abhinav%2C%20I%27m%20interested%20in%20discussing%20a%20software%20project.",
  calendly: "https://calendly.com/kodinav/discovery-call", // TODO: replace with real Calendly URL
  location: "India",
  description:
    "Kodinav is an independent software studio that designs and develops high-performance websites, web applications and mobile apps for ambitious businesses. Every project is personally led by the founder, Abhinav Saxena.",
  priceFloor: "₹75,000",
  keywords: [
    "independent software studio",
    "software studio India",
    "custom software development India",
    "website development India",
    "web application development",
    "mobile app development India",
    "Next.js development studio",
    "custom LMS development",
    "e-commerce website development India",
    "hire software engineer India",
    "Abhinav Saxena",
    "Kodinav",
  ],
} as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;
