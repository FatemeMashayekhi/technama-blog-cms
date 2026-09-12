"use client";

import { BookOpenText } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/public/article-card";
import { Pagination } from "@/components/ui/pagination";
import type { PublicArticle } from "@/lib/public-data";

type SortMode = "latest" | "views" | "popular";
const PAGE_SIZE = 4;

export function AuthorArticlesExplorer({ authorName, articles }: { authorName: string; articles: PublicArticle[] }) {
  const [sort, setSort] = useState<SortMode>("latest");
  const [page, setPage] = useState(1);
  const sortedArticles = useMemo(() => [...articles].sort((first, second) => {
    if (sort === "views") return second.views - first.views;
    if (sort === "popular") return (second.views + second.readingTime * 200) - (first.views + first.readingTime * 200);
    return Date.parse(second.publishedAt || second.createdAt) - Date.parse(first.publishedAt || first.createdAt);
  }), [articles, sort]);
  const pageCount = Math.max(1, Math.ceil(sortedArticles.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const visibleArticles = sortedArticles.slice(startIndex, startIndex + PAGE_SIZE);

  return <section aria-labelledby="author-articles-title" className="overflow-hidden rounded-(--radius-lg) border border-(--border-strong) bg-white"><div className="flex flex-col gap-4 border-b border-(--border-subtle) px-5 py-5 sm:flex-row sm:items-end sm:justify-between md:px-6"><div><p className="text-[12px] font-bold text-(--brand-teal)">آرشیو نویسنده</p><h2 id="author-articles-title" className="mt-1 text-xl font-black text-(--text-strong)">مقالات {authorName}</h2></div><label className="flex items-center gap-2 text-[12px] font-bold text-(--text-secondary)">مرتب‌سازی<select value={sort} onChange={(event) => { setSort(event.target.value as SortMode); setPage(1); }} className="h-10 rounded-(--radius-sm) border border-(--border-strong) bg-(--surface-subtle) px-3 text-[12px] font-bold text-(--text-strong) outline-none focus:border-(--brand-teal)"><option value="latest">جدیدترین</option><option value="views">پربازدیدترین</option><option value="popular">محبوب‌ترین</option></select></label></div>
    {visibleArticles.length ? <div className="grid gap-x-5 gap-y-9 p-5 sm:grid-cols-2 md:p-6">{visibleArticles.map((article) => <ArticleCard key={article.id} article={article}/>)}</div> : <div className="grid min-h-80 place-items-center px-5 py-12 text-center"><div><BookOpenText className="mx-auto text-(--text-muted)" size={34}/><h3 className="mt-4 text-sm font-black text-(--text-strong)">هنوز مقاله‌ای منتشر نشده است</h3><p className="mt-2 max-w-sm text-[13px] leading-6 text-(--text-muted)">این نویسنده هنوز مقاله‌ای برای انتشار در مجله ندارد.</p><Link href="/" className="mt-5 inline-flex rounded-(--radius-sm) bg-(--brand-navy) px-4 py-2.5 text-[12px] font-bold text-white">مطالعه تازه‌ترین مطالب</Link></div></div>}
    <Pagination page={safePage} pageCount={pageCount} start={sortedArticles.length ? startIndex + 1 : 0} end={Math.min(startIndex + PAGE_SIZE, sortedArticles.length)} total={sortedArticles.length} onPageChange={(nextPage) => { setPage(nextPage); document.getElementById("author-articles-title")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}/>
  </section>;
}
