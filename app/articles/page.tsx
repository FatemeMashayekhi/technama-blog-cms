import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticlesExplorer } from "@/components/public/articles/articles-explorer";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { publicCategories, publishedPublicArticles } from "@/lib/public-data";

export const metadata: Metadata = { title: "همه مقالات", description: "آرشیو مقاله‌های تخصصی تک‌نما درباره فناوری، محصول و نوآوری.", alternates: { canonical: "/articles" } };

export default function ArticlesPage() {
  return <div className="public-site min-h-screen"><PublicHeader/><main id="main-content" tabIndex={-1}><section className="border-b border-(--border) bg-white"><div className="mx-auto max-w-360 px-4 py-14 md:px-7 md:py-20"><p className="editorial-kicker">دانش برای ساختن آینده</p><h1 className="mt-3 text-[38px] font-black tracking-[-.05em] text-(--public-ink) sm:text-[52px]">آرشیو تک‌نما</h1><p className="mt-5 max-w-2xl text-[17px] leading-8 text-(--text-secondary)">تحلیل‌های عمیق، راهنماهای کاربردی و روایت‌های مستقل از دنیای فناوری و محصول.</p></div></section><Suspense fallback={<div className="mx-auto min-h-96 max-w-360 animate-pulse px-4 py-16 text-(--text-muted) md:px-7">در حال آماده‌سازی آرشیو…</div>}><ArticlesExplorer articles={publishedPublicArticles} categories={publicCategories}/></Suspense><NewsletterSection/></main><PublicFooter/></div>;
}
