import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFile(join(root, path), "utf8");

async function routeFiles(directory = "app/api") {
  const entries = await readdir(join(root, directory), { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) =>
    entry.isDirectory() ? routeFiles(join(directory, entry.name)) : [join(directory, entry.name)],
  ));
  return files.flat().filter((file) => file.endsWith("route.ts"));
}

test("framework and sanitizer are pinned to patched release lines", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  assert.match(packageJson.dependencies.next, /16\.4\./);
  const sanitizerVersion = packageJson.dependencies["sanitize-html"].replace(/^[^\d]*/, "").split(".").map(Number);
  assert.ok(sanitizerVersion[0] > 2 || (sanitizerVersion[0] === 2 && (sanitizerVersion[1] > 17 || sanitizerVersion[1] === 17 && sanitizerVersion[2] >= 7)));
});

test("global responses receive defense-in-depth browser headers", async () => {
  const config = await read("next.config.ts");
  for (const header of [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Cross-Origin-Opener-Policy",
  ]) assert.ok(config.includes(header), `missing ${header}`);
  assert.match(config, /frame-ancestors 'none'/);
  assert.match(config, /object-src 'none'/);
  assert.match(config, /poweredByHeader: false/);
});

test("every mutating API route validates same-origin requests and applies rate limiting", async () => {
  for (const file of await routeFiles()) {
    const source = await read(file);
    if (!/export async function (?:POST|PUT|PATCH|DELETE)/.test(source)) continue;
    assert.match(source, /assert(?:Json)?Mutation(?:Request)?\(/, `${file} lacks mutation request validation`);
    assert.match(source, /enforceApiRateLimit\(/, `${file} lacks a distributed rate limit`);
  }
});

test("server-side article writes sanitize rich HTML", async () => {
  const [writeLayer, sanitizer] = await Promise.all([
    read("lib/cms-write.ts"),
    read("lib/sanitize-editor-html.server.ts"),
  ]);
  assert.match(writeLayer, /sanitizeStoredArticleHtml/);
  assert.match(sanitizer, /allowedTags/);
  assert.match(sanitizer, /allowedSchemes/);
  assert.match(sanitizer, /allowProtocolRelative: false/);
});

test("media uploads are image-only, bounded, inspected and re-encoded", async () => {
  const [route, migration] = await Promise.all([
    read("app/api/media/route.ts"),
    read("supabase/migrations/202610070001_security_hardening.sql"),
  ]);
  assert.match(route, /4 \* 1024 \* 1024/);
  assert.match(route, /sniffImageType/);
  assert.match(route, /sharp\(source/);
  assert.match(route, /webp\(/);
  assert.doesNotMatch(route, /application\/pdf|image\/svg\+xml|image\/gif/);
  assert.match(migration, /allowed_mime_types = array\['image\/webp'\]/);
  assert.match(migration, /drop policy if exists "staff uploads own media objects"/);
});

test("redirects are constrained to internal admin paths", async () => {
  const [guard, login, callback] = await Promise.all([
    read("lib/request-security.ts"),
    read("app/login/actions.ts"),
    read("app/auth/callback/route.ts"),
  ]);
  assert.match(guard, /parsed\.origin === "https:\/\/technama\.invalid"/);
  assert.match(guard, /parsed\.pathname\.startsWith\("\/admin\/"\)/);
  assert.match(login, /safeAdminPath/);
  assert.match(callback, /safeAdminPath/);
});

test("authentication is limited by both source address and account", async () => {
  const actions = await read("app/login/actions.ts");
  assert.match(actions, /`\$\{namespace\}-ip`/);
  assert.match(actions, /`\$\{namespace\}-account`/);
  assert.match(actions, /stableSecuritySubject\(email\)/);
});

test("database hardening prevents anonymous write and implicit administrator creation", async () => {
  const migration = await read("supabase/migrations/202610070001_security_hardening.sql");
  assert.match(migration, /revoke insert on public\.comments from anon, authenticated/);
  assert.match(migration, /revoke insert on public\.newsletter_subscribers from anon, authenticated/);
  assert.match(migration, /revoke execute on function public\.check_rate_limit/);
  assert.match(migration, /delete from public\.rate_limits where window_started/);
  assert.match(migration, /values\([\s\S]*'author'\)/);
  assert.doesNotMatch(migration, /count\(\*\).*'admin'/);
});

test("public reads use a stateless client while API responses remain private", async () => {
  const [client, articleService, response] = await Promise.all([
    read("lib/supabase/public.ts"),
    read("lib/public-article-service.ts"),
    read("lib/api-response.ts"),
  ]);
  assert.match(client, /persistSession: false/);
  assert.doesNotMatch(client, /cookies\(/);
  assert.match(articleService, /createSupabasePublicClient/);
  assert.match(response, /private, no-store/);
});

test("production admin access fails closed when auth is misconfigured", async () => {
  const [proxy, proxyEntry, layout] = await Promise.all([
    read("lib/supabase/proxy.ts"),
    read("proxy.ts"),
    read("app/admin/layout.tsx"),
  ]);
  assert.match(proxy, /process\.env\.NODE_ENV === "production"/);
  assert.match(proxy, /status: 503/);
  assert.match(proxyEntry, /matcher: \["\/admin\/:path\*", "\/login"\]/);
  assert.match(layout, /process\.env\.NODE_ENV === "production"/);
});

test("published article pages use ISR instead of uncached request-time rendering", async () => {
  const articlePage = await read("app/articles/[slug]/page.tsx");
  assert.match(articlePage, /export const revalidate = 60/);
  assert.match(articlePage, /generateStaticParams/);
  assert.match(articlePage, /getPublishedArticleSlugs/);
});
