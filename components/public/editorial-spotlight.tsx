import { ArrowLeft, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PublicArticle } from "@/lib/public-data";

export function EditorialSpotlight({ article }: { article: PublicArticle }) {
  return <section className="content-auto bg-(--public-ink) text-white">
    <div className="mx-auto grid max-w-360 lg:grid-cols-[1fr_1.08fr]">
      <div className="relative min-h-84 overflow-hidden lg:min-h-128"><Image src={article.image} alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover opacity-80"/><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,42,58,.2),rgba(16,42,58,.65))]"/></div>
      <div className="flex items-center px-5 py-12 sm:px-10 lg:px-14"><div className="max-w-xl"><Quote className="text-(--editorial-gold)" size={30}/><p className="mt-5 text-[13px] font-black text-(--editorial-gold)">روایت بلند هفته</p><h2 className="mt-3 text-[28px] font-black leading-[1.65] tracking-[-.04em] text-balance sm:text-[36px]">{article.title}</h2><p className="mt-4 text-[16px] leading-8 text-white/72">{article.excerpt}</p><div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] text-white/60"><span>{article.author.name}</span><span>•</span><span>{article.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span></div><Link href={`/articles/${article.slug}`} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-(--editorial-coral) px-6 text-[14px] font-black text-white hover:bg-(--editorial-coral-dark)">خواندن پرونده <ArrowLeft size={16}/></Link></div></div>
    </div>
  </section>;
}
