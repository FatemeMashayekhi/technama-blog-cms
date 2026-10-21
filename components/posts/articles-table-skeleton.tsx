import { LoadingStatus, Skeleton } from "@/components/ui/skeleton";

export function ArticlesTableSkeleton() {
  return <LoadingStatus label="در حال بارگذاری صفحه مقالات" className="mt-6 space-y-4">
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => <div key={index} className="rounded-(--radius) border border-(--border) bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4"><div className="space-y-3"><Skeleton className="h-3 w-24 rounded"/><Skeleton className="h-7 w-16 rounded-md"/><Skeleton className="h-3 w-20 rounded"/></div><Skeleton className="size-11 rounded-(--radius-sm)"/></div>
      </div>)}
    </section>

    <section className="rounded-(--radius) border border-(--border) bg-white p-3 sm:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center"><Skeleton className="h-10 flex-1 rounded-(--radius-sm)"/><div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:flex">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-10 min-w-36 rounded-(--radius-sm)"/>)}</div></div>
      <div className="mt-3 flex min-h-7 items-center justify-between border-t border-(--border-subtle) pt-3"><Skeleton className="h-3 w-20 rounded"/><Skeleton className="h-3 w-16 rounded"/></div>
    </section>

    <section className="overflow-hidden rounded-(--radius) border border-(--border) bg-white">
      <div className="hidden lg:block">
        <div className="grid h-12 grid-cols-[48px_32fr_17fr_13fr_13fr_9fr_12fr_48px] items-center gap-3 border-b border-(--border-subtle) bg-(--surface-subtle) px-3">{Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className={`h-3 rounded ${index === 0 || index === 7 ? "w-4" : "w-3/4"}`}/>)}</div>
        <div className="divide-y divide-[#edf0f2]">{Array.from({ length: 8 }, (_, row) => <div key={row} className="grid min-h-20 grid-cols-[48px_32fr_17fr_13fr_13fr_9fr_12fr_48px] items-center gap-3 px-3"><Skeleton className="size-3.5 rounded"/><div className="flex min-w-0 items-center gap-3"><Skeleton className="size-12 shrink-0 rounded-(--radius-sm)"/><div className="min-w-0 flex-1 space-y-2"><Skeleton className="h-3 w-4/5 rounded"/><Skeleton className="h-2.5 w-1/2 rounded"/></div></div><div className="flex items-center gap-2"><Skeleton className="size-7 shrink-0 rounded-full"/><Skeleton className="h-3 w-2/3 rounded"/></div><Skeleton className="h-3 w-3/4 rounded"/><Skeleton className="h-6 w-20 rounded-full"/><Skeleton className="h-3 w-12 rounded"/><Skeleton className="h-3 w-16 rounded"/><Skeleton className="size-10 rounded-lg"/></div>)}</div>
      </div>

      <div className="lg:hidden"><div className="flex h-12 items-center justify-between border-b border-(--border-subtle) bg-(--surface-subtle) px-4"><Skeleton className="h-3 w-28 rounded"/><Skeleton className="h-3 w-14 rounded"/></div><div className="divide-y divide-[#edf0f2]">{Array.from({ length: 5 }, (_, index) => <div key={index} className="p-4"><div className="flex items-start gap-3"><Skeleton className="mt-4 size-4 shrink-0 rounded"/><Skeleton className="size-12 shrink-0 rounded-(--radius-sm)"/><div className="min-w-0 flex-1 space-y-3 pt-1"><Skeleton className="h-3 w-5/6 rounded"/><div className="flex gap-2"><Skeleton className="h-6 w-20 rounded-full"/><Skeleton className="h-3 w-16 rounded"/></div></div><Skeleton className="size-10 shrink-0 rounded-lg"/></div><div className="mt-3 flex items-center justify-between border-t border-(--border-subtle) pt-3"><Skeleton className="h-3 w-24 rounded"/><Skeleton className="h-3 w-16 rounded"/></div></div>)}</div></div>

      <div className="flex min-h-16 items-center justify-between border-t border-(--border-subtle) px-4"><Skeleton className="h-3 w-28 rounded"/><div className="flex gap-2"><Skeleton className="size-10 rounded-lg"/><Skeleton className="size-10 rounded-lg"/><Skeleton className="size-10 rounded-lg"/></div></div>
    </section>
  </LoadingStatus>;
}
