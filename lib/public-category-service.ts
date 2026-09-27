import { publicArticles, type PublicArticle, type PublicCategory } from "@/lib/public-data";
import { mockCategories } from "@/lib/taxonomy-data";
import type { Category } from "@/lib/taxonomy-data";

export type PublicCategoryDetail = PublicCategory & Pick<Category, "icon" | "views" | "seo" | "coverImage">;
export type PublicCategoryData = { category: PublicCategoryDetail; articles: PublicArticle[]; featured: PublicArticle[]; popular: PublicArticle[]; related: PublicCategory[] };

export async function getCategoryBySlug(slug: string): Promise<PublicCategoryDetail | null> { const item = mockCategories.find((category) => category.slug === slug); if (!item) return null; const { id, name, description, color, icon, views, seo, coverImage } = item; const articleCount = publicArticles.filter((article) => article.status === "published" && article.category.id === id).length; return { id, name, slug, description, articleCount, color, icon, views, seo, coverImage }; }
export async function getArticlesByCategory(categoryId: string): Promise<PublicArticle[]> { return publicArticles.filter((article) => article.status === "published" && article.category.id === categoryId).sort((a, b) => Date.parse(b.publishedAt || b.createdAt) - Date.parse(a.publishedAt || a.createdAt)); }
export async function getPopularArticlesByCategory(categoryId: string): Promise<PublicArticle[]> { return (await getArticlesByCategory(categoryId)).sort((a, b) => b.views - a.views).slice(0, 5); }
export async function getPublicCategoryData(slug: string): Promise<PublicCategoryData | null> { const category = await getCategoryBySlug(slug); if (!category) return null; const articles = await getArticlesByCategory(category.id); const related = mockCategories.filter((item) => !item.parentId && item.id !== category.id).sort((a, b) => b.views - a.views).slice(0, 4).map(({ id, name, slug: itemSlug, description, articleCount, color }) => ({ id, name, slug: itemSlug, description, articleCount, color })); return { category, articles, featured: articles.slice(0, 3), popular: await getPopularArticlesByCategory(category.id), related }; }
export function getPublicCategorySlugs() { return mockCategories.map((category) => category.slug); }
