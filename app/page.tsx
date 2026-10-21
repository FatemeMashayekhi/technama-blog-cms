import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthorsSection } from "@/components/public/authors-section";
import { CategoryNavigation } from "@/components/public/category-navigation";
import { EditorialSpotlight } from "@/components/public/editorial-spotlight";
import { HeroSection } from "@/components/public/hero-section";
import { LatestArticles } from "@/components/public/latest-articles";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PopularArticles } from "@/components/public/popular-articles";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { HomePageSkeleton } from "@/components/skeletons/home-page-skeleton";
import { TrendingTopics } from "@/components/public/trending-topics";
import { getPublicHomeData } from "@/lib/public-service";
import { getPublicTags } from "@/lib/public-tag-service";
import { getSiteUrl } from "@/lib/env";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "مجله فناوری؛ تحلیل برای ساختن آینده",
  description: "تازه‌ترین تحلیل‌ها و مقاله‌های تخصصی درباره هوش مصنوعی، برنامه‌نویسی، امنیت، طراحی محصول و اکوسیستم استارتاپی را در تک‌نما بخوانید.",
  alternates: { canonical: getSiteUrl("/") },
  openGraph: { title: "تک‌نما؛ مجله فناوری و نوآوری", description: "تحلیل عمیق فناوری؛ فراتر از تیترهای روز", url: getSiteUrl("/"), siteName: "تک‌نما", locale: "fa_IR", type: "website", images: [{ url: "/media/ai-future.svg", width: 1200, height: 630, alt: "مجله فناوری تک‌نما" }] },
  twitter: { card: "summary_large_image", title: "تک‌نما؛ مجله فناوری و نوآوری", description: "تحلیل عمیق فناوری؛ فراتر از تیترهای روز", images: ["/media/ai-future.svg"] },
};

async function HomeContent() {
  const [data, tags] = await Promise.all([getPublicHomeData(), getPublicTags()]);
  if (!data) {
    return <main id="main-content" tabIndex={-1}><section className="mx-auto max-w-3xl px-4 py-24 text-center md:px-7 md:py-32"><p className="editorial-kicker">آرشیو تک‌نما</p><h1 className="mt-4 text-3xl font-black text-(--public-ink) sm:text-4xl">هنوز مقاله‌ای منتشر نشده است</h1><p className="mx-auto mt-4 max-w-xl text-[15px] leading-8 text-(--text-secondary)">پس از انتشار نخستین مطلب در اتاق خبر، محتوای مجله در همین صفحه نمایش داده می‌شود.</p></section><NewsletterSection/></main>;
  }
  const spotlight = data.latest[2] ?? data.featured;
  return <main id="main-content" tabIndex={-1}><HeroSection featured={data.featured} secondary={data.secondary}/><TrendingTopics tags={tags}/><LatestArticles articles={data.latest}/><EditorialSpotlight article={spotlight}/><CategoryNavigation categories={data.categories}/><PopularArticles articles={data.popular}/><AuthorsSection authors={data.authors}/><NewsletterSection/></main>;
}

export default function HomePage() {
  return <div className="public-site min-h-screen"><PublicHeader/><Suspense fallback={<HomePageSkeleton/>}><HomeContent/></Suspense><PublicFooter/></div>;
}
