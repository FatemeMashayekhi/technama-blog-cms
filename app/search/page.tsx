import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicSearchForm } from "@/components/public/search/public-search-form";
import { InitialSearchState, NoSearchResults, SearchContentSkeleton } from "@/components/public/search/search-page-states";
import { SearchResults } from "@/components/public/search/search-results";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { publicCategories } from "@/lib/public-data";
import { searchPublicContent, sortSearchArticles, type PublicSearchSort } from "@/lib/public-search-service";

export const metadata: Metadata = {
  title: "جست‌وجو",
  description: "در میان مقاله‌ها، نویسندگان و موضوعات مجله فناوری تک‌نما جست‌وجو کنید.",
  alternates: { canonical: "https://technama.ir/search" },
  robots: { index: false, follow: true },
  openGraph: { type: "website", locale: "fa_IR", url: "https://technama.ir/search", siteName: "تک‌نما", title: "جست‌وجو در مجله تک‌نما", description: "مقاله، موضوع یا نویسنده موردنظرتان را در تک‌نما پیدا کنید." },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const firstValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawQuery = firstValue(params.q);
  const rawSort = firstValue(params.sort);
  const sort: PublicSearchSort = rawSort === "newest" || rawSort === "views" ? rawSort : "relevance";
  const requestedPage = Number.parseInt(firstValue(params.page), 10);
  return <div className="public-site min-h-screen"><PublicHeader/><main id="main-content" tabIndex={-1}><section className="border-b border-(--border-strong) bg-white"><div className="mx-auto max-w-360 px-4 py-10 text-center md:px-7 md:py-14"><p className="text-[12px] font-bold tracking-[.12em] text-(--brand-teal)">کشف محتوای تک‌نما</p><h1 className="mt-2 text-3xl font-black tracking-[-.04em] text-(--text-strong) sm:text-4xl">جست‌وجو</h1><p className="mt-3 text-[13px] leading-6 text-(--text-secondary)">مقاله، موضوع یا نویسنده موردنظرتان را پیدا کنید.</p><PublicSearchForm initialQuery={rawQuery}/></div></section><Suspense fallback={<SearchContentSkeleton hasQuery={Boolean(rawQuery.trim())}/>}><SearchContent rawQuery={rawQuery} sort={sort} requestedPage={requestedPage}/></Suspense></main><PublicFooter/></div>;
}

async function SearchContent({ rawQuery, sort, requestedPage }: { rawQuery: string; sort: PublicSearchSort; requestedPage: number }) {
  const result = await searchPublicContent(rawQuery);
  const sortedArticles = sortSearchArticles(result.articles, sort);
  const pageCount = Math.max(1, Math.ceil(sortedArticles.length / 6));
  const page = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), pageCount) : 1;
  const visibleArticles = sortedArticles.slice((page - 1) * 6, page * 6);
  const totalResults = sortedArticles.length + result.authors.length + result.categories.length;

  return <>{!result.query ? <InitialSearchState categories={publicCategories}/> : totalResults === 0 ? <div className="mx-auto max-w-4xl px-4 py-12 md:px-7 md:py-16"><NoSearchResults query={result.query} categories={publicCategories}/></div> : <><section className="mx-auto max-w-360 px-4 pt-9 md:px-7"><h2 className="text-lg font-black text-(--text-strong)">نتایج جست‌وجو برای «{result.query}»</h2><p className="mt-1 text-[12px] text-(--text-muted)">در مجموع {totalResults.toLocaleString("fa-IR")} نتیجه مرتبط پیدا شد</p></section><SearchResults query={result.query} articles={visibleArticles} authors={result.authors} categories={result.categories} sort={sort} page={page} totalArticles={sortedArticles.length}/></>}<NewsletterSection/></>;
}
