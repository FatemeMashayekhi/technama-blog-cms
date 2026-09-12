import { ArrowLeft, Clock3 } from "lucide-react";
import Link from "next/link";
import type { PublicArticle, PublicCategory } from "@/lib/public-data";

export function CategorySidebar({ popular, related }: { popular: PublicArticle[]; related: PublicCategory[] }) {
  return (
    <aside className="space-y-5" aria-label="مطالب و دسته‌بندی‌های مرتبط">
      <section className="rounded-(--radius-lg) border border-(--border-strong) bg-white p-5" aria-labelledby="popular-category-title">
        <p className="text-[12px] font-bold text-(--brand-teal)">منتخب خوانندگان</p>
        <h2 id="popular-category-title" className="mt-1 text-base font-black text-(--text-strong)">پربازدیدهای این دسته</h2>
        <ol className="mt-5 space-y-4">
          {popular.map((article, index) => <li key={article.id} className="flex gap-3 border-b border-(--border-subtle) pb-4 last:border-0 last:pb-0"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-(--surface-muted) text-[13px] font-black text-(--brand-teal)">{(index + 1).toLocaleString("fa-IR")}</span><div><Link href={`/articles/${article.slug}`} className="line-clamp-2 text-[14px] font-bold leading-6 text-(--text-strong) hover:text-(--brand-teal)">{article.title}</Link><span className="mt-1.5 inline-flex items-center gap-1 text-[14px] text-(--text-muted)"><Clock3 size={10} />{article.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span></div></li>)}
        </ol>
      </section>

      <section className="rounded-(--radius-lg) border border-(--border-strong) bg-white p-5" aria-labelledby="related-categories-title">
        <h2 id="related-categories-title" className="text-base font-black text-(--text-strong)">دسته‌بندی‌های مرتبط</h2>
        <div className="mt-4 space-y-2">
          {related.map((category) => <Link key={category.id} href={`/categories/${category.slug}`} className="group flex items-center justify-between rounded-(--radius-sm) border border-(--border-subtle) px-3 py-3 hover:border-(--border-strong) hover:bg-(--surface-subtle)"><span className="flex items-center gap-2 text-[13px] font-bold text-(--text-secondary)"><span className="size-2 rounded-full" style={{ backgroundColor: category.color }} />{category.name}</span><ArrowLeft size={13} className="text-(--text-muted) transition-transform group-hover:-translate-x-1" /></Link>)}
        </div>
      </section>
    </aside>
  );
}
