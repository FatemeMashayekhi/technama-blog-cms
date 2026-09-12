import { FolderTree, Home } from "lucide-react";
import Link from "next/link";
import type { PublicCategoryDetail } from "@/lib/public-category-service";

export function CategoryHeader({ category, publishedCount }: { category: PublicCategoryDetail; publishedCount: number }) {
  const formatter = new Intl.NumberFormat("fa-IR");

  return (
    <section className="border-b border-(--border-strong) bg-white">
      <div className="mx-auto max-w-360 px-4 py-8 md:px-7 md:py-12">
        <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-2 text-[12px] text-(--text-muted)">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-(--brand-teal)"><Home size={12} /> خانه</Link>
          <span aria-hidden="true">/</span>
          <Link href="/categories" className="hover:text-(--editorial-coral)">دسته‌بندی‌ها</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-(--text-strong)">{category.name}</span>
        </nav>

        <div className="mt-7 flex max-w-4xl items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-(--radius) text-white shadow-sm" style={{ backgroundColor: category.color }} aria-hidden="true">
            <FolderTree size={22} />
          </span>
          <div>
            <p className="mb-2 text-[12px] font-bold tracking-[.12em] text-(--brand-teal)">آرشیو موضوعی تک‌نما</p>
            <h1 className="text-3xl font-black leading-tight tracking-[-.04em] text-(--text-strong) sm:text-4xl">{category.name}</h1>
            <p className="mt-4 max-w-3xl text-[16px] leading-8 text-(--text-secondary)">{category.description}</p>
            <p className="mt-4 text-[12px] font-bold text-(--text-muted)">{formatter.format(publishedCount)} مقاله منتشرشده در این مجموعه</p>
          </div>
        </div>
      </div>
    </section>
  );
}
