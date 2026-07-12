import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hostinger's CDN doesn't purge on deploy. Cap the s-maxage sent for
  // prerendered HTML to 5 minutes so a new deploy self-heals quickly instead
  // of serving year-old HTML that references deleted CSS/JS chunks.
  expireTime: 300,
  images: {
    // Serve AVIF/WebP where the browser supports them — smaller than JPEG
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
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
