"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef } from "react";

type DeleteConfirmationDialogProps = {
  open: boolean;
  count: number;
  articleTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmationDialog({ open, count, articleTitle, onCancel, onConfirm }: DeleteConfirmationDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-(--brand-navy)/45 p-4 backdrop-blur-[1px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description" className="w-full max-w-[430px] rounded-(--radius-lg) border border-(--border) bg-white p-5 shadow-[0_24px_70px_rgba(16,24,32,.22)] sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-(--radius) bg-(--danger-soft) text-(--danger)"><AlertTriangle size={19} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3"><h2 id="delete-title" className="text-sm font-bold text-(--text-strong)">حذف مقاله{count > 1 ? "‌ها" : ""}</h2><button type="button" onClick={onCancel} aria-label="بستن" className="grid size-10 place-items-center rounded-lg text-(--text-muted) hover:bg-(--surface-muted)"><X size={17} /></button></div>
            <p id="delete-description" className="mt-3 text-[14px] leading-6 text-(--text-secondary)">{count > 1 ? `آیا مطمئن هستید که می‌خواهید ${new Intl.NumberFormat("fa-IR").format(count)} مقاله انتخاب‌شده را حذف کنید؟` : <>آیا مطمئن هستید که می‌خواهید مقاله «<strong className="font-bold text-(--text-strong)">{articleTitle}</strong>» را حذف کنید؟</>}</p>
            <p className="mt-1 text-[13px] text-(--text-secondary)">این عملیات قابل بازگشت نیست.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button ref={cancelRef} type="button" onClick={onCancel} className="h-10 rounded-(--radius-sm) border border-(--border) px-4 text-xs font-bold text-(--text-secondary) hover:bg-(--surface-subtle)">انصراف</button>
          <button type="button" onClick={onConfirm} className="h-10 rounded-(--radius-sm) bg-(--danger) px-4 text-xs font-bold text-white hover:bg-(--danger)">حذف مقاله{count > 1 ? "‌ها" : ""}</button>
        </div>
      </section>
    </div>
  );
}
