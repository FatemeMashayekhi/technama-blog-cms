import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { getPublicAuthorUsernames } from "@/lib/public-author-service";
import { getPublishedArticleSlugs } from "@/lib/public-article-service";
import { getPublicCategorySlugs } from "@/lib/public-category-service";
import { getPublicTagSlugs } from "@/lib/public-tag-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: getSiteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: getSiteUrl("/articles"), changeFrequency: "daily", priority: 0.9 },
    { url: getSiteUrl("/categories"), changeFrequency: "weekly", priority: 0.75 },
    { url: getSiteUrl("/authors"), changeFrequency: "monthly", priority: 0.65 },
    { url: getSiteUrl("/tags"), changeFrequency: "weekly", priority: 0.6 },
    { url: getSiteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: getSiteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
  ];
  const [articleSlugs, categorySlugs, authorUsernames, tagSlugs] = await Promise.all([
    getPublishedArticleSlugs(),
    getPublicCategorySlugs(),
    getPublicAuthorUsernames(),
    getPublicTagSlugs(),
  ]);
  const articles: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({ url: getSiteUrl(`/articles/${slug}`), changeFrequency: "weekly", priority: 0.8 }));
  const categories: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({ url: getSiteUrl(`/categories/${slug}`), changeFrequency: "weekly", priority: 0.7 }));
  const authors: MetadataRoute.Sitemap = authorUsernames.map((username) => ({ url: getSiteUrl(`/authors/${username}`), changeFrequency: "monthly", priority: 0.6 }));
  const tags: MetadataRoute.Sitemap = tagSlugs.map((slug) => ({ url: getSiteUrl(`/tags/${slug}`), changeFrequency: "weekly", priority: 0.55 }));
  return [...staticPages, ...articles, ...categories, ...authors, ...tags];
}
