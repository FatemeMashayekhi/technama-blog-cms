import { ArrowLeft, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PublicArticle } from "@/lib/public-data";

export type ArticleCardVariant = "default" | "featured" | "compact" | "horizontal";

export function ArticleCard({ article, variant = "default", priority = false, featuredHeadingLevel = "h1" }: { article: PublicArticle; variant?: ArticleCardVariant; priority?: boolean; featuredHeadingLevel?: "h1" | "h2" }) {
  const href = `/articles/${article.slug}`;
  if (variant === "featured") {
    const Heading = featuredHeadingLevel;
    return <article className="group relative min-h-112 overflow-hidden rounded-[22px] bg-(--public-ink) sm:min-h-132">
      <Image src={article.image} alt="" fill priority={priority} sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover opacity-75 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-85"/>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,28,40,.04)_20%,rgba(9,28,40,.96)_94%)]"/>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9 lg:p-11">
        <Category article={article} dark/>
        <Link href={href} className="outline-none"><Heading className="mt-3 max-w-3xl text-[28px] font-black leading-[1.58] tracking-[-.045em] text-balance sm:text-[38px] lg:text-[44px]">{article.title}</Heading></Link>
        <p className="mt-4 hidden max-w-2xl text-[16px] leading-8 text-white/78 sm:block">{article.excerpt}</p>
        <Meta article={article} dark/>
      </div>
    </article>;
  }
  if (variant === "compact") return <article className="group grid grid-cols-[112px_minmax(0,1fr)] gap-4 border-b border-(--border) pb-5 last:border-0 last:pb-0 sm:grid-cols-[132px_minmax(0,1fr)]">
    <Link href={href} className="relative min-h-24 overflow-hidden rounded-(--radius) bg-(--surface-muted)"><Image src={article.image} alt="" fill sizes="132px" className="object-cover transition duration-500 group-hover:scale-105"/><span className="absolute inset-0 bg-(--public-ink)/5"/></Link>
    <div className="min-w-0 py-0.5"><Category article={article}/><Link href={href}><h3 className="mt-1.5 line-clamp-2 text-[15px] font-black leading-7 text-(--public-ink) transition-colors group-hover:text-(--editorial-coral)">{article.title}</h3></Link><p className="mt-2 text-[13px] text-(--text-muted)">{article.author.name} · {article.readingTime.toLocaleString("fa-IR")} دقیقه</p></div>
  </article>;
  if (variant === "horizontal") return <article className="group grid gap-5 sm:grid-cols-[230px_minmax(0,1fr)]">
    <Link href={href} className="relative aspect-16/10 overflow-hidden rounded-(--radius-lg) bg-(--surface-muted) sm:aspect-auto"><Image src={article.image} alt="" fill sizes="(max-width: 640px) 100vw, 230px" className="object-cover transition duration-500 group-hover:scale-[1.035]"/></Link>
    <div className="py-1"><Category article={article}/><Link href={href}><h3 className="mt-2 text-[19px] font-black leading-8 tracking-[-.025em] text-(--public-ink) group-hover:text-(--editorial-coral)">{article.title}</h3></Link><p className="mt-2 line-clamp-2 text-[15px] leading-7 text-(--text-secondary)">{article.excerpt}</p><Meta article={article}/></div>
  </article>;
  return <article className="group rounded-(--radius-lg) transition duration-300 hover:-translate-y-1">
    <Link href={href} className="relative block aspect-16/10 overflow-hidden rounded-(--radius-lg) bg-(--surface-muted)"><Image src={article.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.045]"/><span className="absolute inset-0 ring-1 ring-inset ring-black/8"/></Link>
    <div className="pt-4"><Category article={article}/><Link href={href}><h3 className="mt-2 line-clamp-2 text-[18px] font-black leading-8 tracking-[-.025em] text-(--public-ink) transition-colors group-hover:text-(--editorial-coral)">{article.title}</h3></Link><p className="mt-2 line-clamp-2 text-[15px] leading-7 text-(--text-secondary)">{article.excerpt}</p><Meta article={article}/><Link href={href} aria-label={`مطالعه ${article.title}`} className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-black text-(--editorial-coral)">ادامه مطلب <ArrowLeft size={14}/></Link></div>
  </article>;
}

function Category({ article, dark = false }: { article: PublicArticle; dark?: boolean }) { return <Link href={`/categories/${article.categorySlug}`} className={`inline-flex min-h-10 items-center rounded-full px-3 text-[13px] font-black ${dark ? "bg-white/12 text-white" : "bg-(--public-paper-deep) text-(--editorial-coral)"}`}>{article.category.name}</Link>; }
function Meta({ article, dark = false }: { article: PublicArticle; dark?: boolean }) { return <div className={`mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] ${dark ? "text-white/70" : "text-(--text-muted)"}`}><Link href={`/authors/${article.authorUsername}`} className="min-h-10 content-center font-bold hover:underline">{article.author.name}</Link><span aria-hidden="true">•</span><time>{article.publicDateLabel}</time><span aria-hidden="true">•</span><span className="inline-flex items-center gap-1"><Clock3 size={13}/>{article.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span></div>; }
