import { FileSearch } from "lucide-react";
import { ArticleCard } from "@/components/public/article-card";
import { SearchDiscovery } from "@/components/public/search/search-discovery";
import { SearchPagination, SearchSortControl } from "@/components/public/search/search-navigation";
import type { PublicAuthor, PublicCategory } from "@/lib/public-data";
import type { PublicSearchSort, ScoredArticle } from "@/lib/public-search-service";

export function SearchResults({ query, articles, authors, categories, sort, page, totalArticles }: { query: string; articles: ScoredArticle[]; authors: PublicAuthor[]; categories: PublicCategory[]; sort: PublicSearchSort; page: number; totalArticles: number }) {
  const pageCount = Math.max(1, Math.ceil(totalArticles / 6));
  const start = totalArticles ? (page - 1) * 6 + 1 : 0;
  const end = Math.min(page * 6, totalArticles);

  return <div className="mx-auto grid max-w-360 gap-6 px-4 py-10 md:px-7 md:py-14 xl:grid-cols-[minmax(0,1fr)_300px]"><section aria-labelledby="article-search-results" className="overflow-hidden rounded-(--radius-lg) border border-(--border-strong) bg-white"><div className="flex flex-col gap-4 border-b border-(--border-subtle) px-5 py-5 sm:flex-row sm:items-end sm:justify-between md:px-6"><div><p className="text-[12px] font-bold text-(--brand-teal)">نتایج اصلی</p><h2 id="article-search-results" className="mt-1 text-xl font-black text-(--text-strong)">مقالات مرتبط</h2><p className="mt-1 text-[12px] text-(--text-muted)">{totalArticles.toLocaleString("fa-IR")} مقاله پیدا شد</p></div>{totalArticles > 1 && <SearchSortControl query={query} sort={sort}/>}</div>
    {articles.length ? <div className="space-y-7 p-5 md:p-6">{articles.map(({ article }) => <ArticleCard key={article.id} article={article} variant="horizontal"/>)}</div> : <div className="grid min-h-72 place-items-center p-6 text-center"><div><FileSearch className="mx-auto text-(--text-muted)" size={32}/><h3 className="mt-4 text-sm font-black text-(--text-strong)">مقاله‌ای با این عبارت پیدا نشد</h3><p className="mt-2 text-[13px] leading-6 text-(--text-muted)">نتایج مرتبط نویسندگان و دسته‌بندی‌ها را بررسی کنید.</p></div></div>}
    <SearchPagination query={query} sort={sort} page={page} pageCount={pageCount} start={start} end={end} total={totalArticles}/>
  </section><SearchDiscovery authors={authors} categories={categories}/></div>;
}
