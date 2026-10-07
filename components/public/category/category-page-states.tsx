import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ArticleCardSkeleton } from "@/components/skeletons/article-card-skeleton";
import { NewsletterSkeleton, PaginationSkeleton, SidebarListSkeleton } from "@/components/skeletons/public-shared-skeletons";
import { LoadingStatus, Skeleton } from "@/components/ui/skeleton";

export function CategoryPageSkeleton() {
  return <LoadingStatus label="در حال بارگذاری دسته‌بندی">
    <main id="main-content">
      <section className="border-b border-(--border-strong) bg-white"><div className="mx-auto max-w-360 px-4 py-8 md:px-7 md:py-12"><div className="flex gap-2"><Skeleton className="h-3 w-16 rounded"/><Skeleton className="h-3 w-20 rounded"/><Skeleton className="h-3 w-24 rounded"/></div><div className="mt-7 flex max-w-4xl items-start gap-4"><Skeleton className="size-12 shrink-0 rounded-(--radius)"/><div className="min-w-0 flex-1"><Skeleton className="h-3 w-32 rounded"/><Skeleton className="mt-4 h-10 w-64 max-w-[75vw] rounded"/><Skeleton className="mt-5 h-4 w-full rounded"/><Skeleton className="mt-3 h-4 w-4/5 rounded"/><Skeleton className="mt-5 h-3 w-44 rounded"/></div></div></div></section>
      <section className="mx-auto max-w-360 px-4 pt-10 md:px-7 md:pt-14"><div className="mb-5 flex items-end gap-3"><div className="space-y-2"><Skeleton className="h-3 w-24 rounded"/><Skeleton className="h-6 w-36 rounded"/></div><Skeleton className="h-px flex-1"/></div><div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"><ArticleCardSkeleton variant="featured"/><div className="flex flex-col justify-center gap-5 rounded-(--radius-lg) border border-(--border-strong) bg-white p-5"><ArticleCardSkeleton variant="compact"/><ArticleCardSkeleton variant="compact"/></div></div></section>
      <div className="mx-auto grid max-w-360 gap-6 px-4 py-10 md:px-7 md:py-14 xl:grid-cols-[minmax(0,1fr)_300px]"><section className="overflow-hidden rounded-(--radius-lg) border border-(--border-strong) bg-white"><div className="flex flex-col gap-4 border-b border-(--border-subtle) px-5 py-5 sm:flex-row sm:items-end sm:justify-between md:px-6"><div className="space-y-2"><Skeleton className="h-3 w-24 rounded"/><Skeleton className="h-6 w-36 rounded"/></div><Skeleton className="h-10 w-36 rounded-(--radius-sm)"/></div><div className="grid gap-x-5 gap-y-9 p-5 sm:grid-cols-2 md:p-6 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <ArticleCardSkeleton key={index}/>)}</div><PaginationSkeleton/></section><SidebarListSkeleton/></div>
      <NewsletterSkeleton/>
    </main>
  </LoadingStatus>;
}

export function CategoryErrorState() {
  return <main className="grid min-h-[65vh] place-items-center px-4 text-center"><div><AlertTriangle className="mx-auto text-(--danger)" size={36}/><h1 className="mt-4 text-xl font-black text-(--text-strong)">نمایش دسته‌بندی ممکن نشد</h1><p className="mt-2 text-[13px] leading-6 text-(--text-muted)">لطفاً دوباره تلاش کنید یا از صفحه اصلی به مطالعه ادامه دهید.</p><Link href="/" className="mt-5 inline-flex rounded-(--radius-sm) bg-(--brand-navy) px-4 py-2.5 text-[12px] font-bold text-white">بازگشت به خانه</Link></div></main>;
}
