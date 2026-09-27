import { ArrowLeft, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PublicArticle } from "@/lib/public-data";

export type ArticleCardVariant = "default" | "featured" | "compact" | "horizontal";

type ArticleCardProps = {
  article: PublicArticle;
  variant?: ArticleCardVariant;
  priority?: boolean;
  featuredHeadingLevel?: "h1" | "h2";
};

const primaryLinkClass = "after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:outline-none";

export function ArticleCard({ article, variant = "default", priority = false, featuredHeadingLevel = "h1" }: ArticleCardProps) {
  if (variant === "featured") return <FeaturedArticleCard article={article} priority={priority} headingLevel={featuredHeadingLevel} />;
  if (variant === "compact") return <CompactArticleCard article={article} />;
  if (variant === "horizontal") return <HorizontalArticleCard article={article} />;
  return <DefaultArticleCard article={article} />;
}

function DefaultArticleCard({ article }: { article: PublicArticle }) {
  const href = `/articles/${article.slug}`;
  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-[24px] border border-(--border) bg-white shadow-[0_14px_38px_rgba(16,42,58,.055)] transition duration-300 hover:-translate-y-1.5 hover:border-[#bcc9ce] hover:shadow-[0_24px_58px_rgba(16,42,58,.11)] focus-within:border-(--brand-teal) focus-within:ring-3 focus-within:ring-(--brand-teal)/16">
      <div className="relative aspect-[16/10] overflow-hidden bg-(--surface-muted)">
        <Image src={article.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]" />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(9,28,40,.22))]" aria-hidden="true" />
        <span className="absolute bottom-3 left-3 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/45 bg-white/90 px-3 text-[12px] font-bold text-(--public-ink) shadow-sm backdrop-blur-md">
          <Clock3 size={13} aria-hidden="true" />
          {article.readingTime.toLocaleString("fa-IR")} دقیقه
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <CategoryLink article={article} />
        <Link href={href} className={primaryLinkClass}>
          <h3 className="mt-3 line-clamp-2 text-[19px] font-black leading-[1.72] tracking-[-.03em] text-(--public-ink) transition-colors group-hover:text-(--editorial-coral)">{article.title}</h3>
        </Link>
        <p className="mt-2.5 line-clamp-2 text-[14px] leading-7 text-(--text-secondary)">{article.excerpt}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-(--border-subtle) pt-5">
          <AuthorMeta article={article} />
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-black text-(--editorial-coral)" aria-hidden="true">
            بخوانید <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}

function FeaturedArticleCard({ article, priority, headingLevel: Heading }: { article: PublicArticle; priority: boolean; headingLevel: "h1" | "h2" }) {
  const href = `/articles/${article.slug}`;
  return (
    <article className="group relative isolate min-h-112 overflow-hidden rounded-[26px] bg-(--public-ink) shadow-[0_24px_70px_rgba(16,42,58,.18)] sm:min-h-132 focus-within:ring-3 focus-within:ring-(--brand-teal)/30 focus-within:ring-offset-3">
      <Image src={article.image} alt="" fill priority={priority} sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover opacity-80 transition duration-700 ease-out group-hover:scale-[1.035] group-hover:opacity-90" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,28,40,.06)_16%,rgba(9,28,40,.34)_54%,rgba(9,28,40,.98)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9 lg:p-11">
        <CategoryLink article={article} dark />
        <Link href={href} className={primaryLinkClass}>
          <Heading className="mt-3 max-w-3xl text-balance text-[28px] font-black leading-[1.58] tracking-[-.045em] sm:text-[38px] lg:text-[44px]">{article.title}</Heading>
        </Link>
        <p className="mt-4 hidden max-w-2xl text-[16px] leading-8 text-white/78 sm:block">{article.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/18 pt-5">
          <AuthorMeta article={article} dark />
          <span className="inline-flex min-h-10 items-center gap-2 font-bold text-white" aria-hidden="true">مطالعه پرونده <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /></span>
        </div>
      </div>
    </article>
  );
}

function CompactArticleCard({ article }: { article: PublicArticle }) {
  const href = `/articles/${article.slug}`;
  return (
    <article className="group relative isolate grid grid-cols-[104px_minmax(0,1fr)] gap-4 rounded-2xl p-1 transition hover:bg-white focus-within:bg-white focus-within:ring-3 focus-within:ring-(--brand-teal)/16 sm:grid-cols-[124px_minmax(0,1fr)]">
      <div className="relative aspect-square overflow-hidden rounded-[15px] bg-(--surface-muted)">
        <Image src={article.image} alt="" fill sizes="124px" className="object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute inset-0 ring-1 ring-inset ring-black/6" aria-hidden="true" />
      </div>
      <div className="min-w-0 self-center py-1">
        <CategoryLink article={article} quiet />
        <Link href={href} className={primaryLinkClass}>
          <h3 className="mt-1.5 line-clamp-2 text-[15px] font-black leading-7 text-(--public-ink) transition-colors group-hover:text-(--editorial-coral)">{article.title}</h3>
        </Link>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-(--text-muted)">
          <span>{article.author.name}</span><span aria-hidden="true">·</span><span>{article.readingTime.toLocaleString("fa-IR")} دقیقه</span>
        </p>
      </div>
    </article>
  );
}

function HorizontalArticleCard({ article }: { article: PublicArticle }) {
  const href = `/articles/${article.slug}`;
  return (
    <article className="group relative isolate grid overflow-hidden rounded-[22px] border border-transparent transition duration-300 hover:border-(--border) hover:bg-white hover:shadow-[0_16px_42px_rgba(16,42,58,.07)] focus-within:border-(--brand-teal) focus-within:bg-white focus-within:ring-3 focus-within:ring-(--brand-teal)/16 sm:grid-cols-[240px_minmax(0,1fr)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-(--surface-muted) sm:aspect-auto sm:min-h-48">
        <Image src={article.image} alt="" fill sizes="(max-width: 640px) 100vw, 240px" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className="absolute inset-0 ring-1 ring-inset ring-black/6" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-col p-5 sm:p-6">
        <CategoryLink article={article} quiet />
        <Link href={href} className={primaryLinkClass}>
          <h3 className="mt-2 text-[20px] font-black leading-9 tracking-[-.03em] text-(--public-ink) transition-colors group-hover:text-(--editorial-coral)">{article.title}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-[14px] leading-7 text-(--text-secondary)">{article.excerpt}</p>
        <div className="mt-auto pt-4"><AuthorMeta article={article} /></div>
      </div>
    </article>
  );
}

function CategoryLink({ article, dark = false, quiet = false }: { article: PublicArticle; dark?: boolean; quiet?: boolean }) {
  return (
    <Link href={`/categories/${article.categorySlug}`} className={`relative z-10 inline-flex min-h-10 w-fit items-center rounded-full px-3 text-[12px] font-black transition-colors ${dark ? "border border-white/25 bg-white/12 text-white hover:bg-white/20" : quiet ? "-mr-2 px-2 text-(--editorial-coral) hover:bg-(--public-paper-deep)" : "bg-(--public-paper-deep) text-(--editorial-coral) hover:bg-[#ebe5d9]"}`}>
      {article.category.name}
    </Link>
  );
}

function AuthorMeta({ article, dark = false }: { article: PublicArticle; dark?: boolean }) {
  return (
    <div className={`relative z-10 flex min-w-0 items-center gap-2.5 ${dark ? "text-white/72" : "text-(--text-muted)"}`}>
      <span className={`grid size-10 shrink-0 place-items-center rounded-full text-[11px] font-black ${dark ? "bg-white/14 text-white ring-1 ring-white/25" : article.author.color}`}>{article.author.initials}</span>
      <div className="min-w-0 text-[12px] leading-5">
        <Link href={`/authors/${article.authorUsername}`} className={`block truncate font-black hover:underline ${dark ? "text-white" : "text-(--text-strong)"}`}>{article.author.name}</Link>
        <p className="flex items-center gap-1.5"><time>{article.publicDateLabel}</time><span aria-hidden="true">·</span><span>{article.readingTime.toLocaleString("fa-IR")} دقیقه</span></p>
      </div>
    </div>
  );
}
