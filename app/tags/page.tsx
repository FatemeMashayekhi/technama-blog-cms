import type { Metadata } from "next";
import { Compass, Hash, Layers3 } from "lucide-react";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { TagsDirectory, type TagDirectoryItem } from "@/components/public/tags/tags-directory";
import { getPublicTags } from "@/lib/public-tag-service";

export const metadata: Metadata = {
  title: "برچسب‌ها؛ مسیرهای موضوعی فناوری",
  description: "فناوری‌ها، ابزارها و موضوعات تخصصی آرشیو تک‌نما را بر اساس برچسب کشف و دنبال کنید.",
  alternates: { canonical: "/tags" },
};

export default function TagsPage() {
  const tags = getPublicTags();
  const directory: TagDirectoryItem[] = tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    articleCount: tag.articles.length,
    latestArticle: tag.articles[0]?.title,
  }));
  const activeTags = directory.filter((tag) => tag.articleCount > 0).length;
  const connections = directory.reduce((total, tag) => total + tag.articleCount, 0);

  return (
    <div className="public-site min-h-screen">
      <PublicHeader />
      <main id="main-content" tabIndex={-1}>
        <header className="relative overflow-hidden border-b border-(--border) bg-(--public-paper)">
          <span aria-hidden="true" className="absolute -left-10 -top-24 font-mono text-[330px] font-black leading-none text-(--public-ink)/[.035]">#</span>
          <div aria-hidden="true" className="absolute -right-24 bottom-0 size-96 rounded-full bg-[#d7ebe6]/45 blur-3xl" />
          <div className="relative mx-auto grid max-w-360 gap-10 px-4 py-14 md:px-7 md:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,.7fr)] lg:items-end lg:py-24">
            <div>
              <p className="editorial-kicker flex items-center gap-2"><Hash size={15} /> نمایه موضوعی تک‌نما</p>
              <h1 className="mt-4 max-w-4xl text-[40px] font-black leading-[1.45] tracking-[-.055em] text-balance text-(--public-ink) sm:text-[54px]">از یک کلیدواژه، <span className="text-(--editorial-coral)">مسیر مطالعه</span> بسازید.</h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-8 text-(--text-secondary)">برچسب‌ها نقطه اتصال مقاله‌های ما هستند؛ از یک فناوری یا مفهوم شروع کنید و روایت‌های مرتبط را در سراسر آرشیو دنبال کنید.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[22px] border border-(--border) bg-white/78 p-5 shadow-[0_12px_36px_rgba(16,42,58,.05)] backdrop-blur"><Layers3 className="text-(--brand-teal)" size={20} /><strong className="mt-6 block font-mono text-[32px] font-black tracking-[-.06em] text-(--public-ink)">{directory.length.toLocaleString("fa-IR")}</strong><span className="text-[12px] font-bold text-(--text-muted)">برچسب در نمایه</span></div>
              <div className="rounded-[22px] border border-(--border) bg-white/78 p-5 shadow-[0_12px_36px_rgba(16,42,58,.05)] backdrop-blur"><Compass className="text-(--editorial-coral)" size={20} /><strong className="mt-6 block font-mono text-[32px] font-black tracking-[-.06em] text-(--public-ink)">{connections.toLocaleString("fa-IR")}</strong><span className="text-[12px] font-bold text-(--text-muted)">پیوند به مطالب</span></div>
              <p className="col-span-2 px-1 text-[12px] leading-6 text-(--text-muted)">{activeTags.toLocaleString("fa-IR")} موضوع اکنون محتوای قابل مطالعه دارد و این نمایه همراه آرشیو رشد می‌کند.</p>
            </div>
          </div>
        </header>
        <TagsDirectory tags={directory} />
        <NewsletterSection />
      </main>
      <PublicFooter />
    </div>
  );
}
