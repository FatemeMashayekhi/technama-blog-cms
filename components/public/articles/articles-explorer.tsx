"use client";

import { Check, ChevronDown, FolderTree, Search, SlidersHorizontal, X, type LucideIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArticleCard } from "@/components/public/article-card";
import type { PublicArticle, PublicCategory } from "@/lib/public-data";

type SortMode = "newest" | "popular" | "quick";
type DropdownOption = { value: string; label: string };

const pageSize = 9;
const sortOptions: DropdownOption[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "popular", label: "پربازدیدترین" },
  { value: "quick", label: "کوتاه‌ترین مطالعه" },
];

function FilterDropdown({
  label,
  value,
  options,
  icon: Icon,
  onChange,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  icon: LucideIcon;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (!open) return;

    const handleOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    const frame = requestAnimationFrame(() => optionRefs.current[selectedIndex]?.focus());

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      cancelAnimationFrame(frame);
    };
  }, [open, selectedIndex]);

  const focusOption = (index: number) => {
    const nextIndex = (index + options.length) % options.length;
    optionRefs.current[nextIndex]?.focus();
  };

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-12 w-full items-center gap-2 rounded-(--radius-sm) border bg-(--public-paper) px-3 text-right transition duration-200 ${
          open
            ? "border-(--editorial-coral) bg-white shadow-[0_0_0_3px_rgba(210,78,50,.08)]"
            : "border-(--border-strong) hover:border-(--text-muted) hover:bg-white"
        }`}
      >
        <Icon size={16} className={`shrink-0 transition ${open ? "text-(--editorial-coral)" : "text-(--text-muted)"}`} />
        <span className="min-w-0 flex-1 truncate text-[14px] font-bold text-(--public-ink)">{selectedOption?.label}</span>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`shrink-0 text-(--text-faint) transition-transform duration-200 ${open ? "rotate-180 text-(--editorial-coral)" : ""}`}
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+8px)] z-40 max-h-80 overflow-y-auto rounded-[18px] border border-(--border) bg-white p-2 shadow-[0_22px_55px_rgba(16,42,58,.18)] [scrollbar-color:var(--border-strong)_transparent] [scrollbar-width:thin]"
        >
          <div className="mb-1 flex items-center justify-between gap-3 px-2.5 py-2">
            <span className="text-[11px] font-black tracking-[.04em] text-(--text-muted)">{label}</span>
            <span className="rounded-full bg-(--public-paper-deep) px-2 py-1 text-[11px] font-bold text-(--text-faint)">{options.length.toLocaleString("fa-IR")} گزینه</span>
          </div>
          {options.map((option, index) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                ref={(node) => { optionRefs.current[index] = node; }}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => selectOption(option.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectOption(option.value);
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    focusOption(index + 1);
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    focusOption(index - 1);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    focusOption(0);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    focusOption(options.length - 1);
                  } else if (event.key === "Escape") {
                    event.preventDefault();
                    setOpen(false);
                    triggerRef.current?.focus();
                  }
                }}
                className={`group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-right text-[13px] font-bold transition sm:text-[14px] ${
                  selected
                    ? "bg-[#f7ebe6] text-(--editorial-coral-dark)"
                    : "text-(--text-secondary) hover:bg-(--public-paper-deep) hover:text-(--public-ink) focus:bg-(--public-paper-deep) focus:text-(--public-ink)"
                }`}
              >
                <span className={`grid size-5 shrink-0 place-items-center rounded-full border transition ${selected ? "border-(--editorial-coral) bg-(--editorial-coral) text-white" : "border-(--border-strong) text-transparent group-hover:border-(--editorial-coral)/50"}`}>
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ArticlesExplorer({ articles, categories }: { articles: PublicArticle[]; categories: PublicCategory[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const category = searchParams.get("category") ?? "all";
  const rawSort = searchParams.get("sort");
  const sort: SortMode = rawSort === "popular" || rawSort === "quick" ? rawSort : "newest";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const categoryOptions = useMemo(
    () => [{ value: "all", label: "همه دسته‌بندی‌ها" }, ...categories.map((item) => ({ value: item.id, label: item.name }))],
    [categories],
  );

  const updateUrl = (updates: Record<string, string | null>, replace = false) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "sort" && value === "newest") || (key === "page" && value === "1")) params.delete(key);
      else params.set(key, value);
    });
    const url = `${pathname}${params.size ? `?${params}` : ""}`;
    if (replace) router.replace(url, { scroll: false });
    else router.push(url, { scroll: false });
  };

  const filtered = useMemo(() => {
    const phrase = query.trim().toLocaleLowerCase("fa-IR");
    return articles
      .filter((article) => category === "all" || article.category.id === category)
      .filter((article) => !phrase || `${article.title} ${article.excerpt} ${article.author.name}`.toLocaleLowerCase("fa-IR").includes(phrase))
      .sort((first, second) => sort === "popular" ? second.views - first.views : sort === "quick" ? first.readingTime - second.readingTime : Date.parse(second.publishedAt || second.createdAt) - Date.parse(first.publishedAt || first.createdAt));
  }, [articles, category, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    updateUrl({ q: query.trim() || null, page: null }, true);
  };
  const clear = () => {
    setQuery("");
    updateUrl({ q: null, category: null, sort: null, page: null });
  };

  return (
    <section className="mx-auto max-w-360 px-4 py-10 md:px-7 md:py-16" aria-labelledby="articles-list-title">
      <form onSubmit={submitSearch} className="rounded-[20px] border border-(--border) bg-white p-3 shadow-[0_12px_38px_rgba(16,42,58,.05)] sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px_200px]">
          <label className="flex h-12 items-center gap-2 rounded-(--radius-sm) border border-(--border-strong) bg-(--public-paper) px-3 focus-within:border-(--editorial-coral)">
            <Search size={17} className="text-(--text-muted)" />
            <span className="sr-only">جستجو میان مقالات</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="عنوان، خلاصه یا نویسنده..." className="h-full min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
            {query && <button type="button" onClick={() => { setQuery(""); updateUrl({ q: null, page: null }, true); }} aria-label="پاک‌کردن جستجو" className="grid size-11 place-items-center"><X size={16} /></button>}
          </label>
          <FilterDropdown label="دسته‌بندی" value={category} options={categoryOptions} icon={FolderTree} onChange={(nextValue) => updateUrl({ category: nextValue, page: null })} />
          <FilterDropdown label="مرتب‌سازی" value={sort} options={sortOptions} icon={SlidersHorizontal} onChange={(nextValue) => updateUrl({ sort: nextValue, page: null })} />
        </div>
      </form>

      <div className="editorial-rule mt-10 flex items-end justify-between gap-4 border-b border-(--border-strong) pb-5">
        <div><p className="editorial-kicker">آرشیو تحریریه</p><h2 id="articles-list-title" className="mt-2 text-[28px] font-black text-(--public-ink)">همه مقالات</h2></div>
        <p aria-live="polite" className="text-[13px] text-(--text-muted)">{filtered.length.toLocaleString("fa-IR")} نتیجه</p>
      </div>

      {visible.length ? (
        <div className="mt-9 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{visible.map((article) => <ArticleCard key={article.id} article={article} />)}</div>
      ) : (
        <div className="mt-8 rounded-[22px] border border-dashed border-(--border-strong) bg-white px-5 py-16 text-center">
          <h3 className="text-xl font-black text-(--public-ink)">مقاله‌ای پیدا نشد</h3>
          <p className="mt-2 text-[15px] text-(--text-muted)">عبارت جستجو یا دسته‌بندی را تغییر دهید.</p>
          <button type="button" onClick={clear} className="mt-5 min-h-11 rounded-full bg-(--public-ink) px-5 text-[13px] font-black text-white">پاک‌کردن فیلترها</button>
        </div>
      )}

      {pageCount > 1 && (
        <nav aria-label="صفحه‌بندی مقالات" className="mt-12 flex flex-wrap justify-center gap-2">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
            <button key={item} type="button" onClick={() => updateUrl({ page: String(item) })} aria-current={item === currentPage ? "page" : undefined} className={`grid size-11 place-items-center rounded-full border text-[14px] font-black ${item === currentPage ? "border-(--public-ink) bg-(--public-ink) text-white" : "border-(--border-strong) bg-white text-(--text-secondary) hover:border-(--editorial-coral) hover:text-(--editorial-coral)"}`}>{item.toLocaleString("fa-IR")}</button>
          ))}
        </nav>
      )}
    </section>
  );
}
