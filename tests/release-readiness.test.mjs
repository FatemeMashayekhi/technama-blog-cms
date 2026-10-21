import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFile(join(root, path), "utf8");

test("canonical, robots and sitemap URLs share the configured site origin", async () => {
  const [layout, robots, sitemap, home, search] = await Promise.all([
    read("app/layout.tsx"),
    read("app/robots.ts"),
    read("app/sitemap.ts"),
    read("app/page.tsx"),
    read("app/search/page.tsx"),
  ]);
  assert.match(layout, /new URL\(getSiteOrigin\(\)\)/);
  assert.match(robots, /getSiteUrl\("\/sitemap\.xml"\)/);
  assert.match(sitemap, /getSiteUrl/);
  assert.doesNotMatch([robots, sitemap, home, search].join("\n"), /https:\/\/technama\.ir/);
  assert.doesNotMatch(sitemap, /\/admin|\/search/);
});

test("public taxonomies and search use live published data when Supabase is configured", async () => {
  const [categories, tags, search, authors, categoryPage, tagPage] = await Promise.all([
    read("lib/public-category-service.ts"),
    read("lib/public-tag-service.ts"),
    read("lib/public-search-service.ts"),
    read("lib/public-author-service.ts"),
    read("app/categories/[id]/page.tsx"),
    read("app/tags/[id]/page.tsx"),
  ]);
  assert.match(categories, /createSupabasePublicClient/);
  assert.match(categories, /getPublishedArticles/);
  assert.match(tags, /from\("article_tags"\)/);
  assert.match(search, /Promise\.all/);
  assert.match(authors, /if \(!isSupabaseConfigured\) return localAuthors\(\)/);
  assert.doesNotMatch(authors, /\?\? localAuthors\(\)\.find/);
  assert.match(authors, /if \(error \|\| !data\?\.length\) return \[\]/);
  assert.match(categoryPage, /dynamicParams = true/);
  assert.match(tagPage, /dynamicParams = true/);
});

test("public UI keeps accessible focus, contrast and touch targets", async () => {
  const [styles, footer, newsletter, popular] = await Promise.all([
    read("app/globals.css"),
    read("components/public/public-footer.tsx"),
    read("components/public/newsletter-section.tsx"),
    read("components/public/popular-articles.tsx"),
  ]);
  assert.match(styles, /\.public-site :is\(a, button\):focus-visible/);
  assert.match(styles, /@media \(min-width: 768px\)[\s\S]*content-visibility: auto/);
  assert.match(footer, /role="img"/);
  assert.match(newsletter, /text-white\/68/);
  assert.match(popular, /inline-flex min-h-10 items-center/);
});

test("taxonomy creation rejects duplicates and category hierarchy rejects cycles", async () => {
  const [categoryRoute, tagRoute, categoryGuard] = await Promise.all([
    read("app/api/categories/route.ts"),
    read("app/api/tags/route.ts"),
    read("lib/taxonomy-server.ts"),
  ]);
  assert.match(categoryRoute, /\.insert\(/);
  assert.doesNotMatch(categoryRoute, /\.upsert\(/);
  assert.match(tagRoute, /\.insert\(/);
  assert.doesNotMatch(tagRoute, /\.upsert\(/);
  assert.match(categoryGuard, /چرخه/);
  assert.match(categoryGuard, /categoryId === parentId/);
});

test("production configuration never falls back to localhost", async () => {
  const [auth, profiles, environment] = await Promise.all([
    read("app/login/actions.ts"),
    read("app/api/profiles/route.ts"),
    read("lib/env.ts"),
  ]);
  assert.match(auth, /getSiteOrigin\(\)/);
  assert.match(profiles, /getSiteOrigin\(\)/);
  assert.doesNotMatch(auth + profiles, /localhost/);
  assert.match(environment, /NEXT_PUBLIC_SITE_URL/);
  assert.match(environment, /NODE_ENV === "production" && isLocalhost/);
});
