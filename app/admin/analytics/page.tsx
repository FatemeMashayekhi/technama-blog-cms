import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
export const metadata: Metadata = { title: "آمار و تحلیل", description: "بررسی عملکرد محتوا، مخاطبان و روند رشد مجله" };
export default function AnalyticsPage() { return <DashboardLayout headerTitle="آمار و تحلیل"><AnalyticsDashboard/></DashboardLayout>; }

