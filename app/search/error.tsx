"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function SearchError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-[65vh] place-items-center bg-(--surface-subtle) px-4 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-(--danger-soft) text-(--danger)"><AlertTriangle size={26}/></span><h1 className="mt-5 text-xl font-black text-(--text-strong)">جست‌وجو انجام نشد</h1><p className="mt-2 text-[13px] leading-6 text-(--text-muted)">یک خطای موقت رخ داده است. دوباره تلاش کنید یا به صفحه اصلی برگردید.</p><div className="mt-6 flex justify-center gap-2"><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-4 py-2.5 text-[12px] font-bold text-white"><RotateCcw size={13}/>تلاش دوباره</button><Link href="/" className="inline-flex rounded-(--radius-sm) border border-(--border-strong) bg-white px-4 py-2.5 text-[12px] font-bold text-(--text-secondary)">صفحه اصلی</Link></div></div></main>;
}
