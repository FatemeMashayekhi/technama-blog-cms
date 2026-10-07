import type { ArticleCardVariant } from "@/components/public/article-card";
import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton({ variant = "default" }: { variant?: ArticleCardVariant }) {
  if (variant === "featured") return <FeaturedSkeleton />;
  if (variant === "compact") return <CompactSkeleton />;
  if (variant === "horizontal") return <HorizontalSkeleton />;
  return <DefaultSkeleton />;
}

function MetaSkeleton({ dark = false }: { dark?: boolean }) {
  return <div className="flex items-center gap-2.5"><Skeleton className={`size-10 shrink-0 rounded-full ${dark ? "bg-white/18" : ""}`} /><div className="min-w-0 flex-1 space-y-2"><Skeleton className={`h-3 w-24 rounded ${dark ? "bg-white/18" : ""}`} /><Skeleton className={`h-2.5 w-32 rounded ${dark ? "bg-white/12" : ""}`} /></div></div>;
}

function DefaultSkeleton() {
  return <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-(--border) bg-white shadow-[0_14px_38px_rgba(16,42,58,.045)]"><Skeleton className="aspect-[16/10] w-full" /><div className="flex flex-1 flex-col p-5 sm:p-6"><Skeleton className="h-10 w-24 rounded-full" /><Skeleton className="mt-3 h-5 w-[92%] rounded" /><Skeleton className="mt-2 h-5 w-3/4 rounded" /><Skeleton className="mt-4 h-3.5 w-full rounded" /><Skeleton className="mt-2 h-3.5 w-4/5 rounded" /><div className="mt-6 border-t border-(--border-subtle) pt-5"><MetaSkeleton /></div></div></article>;
}

function FeaturedSkeleton() {
  return <article className="relative min-h-112 overflow-hidden rounded-[26px] bg-(--public-ink) shadow-[0_24px_70px_rgba(16,42,58,.14)] sm:min-h-132"><Skeleton className="absolute inset-0 bg-white/8" /><div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 lg:p-11"><Skeleton className="h-10 w-28 rounded-full bg-white/18" /><Skeleton className="mt-4 h-10 w-[92%] rounded bg-white/20" /><Skeleton className="mt-3 h-10 w-3/4 rounded bg-white/18" /><div className="mt-5 hidden space-y-2 sm:block"><Skeleton className="h-3.5 w-full rounded bg-white/14" /><Skeleton className="h-3.5 w-4/5 rounded bg-white/14" /></div><div className="mt-6 border-t border-white/15 pt-5"><MetaSkeleton dark /></div></div></article>;
}

function CompactSkeleton() {
  return <article className="grid grid-cols-[104px_minmax(0,1fr)] gap-4 rounded-2xl p-1 sm:grid-cols-[124px_minmax(0,1fr)]"><Skeleton className="aspect-square rounded-[15px]" /><div className="min-w-0 self-center py-1"><Skeleton className="h-3 w-20 rounded" /><Skeleton className="mt-3 h-4 w-full rounded" /><Skeleton className="mt-2 h-4 w-4/5 rounded" /><Skeleton className="mt-3 h-2.5 w-28 rounded" /></div></article>;
}

function HorizontalSkeleton() {
  return <article className="grid overflow-hidden rounded-[22px] border border-(--border-subtle) sm:grid-cols-[240px_minmax(0,1fr)]"><Skeleton className="aspect-[16/10] w-full sm:aspect-auto sm:min-h-48" /><div className="flex min-w-0 flex-col p-5 sm:p-6"><Skeleton className="h-3 w-20 rounded" /><Skeleton className="mt-4 h-5 w-[92%] rounded" /><Skeleton className="mt-2 h-5 w-2/3 rounded" /><Skeleton className="mt-4 h-3.5 w-full rounded" /><Skeleton className="mt-2 h-3.5 w-4/5 rounded" /><div className="mt-5"><MetaSkeleton /></div></div></article>;
}
