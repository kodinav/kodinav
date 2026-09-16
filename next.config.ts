import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hostinger's CDN doesn't purge on deploy. Cap the s-maxage sent for
  // prerendered HTML to 5 minutes so a new deploy self-heals quickly instead
  // of serving year-old HTML that references deleted CSS/JS chunks.
  expireTime: 300,
  experimental: {
    // The site has a root layout per language ((en), zh-hk, zh-tw), so
    // unmatched URLs need app/global-not-found.tsx to render a branded 404.
    globalNotFound: true,
  },
  images: {
    // Serve AVIF/WebP where the browser supports them — smaller than JPEG
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        // www → apex 301: without it, www serves duplicate content and
        // splits link equity across two hosts
        source: "/:path*",
        has: [{ type: "host", value: "www.kodinav.com" }],
        destination: "https://kodinav.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Baseline security headers. Not ranking factors, but they are what
        // an auditor (and our own trust checks) look for.
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Project screenshots & founder photo never change without a rename —
        // cache them hard for repeat visits and Core Web Vitals
        source: "/:path(projects/.*|founder\\.jpg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
