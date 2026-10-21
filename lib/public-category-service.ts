import { cache } from "react";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/env";
import { getPublishedArticles } from "@/lib/public-article-service";
import { publicArticles, publicCategories, type PublicArticle, type PublicCategory } from "@/lib/public-data";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { mockCategories, type Category } from "@/lib/taxonomy-data";

export type PublicCategoryDetail = PublicCategory & Pick<Category, "icon" | "views" | "seo" | "coverImage">;
export type PublicCategoryData = { category: PublicCategoryDetail; articles: PublicArticle[]; featured: PublicArticle[]; popular: PublicArticle[]; related: PublicCategory[] };

type DbCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  parent_id: string | null;
  cover_image: string | null;
  seo: Partial<Category["seo"]> | null;
  created_at: string;
};

function localDetail(slug: string): PublicCategoryDetail | null {
  const item = mockCategories.find((category) => category.slug === slug);
  if (!item) return null;
  const { id, name, description, color, icon, views, seo, coverImage } = item;
  const articleCount = publicArticles.filter((article) => article.status === "published" && article.category.id === id).length;
  return { id, name, slug, description, articleCount, color, icon, views, seo, coverImage };
}

function mapCategory(row: DbCategory, articles: PublicArticle[]): PublicCategoryDetail {
  const categoryArticles = articles.filter((article) => article.category.id === row.id);
  const title = row.seo?.title?.trim() || `${row.name}؛ مقاله‌ها و تحلیل‌ها`;
  const description = row.seo?.description?.trim() || row.description;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    articleCount: categoryArticles.length,
    color: row.color,
    icon: row.icon,
    views: categoryArticles.reduce((total, article) => total + article.views, 0),
    coverImage: row.cover_image ?? undefined,
    seo: { title, description, canonicalUrl: getSiteUrl(`/categories/${row.slug}`) },
  };
}

async function loadCategories() {
  const { data, error } = await createSupabasePublicClient().from("categories")
    .select("id,name,slug,description,icon,color,parent_id,cover_image,seo,created_at")
    .order("name")
    .limit(500);
  if (error) throw error;
  return (data ?? []) as DbCategory[];
}

export const getPublicCategories = cache(async (): Promise<PublicCategory[]> => {
  if (!isSupabaseConfigured) return publicCategories;
  try {
    const [rows, articles] = await Promise.all([loadCategories(), getPublishedArticles(500)]);
    return rows.filter((row) => !row.parent_id).map((row) => mapCategory(row, articles));
  } catch (error) {
    console.error("[public-category] directory query failed", { message: error instanceof Error ? error.message : "unknown error" });
    return [];
  }
});

export const getCategoryBySlug = cache(async (slug: string): Promise<PublicCategoryDetail | null> => {
  if (!isSupabaseConfigured) return localDetail(slug);
  try {
    const [result, articles] = await Promise.all([
      createSupabasePublicClient().from("categories")
        .select("id,name,slug,description,icon,color,parent_id,cover_image,seo,created_at")
        .eq("slug", slug).maybeSingle(),
      getPublishedArticles(500),
    ]);
    if (result.error) throw result.error;
    return result.data ? mapCategory(result.data as DbCategory, articles) : null;
  } catch (error) {
    console.error("[public-category] detail query failed", { slug, message: error instanceof Error ? error.message : "unknown error" });
    return null;
  }
});

export async function getArticlesByCategory(categoryId: string): Promise<PublicArticle[]> {
  if (!isSupabaseConfigured) {
    return publicArticles.filter((article) => article.status === "published" && article.category.id === categoryId)
      .sort((a, b) => Date.parse(b.publishedAt || b.createdAt) - Date.parse(a.publishedAt || a.createdAt));
  }
  return (await getPublishedArticles(500)).filter((article) => article.category.id === categoryId);
}

export async function getPopularArticlesByCategory(categoryId: string): Promise<PublicArticle[]> {
  return (await getArticlesByCategory(categoryId)).sort((a, b) => b.views - a.views).slice(0, 5);
}

export async function getPublicCategoryData(slug: string): Promise<PublicCategoryData | null> {
  const category = await getCategoryBySlug(slug);
  if (!category) return null;
  const [articles, categories] = await Promise.all([getArticlesByCategory(category.id), getPublicCategories()]);
  const related = categories.filter((item) => item.id !== category.id).sort((a, b) => b.articleCount - a.articleCount).slice(0, 4);
  return { category, articles, featured: articles.slice(0, 3), popular: [...articles].sort((a, b) => b.views - a.views).slice(0, 5), related };
}

export async function getPublicCategorySlugs() {
  if (!isSupabaseConfigured) return mockCategories.map((category) => category.slug);
  try {
    return (await loadCategories()).map((category) => category.slug);
  } catch {
    return [];
  }
}
