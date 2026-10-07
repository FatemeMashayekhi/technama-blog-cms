import { featuredArticle, latestPublicArticles, popularPublicArticles, publicAuthors, publicCategories, publishedPublicArticles, secondaryFeatured, type PublicArticle, type PublicCategory, type PublicHomeData } from "@/lib/public-data";
import { isSupabaseConfigured } from "@/lib/env";
import { mapDatabaseArticle, type DbArticle } from "@/lib/public-article-service";
import { createSupabasePublicClient } from "@/lib/supabase/public";

const fallback = (): PublicHomeData => ({ featured: featuredArticle, secondary: secondaryFeatured, latest: latestPublicArticles.slice(0, 6), popular: popularPublicArticles, categories: publicCategories, authors: publicAuthors.slice(0, 5) });
type CategoryRow = { id: string; name: string; slug: string; description: string; color: string };
type AuthorRow = { id: string; display_name: string; username: string; avatar_url: string | null; bio: string; role: "admin" | "editor" | "author" };
export async function getPublicHomeData(): Promise<PublicHomeData> {
  if (!isSupabaseConfigured) return fallback();
  try {
    const supabase = createSupabasePublicClient();
    const now = new Date().toISOString();
    const [{ data: articleRows }, { data: categoryRows }, { data: authorRows }] = await Promise.all([
      supabase.from("articles").select("id,title,slug,excerpt,cover_url,status,views,created_at,updated_at,published_at,reading_time,author:profiles!articles_author_id_fkey(id,display_name,username,avatar_url,bio,role,is_active,created_at),category:categories(id,name,slug,color)").eq("status", "published").lte("published_at", now).order("published_at", { ascending: false }).limit(20),
      supabase.from("categories").select("id,name,slug,description,color").order("name").limit(12),
      supabase.from("profiles").select("id,display_name,username,avatar_url,bio,role,is_active,created_at").eq("is_active", true).order("created_at").limit(8),
    ]);
    if (!articleRows?.length) return fallback();
    const articles = (articleRows as unknown as DbArticle[]).map(mapDatabaseArticle);
    const categories = ((categoryRows ?? []) as unknown as CategoryRow[]).map((row) => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, articleCount: articles.filter((article) => article.category.id === row.id).length, color: row.color }));
    const authors = ((authorRows ?? []) as unknown as AuthorRow[]).map((row) => ({ id: row.id, name: row.display_name, username: row.username, initials: row.display_name.split(/\s+/).slice(0, 2).map((part: string) => part[0]).join(""), avatarColor: "bg-[#dbe8f2] text-[#254e6e]", bio: row.bio, articleCount: articles.filter((article) => article.author.id === row.id).length, roleLabel: row.role === "admin" ? "سردبیر و نویسنده ارشد" : row.role === "editor" ? "ویراستار و نویسنده" : "نویسنده تخصصی" }));
    return { featured: articles[0], secondary: articles.slice(1, 4), latest: articles.slice(0, 6), popular: [...articles].sort((a, b) => b.views - a.views).slice(0, 5), categories, authors };
  } catch {
    return fallback();
  }
}

export async function getPublicArchiveData(): Promise<{ articles: PublicArticle[]; categories: PublicCategory[] }> {
  if (!isSupabaseConfigured) return { articles: publishedPublicArticles, categories: publicCategories };
  try {
    const supabase = createSupabasePublicClient(); const now = new Date().toISOString();
    const [{ data: articleRows }, { data: categoryRows }] = await Promise.all([
      supabase.from("articles").select("id,title,slug,excerpt,cover_url,status,views,created_at,updated_at,published_at,reading_time,author:profiles!articles_author_id_fkey(id,display_name,username,avatar_url,bio,role,is_active,created_at),category:categories(id,name,slug,color)").eq("status", "published").lte("published_at", now).order("published_at", { ascending: false }).limit(100),
      supabase.from("categories").select("id,name,slug,description,color").order("name").limit(200),
    ]);
    if (!articleRows?.length) return { articles: publishedPublicArticles, categories: publicCategories };
    const articles = (articleRows as unknown as DbArticle[]).map(mapDatabaseArticle);
    const categories = ((categoryRows ?? []) as unknown as CategoryRow[]).map((row) => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, articleCount: articles.filter((article) => article.category.id === row.id).length, color: row.color }));
    return { articles, categories };
  } catch {
    return { articles: publishedPublicArticles, categories: publicCategories };
  }
}
