import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFile(join(root, path), "utf8");

test("dashboard identity and stats come from the dashboard data layer", async () => {
  const [page, service] = await Promise.all([read("app/admin/dashboard/page.tsx"), read("lib/dashboard-service.ts")]);
  assert.match(page, /getDashboardOverview/);
  assert.match(page, /dashboard\.user\.name/);
  assert.doesNotMatch(page, /سلام، مریم/);
  assert.match(service, /getDashboardStats\(articles\)/);
  assert.match(service, /getCurrentProfile/);
});

test("dashboard date is generated at runtime in Persian", async () => {
  const [header, data] = await Promise.all([read("components/layout/header.tsx"), read("lib/dashboard-data.ts")]);
  assert.match(header, /formatDashboardDate\(new Date\(\)\)/);
  assert.match(header, /setInterval/);
  assert.match(data, /fa-IR-u-ca-persian/);
  assert.match(data, /Asia\/Tehran/);
});

test("dashboard search, notifications, and profile menus are interactive", async () => {
  const [header, search] = await Promise.all([read("components/layout/header.tsx"), read("components/layout/dashboard-search.tsx")]);
  assert.match(search, /role="combobox"/);
  assert.match(search, /ArrowDown/);
  assert.match(search, /event\.key === "Escape"/);
  assert.match(header, /markAsRead/);
  assert.match(header, /aria-expanded=\{notificationsOpen\}/);
  assert.match(header, /aria-expanded=\{profileOpen\}/);
});

test("dashboard analytics supports real range-specific datasets", async () => {
  const [chart, data] = await Promise.all([read("components/dashboard/analytics-chart.tsx"), read("lib/dashboard-data.ts")]);
  for (const range of ["7d", "30d", "90d"]) assert.ok(chart.includes(`"${range}"`));
  assert.match(chart, /setRange\(item\)/);
  assert.match(data, /range === "7d"/);
  assert.match(data, /range === "30d"/);
  assert.match(data, /count: 15, step: 6/);
});

test("dashboard actions and recent article operations have real destinations", async () => {
  const [actions, recent] = await Promise.all([read("components/dashboard/quick-actions.tsx"), read("components/dashboard/recent-articles.tsx")]);
  for (const route of ["/admin/posts/new", "/admin/authors/new", "/admin/media", "/"]) assert.ok(actions.includes(route));
  assert.match(recent, /\/admin\/posts\/\$\{article\.id\}\/edit/);
  assert.match(recent, /article\.status === "published"/);
  assert.match(recent, /\/articles\/\$\{article\.slug\}/);
});
