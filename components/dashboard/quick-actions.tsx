import { ExternalLink, ImageUp, PenLine, UserPlus } from "lucide-react";
import Link from "next/link";

const actions = [
  { label: "ایجاد مقاله جدید", description: "شروع یک پیش‌نویس تازه", icon: PenLine, href: "/admin/posts/new", primary: true },
  { label: "افزودن نویسنده", description: "دعوت عضو جدید تحریریه", icon: UserPlus, href: "/admin/authors/new" },
  { label: "آپلود رسانه", description: "رفتن به کتابخانه رسانه", icon: ImageUp, href: "/admin/media" },
  { label: "مشاهده سایت", description: "بازکردن نسخه عمومی", icon: ExternalLink, href: "/", external: true },
];

export function QuickActions() {
  return (
    <section className="rounded-(--radius) border border-(--border) bg-white p-4 sm:p-5">
      <h2 className="text-sm font-bold">دسترسی سریع</h2>
      <p className="mt-1 text-[13px] text-(--muted)">کارهای پرتکرار تحریریه</p>
      <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-1">
        {actions.map((action) => (
          <Link key={action.label} href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined} className={`group flex min-h-12 items-center gap-3 rounded-(--radius-sm) border px-3 text-right transition-colors ${action.primary ? "border-(--brand-teal) bg-(--brand-navy) text-white hover:bg-(--brand-navy-hover)" : "border-(--border) text-(--text-secondary) hover:border-(--border-strong) hover:bg-(--surface-subtle)"}`}>
            <action.icon size={17} strokeWidth={1.8} className="shrink-0" />
            <span className="min-w-0 flex-1"><strong className="block text-[13px]">{action.label}</strong><span className={`mt-0.5 hidden truncate text-[11px] xl:block ${action.primary ? "text-white/55" : "text-(--text-muted)"}`}>{action.description}</span></span>
            <span aria-hidden="true" className="text-[14px] opacity-45 transition-transform group-hover:-translate-x-0.5">←</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
