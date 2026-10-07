import { cache } from "react";
import { mockAuthors, roleLabels, type Author } from "@/lib/authors-data";
import { isSupabaseConfigured } from "@/lib/env";
import { mapDatabaseArticle, type DbArticle } from "@/lib/public-article-service";
import { publicArticles, type PublicArticle } from "@/lib/public-data";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export type PublicAuthorDetail = Author & { roleLabel: string };
export type PublicAuthorData = {
  author: PublicAuthorDetail;
  articles: PublicArticle[];
  featured: PublicArticle | null;
  popular: PublicArticle[];
  relatedAuthors: PublicAuthorDetail[];
  totalArticleViews: number;
};

type DbArticleSummary = { id: string; title: string; status: string; views: number; published_at: string | null };
type DbProfile = { id: string; display_name: string; username: string; avatar_url: string | null; bio: string; role: Author["role"]; is_active: boolean; created_at: string; articles?: DbArticleSummary[] };
const colors = ["bg-[#dbe8f2] text-[#254e6e]", "bg-[#e8e2f2] text-[#604b78]", "bg-[#f4e5d8] text-[#82552f]", "bg-[#f0e0e0] text-[#844747]", "bg-[#e8ecd9] text-[#626b31]", "bg-[#efe1e8] text-[#814e68]"];
const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("");

const toLocalPublicAuthor = (author: Author): PublicAuthorDetail => ({
  ...author,
  articleCount: publicArticles.filter((article) => article.status === "published" && article.author.id === author.id).length,
  roleLabel: roleLabels[author.role],
});

const toDatabaseAuthor = (row: DbProfile, index = 0): PublicAuthorDetail => {
  const articles = (row.articles ?? []).filter((article) => article.status === "published");
  const name = row.display_name || "نویسنده تک‌نما";
  const joinedAt = row.created_at || new Date().toISOString();
  return {
    id: row.id,
    name,
    username: row.username,
    email: "",
    avatar: row.avatar_url ?? undefined,
    avatarColor: colors[index % colors.length],
    initials: initials(name),
    bio: row.bio || "عضو تحریریه تک‌نما",
    role: row.role,
    status: row.is_active ? "active" : "inactive",
    articleCount: articles.length,
    totalViews: articles.reduce((total, article) => total + Number(article.views ?? 0), 0),
    publishedRate: 100,
    joinedAt,
    joinedLabel: new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long" }).format(new Date(joinedAt)),
    socialLinks: { website: "", linkedin: "", twitter: "", github: "" },
    recentArticles: articles.slice(0, 3).map((article) => article.title),
    roleLabel: roleLabels[row.role as Author["role"]] ?? "نویسنده تخصصی",
  };
};

const localAuthors = () => mockAuthors.filter((author) => author.status === "active").map(toLocalPublicAuthor);

export const getPublicAuthors = cache(async (): Promise<PublicAuthorDetail[]> => {
  if (!isSupabaseConfigured) return localAuthors();
  try {
    const { data, error } = await createSupabasePublicClient().from("profiles").select("id,display_name,username,avatar_url,bio,role,is_active,created_at,articles(id,title,status,views,published_at)").eq("is_active", true).order("created_at").limit(100);
    if (error || !data?.length) return localAuthors();
    return (data as unknown as DbProfile[]).map(toDatabaseAuthor).sort((first, second) => second.articleCount - first.articleCount || second.totalViews - first.totalViews);
  } catch {
    return localAuthors();
  }
});

export async function getAuthorByUsername(username: string): Promise<PublicAuthorDetail | null> {
  const authors = await getPublicAuthors();
  return authors.find((author) => author.username.toLowerCase() === username.toLowerCase())
    ?? localAuthors().find((author) => author.username.toLowerCase() === username.toLowerCase())
    ?? null;
}

export async function getPublishedArticlesByAuthor(authorId: string): Promise<PublicArticle[]> {
  if (!isSupabaseConfigured || authorId.startsWith("author-")) {
    return publicArticles.filter((article) => article.status === "published" && article.author.id === authorId).sort((first, second) => Date.parse(second.publishedAt || second.createdAt) - Date.parse(first.publishedAt || first.createdAt));
  }
  try {
    const { data, error } = await createSupabasePublicClient().from("articles").select("id,title,slug,excerpt,cover_url,status,views,created_at,updated_at,published_at,reading_time,author:profiles!articles_author_id_fkey(id,display_name,username,avatar_url,bio,role,is_active,created_at),category:categories(id,name,slug,color)").eq("author_id", authorId).eq("status", "published").lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(100);
    if (error) return [];
    return ((data ?? []) as unknown as DbArticle[]).map(mapDatabaseArticle);
  } catch {
    return [];
  }
}

export async function getPopularArticlesByAuthor(authorId: string): Promise<PublicArticle[]> {
  return (await getPublishedArticlesByAuthor(authorId)).sort((first, second) => second.views - first.views).slice(0, 4);
}

export async function getPublicAuthorData(username: string): Promise<PublicAuthorData | null> {
  const author = await getAuthorByUsername(username);
  if (!author) return null;
  const [articles, authors] = await Promise.all([getPublishedArticlesByAuthor(author.id), getPublicAuthors()]);
  const featured = [...articles].sort((first, second) => second.views - first.views)[0] ?? null;
  return {
    author,
    articles: featured ? articles.filter((article) => article.id !== featured.id) : [],
    featured,
    popular: [...articles].sort((first, second) => second.views - first.views).slice(0, 4),
    relatedAuthors: authors.filter((item) => item.id !== author.id).slice(0, 4),
    totalArticleViews: articles.reduce((total, article) => total + article.views, 0),
  };
}

export async function getPublicAuthorUsernames() {
  return (await getPublicAuthors()).map((author) => author.username);
}
