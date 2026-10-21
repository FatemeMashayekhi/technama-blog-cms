import "server-only";
import { categoryToForm, getCategory, getTag, tagToForm, type CategoryFormData, type TagFormData } from "@/lib/taxonomy-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
