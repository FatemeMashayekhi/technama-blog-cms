"use client";
import { useState } from "react";
import { fetchAnalytics } from "@/lib/analytics-service";
import { getAnalyticsData, type AnalyticsDataset, type AnalyticsRange } from "@/lib/analytics-data";
import { AnalyticsActivity } from "./analytics-activity";
import { AnalyticsHeader } from "./analytics-header";
import { AnalyticsSummary } from "./analytics-summary";
import { DeviceBreakdown, TrafficSources } from "./audience-insights";
import { AuthorPerformance } from "./author-performance";
import { CategoryPerformance } from "./category-performance";
import { AnalyticsEmptyState, AnalyticsErrorState, AnalyticsSkeleton } from "./analytics-states";
import { TopArticles } from "./top-articles";
import { TrafficChart } from "./traffic-chart";

export function AnalyticsDashboard() {
  const [range, setRange] = useState<AnalyticsRange>("30d"); const [data, setData] = useState<AnalyticsDataset>(() => getAnalyticsData("30d")); const [loading, setLoading] = useState(false); const [error, setError] = useState(false);
  const load = async (nextRange: AnalyticsRange) => { setRange(nextRange); setLoading(true); setError(false); try { setData(await fetchAnalytics(nextRange)); } catch { setError(true); } finally { setLoading(false); } };
  return <div className="space-y-6"><AnalyticsHeader range={range} onRangeChange={load}/>{loading ? <AnalyticsSkeleton/> : error ? <AnalyticsErrorState onRetry={() => load(range)}/> : !data.traffic.length ? <AnalyticsEmptyState onChangeRange={() => load("30d")}/> : <><AnalyticsSummary metrics={data.metrics}/><div className="grid gap-4 xl:grid-cols-3"><div className="xl:col-span-2"><TrafficChart points={data.traffic} rangeLabel={data.label}/></div><CategoryPerformance categories={data.categories}/></div><TopArticles articles={data.articles}/><div className="grid gap-4 xl:grid-cols-2"><AuthorPerformance authors={data.authors}/><div className="grid gap-4 sm:grid-cols-2"><TrafficSources sources={data.sources}/><DeviceBreakdown devices={data.devices}/></div></div><AnalyticsActivity activities={data.activities}/><p className="text-left text-[14px] text-(--text-muted)">{data.updatedLabel} · داده‌های نمایشی تحریریه</p></>}</div>;
}

