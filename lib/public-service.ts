import { featuredArticle, latestPublicArticles, popularPublicArticles, publicAuthors, publicCategories, publishedPublicArticles, secondaryFeatured, type PublicArticle, type PublicCategory, type PublicHomeData } from "@/lib/public-data";
import { isSupabaseConfigured } from "@/lib/env";
import { mapDatabaseArticle } from "@/lib/public-article-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const fallback = (): PublicHomeData => ({ featured: featuredArticle, secondary: secondaryFeatured, latest: latestPublicArticles.slice(0, 6), popular: popularPublicArticles, categories: publicCategories, authors: publicAuthors.slice(0, 5) });
export async function getPublicHomeData(): Promise<PublicHomeData> {
  if (!isSupabaseConfigured) return fallback();
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();
  const [{ data: articleRows }, { data: categoryRows }, { data: authorRows }] = await Promise.all([
    supabase.from("articles").select("*,author:profiles!articles_author_id_fkey(*),category:categories(*)").eq("status", "published").lte("published_at", now).order("published_at", { ascending: false }).limit(20),
    supabase.from("categories").select("*").order("name").limit(12),
    supabase.from("profiles").select("*").eq("is_active", true).order("created_at").limit(8),
  ]);
  if (!articleRows?.length) return fallback();
  const articles = articleRows.map(mapDatabaseArticle);
  const categories = (categoryRows ?? []).map((row) => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, articleCount: articles.filter((article) => article.category.id === row.id).length, color: row.color }));
  const authors = (authorRows ?? []).map((row) => ({ id: row.id, name: row.display_name, username: row.username, initials: row.display_name.split(/\s+/).slice(0, 2).map((part: string) => part[0]).join(""), avatarColor: "bg-[#dbe8f2] text-[#254e6e]", bio: row.bio, articleCount: articles.filter((article) => article.author.id === row.id).length, roleLabel: row.role === "admin" ? "سردبیر و نویسنده ارشد" : row.role === "editor" ? "ویراستار و نویسنده" : "نویسنده تخصصی" }));
  return { featured: articles[0], secondary: articles.slice(1, 4), latest: articles.slice(0, 6), popular: [...articles].sort((a, b) => b.views - a.views).slice(0, 5), categories, authors };
}

export async function getPublicArchiveData(): Promise<{ articles: PublicArticle[]; categories: PublicCategory[] }> {
  if (!isSupabaseConfigured) return { articles: publishedPublicArticles, categories: publicCategories };
  const supabase = await createSupabaseServerClient(); const now = new Date().toISOString();
  const [{ data: articleRows }, { data: categoryRows }] = await Promise.all([
    supabase.from("articles").select("*,author:profiles!articles_author_id_fkey(*),category:categories(*)").eq("status", "published").lte("published_at", now).order("published_at", { ascending: false }).limit(100),
    supabase.from("categories").select("*").order("name"),
  ]);
  const articles = (articleRows ?? []).map(mapDatabaseArticle);
  const categories = (categoryRows ?? []).map((row) => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, articleCount: articles.filter((article) => article.category.id === row.id).length, color: row.color }));
  return { articles, categories };
}
