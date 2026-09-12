import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/public/article-card";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { getPublicTag, getPublicTagSlugs } from "@/lib/public-tag-service";

type Props = { params: Promise<{ id: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getPublicTagSlugs().map((id) => ({ id })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; const tag = getPublicTag(id);
  if (!tag) return { title: "برچسب پیدا نشد", robots: { index: false, follow: false } };
  return { title: `برچسب ${tag.name}`, description: `مقاله‌های مرتبط با ${tag.name} در مجله تک‌نما.`, alternates: { canonical: `/tags/${tag.slug}` } };
}

export default async function TagPage({ params }: Props) {
  const { id } = await params; const tag = getPublicTag(id); if (!tag) notFound();
  return <div className="public-site min-h-screen"><PublicHeader/><main id="main-content" tabIndex={-1}><header className="border-b border-(--border) bg-white"><div className="mx-auto max-w-360 px-4 py-14 md:px-7 md:py-18"><p className="editorial-kicker">نمایه موضوعی</p><h1 className="mt-3 text-[36px] font-black tracking-[-.05em] sm:text-[48px]">#{tag.name}</h1><p className="mt-4 text-[16px] text-(--text-secondary)">{tag.articles.length.toLocaleString("fa-IR")} مقاله در این برچسب</p></div></header><section className="mx-auto max-w-360 px-4 py-12 md:px-7 md:py-16">{tag.articles.length ? <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{tag.articles.map((article) => <ArticleCard key={article.id} article={article}/>)}</div> : <div className="rounded-[22px] border border-dashed border-(--border-strong) bg-white p-12 text-center"><h2 className="text-xl font-black">هنوز مقاله‌ای با این برچسب منتشر نشده است</h2><p className="mt-2 text-[15px] text-(--text-muted)">به‌زودی محتوای تازه‌ای در این موضوع منتشر می‌کنیم.</p></div>}</section><NewsletterSection/></main><PublicFooter/></div>;
}
