import { BarChart3, BookOpenText, CheckCircle2, FileText } from "lucide-react";
import { ActivityList } from "@/components/dashboard/activity-list";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentArticles } from "@/components/dashboard/recent-articles";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { formatDashboardNumber } from "@/lib/dashboard-data";
import { getDashboardOverview } from "@/lib/dashboard-service";

const statIcons = { total: BookOpenText, published: CheckCircle2, draft: FileText, views: BarChart3 };

export default async function DashboardPage() {
  const dashboard = await getDashboardOverview();
  const firstName = dashboard.user.name.trim().split(/\s+/)[0] || dashboard.user.name;
  const persianYear = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", timeZone: "Asia/Tehran" }).format(new Date(dashboard.generatedAt));

  return (
    <DashboardLayout searchItems={dashboard.searchItems} notifications={dashboard.notifications} pendingCommentCount={dashboard.pendingCommentCount}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-xl font-bold tracking-[-.03em] text-(--text-strong) sm:text-2xl">سلام {firstName}، <span aria-hidden="true">👋</span></h2><p className="mt-2 text-xs text-[var(--muted)]">این نمای کلی عملکرد مجله شماست.</p></div><div className="flex items-center gap-2 text-[13px] text-(--text-muted)"><span className="size-1.5 rounded-full bg-(--brand-teal)" /><span>داده‌ها همین حالا به‌روز شدند</span></div></div>
      <section aria-label="خلاصه عملکرد" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{dashboard.stats.map((stat) => <StatCard key={stat.id} label={stat.label} value={formatDashboardNumber(stat.value, stat.id === "views")} detail={stat.detail} icon={statIcons[stat.id]} accent={stat.accent} />)}</section>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3"><AnalyticsChart generatedAt={dashboard.generatedAt} /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><QuickActions /><ActivityList activities={dashboard.activities} /></div></div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3"><RecentArticles articles={dashboard.articles.slice(0, 6)} /></div>
      <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-5 text-[12px] text-(--text-muted)"><span>© {persianYear} تک‌نما — پنل مدیریت تحریریه</span><span>نسخه ۱٫۰٫۰</span></footer>
    </DashboardLayout>
  );
}
