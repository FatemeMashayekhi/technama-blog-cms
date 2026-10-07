import { ArticleCardSkeleton } from "@/components/skeletons/article-card-skeleton";
import { NewsletterSkeleton } from "@/components/skeletons/public-shared-skeletons";
import { LoadingStatus, Skeleton } from "@/components/ui/skeleton";

export function PublicDirectorySkeleton({ variant }: { variant: "articles" | "categories" | "authors" }) {
  return <LoadingStatus label={variant === "articles" ? "در حال بارگذاری آرشیو مقالات" : variant === "categories" ? "در حال بارگذاری دسته‌بندی‌ها" : "در حال بارگذاری نویسندگان"}>
    <main id="main-content"><header className="border-b border-(--border) bg-white"><div className="mx-auto max-w-360 px-4 py-14 md:px-7 md:py-20"><Skeleton className="h-3 w-32 rounded"/><Skeleton className="mt-5 h-12 w-full max-w-3xl rounded sm:h-15"/><Skeleton className="mt-5 h-4 w-full max-w-2xl rounded"/><Skeleton className="mt-3 h-4 w-4/5 max-w-xl rounded"/></div></header>{variant === "articles" ? <ArticlesDirectory/> : <CardDirectory variant={variant}/>}<NewsletterSkeleton/></main>
  </LoadingStatus>;
}

function ArticlesDirectory() {
  return <section className="mx-auto max-w-360 px-4 py-10 md:px-7 md:py-16"><div className="rounded-[20px] border border-(--border) bg-white p-3 sm:p-4"><div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px_200px]"><Skeleton className="h-12 rounded-(--radius-sm)"/><Skeleton className="h-12 rounded-(--radius-sm)"/><Skeleton className="h-12 rounded-(--radius-sm)"/></div></div><div className="mt-10 flex items-end justify-between border-b border-(--border-strong) pb-5"><div className="space-y-3"><Skeleton className="h-3 w-24 rounded"/><Skeleton className="h-10 w-44 rounded"/></div><Skeleton className="h-3 w-20 rounded"/></div><div className="mt-9 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 9 }, (_, index) => <ArticleCardSkeleton key={index}/>)}</div><div className="mt-12 flex justify-center gap-2">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="size-11 rounded-full"/>)}</div></section>;
}

function CardDirectory({ variant }: { variant: "categories" | "authors" }) {
  const count = variant === "categories" ? 8 : 6;
  return <section className="mx-auto grid max-w-360 gap-5 px-4 py-12 sm:grid-cols-2 md:px-7 md:py-16 lg:grid-cols-3">{Array.from({ length: count }, (_, index) => <article key={index} className={`${variant === "authors" ? "min-h-80" : "min-h-72"} rounded-[22px] border border-(--border) p-6 ${index === 0 ? "bg-(--public-ink) sm:col-span-2" : "bg-white"}`}><Skeleton className={`size-16 rounded-full ${index === 0 ? "bg-white/16" : ""}`}/><Skeleton className={`mt-6 h-6 w-36 rounded ${index === 0 ? "bg-white/18" : ""}`}/><Skeleton className={`mt-3 h-3.5 w-28 rounded ${index === 0 ? "bg-white/12" : ""}`}/><div className="mt-5 space-y-3"><Skeleton className={`h-3.5 w-full rounded ${index === 0 ? "bg-white/12" : ""}`}/><Skeleton className={`h-3.5 w-4/5 rounded ${index === 0 ? "bg-white/12" : ""}`}/></div><Skeleton className={`mt-8 h-3 w-24 rounded ${index === 0 ? "bg-white/12" : ""}`}/></article>)}</section>;
}
