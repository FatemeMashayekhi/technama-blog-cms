import { mockAuthors } from "@/lib/authors-data";
import { publicArticles, type PublicArticle, type PublicAuthor, type PublicCategory } from "@/lib/public-data";
import { mockCategories } from "@/lib/taxonomy-data";

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

  const articles = publicArticles
    .filter((article) => article.status === "published")
    .map((article) => {
      const relevance = scoreField(article.title, phrase, tokens, 12)
        + scoreField(article.category.name, phrase, tokens, 8)
        + scoreField(article.categorySlug, phrase, tokens, 5)
        + scoreField(article.excerpt, phrase, tokens, 4)
        + scoreField(article.author.name, phrase, tokens, 3)
        + scoreField(article.authorUsername, phrase, tokens, 3);
      return { article, relevance };
    })
    .filter((result) => result.relevance > 0)
    .sort((first, second) => second.relevance - first.relevance || second.article.views - first.article.views);

  const authors = mockAuthors
    .filter((author) => author.status === "active")
    .map((author) => ({
      author,
      relevance: scoreField(author.name, phrase, tokens, 8) + scoreField(author.username, phrase, tokens, 8) + scoreField(author.bio, phrase, tokens, 3),
    }))
    .filter((result) => result.relevance > 0)
    .sort((first, second) => second.relevance - first.relevance)
    .slice(0, 4)
    .map(({ author }) => ({ id: author.id, name: author.name, username: author.username, initials: author.initials, avatarColor: author.avatarColor, bio: author.bio, articleCount: author.articleCount, roleLabel: author.role === "admin" ? "سردبیر و نویسنده ارشد" : author.role === "editor" ? "ویراستار و نویسنده" : "نویسنده تخصصی" }));

  const categories = mockCategories
    .filter((category) => !category.parentId)
    .map((category) => ({
      category,
      relevance: scoreField(category.name, phrase, tokens, 8) + scoreField(category.slug, phrase, tokens, 6) + scoreField(category.description, phrase, tokens, 3),
    }))
    .filter((result) => result.relevance > 0)
    .sort((first, second) => second.relevance - first.relevance)
    .slice(0, 4)
    .map(({ category }) => ({ id: category.id, name: category.name, slug: category.slug, description: category.description, articleCount: category.articleCount, color: category.color }));

  return { query, articles, authors, categories };
}

export function sortSearchArticles(results: ScoredArticle[], sort: PublicSearchSort) {
  return [...results].sort((first, second) => {
    if (sort === "newest") return Date.parse(second.article.publishedAt || second.article.createdAt) - Date.parse(first.article.publishedAt || first.article.createdAt);
    if (sort === "views") return second.article.views - first.article.views;
    return second.relevance - first.relevance || second.article.views - first.article.views;
  });
}
