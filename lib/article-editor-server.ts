import { getMockArticleForEditor, type ArticleFormData } from "@/lib/article-editor";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getArticleForEditor(id: string): Promise<ArticleFormData | null> {
  if (!isSupabaseConfigured) return getMockArticleForEditor(id);
  const { data, error } = await (await createSupabaseServerClient()).from("articles").select("*,article_tags(tag:tags(name))").eq("id", id).maybeSingle();
  if (error || !data) return null;
  const seo = (data.seo && typeof data.seo === "object" ? data.seo : {}) as Record<string, unknown>;
  return {
    title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content,
    categoryId: data.category_id ?? "", authorId: data.author_id,
    tags: (data.article_tags ?? []).map((item: { tag: { name: string } | null }) => item.tag?.name).filter(Boolean) as string[],
    featuredImage: data.cover_url ?? undefined, featuredImageName: data.cover_url?.split("/").pop(),
    status: data.status === "archived" ? "draft" : data.status,
    publishMode: data.status === "scheduled" ? "scheduled" : "now",
    publishAt: data.scheduled_at ? new Date(data.scheduled_at).toISOString().slice(0, 16) : undefined,
    seo: { title: String(seo.title ?? ""), description: String(seo.description ?? ""), canonicalUrl: String(seo.canonicalUrl ?? ""), ogImage: String(seo.ogImage ?? "") },
  };
}
