import { ArticleCard } from "@/components/public/article-card";
import type { PublicArticle } from "@/lib/public-data";

export function AuthorFeaturedArticle({ article }: { article: PublicArticle | null }) {
  if (!article) return null;
  return <section aria-labelledby="author-featured-title" className="mx-auto max-w-360 px-4 pt-10 md:px-7 md:pt-14"><div className="mb-5 flex items-end gap-3"><div><p className="text-[12px] font-bold text-(--brand-teal)">انتخاب تحریریه</p><h2 id="author-featured-title" className="mt-1 text-xl font-black text-(--text-strong)">مقاله شاخص نویسنده</h2></div><span className="h-px flex-1 bg-(--surface-muted)" aria-hidden="true"/></div><ArticleCard article={article} variant="featured" priority featuredHeadingLevel="h2"/></section>;
}
