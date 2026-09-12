const pulse = "animate-pulse rounded-(--radius) border border-(--border-subtle) bg-white";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-(--surface-subtle) lg:mr-[268px]" dir="rtl" aria-label="در حال بارگذاری داشبورد" role="status">
      <div className="h-[76px] border-b border-(--border-subtle) bg-white" />
      <main className="mx-auto max-w-[1520px] p-4 md:p-7 lg:p-8">
        <div className="mb-7 space-y-3">
          <div className="h-7 w-44 animate-pulse rounded bg-(--surface-muted)" />
          <div className="h-3 w-60 animate-pulse rounded bg-(--surface-muted)" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className={`${pulse} h-[146px]`} />)}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className={`${pulse} h-[396px] lg:col-span-2`} />
          <div className={`${pulse} h-[396px]`} />
        </div>
        <div className={`${pulse} mt-4 h-[330px]`} />
        <span className="sr-only">در حال بارگذاری...</span>
      </main>
    </div>
  );
}

