import { FileDown, Send, Trash2, X } from "lucide-react";

type BulkActionsProps = {
  count: number;
  onPublish: () => void;
  onDraft: () => void;
  onDelete: () => void;
  onClear: () => void;
};

export function BulkActions({ count, onPublish, onDraft, onDelete, onClear }: BulkActionsProps) {
  if (!count) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-(--radius) border border-(--border-strong) bg-(--surface-muted) p-2.5" role="toolbar" aria-label="عملیات گروهی">
      <div className="ml-auto flex items-center gap-2 px-1 text-[14px] font-bold text-(--brand-teal)">
        <button type="button" onClick={onClear} aria-label="لغو انتخاب" title="لغو انتخاب" className="grid size-10 place-items-center rounded-md hover:bg-(--accent-soft)"><X size={15} /></button>
        {new Intl.NumberFormat("fa-IR").format(count)} مقاله انتخاب شده
      </div>
      <button type="button" onClick={onPublish} className="flex h-10 items-center gap-1.5 rounded-md border border-(--border-strong) bg-white px-2.5 text-[13px] font-bold text-(--brand-teal) hover:bg-(--accent-soft)"><Send size={13} /> انتشار</button>
      <button type="button" onClick={onDraft} className="flex h-10 items-center gap-1.5 rounded-md border border-(--border-strong) bg-white px-2.5 text-[13px] font-bold text-(--text-secondary) hover:bg-(--surface-muted)"><FileDown size={13} /> انتقال به پیش‌نویس</button>
      <button type="button" onClick={onDelete} className="flex h-10 items-center gap-1.5 rounded-md border border-(--danger-border) bg-white px-2.5 text-[13px] font-bold text-(--danger) hover:bg-(--danger-soft)"><Trash2 size={13} /> حذف</button>
    </div>
  );
}

