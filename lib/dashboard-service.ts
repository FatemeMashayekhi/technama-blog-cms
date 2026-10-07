import "server-only";

import { cache } from "react";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { defaultDashboardUser, formatRelativeDashboardTime, getDashboardSearchItems, getDashboardStats, normalizeArticleStatus, type DashboardActivity, type DashboardArticle, type DashboardNotification, type DashboardRole, type DashboardSearchItem, type DashboardStat, type DashboardUser } from "@/lib/dashboard-data";
import { isSupabaseConfigured } from "@/lib/env";
import { mockArticles } from "@/lib/posts-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ArticleRow = { id: string; title: string; slug: string; status: string; views: number; updated_at: string; published_at?: string | null; author?: { id: string; display_name: string } | null; category?: { id: string; name: string } | null };
type ProfileRow = { id: string; display_name: string; role: DashboardRole };
type CategoryRow = { id: string; name: string };
type CommentRow = { id: string; name: string; status: string; created_at: string; article?: { id: string; title: string } | null };

export type DashboardOverview = { user: DashboardUser; articles: DashboardArticle[]; stats: DashboardStat[]; searchItems: DashboardSearchItem[]; notifications: DashboardNotification[]; activities: DashboardActivity[]; pendingCommentCount: number; generatedAt: string };

const avatarColors = ["bg-[#dbe8f2] text-[#254e6e]", "bg-[#e8e2f2] text-[#604b78]", "bg-[#f4e5d8] text-[#82552f]", "bg-[#ddefe9] text-[#30665c]", "bg-[#efe1e8] text-[#814e68]"];
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");

function mapArticle(row: ArticleRow, index: number): DashboardArticle {
  const authorName = row.author?.display_name ?? "تحریریه تک‌نما";
  return { id: row.id, title: row.title, slug: row.slug, status: normalizeArticleStatus(row.status), views: Number(row.views) || 0, updatedAt: row.updated_at, publishedAt: row.published_at ?? undefined, author: { id: row.author?.id ?? "", name: authorName, initials: initials(authorName), color: avatarColors[index % avatarColors.length] }, category: { id: row.category?.id ?? "", name: row.category?.name ?? "بدون دسته‌بندی" } };
}

function fallbackArticles(): DashboardArticle[] {
  return mockArticles.map((article) => ({ id: article.id, title: article.title, slug: article.slug, status: article.status, views: article.views, updatedAt: article.updatedAt, publishedAt: article.publishedAt, author: article.author, category: article.category }));
}

export const getDashboardCurrentUser = cache(async (): Promise<DashboardUser> => {
  if (!isSupabaseConfigured) return defaultDashboardUser;
  const [profile, authUser] = await Promise.all([getCurrentProfile(), getCurrentUser()]);
  if (!profile) return defaultDashboardUser;
  return { id: profile.id, name: profile.display_name, email: authUser?.email ?? "", avatar: profile.avatar_url ?? undefined, role: profile.role };
});

export const getDashboardOverview = cache(async (): Promise<DashboardOverview> => {
  const generatedAt = new Date().toISOString();
  const user = await getDashboardCurrentUser();
  if (!isSupabaseConfigured) {
    const articles = fallbackArticles();
    const authors = Array.from(new Map(articles.map((article) => [article.author.id, { id: article.author.id, name: article.author.name, role: "author" as const }])).values());
    const categories = Array.from(new Map(articles.map((article) => [article.category.id, article.category])).values());
    return { user, articles, stats: getDashboardStats(articles), searchItems: getDashboardSearchItems(articles, authors, categories), notifications: [], activities: createActivities(articles, generatedAt), pendingCommentCount: 0, generatedAt };
  }

  const supabase = await createSupabaseServerClient();
  const [articlesResult, profilesResult, categoriesResult, commentsResult] = await Promise.all([
    supabase.from("articles").select("id,title,slug,status,views,updated_at,published_at,author:profiles!articles_author_id_fkey(id,display_name),category:categories(id,name)").order("updated_at", { ascending: false }).limit(100),
    supabase.from("profiles").select("id,display_name,role").eq("is_active", true).order("display_name"),
    supabase.from("categories").select("id,name").order("name"),
    supabase.from("comments").select("id,name,status,created_at,article:articles(id,title)", { count: "exact" }).eq("status", "pending").order("created_at", { ascending: false }).limit(20),
  ]);
  if (articlesResult.error) throw new Error("دریافت داده‌های داشبورد انجام نشد.");
  const articles = ((articlesResult.data ?? []) as unknown as ArticleRow[]).map(mapArticle);
  const profiles = profilesResult.error ? [] : (profilesResult.data ?? []) as ProfileRow[];
  const categories = categoriesResult.error ? [] : (categoriesResult.data ?? []) as CategoryRow[];
  const pendingComments = commentsResult.error ? [] : (commentsResult.data ?? []) as unknown as CommentRow[];
  const notifications = createNotifications(articles, pendingComments);
  return { user, articles, stats: getDashboardStats(articles), searchItems: getDashboardSearchItems(articles, profiles.map((profile) => ({ id: profile.id, name: profile.display_name, role: profile.role })), categories), notifications, activities: createActivities(articles, generatedAt), pendingCommentCount: commentsResult.count ?? pendingComments.length, generatedAt };
});

function createNotifications(articles: DashboardArticle[], comments: CommentRow[]): DashboardNotification[] {
  const commentNotifications = comments.slice(0, 4).map((comment) => ({ id: `comment-${comment.id}`, title: "دیدگاه تازه در انتظار بررسی", description: `${comment.name} برای «${comment.article?.title ?? "یک مقاله"}» دیدگاه ثبت کرده است.`, type: "comment" as const, read: false, createdAt: comment.created_at, href: "/admin/comments" }));
  const reviewNotifications = articles.filter((article) => article.status === "review").slice(0, 3).map((article) => ({ id: `review-${article.id}`, title: "مقاله آماده بررسی است", description: `«${article.title}» توسط ${article.author.name} برای بررسی ارسال شده است.`, type: "article" as const, read: false, createdAt: article.updatedAt, href: `/admin/posts/${article.id}/edit` }));
  return [...commentNotifications, ...reviewNotifications].sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)).slice(0, 6);
}

function createActivities(articles: DashboardArticle[], nowIso: string): DashboardActivity[] {
  return articles.slice(0, 4).map((article) => ({ id: article.id, name: article.author.name, avatar: article.author.initials, color: article.author.color, action: article.status === "published" ? `مقاله «${article.title}» را منتشر کرد.` : article.status === "review" ? `مقاله «${article.title}» را برای بررسی ارسال کرد.` : `پیش‌نویس «${article.title}» را به‌روزرسانی کرد.`, time: formatRelativeDashboardTime(article.updatedAt, new Date(nowIso)), href: `/admin/posts/${article.id}/edit` }));
}
