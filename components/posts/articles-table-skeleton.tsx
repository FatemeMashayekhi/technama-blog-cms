export function ArticlesTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-(--radius) border border-(--border) bg-white" role="status" aria-label="در حال بارگذاری مقالات">
      <div className="h-12 animate-pulse border-b border-(--border-subtle) bg-(--surface-subtle)" />
      <div className="hidden divide-y divide-[#edf0f2] lg:block">{Array.from({ length: 7 }, (_, index) => <div key={index} className="grid h-20 grid-cols-[36px_2fr_1fr_1fr_1fr_80px] items-center gap-5 px-5"><span className="size-3.5 animate-pulse rounded bg-(--surface-muted)" /><span className="h-10 animate-pulse rounded-lg bg-(--surface-muted)" /><span className="h-3 animate-pulse rounded bg-(--surface-muted)" /><span className="h-3 animate-pulse rounded bg-(--surface-muted)" /><span className="h-6 animate-pulse rounded-md bg-(--surface-muted)" /><span className="h-3 animate-pulse rounded bg-(--surface-muted)" /></div>)}</div>
      <div className="divide-y divide-[#edf0f2] lg:hidden">{Array.from({ length: 5 }, (_, index) => <div key={index} className="flex h-28 items-start gap-3 p-4"><span className="mt-4 size-4 animate-pulse rounded bg-(--surface-muted)" /><span className="size-12 animate-pulse rounded-(--radius-sm) bg-(--surface-muted)" /><div className="flex-1 space-y-3 pt-1"><span className="block h-3 animate-pulse rounded bg-(--surface-muted)" /><span className="block h-3 w-2/3 animate-pulse rounded bg-(--surface-muted)" /><span className="block h-5 w-20 animate-pulse rounded bg-(--surface-muted)" /></div></div>)}</div>
      <span className="sr-only">در حال بارگذاری...</span>
    </div>
  );
}

