"use client";

import { AlertCircle } from "lucide-react";

export function UnsavedChangesDialog({ open, saving, onCancel, onDiscard, onSave }: { open: boolean; saving: boolean; onCancel: () => void; onDiscard: () => void; onSave: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-(--brand-navy)/45 p-4 backdrop-blur-[1px]"><section role="alertdialog" aria-modal="true" aria-labelledby="unsaved-title" className="w-full max-w-[460px] rounded-(--radius-lg) border border-(--border) bg-white p-6 shadow-[0_24px_70px_rgba(16,24,32,.22)]"><div className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-(--radius) bg-(--warning-soft) text-(--warning)"><AlertCircle size={19} /></span><div><h2 id="unsaved-title" className="text-sm font-bold text-(--text-strong)">تغییرات ذخیره نشده‌اند</h2><p className="mt-2 text-[14px] leading-6 text-(--text-secondary)">آیا می‌خواهید قبل از خروج تغییرات را ذخیره کنید؟</p></div></div><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} className="h-10 rounded-(--radius-sm) border border-(--border) px-3 text-[13px] font-bold text-(--text-secondary) hover:bg-(--surface-subtle)">انصراف</button><button type="button" onClick={onDiscard} className="h-10 rounded-(--radius-sm) px-3 text-[13px] font-bold text-(--danger) hover:bg-(--danger-soft)">خروج بدون ذخیره</button><button type="button" onClick={onSave} disabled={saving} className="h-10 rounded-(--radius-sm) bg-(--brand-navy) px-4 text-[13px] font-bold text-white hover:bg-(--brand-navy-hover) disabled:opacity-60">{saving ? "در حال ذخیره..." : "ذخیره و خروج"}</button></div></section></div>;
}

