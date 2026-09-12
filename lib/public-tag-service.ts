import { createArticleDetail } from "@/lib/public-article-data";
import { publishedPublicArticles, type PublicArticle } from "@/lib/public-data";
import { mockTags, type Tag } from "@/lib/taxonomy-data";

export type PublicTag = Tag & { articles: PublicArticle[] };

function articlesForTag(slug: string) {
  return publishedPublicArticles.filter((article) => createArticleDetail(article)?.tags.some((tag) => tag.slug === slug));
}

export function getPublicTags(): PublicTag[] {
  return mockTags.map((tag) => ({ ...tag, articles: articlesForTag(tag.slug) })).sort((a, b) => b.articles.length - a.articles.length);
}

export function getPublicTag(slug: string): PublicTag | null {
  const tag = mockTags.find((item) => item.slug === slug);
  return tag ? { ...tag, articles: articlesForTag(slug) } : null;
}

export function getPublicTagSlugs() { return mockTags.map((tag) => tag.slug); }
