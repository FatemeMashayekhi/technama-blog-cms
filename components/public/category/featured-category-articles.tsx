import { ArticleCard } from "@/components/public/article-card";
import type { PublicArticle } from "@/lib/public-data";

export function FeaturedCategoryArticles({ articles }: { articles: PublicArticle[] }) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="category-featured-title" className="mx-auto max-w-360 px-4 pt-10 md:px-7 md:pt-14">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold text-(--brand-teal)">پیشنهاد تحریریه</p>
          <h2 id="category-featured-title" className="mt-1 text-xl font-black text-(--text-strong)">مطالب منتخب</h2>
        </div>
        <span className="h-px flex-1 bg-(--surface-muted)" aria-hidden="true" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <ArticleCard article={articles[0]} variant="featured" priority featuredHeadingLevel="h2" />
        {articles.length > 1 && <div className="flex flex-col justify-center gap-5 rounded-(--radius-lg) border border-(--border-strong) bg-white p-5">{articles.slice(1, 3).map((article) => <ArticleCard key={article.id} article={article} variant="compact" />)}</div>}
      </div>
    </section>
  );
}
