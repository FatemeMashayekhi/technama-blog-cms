import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import type { PublicArticle } from "@/lib/public-data";
import { ArticleCard } from "./article-card";

export function HeroSection({ featured, secondary }: { featured: PublicArticle; secondary: PublicArticle[] }) {
  return <section className="relative overflow-hidden border-b border-(--border) bg-(--public-paper)">
    <div aria-hidden="true" className="absolute -left-32 top-0 size-96 rounded-full bg-[#e8d7bd]/40 blur-3xl"/>
    <div className="relative mx-auto max-w-360 px-4 pb-10 pt-8 md:px-7 md:pb-16 md:pt-12">
      <div className="editorial-rule mb-7 flex items-end justify-between border-b border-(--border-strong) pb-5">
        <div><p className="editorial-kicker flex items-center gap-2"><Sparkles size={15}/> پرونده روز</p><h1 className="mt-2 text-[25px] font-black tracking-[-.045em] text-(--public-ink) sm:text-[32px]">آنچه امروز باید درباره فناوری بدانید</h1></div>
        <Link href="/articles" className="hidden min-h-11 items-center gap-1.5 text-[13px] font-black text-(--text-secondary) hover:text-(--editorial-coral) sm:flex">ورق‌زدن آرشیو <ArrowLeft size={14}/></Link>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,.82fr)]">
        <ArticleCard article={featured} variant="featured" priority featuredHeadingLevel="h2"/>
        <aside aria-label="منتخب‌های دیگر تحریریه" className="flex flex-col justify-between gap-5 rounded-[22px] border border-(--border) bg-white/72 p-5 shadow-[0_18px_55px_rgba(16,42,58,.06)] backdrop-blur sm:p-6">{secondary.map((article) => <ArticleCard key={article.id} article={article} variant="compact"/>)}</aside>
      </div>
    </div>
  </section>;
}
