import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export function CategoryPageSkeleton() {
  return <main aria-busy="true" aria-label="در حال بارگذاری دسته‌بندی" className="mx-auto min-h-[70vh] max-w-360 animate-pulse px-4 py-10 md:px-7"><div className="h-4 w-44 rounded bg-(--surface-muted)"/><div className="mt-10 h-10 w-64 rounded bg-(--surface-muted)"/><div className="mt-4 h-4 max-w-xl rounded bg-(--surface-muted)"/><div className="mt-12 grid gap-5 lg:grid-cols-3"><div className="h-105 rounded-2xl bg-(--surface-muted) lg:col-span-2"/><div className="h-105 rounded-2xl bg-(--surface-muted)"/></div></main>;
}

export function CategoryErrorState() {
  return <main className="grid min-h-[65vh] place-items-center px-4 text-center"><div><AlertTriangle className="mx-auto text-(--danger)" size={36}/><h1 className="mt-4 text-xl font-black text-(--text-strong)">نمایش دسته‌بندی ممکن نشد</h1><p className="mt-2 text-[13px] leading-6 text-(--text-muted)">لطفاً دوباره تلاش کنید یا از صفحه اصلی به مطالعه ادامه دهید.</p><Link href="/" className="mt-5 inline-flex rounded-(--radius-sm) bg-(--brand-navy) px-4 py-2.5 text-[12px] font-bold text-white">بازگشت به خانه</Link></div></main>;
}
