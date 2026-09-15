#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver…) so new or changed
 * pages are crawled in hours instead of weeks. Bing matters more than its
 * search share suggests: Yahoo's Taiwan search, ChatGPT search and Copilot
 * all draw on Bing's index.
 *
 * Usage (after a deploy is live):
 *   node scripts/indexnow.mjs                 # every URL in the live sitemap
 *   node scripts/indexnow.mjs /zh-hk /zh-tw   # specific paths
 *
 * The key is public by design: it is served at /<key>.txt to prove the
 * site owns the submissions.
 */
const HOST = "kodinav.com";
const KEY = "cb5f1309deb6f2cda291bd113f78f4ca";
const ORIGIN = `https://${HOST}`;

async function sitemapUrls() {
  const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urlList = args.length ? args.map((p) => new URL(p, ORIGIN).href) : await sitemapUrls();

const keyCheck = await fetch(`${ORIGIN}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`Key file ${ORIGIN}/${KEY}.txt is not live yet — deploy first.`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}
