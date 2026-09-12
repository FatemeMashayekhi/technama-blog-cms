import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFile(join(root, path), "utf8");

async function sourceFiles(directory) {
  const entries = await readdir(join(root, directory), { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => entry.isDirectory() ? sourceFiles(join(directory, entry.name)) : [join(directory, entry.name)]));
  return files.flat().filter((file) => /\.(tsx?|css)$/.test(file));
}

test("Persian font is self-hosted and globally applied", async () => {
  const [layout, styles] = await Promise.all([read("app/layout.tsx"), read("app/globals.css")]);
  assert.match(layout, /Vazirmatn-Variable\.woff2/);
  assert.match(styles, /var\(--font-vazirmatn\)/);
});

test("UI has no legacy tiny controls or prompt dialogs", async () => {
  const files = [...await sourceFiles("app"), ...await sourceFiles("components")];
  for (const file of files) {
    const content = await read(file);
    assert.doesNotMatch(content, /text-\[(?:[1-9]|10)px\]/, `${file} contains text smaller than 11px`);
    assert.doesNotMatch(content, /\b(?:size|h)-(?:8|9)\b/, `${file} contains a legacy undersized control`);
    assert.doesNotMatch(content, /window\.prompt\(/, `${file} contains a blocking prompt dialog`);
    for (const button of content.matchAll(/<button\b[^>]*>/gs)) assert.doesNotMatch(button[0], /\b(?:size|h)-(?:6|7|8|9)\b/, `${file} contains an undersized button`);
  }
});

test("public navigation covers the complete public information architecture", async () => {
  const [header, footer, manager] = await Promise.all([
    read("components/public/public-header.tsx"),
    read("components/public/public-footer.tsx"),
    read("components/posts/posts-manager.tsx"),
  ]);
  for (const route of ["/articles", "/categories", "/authors", "/tags", "/about"]) assert.ok(header.includes(route));
  assert.ok(footer.includes("/categories"));
  assert.ok(footer.includes("/authors"));
  assert.ok(manager.includes("/articles/${article.slug}"));
  assert.ok(!manager.includes("/posts/${article.slug}"));
});

test("public content excludes drafts and inactive authors", async () => {
  const [articleService, authorService, searchService] = await Promise.all([
    read("lib/public-article-service.ts"),
    read("lib/public-author-service.ts"),
    read("lib/public-search-service.ts"),
  ]);
  assert.match(articleService, /publishedPublicArticles/);
  assert.match(authorService, /status === "active"/);
  assert.match(searchService, /status === "active"/);
});

test("all repaired public destinations exist", async () => {
  for (const route of ["articles", "authors", "categories", "tags", "about", "contact", "privacy", "terms"]) assert.ok((await read(`app/${route}/page.tsx`)).length > 0);
  for (const file of ["app/sitemap.ts", "app/robots.ts", "app/manifest.ts"]) assert.ok((await read(file)).length > 0);
});

test("public dialogs trap focus and the site exposes a skip link", async () => {
  const [header, focus, styles] = await Promise.all([read("components/public/public-header.tsx"), read("components/public/use-dialog-focus.ts"), read("app/globals.css")]);
  assert.match(header, /href="#main-content"/);
  assert.match(header, /aria-modal="true"/);
  assert.match(focus, /event\.key !== "Tab"/);
  assert.match(focus, /trigger\?\.focus\(\)/);
  assert.match(styles, /\.skip-link/);
});

test("admin routes are namespaced and excluded from indexing", async () => {
  const [layout, robots, sidebar] = await Promise.all([read("app/admin/layout.tsx"), read("app/robots.ts"), read("components/layout/sidebar.tsx")]);
  assert.match(layout, /index: false/);
  assert.match(robots, /"\/admin\/"/);
  for (const route of ["/admin/dashboard", "/admin/posts", "/admin/authors", "/admin/categories"]) assert.ok(sidebar.includes(route));
});

test("article filters use shareable URL state and tag routes resolve", async () => {
  const [explorer, tagPage, tagService] = await Promise.all([read("components/public/articles/articles-explorer.tsx"), read("app/tags/[id]/page.tsx"), read("lib/public-tag-service.ts")]);
  assert.match(explorer, /useSearchParams/);
  assert.match(explorer, /router\.(?:push|replace)/);
  assert.match(tagPage, /generateStaticParams/);
  assert.match(tagService, /getPublicTagSlugs/);
});
