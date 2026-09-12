import { getAnalyticsData, type AnalyticsDataset, type AnalyticsRange } from "@/lib/analytics-data";
const wait = (duration = 420) => new Promise((resolve) => setTimeout(resolve, duration));
export async function fetchAnalytics(range: AnalyticsRange): Promise<AnalyticsDataset> { await wait(); return getAnalyticsData(range); }
