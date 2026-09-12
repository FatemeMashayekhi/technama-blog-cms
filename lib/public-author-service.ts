import { mockAuthors, roleLabels, type Author } from "@/lib/authors-data";
import { publicArticles, type PublicArticle } from "@/lib/public-data";

export type PublicAuthorDetail = Author & { roleLabel: string };
export type PublicAuthorData = {
  author: PublicAuthorDetail;
  articles: PublicArticle[];
  featured: PublicArticle | null;
  popular: PublicArticle[];
  relatedAuthors: PublicAuthorDetail[];
  totalArticleViews: number;
};

const toPublicAuthor = (author: Author): PublicAuthorDetail => ({
  ...author,
  roleLabel: roleLabels[author.role],
});

export async function getAuthorByUsername(username: string): Promise<PublicAuthorDetail | null> {
  const author = mockAuthors.find((item) => item.status === "active" && item.username.toLowerCase() === username.toLowerCase());
  return author ? toPublicAuthor(author) : null;
}

export async function getPublishedArticlesByAuthor(authorId: string): Promise<PublicArticle[]> {
  return publicArticles
    .filter((article) => article.status === "published" && article.author.id === authorId)
    .sort((first, second) => Date.parse(second.publishedAt || second.createdAt) - Date.parse(first.publishedAt || first.createdAt));
}

export async function getPopularArticlesByAuthor(authorId: string): Promise<PublicArticle[]> {
  return (await getPublishedArticlesByAuthor(authorId)).sort((first, second) => second.views - first.views).slice(0, 4);
}

export async function getPublicAuthorData(username: string): Promise<PublicAuthorData | null> {
  const author = await getAuthorByUsername(username);
  if (!author) return null;
  const articles = await getPublishedArticlesByAuthor(author.id);
  const featured = [...articles].sort((first, second) => second.views - first.views)[0] ?? null;
  const relatedAuthors = mockAuthors
    .filter((item) => item.id !== author.id && item.status === "active")
    .sort((first, second) => second.totalViews - first.totalViews)
    .slice(0, 4)
    .map(toPublicAuthor);

  return {
    author,
    articles: featured ? articles.filter((article) => article.id !== featured.id) : [],
    featured,
    popular: await getPopularArticlesByAuthor(author.id),
    relatedAuthors,
    totalArticleViews: articles.reduce((total, article) => total + article.views, 0),
  };
}

export function getPublicAuthorUsernames() {
  return mockAuthors.filter((author) => author.status === "active").map((author) => author.username);
}
