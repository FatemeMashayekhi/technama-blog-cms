import type { Metadata } from "next";
import { AuthorsSection } from "@/components/public/authors-section";
import { CategoryNavigation } from "@/components/public/category-navigation";
import { EditorialSpotlight } from "@/components/public/editorial-spotlight";
import { HeroSection } from "@/components/public/hero-section";
import { LatestArticles } from "@/components/public/latest-articles";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PopularArticles } from "@/components/public/popular-articles";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { TrendingTopics } from "@/components/public/trending-topics";
import { getPublicHomeData } from "@/lib/public-service";
import { mockTags } from "@/lib/taxonomy-data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "مجله فناوری؛ تحلیل برای ساختن آینده",
  description: "تازه‌ترین تحلیل‌ها و مقاله‌های تخصصی درباره هوش مصنوعی، برنامه‌نویسی، امنیت، طراحی محصول و اکوسیستم استارتاپی را در تک‌نما بخوانید.",
  alternates: { canonical: "https://technama.ir" },
  openGraph: { title: "تک‌نما؛ مجله فناوری و نوآوری", description: "تحلیل عمیق فناوری؛ فراتر از تیترهای روز", url: "https://technama.ir", siteName: "تک‌نما", locale: "fa_IR", type: "website", images: [{ url: "/media/ai-future.svg", width: 1200, height: 630, alt: "مجله فناوری تک‌نما" }] },
  twitter: { card: "summary_large_image", title: "تک‌نما؛ مجله فناوری و نوآوری", description: "تحلیل عمیق فناوری؛ فراتر از تیترهای روز", images: ["/media/ai-future.svg"] },
};

export default async function HomePage() {
  const data = await getPublicHomeData();
  const spotlight = data.latest[2] ?? data.featured;
  return <div className="public-site min-h-screen"><PublicHeader/><main id="main-content" tabIndex={-1}><HeroSection featured={data.featured} secondary={data.secondary}/><TrendingTopics tags={mockTags}/><LatestArticles articles={data.latest}/><EditorialSpotlight article={spotlight}/><CategoryNavigation categories={data.categories}/><PopularArticles articles={data.popular}/><AuthorsSection authors={data.authors}/><NewsletterSection/></main><PublicFooter/></div>;
}
