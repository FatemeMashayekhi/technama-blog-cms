import type { CommentStatus, MagazineComment } from "@/lib/comments-data";
import { isSupabaseConfigured } from "@/lib/env";

const wait = (duration = 300) => new Promise((resolve) => setTimeout(resolve, duration));

export type CommentFilterArticle = { id: string; title: string };
export type CommentFilterAuthor = { id: string; name: string; initials: string };
export type AdminCommentsData = { comments: MagazineComment[]; articles: CommentFilterArticle[]; authors: CommentFilterAuthor[] };

export const commentsService = {
  async list(): Promise<MagazineComment[]> { if (!isSupabaseConfigured) { const { mockComments } = await import("@/lib/comments-data"); return mockComments; } const response = await fetch("/api/comments?scope=admin"); const result = await response.json() as { ok: boolean; data?: DbComment[]; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error || "دریافت دیدگاه‌ها انجام نشد."); return (result.data ?? []).map(toComment); },
  async loadAdminData(): Promise<AdminCommentsData> {
    if (!isSupabaseConfigured) {
      const [{ mockComments }, { mockArticles }] = await Promise.all([import("@/lib/comments-data"), import("@/lib/posts-data")]);
      const articles = [...new Map(mockArticles.map((item) => [item.id, { id: item.id, title: item.title }])).values()].sort((a, b) => a.title.localeCompare(b.title, "fa"));
      const authors = [...new Map(mockArticles.filter((item) => item.author.id).map((item) => [item.author.id, { id: item.author.id, name: item.author.name, initials: item.author.initials }])).values()].sort((a, b) => a.name.localeCompare(b.name, "fa"));
      return { comments: mockComments, articles, authors };
    }
    const response = await fetch("/api/comments?scope=admin&include=filters");
    const result = await response.json() as { ok: boolean; data?: { comments: DbComment[]; articles: Array<{ id: string; title: string }>; authors: Array<{ id: string; display_name: string }> }; error?: string };
    if (!response.ok || !result.ok || !result.data) throw new Error(result.error || "دریافت اطلاعات مدیریت دیدگاه‌ها انجام نشد.");
    return {
      comments: result.data.comments.map(toComment),
      articles: result.data.articles.map((item) => ({ id: item.id, title: item.title })),
      authors: result.data.authors.map((item) => ({ id: item.id, name: item.display_name, initials: initials(item.display_name) })),
    };
  },
  async updateStatus(comment: MagazineComment, status: CommentStatus): Promise<MagazineComment> { if (isSupabaseConfigured) { const response = await fetch(`/api/comments/${comment.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); const result = await response.json() as { ok: boolean; data?: { status: CommentStatus; updated_at?: string }; error?: string }; if (!response.ok || !result.ok || !result.data) throw new Error(result.error || "ویرایش دیدگاه انجام نشد."); return { ...comment, status: result.data.status, updatedAt: result.data.updated_at ?? new Date().toISOString() }; } await wait(); return { ...comment, status, updatedAt: new Date().toISOString() }; },
  async updateMany(comments: MagazineComment[], ids: Set<string>, status: CommentStatus): Promise<MagazineComment[]> { if (isSupabaseConfigured) { const response = await fetch("/api/comments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [...ids], status }) }); const result = await response.json() as { ok: boolean; data?: Array<{ id: string; status: CommentStatus; updated_at?: string }>; error?: string }; if (!response.ok || !result.ok || !result.data) throw new Error(result.error || "ویرایش دیدگاه‌ها انجام نشد."); const updated = new Map(result.data.map((item) => [item.id, item])); return comments.map((comment) => { const row = updated.get(comment.id); return row ? { ...comment, status: row.status, updatedAt: row.updated_at ?? new Date().toISOString() } : comment; }); } await wait(); return comments.map((comment) => ids.has(comment.id) ? { ...comment, status, updatedAt: new Date().toISOString() } : comment); },
  async remove(comments: MagazineComment[], ids: Set<string>): Promise<MagazineComment[]> { if (isSupabaseConfigured) { const response = await fetch("/api/comments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [...ids] }) }); const result = await response.json() as { ok: boolean; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error || "حذف دیدگاه انجام نشد."); } else await wait(); return comments.filter((comment) => !ids.has(comment.id)); },
};

type DbComment = { id: string; content: string; name: string; email: string; status: CommentStatus; likes: number; created_at: string; updated_at?: string; parent_id?: string | null; article: { id: string; title: string; slug: string; author?: { id: string; display_name: string } | null } };
function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join(""); }
function toComment(row: DbComment): MagazineComment { const authorName = row.article.author?.display_name ?? "تحریریه"; return { id: row.id, content: row.content, commenter: { name: row.name, email: row.email, initials: initials(row.name), color: "bg-[#dbe8f2] text-[#315d78]" }, article: { id: row.article.id, title: row.article.title, slug: row.article.slug }, author: { id: row.article.author?.id ?? "", name: authorName, initials: initials(authorName) }, status: row.status, likes: row.likes, createdAt: row.created_at, updatedAt: row.updated_at, parentId: row.parent_id ?? undefined }; }
