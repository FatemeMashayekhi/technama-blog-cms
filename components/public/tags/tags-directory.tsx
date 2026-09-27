"use client";

import { ArrowLeft, BookOpenText, Hash, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type TagDirectoryItem = {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
  latestArticle?: string;
};

const accents = [
  "from-[#dcece8] to-[#f8fbfa] text-[#176f66]",
  "from-[#e5eaf2] to-[#fafbfc] text-[#315f86]",
  "from-[#f0e5db] to-[#fdfaf7] text-[#8a5c3d]",
  "from-[#eee4ef] to-[#fcf9fc] text-[#745579]",
  "from-[#ecebdc] to-[#fbfbf6] text-[#657038]",
];

function normalize(value: string) {
  return value.trim().replace(/^#/, "").toLocaleLowerCase("fa-IR");
}

export function TagsDirectory({ tags }: { tags: TagDirectoryItem[] }) {
  const [query, setQuery] = useState("");
  const featured = tags.slice(0, 3);
  const needle = normalize(query);
  const visible = needle ? tags.filter((tag) => normalize(`${tag.name} ${tag.slug}`).includes(needle)) : tags;

  return (
    <>
      <section aria-labelledby="featured-tags-title" className="mx-auto max-w-360 px-4 pt-12 md:px-7 md:pt-16">
        <div className="editorial-rule border-b border-(--border-strong) pb-5">
          <p className="editorial-kicker">پیشنهاد تحریریه</p>
          <h2 id="featured-tags-title" className="mt-2 text-[27px] font-black tracking-[-.04em] text-(--public-ink) sm:text-[32px]">مسیرهای محبوب برای شروع</h2>
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {featured.map((tag, index) => (
            <article key={tag.id} className={`group relative isolate min-h-58 overflow-hidden rounded-[24px] border border-(--border) bg-linear-to-br p-6 shadow-[0_14px_38px_rgba(16,42,58,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(16,42,58,.1)] focus-within:ring-3 focus-within:ring-(--brand-teal)/16 ${accents[index % accents.length]}`}>
              <span aria-hidden="true" className="absolute -bottom-12 -left-5 font-mono text-[150px] font-black leading-none opacity-[.065]">#</span>
              <div className="relative flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-2xl bg-white/72 shadow-sm"><Hash size={20} /></span>
                <span className="rounded-full border border-current/15 bg-white/55 px-3 py-1 text-[12px] font-black">{tag.articleCount.toLocaleString("fa-IR")} مطلب</span>
              </div>
              <Link href={`/tags/${tag.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                <h3 className="relative mt-7 text-[25px] font-black tracking-[-.035em] text-(--public-ink)">#{tag.name}</h3>
              </Link>
              <p className="relative mt-2 line-clamp-1 text-[13px] text-(--text-secondary)">{tag.latestArticle ? `از «${tag.latestArticle}» شروع کنید` : "مقاله‌های این موضوع به‌زودی منتشر می‌شوند"}</p>
              <span aria-hidden="true" className="relative mt-5 inline-flex items-center gap-1.5 text-[12px] font-black">ورود به موضوع <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /></span>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="all-tags-title" className="mx-auto max-w-360 px-4 py-14 md:px-7 md:py-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="editorial-kicker">نمایه کامل</p>
            <h2 id="all-tags-title" className="mt-2 text-[27px] font-black tracking-[-.04em] text-(--public-ink) sm:text-[32px]">موضوع موردنظرتان را پیدا کنید</h2>
            <p className="mt-3 text-[14px] leading-7 text-(--text-secondary)">نام یک فناوری، ابزار یا مفهوم را بنویسید تا مسیرهای مرتبط فیلتر شوند.</p>
          </div>
          <div role="search" className="relative">
            <Search aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-muted)" size={18} />
            <label htmlFor="tag-search" className="sr-only">جستجو میان برچسب‌ها</label>
            <input id="tag-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="مثلاً React، هوش مصنوعی یا UX" className="h-13 w-full rounded-2xl border border-(--border-strong) bg-white pr-11 pl-12 text-[14px] text-(--public-ink) shadow-[0_8px_24px_rgba(16,42,58,.04)] outline-none transition placeholder:text-(--text-faint) focus:border-(--brand-teal) focus:ring-3 focus:ring-(--brand-teal)/12" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="پاک‌کردن جستجو" className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-xl text-(--text-muted) hover:bg-(--surface-muted) hover:text-(--public-ink)"><X size={17} /></button>}
          </div>
        </div>

        <p aria-live="polite" className="mt-8 text-[12px] font-bold text-(--text-muted)">{visible.length.toLocaleString("fa-IR")} برچسب پیدا شد</p>
        {visible.length ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((tag, index) => (
              <Link key={tag.id} href={`/tags/${tag.slug}`} className="group relative flex min-h-44 flex-col overflow-hidden rounded-[22px] border border-(--border) bg-white p-5 shadow-[0_10px_30px_rgba(16,42,58,.04)] transition duration-300 hover:-translate-y-1 hover:border-[#b7c5ca] hover:shadow-[0_18px_45px_rgba(16,42,58,.09)] focus-visible:border-(--brand-teal)">
                <span aria-hidden="true" className={`absolute -left-4 -top-8 font-mono text-[90px] font-black opacity-[.07] ${accents[index % accents.length].split(" ").at(-1)}`}>#</span>
                <div className="relative flex items-center justify-between gap-3"><span className="font-mono text-[11px] font-black tracking-[.08em] text-(--text-faint)">{(index + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}</span><span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-(--text-muted)"><BookOpenText size={14} />{tag.articleCount.toLocaleString("fa-IR")}</span></div>
                <h3 className="relative mt-8 text-[20px] font-black tracking-[-.025em] text-(--public-ink) transition-colors group-hover:text-(--editorial-coral)">#{tag.name}</h3>
                <div className="relative mt-auto flex items-center justify-between border-t border-(--border-subtle) pt-4 text-[12px]"><span dir="ltr" className="text-(--text-faint)">/{tag.slug}</span><ArrowLeft size={15} className="text-(--editorial-coral) transition-transform group-hover:-translate-x-1" /></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[24px] border border-dashed border-(--border-strong) bg-white px-5 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-(--surface-muted) text-(--text-muted)"><Search size={21} /></span>
            <h3 className="mt-4 text-[18px] font-black text-(--public-ink)">برچسبی با این عبارت پیدا نشد</h3>
            <p className="mt-2 text-[13px] text-(--text-muted)">املای عبارت را بررسی کنید یا یک کلیدواژه کوتاه‌تر بنویسید.</p>
            <button type="button" onClick={() => setQuery("")} className="mt-5 min-h-11 rounded-full bg-(--public-ink) px-5 text-[13px] font-black text-white">نمایش همه برچسب‌ها</button>
          </div>
        )}
      </section>
    </>
  );
}
