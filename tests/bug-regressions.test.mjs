import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFile(join(root, path), "utf8");

test("article share links are deterministic across server and client renders", async () => {
  const [tools, page, env] = await Promise.all([read("components/public/article/article-tools.tsx"), read("app/articles/[slug]/page.tsx"), read("lib/env.ts")]);
  assert.doesNotMatch(tools, /typeof window|window\.location/);
  assert.match(tools, /new URLSearchParams\(\{ url, text: title \}\)/);
  assert.match(page, /url=\{canonicalUrl\}/);
  assert.match(env, /NEXT_PUBLIC_SITE_URL/);
});

test("public comments only report success after a persisted pending response", async () => {
  const [form, route, statusRoute, page] = await Promise.all([read("components/public/article/article-comments.tsx"), read("app/api/comments/route.ts"), read("app/api/comments/status/route.ts"), read("app/articles/[slug]/page.tsx")]);
  assert.doesNotMatch(form, /localComments|local-\$\{Date\.now/);
  assert.match(form, /result\.data\?\.status !== "pending"/);
  assert.match(form, /rememberReceipt/);
  assert.match(form, /storeReceipts\(storageKey, visible\)/);
  assert.match(form, /receiptState === "checking"/);
  assert.match(form, /OwnCommentsSkeleton/);
  assert.match(form, /localStorage\.getItem\(storageKey\)/);
  assert.match(form, /\/api\/comments\/status/);
  assert.match(form, /دیدگاه با موفقیت ذخیره شد/);
  assert.match(route, /status: "pending"/);
  assert.match(route, /get_public_comments/);
  assert.match(route, /findPublishedArticle/);
  assert.match(statusRoute, /publicCommentReceiptSchema/);
  assert.match(statusRoute, /\.in\("id", input\.ids\)/);
  assert.match(page, /articleSlug=\{article\.slug\}/);
});

test("comment and authentication forms have matching client and server validation", async () => {
  const [commentForm, validation, login] = await Promise.all([read("components/public/article/article-comments.tsx"), read("lib/validation.ts"), read("app/login/actions.ts")]);
  assert.match(commentForm, /maxLength=\{maxContentLength\}/);
  assert.match(commentForm, /minLength=\{10\}/);
  assert.match(commentForm, /aria-invalid/);
  assert.match(validation, /publicCommentSchema/);
  assert.match(validation, /publicCommentReceiptSchema/);
  assert.match(validation, /حداکثر دو پیوند مجاز است/);
  assert.match(validation, /loginInputSchema/);
  assert.match(login, /safeParse/);
});

test("contact email actions remain semantic and correctly encoded", async () => {
  const contact = await read("app/contact/page.tsx");
  assert.match(contact, /href=\{`mailto:editorial@technama\.ir\?subject=\$\{encodeURIComponent\(subject\)\}`\}/);
  assert.doesNotMatch(contact, /window\.location|onClick=.*mailto/);
});

test("profile and settings have distinct destinations and self-service updates cannot change role", async () => {
  const [header, page, route, schema] = await Promise.all([read("components/layout/header.tsx"), read("app/profile/page.tsx"), read("app/api/me/route.ts"), read("lib/validation.ts")]);
  assert.match(header, /href="\/profile"/);
  assert.match(header, /href="\/settings"/);
  assert.match(page, /requireUser\("\/profile"\)/);
  assert.doesNotMatch(route, /input\.role|role: input/);
  assert.match(schema, /ownProfilePatchSchema/);
});

test("comments dashboard does not replace mock content with a false empty response", async () => {
  const manager = await read("components/comments/comments-manager.tsx");
  assert.match(manager, /useState<MagazineComment\[\]>\(\[\]\)/);
  assert.match(manager, /loadState.*"loading"/);
  assert.match(manager, /loadState === "error"/);
  assert.match(manager, /currentRequest !== requestId\.current/);
});

test("login confirms the Supabase session instead of inferring success from HTTP 200", async () => {
  const login = await read("app/login/actions.ts");
  assert.match(login, /data\.session/);
  assert.match(login, /invalid_credentials/);
  assert.match(login, /fetch\|network/);
});

test("dashboard chart labels share the same datum and geometry as tooltips", async () => {
  const chart = await read("components/dashboard/analytics-chart.tsx");
  assert.match(chart, /coords\[index\]\.x \/ 900/);
  assert.match(chart, /dir="ltr"/);
  assert.match(chart, /onFocus=\{\(\) => setActivePoint\(index\)\}/);
});

test("recent article categories use canonical public category slugs", async () => {
  const [recent, service] = await Promise.all([read("components/dashboard/recent-articles.tsx"), read("lib/dashboard-service.ts")]);
  assert.match(recent, /\/categories\/\$\{article\.category\.slug\}/);
  assert.doesNotMatch(recent, /\/admin\/categories\/\$\{article\.category\.id\}/);
  assert.match(service, /category:categories\(id,name,slug\)/);
});

test("scheduled publishing uses ISO instants and explicit article status", async () => {
  const [client, schedule, write, validation] = await Promise.all([read("lib/article-editor.ts"), read("lib/article-scheduling.ts"), read("lib/cms-write.ts"), read("lib/validation.ts")]);
  assert.match(client, /tehranDateTimeToIso/);
  assert.match(schedule, /toISOString\(\)/);
  assert.match(write, /const requestedStatus = input\.status/);
  assert.match(write, /const requested = input\.status \?\? existing\.status/);
  assert.match(validation, /datetime\(\{ offset: true \}\)/);
  assert.match(validation, /زمان انتشار باید در آینده باشد/);
});

test("article editor controls are consistent, accessible, and preserve long rich content", async () => {
  const [sidebar, editor, styles] = await Promise.all([read("components/editor/editor-sidebar.tsx"), read("components/editor/rich-text-editor.tsx"), read("app/globals.css")]);
  for (const id of ["article-status", "article-publish-at", "article-category", "article-author"]) assert.ok(sidebar.includes(id));
  assert.match(editor, /setContent\(value \|\| "", \{ emitUpdate: false/);
  assert.match(editor, /toggleCodeBlock/);
  assert.match(editor, /setParagraph/);
  assert.doesNotMatch(editor, /overflow-hidden rounded-\(--radius\)/);
  assert.match(styles, /min-height: 34rem/);
});
