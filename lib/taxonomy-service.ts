import { isSupabaseConfigured } from "@/lib/env";
import { mockCategories, mockTags, type Category, type CategoryFormData, type Tag, type TagFormData } from "@/lib/taxonomy-data";

type DbCategory = { id: string; name: string; slug: string; description: string; icon: string; color: string; parent_id?: string | null; cover_image?: string | null; seo?: Partial<Category["seo"]> | null; created_at: string; articles?: Array<{ count: number }> };
type DbTag = { id: string; name: string; slug: string; created_at: string; article_tags?: Array<{ count: number }> };
type ApiResult<T> = { ok: boolean; data?: T; error?: string };

function mapCategory(row: DbCategory): Category { return { id: row.id, name: row.name, slug: row.slug, description: row.description, icon: row.icon, color: row.color, parentId: row.parent_id ?? undefined, coverImage: row.cover_image ?? undefined, articleCount: Number(row.articles?.[0]?.count ?? 0), views: 0, createdAt: row.created_at, seo: { title: row.seo?.title ?? "", description: row.seo?.description ?? "", canonicalUrl: row.seo?.canonicalUrl ?? "" } }; }
function mapTag(row: DbTag): Tag { return { id: row.id, name: row.name, slug: row.slug, articleCount: Number(row.article_tags?.[0]?.count ?? 0), createdAt: row.created_at }; }
async function request<T>(url: string, init?: RequestInit): Promise<T> { const response = await fetch(url, init); const result = await response.json() as ApiResult<T>; if (!response.ok || !result.ok || result.data === undefined) throw new Error(result.error || "عملیات ساختار محتوا انجام نشد."); return result.data; }

export const taxonomyService = {
  async categories(): Promise<Category[]> { if (!isSupabaseConfigured) return mockCategories; return (await request<DbCategory[]>("/api/categories")).map(mapCategory); },
  async tags(): Promise<Tag[]> { if (!isSupabaseConfigured) return mockTags; return (await request<DbTag[]>("/api/tags")).map(mapTag); },
  async saveCategory(data: CategoryFormData, id?: string) { if (!isSupabaseConfigured) throw new Error("اتصال Supabase برای ذخیره دسته‌بندی فعال نیست."); return request<DbCategory>(id ? `/api/categories/${id}` : "/api/categories", { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); },
  async saveTag(data: TagFormData, id?: string) { if (!isSupabaseConfigured) throw new Error("اتصال Supabase برای ذخیره برچسب فعال نیست."); return request<DbTag>(id ? `/api/tags/${id}` : "/api/tags", { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); },
  async removeCategory(id: string) { if (!isSupabaseConfigured) throw new Error("اتصال Supabase برای حذف دسته‌بندی فعال نیست."); await request<{ id: string }>(`/api/categories/${id}`, { method: "DELETE" }); },
  async removeTag(id: string) { if (!isSupabaseConfigured) throw new Error("اتصال Supabase برای حذف برچسب فعال نیست."); await request<{ id: string }>(`/api/tags/${id}`, { method: "DELETE" }); },
};
