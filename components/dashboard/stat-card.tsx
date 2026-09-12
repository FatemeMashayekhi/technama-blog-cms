import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <article className="group rounded-(--radius) border border-(--border) bg-white p-4 transition-colors hover:border-(--border-strong) sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-(--text-secondary)">{label}</p>
          <strong className="mt-3 block text-[26px] font-bold tracking-[-.04em] text-(--text-strong)">
            {value}
          </strong>
        </div>
        <span
          className={`grid size-10 place-items-center rounded-(--radius) ${accent ? "bg-(--accent-soft) text-(--accent)" : "bg-(--surface-muted) text-(--text-secondary)"}`}
        >
          <Icon size={19} strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-3 text-[13px] text-(--text-muted)">
        <span className="ml-1 font-bold text-(--brand-teal)">↑ {trend}</span> نسبت به
        ماه گذشته
      </p>
    </article>
  );
}
