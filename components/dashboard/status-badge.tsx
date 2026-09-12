import type { ArticleStatus } from "@/lib/dashboard-data";

const styles: Record<ArticleStatus, { label: string; className: string }> = {
  published: { label: "منتشر شده", className: "bg-(--accent-soft) text-(--brand-teal)" },
  draft: { label: "پیش‌نویس", className: "bg-(--surface-muted) text-(--text-secondary)" },
  review: {
    label: "در انتظار بررسی",
    className: "bg-(--warning-soft) text-(--warning)",
  },
};

export function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  const item = styles[status];
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md px-2.5 py-1 text-[13px] font-bold ${item.className}`}
    >
      {item.label}
    </span>
  );
}
