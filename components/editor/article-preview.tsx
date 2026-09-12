"use client";

import { X } from "lucide-react";
import { useMemo } from "react";
import { editorAuthors, type ArticleFormData } from "@/lib/article-editor";
import { sanitizeEditorHtml } from "@/lib/sanitize-editor-html";

type Props = {
  open: boolean;
  data: ArticleFormData;
  readingTime: number;
  onClose: () => void;
};

export function ArticlePreview({ open, data, readingTime, onClose }: Props) {
  const safeContent = useMemo(() => {
    const fallback = "<p>محتوای مقاله در این قسمت نمایش داده می‌شود.</p>";
    return sanitizeEditorHtml(data.content || fallback);
  }, [data.content]);

  if (!open) return null;
  const author = editorAuthors.find((item) => item.id === data.authorId);

  return (
    <div className="fixed inset-0 z-[75] overflow-y-auto bg-(--surface-muted) p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="preview-title">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-(--radius-lg) border border-(--border) bg-white shadow-[0_24px_70px_rgba(16,24,32,.18)]">
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-(--border) bg-white/95 px-4 backdrop-blur">
          <span className="text-[13px] font-bold text-(--text-secondary)">پیش‌نمایش امن مقاله</span>
          <button type="button" onClick={onClose} className="flex h-10 items-center gap-1.5 rounded-(--radius-sm) border border-(--border) px-3 text-[13px] font-bold text-(--text-secondary) hover:bg-(--surface-subtle)"><X size={14}/> بستن پیش‌نمایش</button>
        </div>
        {data.featuredImage && <div className="aspect-[16/7] w-full bg-cover bg-center" style={{ backgroundImage: `url(${data.featuredImage})` }} role="img" aria-label="تصویر شاخص مقاله"/>}
        <article className="mx-auto max-w-2xl px-6 py-10 sm:px-10 sm:py-14">
          <div className="flex items-center gap-2 text-[13px] text-(--text-secondary)">
            <span className="font-bold text-(--accent)">{data.categoryId || "بدون دسته‌بندی"}</span><span>•</span><span>{new Intl.NumberFormat("fa-IR").format(readingTime)} دقیقه مطالعه</span>
          </div>
          <h1 id="preview-title" className="mt-4 text-2xl font-bold leading-[1.6] tracking-[-.03em] text-(--text-strong) sm:text-4xl">{data.title || "عنوان مقاله"}</h1>
          <p className="mt-4 text-sm leading-7 text-(--text-secondary)">{data.excerpt}</p>
          <div className="mt-6 flex items-center gap-2 border-b border-(--border-subtle) pb-6">
            <span className="grid size-10 place-items-center rounded-full bg-(--surface-muted) text-[13px] font-bold text-(--brand-teal)">{author?.initials ?? "—"}</span>
            <div><strong className="block text-[13px] text-(--text-strong)">{author?.name ?? "بدون نویسنده"}</strong><span className="mt-1 block text-[14px] text-(--text-muted)">۱۸ شهریور ۱۴۰۵</span></div>
          </div>
          <div className="tiptap pt-5" dangerouslySetInnerHTML={{ __html: safeContent }}/>
        </article>
      </div>
    </div>
  );
}
