"use client";

import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { dashboardRangeLabels, formatDashboardNumber, getDashboardAnalytics, type AnalyticsRange } from "@/lib/dashboard-data";

const ranges: AnalyticsRange[] = ["7d", "30d", "90d"];

function chartGeometry(values: number[]) {
  const width = 900;
  const height = 220;
  const paddingX = 10;
  const paddingY = 16;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1);
  const coords = values.map((value, index) => ({
    x: paddingX + (index / Math.max(values.length - 1, 1)) * (width - paddingX * 2),
    y: height - paddingY - ((value - min) / spread) * (height - paddingY * 2),
  }));
  const points = coords.map((point) => `${point.x},${point.y}`).join(" ");
  return { coords, points, area: `${paddingX},${height - paddingY} ${points} ${width - paddingX},${height - paddingY}` };
}

export function AnalyticsChart({ generatedAt }: { generatedAt: string }) {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const analytics = useMemo(() => getDashboardAnalytics(range, generatedAt), [generatedAt, range]);
  const values = analytics.points.map((point) => point.views);
  const { coords, points, area } = chartGeometry(values);
  const labelIndexes = Array.from(new Set([0, Math.round((analytics.points.length - 1) * 0.25), Math.round((analytics.points.length - 1) * 0.5), Math.round((analytics.points.length - 1) * 0.75), analytics.points.length - 1]));
  const active = activePoint === null ? null : { ...analytics.points[activePoint], ...coords[activePoint] };

  return (
    <section className="rounded-(--radius) border border-(--border) bg-white p-4 sm:p-6 lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 className="text-sm font-bold text-(--text-strong)">روند بازدید مقاله‌ها</h2><p className="mt-1.5 text-[13px] text-(--muted)">داده‌های تحلیلی {analytics.rangeLabel}</p></div>
        <div role="group" aria-label="بازه زمانی نمودار" className="flex rounded-(--radius-sm) border border-(--border) bg-(--surface-subtle) p-1">
          {ranges.map((item) => <button key={item} type="button" aria-pressed={range === item} onClick={() => { setRange(item); setActivePoint(null); }} className={`min-h-10 rounded-lg px-2.5 text-[11px] font-bold transition sm:px-3 sm:text-[12px] ${range === item ? "bg-white text-(--brand-teal) shadow-sm" : "text-(--text-muted) hover:text-(--text-strong)"}`}>{dashboardRangeLabels[item].replace(" گذشته", "")}</button>)}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3" aria-live="polite">
        <strong className="text-[28px] tracking-[-.04em] text-(--text-strong)">{formatDashboardNumber(analytics.total)}</strong>
        <span className="mb-1 rounded-md bg-(--accent-soft) px-2 py-1 text-[12px] font-bold text-(--accent)">↑ {analytics.change.toLocaleString("fa-IR")}٪</span>
        <span className="mb-1 text-[11px] text-(--text-muted)">{analytics.comparisonLabel}</span>
      </div>

      <div className="relative mt-6 h-57.5 w-full" role="img" aria-label={`نمودار بازدید مقاله‌ها در ${analytics.rangeLabel} با مجموع ${formatDashboardNumber(analytics.total)} بازدید`}>
        <div className="absolute inset-0 flex flex-col justify-between" aria-hidden="true">{[0, 1, 2, 3, 4].map((item) => <span key={item} className="block border-t border-dashed border-(--border-subtle)" />)}</div>
        <svg className="relative h-51.25 w-full overflow-visible" viewBox="0 0 900 220" preserveAspectRatio="none" aria-hidden="true" onMouseLeave={() => setActivePoint(null)}>
          <defs><linearGradient id={`dashboard-area-${range}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16877b" stopOpacity=".2" /><stop offset="100%" stopColor="#16877b" stopOpacity="0" /></linearGradient></defs>
          <polygon points={area} fill={`url(#dashboard-area-${range})`} />
          <polyline points={points} fill="none" stroke="#13786f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {coords.map((point, index) => <circle key={analytics.points[index].date} cx={point.x} cy={point.y} r={activePoint === index ? 7 : 5} fill="#fff" stroke="#13786f" strokeWidth="3" vectorEffect="non-scaling-stroke" onMouseEnter={() => setActivePoint(index)} />)}
        </svg>
        {active && <div className="pointer-events-none absolute z-10 min-w-30 -translate-x-1/2 -translate-y-full rounded-(--radius-sm) bg-(--brand-navy) px-3 py-2 text-center text-white shadow-lg" style={{ left: `${(active.x / 900) * 100}%`, top: `${(active.y / 220) * 205}px` }}><strong className="block text-[12px]">{formatDashboardNumber(active.views)} بازدید</strong><span className="mt-1 block text-[11px] text-white/65">{active.label}</span></div>}
        <div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] text-(--text-muted)">{labelIndexes.map((index) => <span key={analytics.points[index].date}>{analytics.points[index].label}</span>)}</div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-(--border-subtle) pt-4 text-[11px] text-(--text-muted)"><BarChart3 size={15} className="text-(--brand-teal)" /><span>{range === "90d" ? "داده‌های ۹۰ روزه برای خوانایی در بازه‌های شش‌روزه تجمیع شده‌اند." : `${analytics.points.length.toLocaleString("fa-IR")} نقطه روزانه در نمودار نمایش داده شده است.`}</span></div>
      <table className="sr-only"><caption>داده‌های بازدید {analytics.rangeLabel}</caption><thead><tr><th>تاریخ</th><th>بازدید</th></tr></thead><tbody>{analytics.points.map((point) => <tr key={point.date}><td>{point.label}</td><td>{point.views.toLocaleString("fa-IR")}</td></tr>)}</tbody></table>
    </section>
  );
}
