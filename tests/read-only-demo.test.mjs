import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFile(join(root, path), "utf8");

test("read-only sessions are rejected by authenticated mutation routes", async () => {
  const files = [
    "app/api/articles/route.ts", "app/api/articles/[id]/route.ts",
    "app/api/categories/route.ts", "app/api/categories/[id]/route.ts",
    "app/api/tags/route.ts", "app/api/tags/[id]/route.ts",
    "app/api/media/route.ts", "app/api/media/[id]/route.ts",
    "app/api/comments/[id]/route.ts", "app/api/settings/route.ts",
    "app/api/profiles/route.ts", "app/api/profiles/[id]/route.ts",
  ];
  for (const file of files) assert.match(await read(file), /requireWriteRole\(/, `${file} does not enforce write access`);
});

test("database blocks direct writes from read-only auth tokens", async () => {
  const migration = await read("supabase/migrations/202610250001_read_only_demo_access.sql");
  assert.match(migration, /auth\.jwt\(\) -> 'app_metadata' ->> 'read_only'/);
  assert.match(migration, /before insert or update or delete/);
  for (const table of ["profiles", "categories", "tags", "articles", "article_tags", "comments", "media", "site_settings", "newsletter_subscribers", "article_revisions"]) {
    assert.ok(migration.includes(`'${table}'`), `missing read-only trigger for ${table}`);
  }
});

test("demo password remains server-only and admin ownership is protected", async () => {
  const [actions, form, profileRoute, env] = await Promise.all([
    read("app/login/actions.ts"),
    read("components/auth/login-form.tsx"),
    read("app/api/profiles/[id]/route.ts"),
    read(".env.example"),
  ]);
  assert.match(actions, /process\.env\.DEMO_USER_PASSWORD/);
  assert.doesNotMatch(form, /DEMO_USER_PASSWORD|demo@example\.com/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_DEMO/);
  assert.match(profileRoute, /ایجاد مدیر دوم غیرفعال است/);
  assert.match(profileRoute, /دسترسی حساب مدیر فعال خودتان/);
});

test("read-only UI is explicit and sensitive admin routes are denied", async () => {
  const [layout, sidebar, proxy] = await Promise.all([
    read("components/layout/dashboard-layout.tsx"),
    read("components/layout/sidebar.tsx"),
    read("lib/supabase/proxy.ts"),
  ]);
  assert.match(layout, /حالت فقط‌خواندنی/);
  assert.match(sidebar, /بازدیدکننده · فقط مشاهده/);
  assert.match(proxy, /allowedReadOnlyPaths/);
  assert.match(proxy, /notice=read-only/);
});
