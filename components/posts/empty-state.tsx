import Link from "next/link";
import { FileSearch, Plus } from "lucide-react";

type EmptyStateProps = {
  hasArticles: boolean;
  onReset: () => void;
};

export function PostsEmptyState({ hasArticles, onReset }: EmptyStateProps) {
  return (
    <div className="grid min-h-80 place-items-center px-5 py-12 text-center">
      <div className="max-w-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-(--radius) bg-(--surface-muted) text-(--text-secondary)"><FileSearch size={22} strokeWidth={1.7} /></span>
        <h3 className="mt-4 text-sm font-bold text-(--text-strong)">{hasArticles ? "مقاله‌ای پیدا نشد" : "هنوز مقاله‌ای ایجاد نکرده‌اید"}</h3>
        <p className="mt-2 text-[14px] leading-6 text-(--text-muted)">{hasArticles ? "فیلترها یا عبارت جست‌وجو را تغییر دهید و دوباره امتحان کنید." : "اولین مقاله مجله را ایجاد کنید و جریان محتوای تحریریه را آغاز کنید."}</p>
        {hasArticles ? <button type="button" onClick={onReset} className="mt-5 h-10 rounded-(--radius-sm) border border-(--border) px-4 text-xs font-bold text-(--text-secondary) hover:bg-(--surface-subtle)">پاک‌کردن فیلترها</button> : <Link href="/admin/posts/new" className="mt-5 inline-flex h-10 items-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-4 text-xs font-bold text-white hover:bg-(--brand-navy-hover)"><Plus size={15} /> ایجاد مقاله جدید</Link>}
      </div>
    </div>
  );
}

