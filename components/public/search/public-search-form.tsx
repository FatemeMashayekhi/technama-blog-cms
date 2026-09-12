"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function PublicSearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  };

  const clear = () => {
    setQuery("");
    router.push("/search");
  };

  return <form role="search" onSubmit={submit} className="mx-auto mt-7 flex w-full max-w-3xl flex-col gap-2 sm:flex-row"><div className="relative min-w-0 flex-1"><label htmlFor="magazine-search" className="sr-only">جست‌وجو در مجله تک‌نما</label><Search size={19} aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-muted)"/><input id="magazine-search" name="q" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" maxLength={120} placeholder="دنبال چه چیزی می‌گردید؟" className="h-14 w-full rounded-(--radius) border border-(--border-strong) bg-white pr-12 pl-12 text-[12px] text-(--text-strong) shadow-[0_8px_25px_rgba(24,54,67,.06)] outline-none placeholder:text-(--text-faint) focus:border-(--brand-teal) focus:ring-3 focus:ring-(--border-strong)"/>{query && <button type="button" onClick={clear} aria-label="پاک کردن عبارت جست‌وجو" className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-(--radius-sm) text-(--text-muted) hover:bg-(--surface-muted) hover:text-(--text-strong)"><X size={16}/></button>}</div><button type="submit" className="h-14 rounded-(--radius) bg-(--brand-navy) px-7 text-[13px] font-black text-white hover:bg-(--brand-navy) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--border-strong)">جست‌وجو</button></form>;
}
