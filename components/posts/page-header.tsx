import Link from "next/link";
import { Plus } from "lucide-react";

export function PostsPageHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-[13px] font-bold text-(--accent)">مدیریت محتوا</p>
        <h2 className="text-xl font-bold tracking-[-.03em] text-(--text-strong) sm:text-2xl">
          مقالات
        </h2>
        <p className="mt-2 text-xs text-(--muted)">
          مدیریت، ویرایش و انتشار محتوای مجله
        </p>
      </div>
      <Link
        href="/admin/posts/new"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-4 text-xs font-bold text-white transition-colors hover:bg-(--brand-navy-hover) focus-visible:outline-(--brand-teal)"
      >
        <Plus size={17} strokeWidth={2.2} />
        ایجاد مقاله جدید
      </Link>
    </div>
  );
}

