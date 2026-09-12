import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AuthorArticlesExplorer } from "@/components/public/author/author-articles-explorer";
import { AuthorDiscovery } from "@/components/public/author/author-discovery";
import { AuthorFeaturedArticle } from "@/components/public/author/author-featured-article";
import { AuthorPageSkeleton } from "@/components/public/author/author-page-skeleton";
import { AuthorProfileHero } from "@/components/public/author/author-profile-hero";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { getAuthorByUsername, getPublicAuthorData, getPublicAuthorUsernames } from "@/lib/public-author-service";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getPublicAuthorUsernames().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthorByUsername(id);
  if (!author) return { title: "نویسنده پیدا نشد", robots: { index: false, follow: false } };
  const url = `https://technama.ir/authors/${author.username}`;
  const image = author.avatar ? `https://technama.ir${author.avatar}` : "https://technama.ir/media/design-system.svg";
  const title = `${author.name}؛ نویسنده مجله فناوری`;

  return {
    title,
    description: author.bio,
    alternates: { canonical: url },
    authors: [{ name: author.name, url }],
    robots: { index: true, follow: true },
    openGraph: { type: "profile", locale: "fa_IR", url, siteName: "تک‌نما", title, description: author.bio, images: [{ url: image, width: 1200, height: 630, alt: author.name }] },
    twitter: { card: "summary_large_image", title, description: author.bio, images: [image] },
  };
}

async function AuthorContent({ username }: { username: string }) {
  const data = await getPublicAuthorData(username);
  if (!data) notFound();
  const publishedCount = data.articles.length + (data.featured ? 1 : 0);
  const url = `https://technama.ir/authors/${data.author.username}`;
  const sameAs = Object.values(data.author.socialLinks).filter(Boolean).map((link) => link.startsWith("http") ? link : `https://github.com/${link}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${data.author.name}؛ نویسنده تک‌نما`,
    description: data.author.bio,
    url,
    inLanguage: "fa-IR",
    mainEntity: {
      "@type": "Person",
      name: data.author.name,
      alternateName: `@${data.author.username}`,
      description: data.author.bio,
      jobTitle: data.author.roleLabel,
      url,
      ...(data.author.avatar ? { image: `https://technama.ir${data.author.avatar}` } : {}),
      ...(sameAs.length ? { sameAs } : {}),
    },
  };

  return <><main id="main-content" tabIndex={-1}><AuthorProfileHero author={data.author} publishedCount={publishedCount} totalViews={data.totalArticleViews}/><AuthorFeaturedArticle article={data.featured}/><div className="mx-auto grid max-w-360 gap-6 px-4 py-10 md:px-7 md:py-14 xl:grid-cols-[minmax(0,1fr)_300px]"><AuthorArticlesExplorer authorName={data.author.name} articles={data.articles}/><AuthorDiscovery authors={data.relatedAuthors} popular={data.popular}/></div><NewsletterSection/></main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}/></>;
}

export default async function PublicAuthorPage({ params }: Props) {
  const { id } = await params;
  return <div className="public-site min-h-screen"><PublicHeader/><Suspense fallback={<AuthorPageSkeleton/>}><AuthorContent username={id}/></Suspense><PublicFooter/></div>;
}
