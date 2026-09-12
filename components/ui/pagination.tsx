import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  pageCount: number;
  start: number;
  end: number;
  total: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  ariaLabel?: string;
};

export function Pagination({ page, pageCount, start, end, total, onPageChange, itemLabel = "مقاله", ariaLabel = "صفحه‌بندی مقالات" }: PaginationProps) {
  if (!total) return null;
  const formatter = new Intl.NumberFormat("fa-IR");

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-(--border-subtle) px-4 py-4 text-[13px] text-(--text-muted) sm:flex-row sm:px-6">
      <p>نمایش {formatter.format(start)} تا {formatter.format(end)} از {formatter.format(total)} {itemLabel}</p>
      <nav className="flex items-center gap-1" aria-label={ariaLabel}>
        <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)} className="flex h-10 items-center gap-1 rounded-md border border-(--border) px-2.5 font-bold text-(--text-secondary) hover:bg-(--surface-subtle) disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={13} /> قبلی</button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <button type="button" key={item} onClick={() => onPageChange(item)} aria-current={item === page ? "page" : undefined} aria-label={`صفحه ${formatter.format(item)}`} className={`grid size-10 place-items-center rounded-md font-bold ${item === page ? "bg-(--brand-navy) text-white" : "text-(--text-secondary) hover:bg-(--surface-muted)"}`}>{formatter.format(item)}</button>)}
        <button type="button" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} className="flex h-10 items-center gap-1 rounded-md border border-(--border) px-2.5 font-bold text-(--text-secondary) hover:bg-(--surface-subtle) disabled:cursor-not-allowed disabled:opacity-40">بعدی <ChevronLeft size={13} /></button>
      </nav>
    </div>
  );
}
