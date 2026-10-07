export type ArticleStatus = "published" | "draft" | "review";
export type AnalyticsRange = "7d" | "30d" | "90d";
export type DashboardRole = "admin" | "editor" | "author";
export type DashboardSearchKind = "article" | "author" | "category";
export type DashboardNotificationType = "comment" | "article" | "system";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: DashboardRole;
};

export type DashboardArticle = {
  id: string;
  title: string;
  slug: string;
  author: { id: string; name: string; initials: string; color: string };
  category: { id: string; name: string };
  status: ArticleStatus;
  views: number;
  updatedAt: string;
  publishedAt?: string;
};

export type DashboardSearchItem = {
  id: string;
  kind: DashboardSearchKind;
  title: string;
  description: string;
  href: string;
};

export type DashboardNotification = {
  id: string;
  title: string;
  description: string;
  type: DashboardNotificationType;
  read: boolean;
  createdAt: string;
  href: string;
};

export type DashboardActivity = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  action: string;
  time: string;
  href: string;
};

export type DashboardStat = {
  id: "total" | "published" | "draft" | "views";
  label: string;
  value: number;
  detail: string;
  accent?: boolean;
};

export type DashboardAnalyticsPoint = { date: string; label: string; views: number };
export type DashboardAnalytics = { range: AnalyticsRange; rangeLabel: string; total: number; change: number; comparisonLabel: string; points: DashboardAnalyticsPoint[] };

export const dashboardRangeLabels: Record<AnalyticsRange, string> = { "7d": "۷ روز گذشته", "30d": "۳۰ روز گذشته", "90d": "۹۰ روز گذشته" };
export const defaultDashboardUser: DashboardUser = { id: "local-preview-user", name: "مریم موسوی", email: "editor@technama.local", role: "admin" };

const numberFormatter = new Intl.NumberFormat("fa-IR");
const compactFormatter = new Intl.NumberFormat("fa-IR", { notation: "compact", maximumFractionDigits: 1 });
const shortDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric", month: "short", timeZone: "Asia/Tehran" });

export function formatDashboardDate(date: Date) {
  const parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Tehran" }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("weekday")}، ${part("day")} ${part("month")} ${part("year")}`;
}

export function formatDashboardNumber(value: number, compact = false) {
  return (compact ? compactFormatter : numberFormatter).format(value);
}

export function formatRelativeDashboardTime(value: string, now = new Date()) {
  const target = new Date(value);
  const diffMinutes = Math.max(0, Math.round((now.getTime() - target.getTime()) / 60_000));
  if (diffMinutes < 2) return "همین حالا";
  if (diffMinutes < 60) return `${numberFormatter.format(diffMinutes)} دقیقه پیش`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${numberFormatter.format(diffHours)} ساعت پیش`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${numberFormatter.format(diffDays)} روز پیش`;
  return shortDateFormatter.format(target);
}

export function getDashboardStats(articles: DashboardArticle[]): DashboardStat[] {
  const published = articles.filter((article) => article.status === "published");
  const drafts = articles.filter((article) => article.status === "draft");
  const reviewCount = articles.filter((article) => article.status === "review").length;
  const totalViews = published.reduce((sum, article) => sum + article.views, 0);
  const publishedShare = articles.length ? Math.round((published.length / articles.length) * 100) : 0;
  return [
    { id: "total", label: "مجموع مقالات", value: articles.length, detail: "کل محتوای ثبت‌شده" },
    { id: "published", label: "منتشر شده", value: published.length, detail: `${numberFormatter.format(publishedShare)}٪ از کل مقالات`, accent: true },
    { id: "draft", label: "پیش‌نویس‌ها", value: drafts.length, detail: `${numberFormatter.format(reviewCount)} مورد در انتظار بررسی` },
    { id: "views", label: "مجموع بازدیدها", value: totalViews, detail: "برای مطالب منتشرشده", accent: true },
  ];
}

export function getDashboardSearchItems(articles: DashboardArticle[], authors: Array<{ id: string; name: string; role: DashboardRole }>, categories: Array<{ id: string; name: string }>): DashboardSearchItem[] {
  return [
    ...articles.map((article) => ({ id: `article-${article.id}`, kind: "article" as const, title: article.title, description: `${article.author.name} · ${article.category.name}`, href: `/admin/posts/${article.id}/edit` })),
    ...authors.map((author) => ({ id: `author-${author.id}`, kind: "author" as const, title: author.name, description: author.role === "admin" ? "مدیر" : author.role === "editor" ? "ویراستار" : "نویسنده", href: `/admin/authors/${author.id}/edit` })),
    ...categories.map((category) => ({ id: `category-${category.id}`, kind: "category" as const, title: category.name, description: "دسته‌بندی محتوا", href: `/admin/categories/${category.id}/edit` })),
  ];
}

export function getDashboardAnalytics(range: AnalyticsRange, nowIso: string): DashboardAnalytics {
  const now = new Date(nowIso);
  const config = range === "7d" ? { count: 7, step: 1, base: 610, change: 8.7 } : range === "30d" ? { count: 30, step: 1, base: 720, change: 14.2 } : { count: 15, step: 6, base: 4_380, change: 19.6 };
  const points = Array.from({ length: config.count }, (_, index) => {
    const daysAgo = (config.count - 1 - index) * config.step;
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - daysAgo);
    const seasonal = Math.sin((index + 1) * 1.31) * config.base * 0.12;
    const weekly = index % 6 === 4 ? config.base * 0.2 : index % 7 === 0 ? -config.base * 0.09 : 0;
    const growth = index * config.base * 0.018;
    const deterministicNoise = ((index * 73 + config.count * 11) % 97) - 48;
    const views = Math.max(120, Math.round(config.base + seasonal + weekly + growth + deterministicNoise));
    return { date: date.toISOString(), label: shortDateFormatter.format(date), views };
  });
  return { range, rangeLabel: dashboardRangeLabels[range], total: points.reduce((sum, point) => sum + point.views, 0), change: config.change, comparisonLabel: "نسبت به دوره قبل", points };
}

export function normalizeArticleStatus(status: string): ArticleStatus {
  if (status === "published" || status === "review") return status;
  return "draft";
}
