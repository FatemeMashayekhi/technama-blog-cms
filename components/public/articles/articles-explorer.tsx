"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/public/article-card";
import type { PublicArticle, PublicCategory } from "@/lib/public-data";

type SortMode = "newest" | "popular" | "quick";
const pageSize = 9;

export function ArticlesExplorer({ articles, categories }: { articles: PublicArticle[]; categories: PublicCategory[] }) {
  const router = useRouter(); const pathname = usePathname(); const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const category = searchParams.get("category") ?? "all";
  const rawSort = searchParams.get("sort");
  const sort: SortMode = rawSort === "popular" || rawSort === "quick" ? rawSort : "newest";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const updateUrl = (updates: Record<string, string | null>, replace = false) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => { if (!value || value === "all" || (key === "sort" && value === "newest") || (key === "page" && value === "1")) params.delete(key); else params.set(key, value); });
    const url = `${pathname}${params.size ? `?${params}` : ""}`;
    if (replace) router.replace(url, { scroll: false }); else router.push(url, { scroll: false });
  };

  const filtered = useMemo(() => {
    const phrase = query.trim().toLocaleLowerCase("fa-IR");
    return articles.filter((article) => category === "all" || article.category.id === category).filter((article) => !phrase || `${article.title} ${article.excerpt} ${article.author.name}`.toLocaleLowerCase("fa-IR").includes(phrase)).sort((first, second) => sort === "popular" ? second.views - first.views : sort === "quick" ? first.readingTime - second.readingTime : Date.parse(second.publishedAt || second.createdAt) - Date.parse(first.publishedAt || first.createdAt));
  }, [articles, category, query, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)); const currentPage = Math.min(page, pageCount); const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const submitSearch = (event: React.FormEvent) => { event.preventDefault(); updateUrl({ q: query.trim() || null, page: null }, true); };
  const clear = () => { setQuery(""); updateUrl({ q: null, category: null, sort: null, page: null }); };

  return <section className="mx-auto max-w-360 px-4 py-10 md:px-7 md:py-16" aria-labelledby="articles-list-title">
    <form onSubmit={submitSearch} className="rounded-[20px] border border-(--border) bg-white p-3 shadow-[0_12px_38px_rgba(16,42,58,.05)] sm:p-4"><div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px_200px]">
      <label className="flex h-12 items-center gap-2 rounded-(--radius-sm) border border-(--border-strong) bg-(--public-paper) px-3 focus-within:border-(--editorial-coral)"><Search size={17} className="text-(--text-muted)"/><span className="sr-only">جستجو میان مقالات</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="عنوان، خلاصه یا نویسنده..." className="h-full min-w-0 flex-1 bg-transparent text-[14px] outline-none"/>{query && <button type="button" onClick={() => { setQuery(""); updateUrl({ q: null, page: null }, true); }} aria-label="پاک‌کردن جستجو" className="grid size-11 place-items-center"><X size={16}/></button>}</label>
      <label><span className="sr-only">دسته‌بندی</span><select value={category} onChange={(event) => updateUrl({ category: event.target.value, page: null })} className="h-12 w-full rounded-(--radius-sm) border border-(--border-strong) bg-(--public-paper) px-3 text-[14px] font-bold outline-none focus:border-(--editorial-coral)"><option value="all">همه دسته‌بندی‌ها</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label className="flex h-12 items-center gap-2 rounded-(--radius-sm) border border-(--border-strong) bg-(--public-paper) px-3"><SlidersHorizontal size={16} className="text-(--text-muted)"/><span className="sr-only">مرتب‌سازی</span><select value={sort} onChange={(event) => updateUrl({ sort: event.target.value, page: null })} className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-bold outline-none"><option value="newest">جدیدترین</option><option value="popular">پربازدیدترین</option><option value="quick">کوتاه‌ترین مطالعه</option></select></label>
    </div></form>
    <div className="editorial-rule mt-10 flex items-end justify-between gap-4 border-b border-(--border-strong) pb-5"><div><p className="editorial-kicker">آرشیو تحریریه</p><h2 id="articles-list-title" className="mt-2 text-[28px] font-black text-(--public-ink)">همه مقالات</h2></div><p aria-live="polite" className="text-[13px] text-(--text-muted)">{filtered.length.toLocaleString("fa-IR")} نتیجه</p></div>
    {visible.length ? <div className="mt-9 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{visible.map((article) => <ArticleCard key={article.id} article={article}/>)}</div> : <div className="mt-8 rounded-[22px] border border-dashed border-(--border-strong) bg-white px-5 py-16 text-center"><h3 className="text-xl font-black text-(--public-ink)">مقاله‌ای پیدا نشد</h3><p className="mt-2 text-[15px] text-(--text-muted)">عبارت جستجو یا دسته‌بندی را تغییر دهید.</p><button type="button" onClick={clear} className="mt-5 min-h-11 rounded-full bg-(--public-ink) px-5 text-[13px] font-black text-white">پاک‌کردن فیلترها</button></div>}
    {pageCount > 1 && <nav aria-label="صفحه‌بندی مقالات" className="mt-12 flex flex-wrap justify-center gap-2">{Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <button key={item} type="button" onClick={() => updateUrl({ page: String(item) })} aria-current={item === currentPage ? "page" : undefined} className={`grid size-11 place-items-center rounded-full border text-[14px] font-black ${item === currentPage ? "border-(--public-ink) bg-(--public-ink) text-white" : "border-(--border-strong) bg-white text-(--text-secondary) hover:border-(--editorial-coral) hover:text-(--editorial-coral)"}`}>{item.toLocaleString("fa-IR")}</button>)}</nav>}
  </section>;
}
