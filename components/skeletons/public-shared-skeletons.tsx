import { Skeleton } from "@/components/ui/skeleton";

export function SectionHeadingSkeleton({ action = true }: { action?: boolean }) {
  return <div className="flex items-end justify-between gap-4 border-b border-(--border-strong) pb-5"><div className="space-y-3"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-10 w-56 max-w-[65vw] rounded sm:w-80" /></div>{action && <Skeleton className="h-11 w-24 rounded-full" />}</div>;
}

export function NewsletterSkeleton() {
  return <section className="mx-auto max-w-360 px-4 pb-14 md:px-7 md:pb-18"><div className="rounded-(--radius-lg) bg-(--brand-navy) px-5 py-9 sm:px-9 lg:flex lg:items-center lg:justify-between lg:gap-10"><div className="max-w-xl"><Skeleton className="size-10 rounded-(--radius) bg-white/12" /><Skeleton className="mt-4 h-6 w-64 max-w-[75vw] rounded bg-white/16" /><Skeleton className="mt-3 h-3.5 w-80 max-w-full rounded bg-white/12" /></div><div className="mt-6 flex w-full max-w-lg flex-col gap-2 sm:flex-row lg:mt-0"><Skeleton className="h-12 min-w-0 flex-1 rounded-(--radius-sm) bg-white/18" /><Skeleton className="h-12 w-full rounded-(--radius-sm) bg-white/16 sm:w-28" /></div></div></section>;
}

export function AuthorCardSkeleton() {
  return <article className="min-h-72 rounded-[20px] border border-(--border) bg-white p-5"><Skeleton className="size-15 rounded-full" /><Skeleton className="mt-4 h-5 w-28 rounded" /><Skeleton className="mt-2 h-3 w-20 rounded" /><div className="mt-5 space-y-2"><Skeleton className="h-3 w-full rounded" /><Skeleton className="h-3 w-[90%] rounded" /><Skeleton className="h-3 w-2/3 rounded" /></div><Skeleton className="mt-5 h-3 w-16 rounded" /></article>;
}

export function CategoryCardSkeleton({ featured = false }: { featured?: boolean }) {
  return <article className={`relative min-h-52 rounded-[20px] border border-(--border) p-5 ${featured ? "bg-(--public-ink)" : "bg-(--public-paper)"}`}><Skeleton className={`h-1.5 w-12 rounded-full ${featured ? "bg-white/18" : ""}`} /><Skeleton className={`mt-5 h-5 w-28 rounded ${featured ? "bg-white/18" : ""}`} /><Skeleton className={`mt-4 h-3.5 w-full rounded ${featured ? "bg-white/12" : ""}`} /><Skeleton className={`mt-2 h-3.5 w-4/5 rounded ${featured ? "bg-white/12" : ""}`} /><Skeleton className={`absolute bottom-5 right-5 h-3 w-16 rounded ${featured ? "bg-white/12" : ""}`} /></article>;
}

export function PaginationSkeleton() {
  return <div className="flex flex-col gap-3 border-t border-(--border-subtle) px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><Skeleton className="h-3 w-32 rounded" /><div className="flex gap-2"><Skeleton className="size-10 rounded-(--radius-sm)" /><Skeleton className="size-10 rounded-(--radius-sm)" /><Skeleton className="size-10 rounded-(--radius-sm)" /></div></div>;
}

export function SidebarListSkeleton({ rows = 4 }: { rows?: number }) {
  return <aside className="space-y-5"><section className="rounded-(--radius-lg) border border-(--border-strong) bg-white p-5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="mt-3 h-5 w-40 rounded" /><div className="mt-5 space-y-4">{Array.from({ length: rows }, (_, index) => <div key={index} className="flex gap-3 border-b border-(--border-subtle) pb-4 last:border-0 last:pb-0"><Skeleton className="size-7 shrink-0 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-full rounded" /><Skeleton className="h-3.5 w-3/4 rounded" /><Skeleton className="h-2.5 w-20 rounded" /></div></div>)}</div></section><section className="rounded-(--radius-lg) border border-(--border-strong) bg-white p-5"><Skeleton className="h-5 w-36 rounded" /><div className="mt-4 space-y-2">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-13 w-full rounded-(--radius-sm)" />)}</div></section></aside>;
}
