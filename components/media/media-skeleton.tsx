export function MediaSkeleton() {
  return <div className="space-y-5" aria-label="در حال بارگذاری رسانه‌ها" aria-busy="true"><div className="h-38 animate-pulse rounded-(--radius) border border-(--border) bg-white"/><div className="h-18 animate-pulse rounded-(--radius) border border-(--border) bg-white"/><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{Array.from({ length: 10 }, (_, index) => <div key={index} className="overflow-hidden rounded-(--radius) border border-(--border) bg-white"><div className="aspect-4/3 animate-pulse bg-(--surface-muted)"/><div className="space-y-2 p-3"><div className="h-3 w-4/5 animate-pulse rounded bg-(--surface-muted)"/><div className="h-2 w-2/3 animate-pulse rounded bg-(--surface-muted)"/></div></div>)}</div></div>;
}

