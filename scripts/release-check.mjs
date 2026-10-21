import assert from "node:assert/strict";

const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const publicOrigin = process.env.SMOKE_PUBLIC_ORIGIN || "https://technama.ir";

const home = await fetch(baseUrl);
const homeHtml = await home.text();
assert.equal(home.status, 200);
for (const header of [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "cross-origin-opener-policy",
  "cross-origin-resource-policy",
]) assert.ok(home.headers.get(header), `missing response header: ${header}`);
assert.match(homeHtml, new RegExp(`rel="canonical" href="${publicOrigin.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}/?"`));

const search = await fetch(`${baseUrl}/search?q=react`);
const searchHtml = await search.text();
assert.equal(search.status, 200);
assert.match(searchHtml, /name="robots" content="noindex, follow"/);

const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
assert.doesNotMatch(sitemap, /\/admin(?:\/|<)|\/search(?:[?<]|$)/);
const articleUrl = sitemap.match(/<loc>([^<]+\/articles\/[^<]+)<\/loc>/)?.[1];
assert.ok(articleUrl, "sitemap must contain a published article");
const articlePath = new URL(articleUrl).pathname;
const article = await fetch(`${baseUrl}${articlePath}`);
const articleHtml = await article.text();
assert.equal(article.status, 200);
assert.match(articleHtml, /type="application\/ld\+json"/);
assert.match(articleHtml, new RegExp(`rel="canonical" href="${publicOrigin.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}`));

const me = await fetch(`${baseUrl}/api/me`);
assert.equal(me.status, 401);

const invalidJson = await fetch(`${baseUrl}/api/newsletter`, {
  method: "POST",
  headers: { "content-type": "application/json", origin: baseUrl },
  body: "{",
});
assert.equal(invalidJson.status, 400);

const crossOrigin = await fetch(`${baseUrl}/api/newsletter`, {
  method: "POST",
  headers: { "content-type": "application/json", origin: "https://evil.example", "sec-fetch-site": "cross-site" },
  body: "{}",
});
assert.equal(crossOrigin.status, 403);

const oversized = await fetch(`${baseUrl}/api/newsletter`, {
  method: "POST",
  headers: { "content-type": "application/json", origin: baseUrl },
  body: JSON.stringify({ email: `${"a".repeat(5_000)}@example.com` }),
});
assert.equal(oversized.status, 413);

console.log("Release checks passed: headers, canonical URLs, noindex, JSON-LD, auth failure, CSRF, invalid JSON, and body limits.");
