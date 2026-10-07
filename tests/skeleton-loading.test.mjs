import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFile(join(root, path), "utf8");

test("required routes expose App Router loading states", async () => {
  const routes = [
    "app/loading.tsx",
    "app/admin/dashboard/loading.tsx",
    "app/dashboard/loading.tsx",
    "app/articles/[slug]/loading.tsx",
    "app/categories/[id]/loading.tsx",
    "app/authors/[id]/loading.tsx",
    "app/search/loading.tsx",
  ];
  const sources = await Promise.all(routes.map(read));
  sources.forEach((source) => assert.match(source, /Skeleton|Loading/));
});

test("skeleton primitive is accessible and reduced-motion aware", async () => {
  const [primitive, css] = await Promise.all([read("components/ui/skeleton.tsx"), read("app/globals.css")]);
  assert.match(primitive, /aria-hidden="true"/);
  assert.match(primitive, /aria-busy="true"/);
  assert.match(primitive, /sr-only/);
  assert.match(css, /@keyframes skeletonPulse/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.skeleton-surface \{ animation: none !important/);
});

test("article card skeleton supports every production card geometry", async () => {
  const source = await read("components/skeletons/article-card-skeleton.tsx");
  for (const variant of ["featured", "compact", "horizontal", "default"]) assert.ok(source.includes(variant));
  assert.match(source, /aspect-\[16\/10\]/);
  assert.match(source, /sm:grid-cols-\[240px_minmax\(0,1fr\)\]/);
});

test("page skeletons preserve realistic counts and responsive grids", async () => {
  const [dashboard, home, article, category, author, search] = await Promise.all([
    read("components/skeletons/dashboard-skeleton.tsx"),
    read("components/skeletons/home-page-skeleton.tsx"),
    read("components/skeletons/article-detail-skeleton.tsx"),
    read("components/public/category/category-page-states.tsx"),
    read("components/public/author/author-page-skeleton.tsx"),
    read("components/public/search/search-page-states.tsx"),
  ]);
  assert.match(dashboard, /length: 4/);
  assert.match(dashboard, /length: 6/);
  assert.match(dashboard, /md:hidden/);
  assert.match(home, /length: 6/);
  assert.match(article, /aspect-16\/8/);
  assert.match(category, /xl:grid-cols-\[minmax\(0,1fr\)_300px\]/);
  assert.match(author, /sm:grid-cols-2/);
  assert.match(search, /hasQuery/);
});

test("search separates loading, empty, and successful result architecture", async () => {
  const [page, states] = await Promise.all([read("app/search/page.tsx"), read("components/public/search/search-page-states.tsx")]);
  assert.match(page, /Suspense fallback=\{<SearchContentSkeleton/);
  assert.match(page, /totalResults === 0/);
  assert.match(states, /if \(!hasQuery\)/);
  assert.doesNotMatch(states, /مقاله جدید درباره/);
});
