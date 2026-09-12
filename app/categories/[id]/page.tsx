import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryArticlesExplorer } from "@/components/public/category/category-articles-explorer";
import { CategoryHeader } from "@/components/public/category/category-header";
import { CategoryPageSkeleton } from "@/components/public/category/category-page-states";
import { CategorySidebar } from "@/components/public/category/category-sidebar";
import { FeaturedCategoryArticles } from "@/components/public/category/featured-category-articles";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { getCategoryBySlug, getPublicCategoryData, getPublicCategorySlugs } from "@/lib/public-category-service";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getPublicCategorySlugs().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryBySlug(id);
  if (!category) return { title: "دسته‌بندی پیدا نشد", robots: { index: false, follow: false } };
  const url = `https://technama.ir/categories/${category.slug}`;
  const image = `https://technama.ir${category.coverImage || "/media/design-system.svg"}`;

  return {
    title: `${category.seo.title}`,
    description: category.seo.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { type: "website", locale: "fa_IR", url, siteName: "تک‌نما", title: category.seo.title, description: category.seo.description, images: [{ url: image, width: 1200, height: 630, alt: category.name }] },
    twitter: { card: "summary_large_image", title: category.seo.title, description: category.seo.description, images: [image] },
  };
}

async function CategoryContent({ slug }: { slug: string }) {
  const data = await getPublicCategoryData(slug);
  if (!data) notFound();
  const url = `https://technama.ir/categories/${data.category.slug}`;
  const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: data.category.seo.title,
      description: data.category.seo.description,
      url,
      inLanguage: "fa-IR",
      isPartOf: { "@type": "WebSite", name: "تک‌نما", url: "https://technama.ir" },
      mainEntity: { "@type": "ItemList", numberOfItems: data.articles.length, itemListElement: data.articles.map((article, index) => ({ "@type": "ListItem", position: index + 1, url: `https://technama.ir/articles/${article.slug}`, name: article.title })) },
  };

  return <><main id="main-content" tabIndex={-1}><CategoryHeader category={data.category} publishedCount={data.articles.length}/><FeaturedCategoryArticles articles={data.featured}/><div className="mx-auto grid max-w-360 gap-6 px-4 py-10 md:px-7 md:py-14 xl:grid-cols-[minmax(0,1fr)_300px]"><CategoryArticlesExplorer articles={data.articles}/><CategorySidebar popular={data.popular} related={data.related}/></div><NewsletterSection/></main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}/></>;
}

export default async function PublicCategoryPage({ params }: Props) {
  const { id } = await params;
  return <div className="public-site min-h-screen"><PublicHeader/><Suspense fallback={<CategoryPageSkeleton/>}><CategoryContent slug={id}/></Suspense><PublicFooter/></div>;
}
