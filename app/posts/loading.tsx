import { ArticlesTableSkeleton } from "@/components/posts/articles-table-skeleton";

export default function PostsLoading() {
  return (
    <div className="min-h-screen bg-(--surface-subtle) lg:mr-67" dir="rtl">
      <div className="h-19 border-b border-(--border-subtle) bg-white" />
      <main className="mx-auto max-w-380 p-4 md:p-7 lg:p-8">
        <div className="space-y-3"><div className="h-7 w-28 animate-pulse rounded bg-(--surface-muted)" /><div className="h-3 w-64 animate-pulse rounded bg-(--surface-muted)" /></div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 animate-pulse rounded-(--radius) border border-(--border) bg-white" />)}</div>
        <div className="mt-4 h-24 animate-pulse rounded-(--radius) border border-(--border) bg-white" />
        <div className="mt-3"><ArticlesTableSkeleton /></div>
      </main>
    </div>
  );
}

