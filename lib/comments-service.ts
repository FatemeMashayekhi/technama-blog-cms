import type { CommentStatus, MagazineComment } from "@/lib/comments-data";
import { isSupabaseConfigured } from "@/lib/env";

const wait = (duration = 300) => new Promise((resolve) => setTimeout(resolve, duration));

export const commentsService = {
  async list(): Promise<MagazineComment[]> { if (!isSupabaseConfigured) { const { mockComments } = await import("@/lib/comments-data"); return mockComments; } const response = await fetch("/api/comments?scope=admin"); const result = await response.json() as { ok: boolean; data?: DbComment[]; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error || "دریافت دیدگاه‌ها انجام نشد."); return (result.data ?? []).map(toComment); },
  async updateStatus(comment: MagazineComment, status: CommentStatus): Promise<MagazineComment> { if (isSupabaseConfigured) { const response = await fetch(`/api/comments/${comment.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); const result = await response.json() as { ok: boolean; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error || "ویرایش دیدگاه انجام نشد."); } else await wait(); return { ...comment, status, updatedAt: new Date().toISOString() }; },
  async updateMany(comments: MagazineComment[], ids: Set<string>, status: CommentStatus): Promise<MagazineComment[]> { for (const comment of comments.filter((item) => ids.has(item.id))) await this.updateStatus(comment, status); return comments.map((comment) => ids.has(comment.id) ? { ...comment, status, updatedAt: new Date().toISOString() } : comment); },
  async remove(comments: MagazineComment[], ids: Set<string>): Promise<MagazineComment[]> { if (isSupabaseConfigured) { for (const id of ids) { const response = await fetch(`/api/comments/${id}`, { method: "DELETE" }); if (!response.ok) throw new Error("حذف دیدگاه انجام نشد."); } } else await wait(); return comments.filter((comment) => !ids.has(comment.id)); },
};

type DbComment = { id: string; content: string; name: string; email: string; status: CommentStatus; likes: number; created_at: string; updated_at?: string; parent_id?: string | null; article: { id: string; title: string; slug: string; author?: { id: string; display_name: string } | null } };
function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join(""); }
function toComment(row: DbComment): MagazineComment { const authorName = row.article.author?.display_name ?? "تحریریه"; return { id: row.id, content: row.content, commenter: { name: row.name, email: row.email, initials: initials(row.name), color: "bg-[#dbe8f2] text-[#315d78]" }, article: { id: row.article.id, title: row.article.title, slug: row.article.slug }, author: { id: row.article.author?.id ?? "", name: authorName, initials: initials(authorName) }, status: row.status, likes: row.likes, createdAt: row.created_at, updatedAt: row.updated_at, parentId: row.parent_id ?? undefined }; }
