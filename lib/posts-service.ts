import { isSupabaseConfigured } from "@/lib/env";
import { mockArticles, type PostArticle } from "@/lib/posts-data";
import type { ArticleStatus } from "@/lib/dashboard-data";

type DbArticle = { id: string; title: string; slug: string; excerpt: string; status: ArticleStatus; views: number; created_at: string; updated_at: string; published_at?: string | null; author?: { id: string; display_name: string } | null; category?: { id: string; name: string } | null };
const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
const mapArticle = (row: DbArticle): PostArticle => { const authorName = row.author?.display_name ?? "تحریریه"; return { id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt, thumbnail: { background: "bg-[#dcebe8]", accent: "text-[#176a62]" }, author: { id: row.author?.id ?? "", name: authorName, initials: initials(authorName), color: "bg-[#dbe8f2] text-[#254e6e]" }, category: { id: row.category?.id ?? "", name: row.category?.name ?? "بدون دسته‌بندی" }, status: row.status, views: Number(row.views), createdAt: row.created_at, updatedAt: row.updated_at, updatedLabel: "به‌روزرسانی اخیر", publishedAt: row.published_at ?? undefined }; };
export const postsService = {
  async list() { if (!isSupabaseConfigured) return mockArticles; const response = await fetch("/api/articles?scope=admin&limit=100"); const result = await response.json() as { ok: boolean; data?: DbArticle[]; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error || "دریافت مقاله‌ها انجام نشد."); return (result.data ?? []).map(mapArticle); },
  async status(id: string, status: ArticleStatus) { if (!isSupabaseConfigured) return; const response = await fetch(`/api/articles/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); if (!response.ok) throw new Error("تغییر وضعیت انجام نشد."); },
  async remove(ids: string[]) { if (!isSupabaseConfigured) return; for (const id of ids) { const response = await fetch(`/api/articles/${id}`, { method: "DELETE" }); if (!response.ok) throw new Error("حذف مقاله انجام نشد."); } },
};
