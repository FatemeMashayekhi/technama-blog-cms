import { Activity } from "lucide-react";
import Link from "next/link";
import type { DashboardActivity } from "@/lib/dashboard-data";

export function ActivityList({ activities }: { activities: DashboardActivity[] }) {
  return (
    <section className="rounded-(--radius) border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">آخرین فعالیت‌ها</h2><p className="mt-1 text-[13px] text-(--muted)">همکاری اعضای تحریریه</p></div><span className="size-2 rounded-full bg-(--brand-teal) ring-4 ring-(--focus-border)" /></div>
      {activities.length ? <div className="mt-5 space-y-5">{activities.map((item, index) => <Link href={item.href} key={item.id} className="group relative flex gap-3 rounded-lg"><span className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-bold ${item.color}`}>{item.avatar}</span>{index < activities.length - 1 && <span className="absolute right-5 top-9 h-[calc(100%+12px)] w-px bg-(--surface-muted)" />}<span className="min-w-0 pt-0.5"><span className="text-[13px] leading-6 text-(--text-secondary)"><strong className="text-(--text-strong) group-hover:text-(--brand-teal)">{item.name}</strong>{" "}{item.action}</span><time className="mt-1 block text-[11px] text-(--text-muted)">{item.time}</time></span></Link>)}</div> : <div className="grid min-h-48 place-items-center text-center"><div><Activity size={22} className="mx-auto text-(--text-faint)" /><p className="mt-3 text-[12px] font-bold text-(--text-secondary)">هنوز فعالیتی ثبت نشده است</p></div></div>}
    </section>
  );
}
