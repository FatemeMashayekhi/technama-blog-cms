import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export default function Loading() {
  return (
    <div className="public-site min-h-screen" aria-busy="true" aria-label="در حال بارگذاری برچسب‌ها">
      <PublicHeader />
      <main id="main-content">
        <div className="border-b border-(--border) bg-(--public-paper)"><div className="mx-auto max-w-360 px-4 py-16 md:px-7 md:py-22"><div className="h-4 w-32 animate-pulse rounded-full bg-(--surface-muted)" /><div className="mt-6 h-14 max-w-2xl animate-pulse rounded-2xl bg-(--surface-muted)" /><div className="mt-4 h-6 max-w-xl animate-pulse rounded-xl bg-(--surface-muted)" /></div></div>
        <section className="mx-auto max-w-360 px-4 py-12 md:px-7 md:py-16"><div className="h-10 w-64 animate-pulse rounded-xl bg-(--surface-muted)" /><div className="mt-7 grid gap-4 lg:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-58 animate-pulse rounded-[24px] border border-(--border) bg-white" />)}</div><div className="mt-16 h-12 max-w-sm animate-pulse rounded-2xl bg-(--surface-muted)" /><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-44 animate-pulse rounded-[22px] border border-(--border) bg-white" />)}</div></section>
      </main>
      <PublicFooter />
    </div>
  );
}
