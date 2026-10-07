"use client";

import { ArrowLeft, FileText, FolderTree, Search, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { DashboardSearchItem, DashboardSearchKind } from "@/lib/dashboard-data";

const kindMeta: Record<DashboardSearchKind, { label: string; icon: typeof Search }> = {
  article: { label: "مقالات", icon: FileText },
  author: { label: "نویسندگان", icon: UserRound },
  category: { label: "دسته‌بندی‌ها", icon: FolderTree },
};

export function DashboardSearch({ items, placeholder, mobile = false }: { items: DashboardSearchItem[]; placeholder: string; mobile?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const normalizedQuery = query.trim().toLocaleLowerCase("fa-IR");
  const results = useMemo(() => normalizedQuery.length < 2 ? [] : items.filter((item) => `${item.title} ${item.description}`.toLocaleLowerCase("fa-IR").includes(normalizedQuery)).slice(0, 9), [items, normalizedQuery]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
      if (event.key === "Escape") setOpen(false);
    };
    const handleOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", handleShortcut);
    document.addEventListener("pointerdown", handleOutside);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, []);

  const goToResult = (item: DashboardSearchItem | undefined) => {
    if (!item) return;
    setOpen(false);
    setQuery("");
    router.push(item.href);
  };

  const searchField = (
    <form
      role="search"
      onSubmit={(event) => { event.preventDefault(); goToResult(results[activeIndex] ?? results[0]); }}
      className={`relative flex h-11 items-center gap-2 rounded-(--radius-sm) border bg-white px-2 transition ${open && query ? "border-(--brand-teal) shadow-[0_0_0_3px_rgba(19,120,111,.08)]" : "border-(--border-strong) hover:border-(--text-muted)"}`}
    >
      <Search size={17} className="shrink-0 text-(--text-muted)" />
      <input
        ref={inputRef}
        role="combobox"
        aria-label="جست‌وجو در داشبورد"
        aria-expanded={open && normalizedQuery.length >= 2}
        aria-controls={listboxId}
        aria-activedescendant={results[activeIndex] ? `${listboxId}-${results[activeIndex].id}` : undefined}
        autoComplete="off"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); setOpen(true); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && results.length) { event.preventDefault(); setActiveIndex((index) => (index + 1) % results.length); }
          if (event.key === "ArrowUp" && results.length) { event.preventDefault(); setActiveIndex((index) => (index - 1 + results.length) % results.length); }
          if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
        }}
        className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-(--text-strong) placeholder:text-(--text-faint)"
        placeholder={placeholder}
      />
      {query && <button type="button" onClick={() => { setQuery(""); setActiveIndex(0); inputRef.current?.focus(); }} aria-label="پاک‌کردن جست‌وجو" className="grid size-10 shrink-0 place-items-center rounded-lg text-(--text-muted) hover:bg-(--surface-muted) hover:text-(--text-strong)"><X size={15} /></button>}
      <button type="submit" disabled={!results.length} aria-label="باز کردن نتیجه انتخاب‌شده" className="grid size-10 shrink-0 place-items-center rounded-lg bg-(--brand-navy) text-white transition hover:bg-(--brand-navy-hover) disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft size={15} /></button>
    </form>
  );

  const resultsPanel = open && normalizedQuery.length >= 2 && (
    <div id={listboxId} role="listbox" aria-label="نتایج جست‌وجوی داشبورد" className="absolute inset-x-0 top-[calc(100%+8px)] z-60 max-h-[min(430px,70vh)] overflow-y-auto rounded-(--radius) border border-(--border) bg-white p-2 shadow-[0_20px_60px_rgba(16,35,49,.18)]">
      {results.length ? (
        <div className="space-y-1">
          {results.map((item, index) => {
            const Icon = kindMeta[item.kind].icon;
            return <button key={item.id} id={`${listboxId}-${item.id}`} type="button" role="option" aria-selected={activeIndex === index} onMouseEnter={() => setActiveIndex(index)} onClick={() => goToResult(item)} className={`flex min-h-14 w-full items-center gap-3 rounded-(--radius-sm) px-3 text-right transition ${activeIndex === index ? "bg-(--accent-soft)" : "hover:bg-(--surface-subtle)"}`}><span className={`grid size-10 shrink-0 place-items-center rounded-(--radius-sm) ${activeIndex === index ? "bg-white text-(--brand-teal)" : "bg-(--surface-muted) text-(--text-muted)"}`}><Icon size={16} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-[13px] text-(--text-strong)">{item.title}</strong><span className="mt-1 block truncate text-[11px] text-(--text-muted)">{kindMeta[item.kind].label} · {item.description}</span></span><ArrowLeft size={14} className="shrink-0 text-(--text-faint)" /></button>;
          })}
        </div>
      ) : <div className="px-4 py-8 text-center"><Search size={20} className="mx-auto text-(--text-faint)" /><p className="mt-3 text-[13px] font-bold text-(--text-secondary)">نتیجه‌ای پیدا نشد</p><p className="mt-1 text-[11px] text-(--text-muted)">عنوان مقاله، نویسنده یا دسته‌بندی دیگری را امتحان کنید.</p></div>}
    </div>
  );

  if (mobile) {
    return <div ref={rootRef} className="md:hidden">{!open && <button type="button" onClick={() => { setOpen(true); requestAnimationFrame(() => inputRef.current?.focus()); }} aria-label="باز کردن جست‌وجوی داشبورد" className="grid size-10 place-items-center rounded-(--radius-sm) border border-(--border) text-(--text-secondary) hover:bg-(--surface-subtle)"><Search size={18} /></button>}{open && <><button type="button" aria-label="بستن جست‌وجو" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-(--brand-navy)/25 backdrop-blur-[1px]" /><div className="fixed inset-x-3 top-3 z-50">{searchField}{resultsPanel}</div></>}</div>;
  }

  return <div ref={rootRef} className="relative hidden w-full max-w-92 md:block">{searchField}{resultsPanel}{!query && <span className="pointer-events-none absolute left-13 top-1/2 hidden -translate-y-1/2 rounded border border-(--border-strong) bg-(--surface-subtle) px-1.5 py-0.5 text-[11px] text-(--text-muted) xl:block">Ctrl K</span>}</div>;
}
