export type AnalyticsRange = "7d" | "30d" | "90d" | "6m" | "12m" | "custom";
export type ChartMetric = "views" | "visitors" | "engagement";
export type TrendDirection = "up" | "down";

export type AnalyticsMetric = { id: string; label: string; value: number; format: "number" | "duration" | "percent"; change: number; direction: TrendDirection };
export type AnalyticsPoint = { label: string; views: number; visitors: number; engagement: number };
export type ArticlePerformance = { id: string; title: string; author: string; category: string; views: number; engagement: number; publishedLabel: string; trend: number; thumbnail: string };
export type CategoryPerformance = { name: string; views: number; articles: number; engagement: number; share: number };
export type AuthorPerformance = { id: string; name: string; initials: string; color: string; articles: number; views: number; averageViews: number; engagement: number; growth: number };
export type TrafficSource = { name: string; visitors: number; share: number; trend: number };
export type DeviceStat = { name: string; visitors: number; share: number };
export type AnalyticsActivity = { id: string; title: string; detail: string; time: string; type: "publish" | "milestone" | "growth" | "engagement" };
export type AnalyticsDataset = { range: AnalyticsRange; label: string; updatedLabel: string; metrics: AnalyticsMetric[]; traffic: AnalyticsPoint[]; articles: ArticlePerformance[]; categories: CategoryPerformance[]; authors: AuthorPerformance[]; sources: TrafficSource[]; devices: DeviceStat[]; activities: AnalyticsActivity[] };

export const analyticsRangeLabels: Record<AnalyticsRange, string> = { "7d": "۷ روز گذشته", "30d": "۳۰ روز گذشته", "90d": "۹۰ روز گذشته", "6m": "۶ ماه گذشته", "12m": "۱۲ ماه گذشته", custom: "بازه دلخواه" };

const configs: Record<AnalyticsRange, { factor: number; changes: number[]; labels: string[]; wave: number[] }> = {
  "7d": { factor: .24, changes: [12.8, 9.4, 14.1, -3.2, 5.8, 8.1], labels: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "امروز"], wave: [52, 59, 57, 68, 64, 73, 69, 77, 82, 79, 91, 96] },
  "30d": { factor: 1, changes: [18.4, 13.2, 20.1, 6.4, 4.8, 11.3], labels: ["۱۰ مرداد", "۱۳ مرداد", "۱۶ مرداد", "۱۹ مرداد", "۲۲ مرداد", "۲۵ مرداد", "۲۸ مرداد", "۳۱ مرداد", "۳ شهریور", "۶ شهریور", "۹ شهریور", "امروز"], wave: [46, 51, 49, 58, 55, 64, 68, 66, 75, 81, 78, 92] },
  "90d": { factor: 2.84, changes: [22.6, 18.1, 24.7, 8.9, 7.2, 15.4], labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴", "هفته ۵", "هفته ۶", "هفته ۷", "هفته ۸", "هفته ۹", "هفته ۱۰", "هفته ۱۱", "هفته ۱۲"], wave: [38, 44, 49, 47, 56, 61, 58, 67, 72, 79, 85, 94] },
  "6m": { factor: 5.7, changes: [31.5, 27.2, 35.4, 12.1, 9.8, 19.6], labels: ["فروردین", "نیمه فروردین", "اردیبهشت", "نیمه اردیبهشت", "خرداد", "نیمه خرداد", "تیر", "نیمه تیر", "مرداد", "نیمه مرداد", "شهریور", "امروز"], wave: [31, 36, 42, 46, 51, 55, 62, 59, 70, 77, 84, 95] },
  "12m": { factor: 10.9, changes: [48.2, 41.7, 52.3, 16.5, 12.4, 28.1], labels: ["مهر", "آبان", "آذر", "دی", "بهمن", "اسفند", "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"], wave: [24, 28, 34, 39, 43, 49, 55, 61, 68, 76, 85, 96] },
  custom: { factor: 1.46, changes: [16.1, 12.4, 18.8, 4.2, 6.3, 10.5], labels: ["شروع", "روز ۴", "روز ۸", "روز ۱۲", "روز ۱۶", "روز ۲۰", "روز ۲۴", "روز ۲۸", "روز ۳۲", "روز ۳۶", "روز ۴۰", "پایان"], wave: [43, 48, 55, 51, 62, 58, 69, 73, 70, 82, 87, 93] },
};

const articleBase = [
  ["post-001", "آینده هوش مصنوعی مولد در توسعه نرم‌افزار", "مریم احمدی", "هوش مصنوعی", 28450, 72.4, "۸ شهریور", "/media/ai-future.svg"],
  ["post-008", "از ایده تا بازار؛ روایت سه استارتاپ ایرانی", "الهام مرادی", "استارتاپ", 24180, 68.9, "۵ شهریور", "/media/startup-team.svg"],
  ["post-002", "چرا معماری Server Components اهمیت دارد؟", "علی رضایی", "برنامه‌نویسی", 21940, 76.1, "۲ شهریور", "/media/code-workspace.svg"],
  ["post-005", "امنیت زنجیره تأمین نرم‌افزار", "علی رضایی", "امنیت", 18620, 64.7, "۲۹ مرداد", "/media/security.svg"],
  ["post-007", "راهنمای طراحی یک Design System پایدار", "سارا اکبری", "طراحی محصول", 15890, 70.3, "۲۵ مرداد", "/media/design-system.svg"],
  ["post-006", "تراشه‌های هوش مصنوعی چه مسیری را طی می‌کنند؟", "نیما فرهمند", "سخت‌افزار", 13740, 61.8, "۲۱ مرداد", "/media/chip.svg"],
] as const;

