import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { PublicArticle } from "@/lib/public-data";
import { ArticleCard } from "./article-card";
export function LatestArticles({ articles }: { articles: PublicArticle[] }) { return <section className="content-auto mx-auto max-w-360 px-4 py-14 md:px-7 md:py-20"><div className="editorial-rule flex items-end justify-between border-b border-(--border-strong) pb-5"><div><p className="editorial-kicker">تازه‌های مجله</p><h2 className="mt-2 text-[27px] font-black tracking-[-.04em] text-(--public-ink) sm:text-[32px]">آخرین روایت‌ها و تحلیل‌ها</h2></div><Link href="/articles" className="flex min-h-11 items-center gap-1.5 text-[13px] font-black text-(--text-secondary) hover:text-(--editorial-coral)">مشاهده همه <ArrowLeft size={14}/></Link></div><div className="mt-9 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <ArticleCard key={article.id} article={article}/>)}</div></section>; }
