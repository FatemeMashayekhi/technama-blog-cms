"use client";

import Link from "next/link";
import { CheckCircle2, Copy, Eye, MoreHorizontal, PenLine, RefreshCcw, Trash2 } from "lucide-react";
import { useRef } from "react";
import type { PostArticle } from "@/lib/posts-data";

type ArticleActionsProps = {
  article: PostArticle;
  onDelete: () => void;
  onStatusChange: () => void;
  onCopy: () => void;
};

export function ArticleActions({ article, onDelete, onStatusChange, onCopy }: ArticleActionsProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const close = () => detailsRef.current?.removeAttribute("open");

  return (
    <details ref={detailsRef} className="relative">
      <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--surface-muted) hover:text-(--text-strong) [&::-webkit-details-marker]:hidden" aria-label={`عملیات ${article.title}`} title="عملیات">
        <MoreHorizontal size={18} />
      </summary>
      <div className="absolute left-0 top-9 z-30 w-44 rounded-(--radius) border border-(--border) bg-white p-1.5 text-right shadow-[0_12px_30px_rgba(23,38,48,.13)]">
        <Link href={`/articles/${article.slug}`} onClick={close} className="flex h-10 items-center gap-2 rounded-md px-2.5 text-[14px] text-(--text-secondary) hover:bg-(--surface-muted)"><Eye size={14} /> مشاهده عمومی</Link>
        <Link href={`/admin/posts/${article.id}/edit`} onClick={close} className="flex h-10 items-center gap-2 rounded-md px-2.5 text-[14px] text-(--text-secondary) hover:bg-(--surface-muted)"><PenLine size={14} /> ویرایش</Link>
        <button type="button" onClick={() => { onCopy(); close(); }} className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-[14px] text-(--text-secondary) hover:bg-(--surface-muted)"><Copy size={14} /> کپی لینک</button>
        <button type="button" onClick={() => { onStatusChange(); close(); }} className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-[14px] text-(--text-secondary) hover:bg-(--surface-muted)">{article.status === "published" ? <RefreshCcw size={14} /> : <CheckCircle2 size={14} />} تغییر وضعیت</button>
        <div className="my-1 border-t border-(--border-subtle)" />
        <button type="button" onClick={() => { onDelete(); close(); }} className="flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-[14px] font-bold text-(--danger) hover:bg-(--danger-soft)"><Trash2 size={14} /> حذف</button>
      </div>
    </details>
  );
}
