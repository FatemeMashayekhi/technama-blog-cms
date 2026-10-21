import { getPublishedArticles } from "@/lib/public-article-service";
import { getPublicAuthors } from "@/lib/public-author-service";
import { getPublicCategories } from "@/lib/public-category-service";
import type { PublicArticle, PublicAuthor, PublicCategory } from "@/lib/public-data";

export type PublicSearchSort = "relevance" | "newest" | "views";
export type ScoredArticle = { article: PublicArticle; relevance: number };
export type PublicSearchResponse = {
  query: string;
  articles: ScoredArticle[];
  authors: PublicAuthor[];
  categories: PublicCategory[];
};

const normalize = (value: string) => value
  .toLocaleLowerCase("fa-IR")
  .replace(/[يى]/g, "ی")
  .replace(/ك/g, "ک")
  .replace(/[\u200c\s]+/g, " ")
  .trim();

const scoreField = (field: string, phrase: string, tokens: string[], weight: number) => {
  const normalized = normalize(field);
  let score = normalized.includes(phrase) ? weight * 3 : 0;
  for (const token of tokens) if (normalized.includes(token)) score += weight;
  return score;
};

export async function searchPublicContent(rawQuery: string): Promise<PublicSearchResponse> {
  const query = rawQuery.trim().slice(0, 120);
  const phrase = normalize(query);
  if (!phrase) return { query: "", articles: [], authors: [], categories: [] };
  const tokens = phrase.split(" ").filter((token) => token.length > 1);
  const [publishedArticles, publicAuthors, publicCategories] = await Promise.all([
    getPublishedArticles(500),
    getPublicAuthors(),
    getPublicCategories(),
  ]);

  const articles = publishedArticles.map((article) => {
    const relevance = scoreField(article.title, phrase, tokens, 12)
      + scoreField(article.category.name, phrase, tokens, 8)
      + scoreField(article.categorySlug, phrase, tokens, 5)
      + scoreField(article.excerpt, phrase, tokens, 4)
      + scoreField(article.author.name, phrase, tokens, 3)
      + scoreField(article.authorUsername, phrase, tokens, 3);
    return { article, relevance };
  }).filter((result) => result.relevance > 0)
    .sort((first, second) => second.relevance - first.relevance || second.article.views - first.article.views);

  const authors = publicAuthors.map((author) => ({
    author,
    relevance: scoreField(author.name, phrase, tokens, 8)
      + scoreField(author.username, phrase, tokens, 8)
      + scoreField(author.bio, phrase, tokens, 3),
  })).filter((result) => result.relevance > 0)
    .sort((first, second) => second.relevance - first.relevance)
    .slice(0, 4)
    .map(({ author }) => author);

  const categories = publicCategories.map((category) => ({
    category,
    relevance: scoreField(category.name, phrase, tokens, 8)
      + scoreField(category.slug, phrase, tokens, 6)
      + scoreField(category.description, phrase, tokens, 3),
  })).filter((result) => result.relevance > 0)
    .sort((first, second) => second.relevance - first.relevance)
    .slice(0, 4)
    .map(({ category }) => category);

  return { query, articles, authors, categories };
}

export function sortSearchArticles(results: ScoredArticle[], sort: PublicSearchSort) {
  return [...results].sort((first, second) => {
    if (sort === "newest") return Date.parse(second.article.publishedAt || second.article.createdAt) - Date.parse(first.article.publishedAt || first.article.createdAt);
    if (sort === "views") return second.article.views - first.article.views;
    return second.relevance - first.relevance || second.article.views - first.article.views;
  });
}
