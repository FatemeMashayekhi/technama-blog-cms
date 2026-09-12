import { ExternalLink, ImageUp, PenLine, UserPlus } from "lucide-react";

const actions = [
  { label: "ایجاد مقاله جدید", icon: PenLine },
  { label: "افزودن نویسنده", icon: UserPlus },
  { label: "آپلود رسانه", icon: ImageUp },
  { label: "مشاهده سایت", icon: ExternalLink },
];

export function QuickActions() {
  return (
    <section className="rounded-(--radius) border border-(--border) bg-white p-4 sm:p-5">
      <h2 className="text-sm font-bold">دسترسی سریع</h2>
      <p className="mt-1 text-[13px] text-(--muted)">کارهای پرتکرار تحریریه</p>
      <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-1">
        {actions.map((action, index) => (
          <button
            key={action.label}
            className={`flex h-11 items-center gap-3 rounded-(--radius-sm) border px-3 text-right text-[14px] font-bold transition-colors ${index === 0 ? "border-(--brand-teal) bg-(--brand-navy) text-white hover:bg-(--brand-navy-hover)" : "border-(--border) text-(--text-secondary) hover:border-(--border-strong) hover:bg-(--surface-subtle)"}`}
          >
            <action.icon size={17} strokeWidth={1.8} />
            <span className="flex-1">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
