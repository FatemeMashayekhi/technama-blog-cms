import "server-only";
import { categoryToForm, getCategory, getTag, tagToForm, type CategoryFormData, type TagFormData } from "@/lib/taxonomy-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function assertValidCategoryParent(supabase: SupabaseClient, categoryId: string | null, parentId: string | null) {
  if (!parentId) return;
  if (categoryId === parentId) throw new Error("دسته‌بندی نمی‌تواند والد خودش باشد.");
  let cursor: string | null = parentId;
  const visited = new Set<string>();
  for (let depth = 0; cursor && depth < 100; depth += 1) {
    if (cursor === categoryId || visited.has(cursor)) throw new Error("ساختار والد دسته‌بندی چرخه ایجاد می‌کند.");
    visited.add(cursor);
    const result = await supabase.from("categories").select("parent_id").eq("id", cursor).maybeSingle();
    if (result.error) throw result.error;
    const parent = result.data as { parent_id: string | null } | null;
    if (!parent) throw new Error("دسته‌بندی والد پیدا نشد.");
    cursor = parent.parent_id;
  }
  if (cursor) throw new Error("عمق ساختار دسته‌بندی بیشتر از حد مجاز است.");
}

export async function getCategoryForm(id: string): Promise<CategoryFormData | null> {
  if (!isSupabaseConfigured) { const item = getCategory(id); return item ? categoryToForm(item) : null; }
  const { data, error } = await (await createSupabaseServerClient()).from("categories").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return { name: data.name, slug: data.slug, description: data.description, icon: data.icon, color: data.color, parentId: data.parent_id ?? "", coverImage: data.cover_image ?? undefined, seo: { title: data.seo?.title ?? "", description: data.seo?.description ?? "", canonicalUrl: data.seo?.canonicalUrl ?? "" } };
}

export async function getTagForm(id: string): Promise<TagFormData | null> {
  if (!isSupabaseConfigured) { const item = getTag(id); return item ? tagToForm(item) : null; }
  const { data, error } = await (await createSupabaseServerClient()).from("tags").select("name,slug").eq("id", id).maybeSingle();
  return error || !data ? null : { name: data.name, slug: data.slug };
}
