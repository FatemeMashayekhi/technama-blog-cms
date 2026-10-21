import { cache } from "react";
import { createArticleDetail } from "@/lib/public-article-data";
import { getPublishedArticles } from "@/lib/public-article-service";
import { isSupabaseConfigured } from "@/lib/env";
import { publishedPublicArticles, type PublicArticle } from "@/lib/public-data";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { mockTags, type Tag } from "@/lib/taxonomy-data";

export type PublicTag = Tag & { articles: PublicArticle[] };
type DbTag = { id: string; name: string; slug: string; created_at: string };
type DbArticleTag = { article_id: string; tag_id: string };

function localTags(): PublicTag[] {
  return mockTags.map((tag) => ({
    ...tag,
    articles: publishedPublicArticles.filter((article) => createArticleDetail(article)?.tags.some((item) => item.slug === tag.slug)),
  })).sort((a, b) => b.articles.length - a.articles.length);
}

export const getPublicTags = cache(async (): Promise<PublicTag[]> => {
  if (!isSupabaseConfigured) return localTags();
  try {
    const supabase = createSupabasePublicClient();
    const [{ data: tagRows, error: tagError }, { data: relationRows, error: relationError }, articles] = await Promise.all([
      supabase.from("tags").select("id,name,slug,created_at").order("name").limit(500),
      supabase.from("article_tags").select("article_id,tag_id").limit(5_000),
      getPublishedArticles(500),
    ]);
    if (tagError) throw tagError;
    if (relationError) throw relationError;
    const byId = new Map(articles.map((article) => [article.id, article]));
    const relations = (relationRows ?? []) as DbArticleTag[];
    return ((tagRows ?? []) as DbTag[]).map((tag) => {
      const linked = relations.flatMap((relation) => relation.tag_id === tag.id && byId.has(relation.article_id) ? [byId.get(relation.article_id)!] : []);
      return { id: tag.id, name: tag.name, slug: tag.slug, articleCount: linked.length, createdAt: tag.created_at, articles: linked };
    }).sort((a, b) => b.articles.length - a.articles.length || a.name.localeCompare(b.name, "fa"));
  } catch (error) {
    console.error("[public-tag] directory query failed", { message: error instanceof Error ? error.message : "unknown error" });
    return [];
  }
});

export async function getPublicTag(slug: string): Promise<PublicTag | null> {
  return (await getPublicTags()).find((tag) => tag.slug === slug) ?? null;
}

export async function getPublicTagSlugs() {
  return (await getPublicTags()).map((tag) => tag.slug);
}