export function getAnalyticsData(range: AnalyticsRange): AnalyticsDataset {
  const config = configs[range]; const f = config.factor;
  const metricValues = [184250, 128420, 267310, 274, 68.4, 32];
  const metrics: AnalyticsMetric[] = ["بازدید کل", "بازدیدکنندگان یکتا", "صفحات مشاهده‌شده", "میانگین زمان مطالعه", "نرخ تعامل", "مقالات منتشرشده"].map((label, index) => ({ id: ["views", "visitors", "pages", "read-time", "engagement", "articles"][index], label, value: index === 3 ? Math.round(metricValues[index] * (1 + (f - 1) * .02)) : index === 4 ? +(metricValues[index] + Math.log2(f + 1) * 1.4).toFixed(1) : Math.round(metricValues[index] * f), format: index === 3 ? "duration" : index === 4 ? "percent" : "number", change: Math.abs(config.changes[index]), direction: config.changes[index] >= 0 ? "up" : "down" }));
  const traffic = config.wave.map((point, index) => ({ label: config.labels[index], views: Math.round(point * 112 * f), visitors: Math.round(point * 74 * f), engagement: +(54 + point * .21 + (index % 3)).toFixed(1) }));
  const articles: ArticlePerformance[] = articleBase.map((row, index) => ({ id: row[0], title: row[1], author: row[2], category: row[3], views: Math.round(row[4] * f * (1 + ((index + config.wave[0]) % 4) * .035)), engagement: +(row[5] + (f > 2 ? index * .4 : 0)).toFixed(1), publishedLabel: row[6], trend: +(config.changes[index % config.changes.length] - index * .7).toFixed(1), thumbnail: row[7] })).sort((a, b) => b.views - a.views);
  const categoryNames = ["هوش مصنوعی", "برنامه‌نویسی", "طراحی محصول", "امنیت", "استارتاپ", "سخت‌افزار"];
  const categoryShares = range === "7d" ? [31, 21, 14, 13, 12, 9] : range === "12m" ? [25, 23, 15, 14, 13, 10] : [28, 22, 15, 13, 13, 9];
  const categories = categoryNames.map((name, index) => ({ name, views: Math.round(184250 * f * categoryShares[index] / 100), articles: Math.max(1, Math.round([18, 16, 11, 10, 9, 7][index] * Math.max(.35, f / 2))), engagement: +(74 - index * 2.6 + Math.min(f, 5) * .3).toFixed(1), share: categoryShares[index] }));
  const authors: AuthorPerformance[] = [["author-1", "مریم احمدی", "ما", "bg-[#dbe8f2] text-[#315d78]", 14, 82500, 72.8], ["author-2", "علی رضایی", "عر", "bg-[#e8e2f2] text-[#604b78]", 12, 69740, 70.1], ["author-3", "سارا اکبری", "سا", "bg-[#f4e5d8] text-[#82552f]", 9, 48620, 74.5], ["author-5", "نیما فرهمند", "نف", "bg-[#e8ecd9] text-[#626b31]", 8, 38290, 63.2], ["author-6", "الهام مرادی", "ام", "bg-[#efe1e8] text-[#814e68]", 7, 35680, 68.7]].map((row, index) => { const articles = Math.max(1, Math.round(Number(row[4]) * Math.max(.3, f / 2))); const views = Math.round(Number(row[5]) * f); return { id: String(row[0]), name: String(row[1]), initials: String(row[2]), color: String(row[3]), articles, views, averageViews: Math.round(views / articles), engagement: Number(row[6]), growth: +(config.changes[index] || 7).toFixed(1) }; });
  const sourceShares = range === "7d" ? [49, 18, 17, 9, 7] : [54, 17, 14, 9, 6];
  const sources = ["جستجوی گوگل", "ورود مستقیم", "شبکه‌های اجتماعی", "لینک‌های ارجاعی", "خبرخوان‌ها"].map((name, index) => ({ name, visitors: Math.round(128420 * f * sourceShares[index] / 100), share: sourceShares[index], trend: +(config.changes[index] / 1.8).toFixed(1) }));
  const deviceShares = range === "12m" ? [58, 36, 6] : [64, 31, 5];
  const devices = ["موبایل", "دسکتاپ", "تبلت"].map((name, index) => ({ name, visitors: Math.round(128420 * f * deviceShares[index] / 100), share: deviceShares[index] }));
  const activities: AnalyticsActivity[] = [{ id: "a1", type: "milestone", title: "رکورد تازه برای مقاله هوش مصنوعی", detail: `این مقاله در بازه انتخابی ${Math.round(28450 * f).toLocaleString("fa-IR")} بازدید دریافت کرد.`, time: "۲ ساعت پیش" }, { id: "a2", type: "publish", title: "مقاله جدید منتشر شد", detail: "«معماری مقیاس‌پذیر TypeScript» وارد چرخه تحلیل شد.", time: "۵ ساعت پیش" }, { id: "a3", type: "growth", title: "رشد ترافیک دسته هوش مصنوعی", detail: `سهم این دسته به ${categoryShares[0].toLocaleString("fa-IR")}٪ از کل بازدید رسید.`, time: "دیروز" }, { id: "a4", type: "engagement", title: "افزایش تعامل مخاطبان", detail: `نرخ تعامل نسبت به دوره قبل ${config.changes[4].toLocaleString("fa-IR")}٪ تغییر کرد.`, time: "۲ روز پیش" }];
  return { range, label: analyticsRangeLabels[range], updatedLabel: "آخرین به‌روزرسانی: امروز، ۱۰:۳۰", metrics, traffic, articles, categories, authors, sources, devices, activities };
}

