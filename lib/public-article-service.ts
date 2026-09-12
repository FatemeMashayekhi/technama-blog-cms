import { createArticleDetail, type PublicArticleDetail } from "@/lib/public-article-data";
import { publishedPublicArticles, type PublicArticle } from "@/lib/public-data";
export async function getArticleBySlug(slug: string): Promise<PublicArticleDetail | null> { const article = publishedPublicArticles.find((item) => item.slug === slug); return article ? createArticleDetail(article) : null; }
export async function getRelatedArticles(article: PublicArticle): Promise<PublicArticle[]> { return publishedPublicArticles.filter((item) => item.id !== article.id).sort((a, b) => Number(b.category.id === article.category.id) - Number(a.category.id === article.category.id)).slice(0, 3); }
export function getPublishedArticleSlugs() { return publishedPublicArticles.map((item) => item.slug); }
