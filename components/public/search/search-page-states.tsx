import { SearchX } from "lucide-react";
import Link from "next/link";
import type { PublicCategory } from "@/lib/public-data";

export function InitialSearchState({ categories }: { categories: PublicCategory[] }) {
  return <section className="mx-auto max-w-4xl px-4 py-12 text-center md:px-7 md:py-16"><h2 className="text-lg font-black text-(--text-strong)">جست‌وجوی محتوای مجله</h2><p className="mx-auto mt-2 max-w-xl text-[13px] leading-6 text-(--text-muted)">موضوع، مقاله یا نویسنده‌ای که به دنبالش هستید را جست‌وجو کنید.</p><div className="mt-7 flex flex-wrap justify-center gap-2" aria-label="دسته‌بندی‌های پیشنهادی">{categories.slice(0, 6).map((category) => <Link key={category.id} href={`/categories/${category.slug}`} className="rounded-full border border-(--border-strong) bg-white px-4 py-2 text-[12px] font-bold text-(--text-secondary) hover:border-(--border-strong) hover:text-(--brand-teal)">{category.name}</Link>)}</div></section>;
}

export function NoSearchResults({ query, categories }: { query: string; categories: PublicCategory[] }) {
  return <section className="rounded-(--radius-lg) border border-(--border-strong) bg-white px-5 py-14 text-center"><SearchX className="mx-auto text-(--text-muted)" size={36}/><h2 className="mt-4 text-lg font-black text-(--text-strong)">نتیجه‌ای پیدا نشد</h2><p className="mt-2 text-[13px] leading-6 text-(--text-muted)">برای «{query}» نتیجه‌ای پیدا نکردیم. عبارت کوتاه‌تر یا دیگری را امتحان کنید.</p><div className="mt-6 flex flex-wrap justify-center gap-2">{categories.slice(0, 4).map((category) => <Link key={category.id} href={`/categories/${category.slug}`} className="rounded-full border border-(--border-strong) px-3 py-2 text-[12px] font-bold text-(--text-secondary) hover:border-(--border-strong) hover:text-(--brand-teal)">{category.name}</Link>)}</div></section>;
}

export function SearchPageSkeleton() {
  return <main aria-busy="true" aria-label="در حال جست‌وجو" className="mx-auto min-h-[70vh] max-w-360 animate-pulse px-4 py-10 md:px-7"><div className="mx-auto h-10 max-w-52 rounded bg-(--surface-muted)"/><div className="mx-auto mt-7 h-14 max-w-3xl rounded-xl bg-(--surface-muted)"/><div className="mt-14 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]"><div className="space-y-6">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-44 rounded-2xl bg-(--surface-muted)"/>)}</div><div className="h-72 rounded-2xl bg-(--surface-muted)"/></div></main>;
}
