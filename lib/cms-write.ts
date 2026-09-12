import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { z } from "zod";
import type { articleInputSchema } from "@/lib/validation";

type ArticleInput = z.infer<typeof articleInputSchema>;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function tagSlug(name: string) {
  const latin = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return latin || `tag-${createHash("sha256").update(name).digest("hex").slice(0, 12)}`;
}

async function resolveCategoryId(supabase: SupabaseClient, value: string) {
  let query = supabase.from("categories").select("id");
  query = uuidPattern.test(value) ? query.eq("id", value) : query.eq("name", value);
  let { data } = await query.maybeSingle();
  if (!data && !uuidPattern.test(value)) {
    ({ data } = await supabase.from("categories").select("id").eq("slug", value).maybeSingle());
  }
  if (!data) throw new Error("دسته‌بندی انتخاب‌شده وجود ندارد.");
  return data.id as string;
}

async function syncTags(supabase: SupabaseClient, articleId: string, names: string[], canCreate: boolean) {
  const unique = [...new Set(names.map((name) => name.trim()).filter(Boolean))];
  const tagIds: string[] = [];
  for (const name of unique) {
    const slug = tagSlug(name);
    const { data: existing } = await supabase.from("tags").select("id").eq("slug", slug).maybeSingle();
    if (existing) tagIds.push(existing.id);
    else if (canCreate) { const { data, error } = await supabase.from("tags").insert({ name, slug }).select("id").single(); if (error) throw error; tagIds.push(data.id); }
  }
  const { error: clearError } = await supabase.from("article_tags").delete().eq("article_id", articleId);
  if (clearError) throw clearError;
  if (tagIds.length) {
    const { error } = await supabase.from("article_tags").insert(tagIds.map((tagId) => ({ article_id: articleId, tag_id: tagId })));
    if (error) throw error;
  }
}

export async function createArticle(supabase: SupabaseClient, input: ArticleInput, currentUserId: string, canPublish: boolean) {
  const categoryId = input.categoryId ? await resolveCategoryId(supabase, input.categoryId) : null;
  const authorId = uuidPattern.test(input.authorId ?? "") && canPublish ? input.authorId! : currentUserId;
  const requestedStatus = input.publishMode === "scheduled" ? "scheduled" : input.status;
  const status = !canPublish && ["published", "scheduled"].includes(requestedStatus) ? "review" : requestedStatus;
  const plainText = input.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const row = {
    title: input.title, slug: input.slug, excerpt: input.excerpt, content: input.content,
    category_id: categoryId, author_id: authorId, cover_url: input.featuredImage || null, status,
    reading_time: Math.max(1, Math.ceil((plainText ? plainText.split(" ").length : 0) / 220)),
    published_at: status === "published" ? new Date().toISOString() : null,
    scheduled_at: status === "scheduled" ? input.publishAt : null, seo: input.seo,
  };
  const { data, error } = await supabase.from("articles").insert(row).select("*").single();
  if (error) throw error;
  await syncTags(supabase, data.id, input.tags, canPublish);
  return data;
}

export async function updateArticle(supabase: SupabaseClient, id: string, input: Partial<ArticleInput>, editorId: string, canPublish: boolean) {
  const { data: existing, error: readError } = await supabase.from("articles").select("*").eq("id", id).single();
  if (readError) throw readError;
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
  if (input.content !== undefined) {
    patch.content = input.content;
    const plainText = input.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    patch.reading_time = Math.max(1, Math.ceil((plainText ? plainText.split(" ").length : 0) / 220));
  }
  if (input.categoryId !== undefined) patch.category_id = input.categoryId ? await resolveCategoryId(supabase, input.categoryId) : null;
  if (input.authorId && uuidPattern.test(input.authorId) && canPublish) patch.author_id = input.authorId;
  if (input.featuredImage !== undefined) patch.cover_url = input.featuredImage || null;
  if (input.seo !== undefined) patch.seo = input.seo;
  if (input.status !== undefined || input.publishMode !== undefined) {
    const requested = input.publishMode === "scheduled" ? "scheduled" : (input.status ?? existing.status);
    const status = !canPublish && ["published", "scheduled"].includes(requested) ? "review" : requested;
    patch.status = status;
    if (status === "published" && !existing.published_at) patch.published_at = new Date().toISOString();
    patch.scheduled_at = status === "scheduled" ? input.publishAt : null;
  }
  const { error: revisionError } = await supabase.from("article_revisions").insert({ article_id: id, editor_id: editorId, snapshot: existing });
  if (revisionError) throw revisionError;
  const { data, error } = await supabase.from("articles").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  if (input.tags) await syncTags(supabase, id, input.tags, canPublish);
  return data;
}
