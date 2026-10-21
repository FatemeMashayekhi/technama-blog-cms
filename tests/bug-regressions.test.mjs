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

test("profile avatars use the real media pipeline and never persist preview object URLs", async () => {
  const [profile, uploader, mediaService, mediaRoute] = await Promise.all([
    read("components/profile/profile-form.tsx"), read("components/profile/avatar-uploader.tsx"), read("lib/media-service.ts"), read("app/api/media/route.ts"),
  ]);
  assert.match(profile, /<AvatarUploader/);
  assert.doesNotMatch(profile, /type="url"/);
  assert.match(uploader, /uploadMedia\(file\)/);
  assert.match(uploader, /URL\.createObjectURL/);
  assert.match(mediaService, /throw new Error\("برای آپلود پایدار رسانه/);
  assert.match(mediaRoute, /sniffImageType/);
  assert.match(mediaRoute, /\.webp/);
});

test("admin mutations share one accessible toast system", async () => {
  const [layout, provider, posts, comments, profile, authors, media, settings] = await Promise.all([
    read("app/layout.tsx"), read("components/ui/toast-provider.tsx"), read("components/posts/posts-manager.tsx"), read("components/comments/comments-manager.tsx"), read("components/profile/profile-form.tsx"), read("components/authors/authors-manager.tsx"), read("components/media/media-manager.tsx"), read("components/settings/settings-form.tsx"),
  ]);
  assert.match(layout, /<ToastProvider>/);
  assert.match(provider, /aria-live="polite"/);
  for (const source of [posts, comments, profile, authors, media, settings]) assert.match(source, /useToast/);
});

test("article list has one real source with loading, error, and empty states", async () => {
  const source = await read("components/posts/posts-manager.tsx");
  assert.match(source, /useState<PostArticle\[]>\(\[]\)/);
  assert.match(source, /ArticlesTableSkeleton/);
  assert.match(source, /loadState === "error"/);
  assert.doesNotMatch(source, /useState<PostArticle\[]>\(mockArticles\)/);
});

test("article image uploads expose real busy state and block conflicting saves", async () => {
  const [sidebar, editor, mediaService] = await Promise.all([read("components/editor/editor-sidebar.tsx"), read("components/editor/article-editor.tsx"), read("lib/media-service.ts")]);
  assert.match(sidebar, /در حال بارگذاری تصویر/);
  assert.match(sidebar, /onUploadStateChange/);
  assert.match(editor, /imageUploading/);
  assert.match(editor, /disabled=\{saveState === "saving" \|\| imageUploading\}/);
  assert.doesNotMatch(mediaService, /createUploadedAsset\(file, URL\.createObjectURL/);
});

test("new drafts create once, later saves patch, and publication returns to the canonical list", async () => {
  const [client, editor, createRoute, updateRoute, publicService] = await Promise.all([read("lib/article-editor.ts"), read("components/editor/article-editor.tsx"), read("app/api/articles/route.ts"), read("app/api/articles/[id]/route.ts"), read("lib/public-article-service.ts")]);
  assert.match(client, /method: articleId \? "PATCH" : "POST"/);
  assert.match(editor, /setArticleId\(saved\.id\)/);
  assert.match(editor, /router\.push\("\/admin\/posts"\)/);
  assert.match(createRoute, /revalidatePath\(`\/articles\/\$\{article\.slug\}`\)/);
  assert.match(updateRoute, /revalidatePath\(`\/articles\/\$\{article\.slug\}`\)/);
  assert.match(publicService, /supabase\.rpc\("get_public_comments"/);
  assert.doesNotMatch(publicService, /const rpc = supabase\.rpc/);
});

test("comment moderation trusts persisted status and filters use the complete live dataset", async () => {
  const [service, manager, toolbar, dialogs, route] = await Promise.all([read("lib/comments-service.ts"), read("components/comments/comments-manager.tsx"), read("components/comments/comments-toolbar.tsx"), read("components/comments/comment-dialogs.tsx"), read("app/api/comments/route.ts")]);
  assert.match(service, /status: result\.data\.status/);
  assert.match(service, /fetch\("\/api\/comments", \{ method: "PATCH"/);
  assert.match(service, /scope=admin&include=filters/);
  assert.match(manager, /commentsService\.loadAdminData\(\)/);
  assert.match(manager, /setFilterOptions\(\{ articles: data\.articles, authors: data\.authors \}\)/);
  assert.match(dialogs, /aria-busy=\{busy\}/);
  assert.match(dialogs, /pendingStatusLabel/);
  assert.match(dialogs, /در حال ثبت\.\.\./);
  assert.doesNotMatch(toolbar, /commentArticles|commentAuthors/);
  assert.match(route, /\.range\(from, from \+ 999\)/);
  assert.match(route, /from\("articles"\)\.select\("id,title"\)/);
  assert.match(route, /from\("profiles"\)\.select\("id,display_name"\)/);
  assert.match(route, /export async function PATCH/);
  assert.match(route, /export async function DELETE/);
});

test("profile save state, posts skeleton, and slug validation match the final UI", async () => {
  const [profile, avatar, skeleton, editor, validation] = await Promise.all([read("components/profile/profile-form.tsx"), read("components/profile/avatar-uploader.tsx"), read("components/posts/articles-table-skeleton.tsx"), read("components/editor/article-editor.tsx"), read("lib/validation.ts")]);
  assert.match(profile, /setSavedProfile\(normalized\)/);
  assert.match(profile, /pendingSave=\{profile\.avatarUrl !== savedProfile\.avatarUrl\}/);
  assert.match(avatar, /value && pendingSave/);
  assert.match(skeleton, /length: 4/);
  assert.match(skeleton, /grid-cols-\[48px_32fr_17fr_13fr_13fr_9fr_12fr_48px\]/);
  assert.match(editor, /فقط حروف کوچک انگلیسی \(a-z\)/);
  assert.match(editor, /id="article-slug"/);
  assert.match(validation, /حروف کوچک انگلیسی/);
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
