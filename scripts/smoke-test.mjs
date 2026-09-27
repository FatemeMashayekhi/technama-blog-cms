const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const routes = [
  "/", "/articles", "/articles/future-of-generative-ai-in-software", "/about", "/contact", "/privacy", "/terms", "/search?q=react",
  "/categories", "/categories/programming", "/authors", "/authors/maryam", "/tags", "/tags/react",
  "/admin/dashboard", "/admin/posts", "/admin/posts/new", "/admin/authors", "/admin/categories", "/admin/comments", "/admin/analytics", "/admin/media", "/admin/settings", "/admin/tags",
  "/dashboard", "/posts", "/comments", "/analytics", "/media", "/settings",
  "/robots.txt", "/sitemap.xml", "/manifest.webmanifest",
];

const failures = [];
for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  if (response.status < 200 || response.status >= 400) failures.push(`${route}: ${response.status}`);
  else console.log(`OK ${response.status} ${route}`);
}

for (const route of ["/articles/typescript-scalable-architecture", "/authors/arman.dev", "/definitely-missing"]) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  const streamedNotFound = response.status === 200 && (await response.text()).includes('name="robots" content="noindex"');
  if (response.status !== 404 && !streamedNotFound) failures.push(`${route}: expected a not-found response, received ${response.status}`);
  else console.log(`OK ${response.status}${streamedNotFound ? " streamed-not-found" : ""} ${route}`);
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const articleRoutes = [...sitemap.matchAll(/<loc>[^<]+\/articles\/([^<]+)<\/loc>/g)].map((match) => `/articles/${match[1]}`);
for (const route of articleRoutes) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  const html = await response.text();
  const isNotFound = response.status === 404 || html.includes('name="robots" content="noindex"');
  if (response.status < 200 || response.status >= 400 || isNotFound) failures.push(`${route}: article route did not resolve`);
  else console.log(`OK ${response.status} ${route}`);
}
const collectionRoutes = [...sitemap.matchAll(/<loc>[^<]+\/((?:categories|authors|tags)\/[^<]+)<\/loc>/g)].map((match) => `/${match[1]}`);
for (const route of collectionRoutes) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  const html = await response.text();
  const isNotFound = response.status === 404 || html.includes('name="robots" content="noindex"');
  if (response.status < 200 || response.status >= 400 || isNotFound) failures.push(`${route}: public data route did not resolve`);
  else console.log(`OK ${response.status} ${route}`);
}

if (failures.length) {
  console.error(`Smoke test failed:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Smoke test passed for ${routes.length + 3 + articleRoutes.length + collectionRoutes.length} routes, including ${articleRoutes.length} published articles and ${collectionRoutes.length} public data pages.`);
}
