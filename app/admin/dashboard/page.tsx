import { BarChart3, BookOpenText, CheckCircle2, FileText } from "lucide-react";
import { ActivityList } from "@/components/dashboard/activity-list";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentArticles } from "@/components/dashboard/recent-articles";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const stats = [
  { label: "مجموع مقالات", value: "۱۲۸", trend: "۱۲٪", icon: BookOpenText },
  { label: "منتشر شده", value: "۹۶", trend: "۸٪", icon: CheckCircle2, accent: true },
  { label: "پیش‌نویس‌ها", value: "۱۸", trend: "۳٪", icon: FileText },
  { label: "بازدید ماه جاری", value: "۲۸٫۶K", trend: "۱۸٪", icon: BarChart3, accent: true },
];

export default function DashboardPage() {
  return <DashboardLayout><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-xl font-bold tracking-[-.03em] text-(--text-strong) sm:text-2xl">سلام، مریم <span aria-hidden="true">👋</span></h2><p className="mt-2 text-xs text-[var(--muted)]">این نمای کلی عملکرد مجله شماست.</p></div><div className="flex items-center gap-2 text-[13px] text-(--text-muted)"><span className="size-1.5 rounded-full bg-(--brand-teal)"/><span>داده‌ها همین حالا به‌روز شدند</span></div></div>
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} {...stat}/>)}</section>
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3"><AnalyticsChart/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><QuickActions/><ActivityList/></div></div>
    <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3"><RecentArticles/></div>
    <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-5 text-[12px] text-(--text-muted)"><span>© ۱۴۰۵ تک‌نما — پنل مدیریت تحریریه</span><span>نسخه ۱٫۰٫۰</span></footer>
  </DashboardLayout>;
}

