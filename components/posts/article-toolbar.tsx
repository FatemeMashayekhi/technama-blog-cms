import { Search, SlidersHorizontal, X } from "lucide-react";
import { technologyCategories } from "@/lib/posts-data";
import type { ArticleStatus } from "@/lib/dashboard-data";

export type StatusFilter = "all" | ArticleStatus;
export type SortOption = "newest" | "oldest" | "views" | "updated";

type ArticleToolbarProps = {
  query: string;
  status: StatusFilter;
  category: string;
  sort: SortOption;
  resultCount: number;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onReset: () => void;
};

const selectClass =
  "h-10 min-w-0 rounded-(--radius-sm) border border-(--border) bg-white px-3 text-[14px] font-bold text-(--text-secondary) outline-none transition-colors hover:border-(--border-strong) focus:border-(--focus-border)";

export function ArticleToolbar({
  query,
  status,
  category,
  sort,
  resultCount,
  onQueryChange,
  onStatusChange,
  onCategoryChange,
  onSortChange,
  onReset,
}: ArticleToolbarProps) {
  const hasFilters = query || status !== "all" || category !== "all";

  return (
    <section className="rounded-(--radius) border border-(--border) bg-white p-3 sm:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="flex h-10 flex-1 items-center gap-2 rounded-(--radius-sm) border border-(--border) bg-(--surface-subtle) px-3 text-(--muted) transition-colors focus-within:border-(--border-strong) focus-within:bg-white">
          <Search size={17} />
          <span className="sr-only">جست‌وجوی مقاله</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-full w-full bg-transparent text-xs text-(--text-strong) outline-none placeholder:text-(--text-faint)"
            placeholder="جست‌وجوی مقاله..."
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="پاک‌کردن جست‌وجو"
              className="grid size-7 shrink-0 place-items-center rounded-md hover:bg-(--surface-muted)"
            >
              <X size={14} />
            </button>
          )}
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:flex">
          <label className="sr-only" htmlFor="status-filter">فیلتر وضعیت</label>
          <select id="status-filter" value={status} onChange={(event) => onStatusChange(event.target.value as StatusFilter)} className={selectClass}>
            <option value="all">همه وضعیت‌ها</option>
            <option value="published">منتشر شده</option>
            <option value="draft">پیش‌نویس</option>
            <option value="review">در انتظار بررسی</option>
          </select>
          <label className="sr-only" htmlFor="category-filter">فیلتر دسته‌بندی</label>
          <select id="category-filter" value={category} onChange={(event) => onCategoryChange(event.target.value)} className={selectClass}>
            <option value="all">همه دسته‌بندی‌ها</option>
            {technologyCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="sr-only" htmlFor="sort-filter">مرتب‌سازی</label>
          <select id="sort-filter" value={sort} onChange={(event) => onSortChange(event.target.value as SortOption)} className={selectClass}>
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="views">بیشترین بازدید</option>
            <option value="updated">آخرین ویرایش</option>
          </select>
        </div>
      </div>
      <div className="mt-3 flex min-h-7 items-center justify-between gap-3 border-t border-(--border-subtle) pt-3 text-[13px] text-(--text-muted)">
        <span className="flex items-center gap-1.5"><SlidersHorizontal size={13} /> {new Intl.NumberFormat("fa-IR").format(resultCount)} نتیجه</span>
        {hasFilters && <button type="button" onClick={onReset} className="font-bold text-(--accent) hover:text-(--brand-teal)">پاک‌کردن فیلترها</button>}
      </div>
    </section>
  );
}

