"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import type { PublicSearchSort } from "@/lib/public-search-service";

const buildUrl = (query: string, sort: PublicSearchSort, page: number) => {
  const params = new URLSearchParams({ q: query });
  if (sort !== "relevance") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  return `/search?${params.toString()}`;
};

export function SearchSortControl({ query, sort }: { query: string; sort: PublicSearchSort }) {
  const router = useRouter();
  return <label className="flex items-center gap-2 text-[12px] font-bold text-(--text-secondary)">مرتب‌سازی<select value={sort} onChange={(event) => router.push(buildUrl(query, event.target.value as PublicSearchSort, 1))} className="h-10 rounded-(--radius-sm) border border-(--border-strong) bg-(--surface-subtle) px-3 text-[12px] font-bold text-(--text-strong) outline-none focus:border-(--brand-teal)"><option value="relevance">مرتبط‌ترین</option><option value="newest">جدیدترین</option><option value="views">پربازدیدترین</option></select></label>;
}

export function SearchPagination({ query, sort, page, pageCount, start, end, total }: { query: string; sort: PublicSearchSort; page: number; pageCount: number; start: number; end: number; total: number }) {
  const router = useRouter();
  return <Pagination page={page} pageCount={pageCount} start={start} end={end} total={total} onPageChange={(nextPage) => router.push(buildUrl(query, sort, nextPage))} ariaLabel="صفحه‌بندی نتایج جست‌وجو" itemLabel="مقاله"/>;
}
