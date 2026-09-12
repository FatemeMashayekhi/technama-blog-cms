export default function EditorLoading() {
  return <div className="min-h-screen bg-(--surface-subtle) lg:mr-67" dir="rtl"><div className="h-19 border-b border-(--border-subtle) bg-white" /><main className="mx-auto max-w-380 p-4 md:p-7 lg:p-8"><div className="h-20 animate-pulse rounded-(--radius) bg-white" /><div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]"><div className="space-y-4"><div className="h-56 animate-pulse rounded-(--radius) border border-(--border) bg-white" /><div className="h-[580px] animate-pulse rounded-(--radius) border border-(--border) bg-white" /></div><div className="space-y-3">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-44 animate-pulse rounded-(--radius) border border-(--border) bg-white" />)}</div></div></main></div>;
}

