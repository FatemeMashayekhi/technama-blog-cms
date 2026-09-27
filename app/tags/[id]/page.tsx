import type { Metadata } from "next";
import { ArrowLeft, BookOpenText, Hash, Layers3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/public/article-card";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { getPublicTag, getPublicTags, getPublicTagSlugs } from "@/lib/public-tag-service";

type Props = { params: Promise<{ id: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicTagSlugs().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tag = getPublicTag(id);
  if (!tag) return { title: "برچسب پیدا نشد", robots: { index: false, follow: false } };
  return {
    title: `#${tag.name}؛ مقاله‌ها و تحلیل‌ها`,
    description: `تازه‌ترین مقاله‌ها، راهنماها و تحلیل‌های مرتبط با ${tag.name} در مجله فناوری تک‌نما.`,
    alternates: { canonical: `/tags/${tag.slug}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { id } = await params;
  const tag = getPublicTag(id);
  if (!tag) notFound();

  const [lead, ...rest] = tag.articles;
  const relatedTags = getPublicTags().filter((item) => item.id !== tag.id).slice(0, 6);
  const totalReadingTime = tag.articles.reduce((total, article) => total + article.readingTime, 0);

  return (
    <div className="public-site min-h-screen">
      <PublicHeader />
      <main id="main-content" tabIndex={-1}>
        <header className="relative overflow-hidden border-b border-(--border) bg-(--public-ink) text-white">
          <span aria-hidden="true" className="absolute -left-6 -top-28 font-mono text-[360px] font-black leading-none text-white/[.035]">#</span>
          <div aria-hidden="true" className="absolute -right-32 bottom-0 size-112 rounded-full bg-(--brand-teal)/25 blur-3xl" />
          <div className="relative mx-auto max-w-360 px-4 py-12 md:px-7 md:py-18">
            <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-2 text-[12px] font-bold text-white/55"><Link href="/" className="min-h-10 content-center hover:text-white">خانه</Link><ArrowLeft size={13} /><Link href="/tags" className="min-h-10 content-center hover:text-white">برچسب‌ها</Link><ArrowLeft size={13} /><span className="text-white/80">{tag.name}</span></nav>
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="flex items-center gap-2 text-[12px] font-black text-(--editorial-gold)"><Hash size={15} /> پرونده موضوعی</p>
                <h1 className="mt-3 text-[48px] font-black leading-tight tracking-[-.06em] text-balance sm:text-[68px]">#{tag.name}</h1>
                <p className="mt-5 max-w-2xl text-[15px] leading-8 text-white/68">مجموعه مقاله‌ها و تحلیل‌هایی که این موضوع را از زاویه فناوری، محصول و تجربه واقعی تیم‌ها دنبال می‌کنند.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="min-w-32 rounded-2xl border border-white/12 bg-white/[.07] px-5 py-4 backdrop-blur"><strong className="block font-mono text-[28px] font-black">{tag.articles.length.toLocaleString("fa-IR")}</strong><span className="text-[12px] text-white/55">مطلب منتشرشده</span></div>
                <div className="min-w-32 rounded-2xl border border-white/12 bg-white/[.07] px-5 py-4 backdrop-blur"><strong className="block font-mono text-[28px] font-black">{totalReadingTime.toLocaleString("fa-IR")}</strong><span className="text-[12px] text-white/55">دقیقه مطالعه</span></div>
              </div>
            </div>
          </div>
        </header>

        {lead ? (
          <>
            <section aria-labelledby="tag-lead-title" className="mx-auto max-w-360 px-4 pt-12 md:px-7 md:pt-16">
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-(--border-strong) pb-5"><div><p className="editorial-kicker">پیشنهاد برای شروع</p><h2 id="tag-lead-title" className="mt-2 text-[26px] font-black tracking-[-.04em] text-(--public-ink)">مطلب شاخص این موضوع</h2></div><BookOpenText className="hidden text-(--text-faint) sm:block" size={27} /></div>
              <ArticleCard article={lead} variant="featured" priority featuredHeadingLevel="h2" />
            </section>

            {rest.length > 0 && <section aria-labelledby="tag-archive-title" className="mx-auto max-w-360 px-4 py-14 md:px-7 md:py-20"><div className="editorial-rule border-b border-(--border-strong) pb-5"><p className="editorial-kicker">ادامه مسیر</p><h2 id="tag-archive-title" className="mt-2 text-[27px] font-black tracking-[-.04em] text-(--public-ink) sm:text-[32px]">همه مطالب #{tag.name}</h2></div><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{rest.map((article) => <ArticleCard key={article.id} article={article} />)}</div></section>}
          </>
        ) : (
          <section className="mx-auto max-w-360 px-4 py-16 md:px-7 md:py-24"><div className="relative overflow-hidden rounded-[26px] border border-dashed border-(--border-strong) bg-white px-6 py-16 text-center"><span aria-hidden="true" className="absolute -left-5 -top-16 font-mono text-[180px] font-black text-(--public-ink)/[.035]">#</span><span className="mx-auto grid size-13 place-items-center rounded-2xl bg-(--surface-muted) text-(--brand-teal)"><Layers3 size={22} /></span><h2 className="mt-5 text-[22px] font-black text-(--public-ink)">این مسیر در حال ساخته‌شدن است</h2><p className="mx-auto mt-3 max-w-lg text-[14px] leading-7 text-(--text-muted)">هنوز مقاله‌ای با برچسب #{tag.name} منتشر نشده؛ می‌توانید فعلاً موضوعات نزدیک را مرور کنید.</p><Link href="/articles" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-(--public-ink) px-5 text-[13px] font-black text-white">مرور تازه‌ترین مقالات <ArrowLeft size={15} /></Link></div></section>
        )}

        <section aria-labelledby="related-tags-title" className="border-y border-(--border) bg-(--public-paper-deep)"><div className="mx-auto max-w-360 px-4 py-12 md:px-7 md:py-16"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="editorial-kicker">کشف بیشتر</p><h2 id="related-tags-title" className="mt-2 text-[24px] font-black tracking-[-.035em] text-(--public-ink)">موضوعات نزدیک برای ادامه مطالعه</h2></div><Link href="/tags" className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-black text-(--editorial-coral)">همه برچسب‌ها <ArrowLeft size={14} /></Link></div><div className="mt-7 flex flex-wrap gap-3">{relatedTags.map((item) => <Link key={item.id} href={`/tags/${item.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--border-strong) bg-white px-4 text-[13px] font-black text-(--public-ink) transition hover:-translate-y-0.5 hover:border-(--editorial-coral) hover:text-(--editorial-coral)"><Hash size={14} />{item.name}<span className="text-[11px] font-bold text-(--text-faint)">{item.articles.length.toLocaleString("fa-IR")}</span></Link>)}</div></div></section>

        <div className="pt-14 md:pt-18"><NewsletterSection /></div>
      </main>
      <PublicFooter />
    </div>
  );
}
