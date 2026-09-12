import type { Metadata } from "next";
import Link from "next/link";
import { Hash } from "lucide-react";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { getPublicTags } from "@/lib/public-tag-service";

export const metadata: Metadata = { title: "برچسب‌ها", description: "موضوعات و کلیدواژه‌های آرشیو تک‌نما را مرور کنید.", alternates: { canonical: "/tags" } };

export default function TagsPage() {
  const tags = getPublicTags();
  return <div className="public-site min-h-screen"><PublicHeader/><main id="main-content" tabIndex={-1}><header className="border-b border-(--border) bg-white"><div className="mx-auto max-w-360 px-4 py-14 md:px-7 md:py-20"><p className="editorial-kicker">نمایه موضوعی</p><h1 className="mt-3 text-[36px] font-black tracking-[-.05em] sm:text-[50px]">برچسب‌های تک‌نما</h1><p className="mt-5 max-w-2xl text-[17px] leading-8 text-(--text-secondary)">برای رسیدن سریع به یک فناوری، ابزار یا حوزه تخصصی از برچسب‌ها استفاده کنید.</p></div></header><section className="mx-auto max-w-5xl px-4 py-12 md:px-7 md:py-16"><div className="flex flex-wrap gap-3">{tags.map((tag, index) => <Link key={tag.id} href={`/tags/${tag.slug}`} className={`group inline-flex min-h-13 items-center gap-2 rounded-full border px-5 font-black transition hover:-translate-y-0.5 hover:border-(--editorial-coral) hover:text-(--editorial-coral) ${index < 3 ? "border-(--public-ink) bg-(--public-ink) text-white hover:bg-white" : "border-(--border-strong) bg-white text-(--public-ink)"}`}><Hash size={15}/>{tag.name}<span className={`text-[12px] ${index < 3 ? "text-white/55 group-hover:text-(--text-muted)" : "text-(--text-muted)"}`}>{tag.articles.length.toLocaleString("fa-IR")}</span></Link>)}</div></section></main><PublicFooter/></div>;
}
