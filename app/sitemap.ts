import type { MetadataRoute } from "next";
import { getPublicAuthorUsernames } from "@/lib/public-author-service";
import { getPublishedArticleSlugs } from "@/lib/public-article-service";
import { getPublicTagSlugs } from "@/lib/public-tag-service";
import { publicCategories } from "@/lib/public-data";

const siteUrl = "https://technama.ir";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/articles`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/categories`, changeFrequency: "weekly", priority: 0.75 },
    { url: `${siteUrl}/authors`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${siteUrl}/tags`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.3 },
  ];
  const articles: MetadataRoute.Sitemap = getPublishedArticleSlugs().map((slug) => ({ url: `${siteUrl}/articles/${slug}`, changeFrequency: "weekly", priority: 0.8 }));
  const categories: MetadataRoute.Sitemap = publicCategories.map((category) => ({ url: `${siteUrl}/categories/${category.slug}`, changeFrequency: "weekly", priority: 0.7 }));
  const authors: MetadataRoute.Sitemap = getPublicAuthorUsernames().map((username) => ({ url: `${siteUrl}/authors/${username}`, changeFrequency: "monthly", priority: 0.6 }));
  const tags: MetadataRoute.Sitemap = getPublicTagSlugs().map((slug) => ({ url: `${siteUrl}/tags/${slug}`, changeFrequency: "weekly", priority: 0.55 }));
  return [...staticPages, ...articles, ...categories, ...authors, ...tags];
}
