import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * Search and AI answer-engine crawlers are welcome everywhere except the API
 * and admin. The named groups say so explicitly: several AI crawlers only
 * read the group addressed to them, and an explicit allow removes any doubt
 * for site owners and auditors. A crawler that matches a named group ignores
 * the `*` group, so every group repeats the same disallows.
 */
const disallow = ["/api/", "/admin"];

const answerEngines = [
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended", // Gemini / AI Overviews grounding
  "Applebot-Extended",
  "Bingbot", // also feeds Yahoo Taiwan and Copilot
  "DuckAssistBot",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: answerEngines, allow: "/", disallow },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
