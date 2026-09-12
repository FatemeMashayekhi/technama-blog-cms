import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MediaPageHeader } from "@/components/media/media-page-header";
import { MediaStats } from "@/components/media/media-stats";
import { MediaWorkspace } from "@/components/media/media-workspace";

export const metadata: Metadata = { title: "رسانه", description: "مدیریت تصاویر و فایل‌های مورد استفاده در مجله" };

export default function MediaPage() { return <DashboardLayout headerTitle="رسانه" searchPlaceholder="جست‌وجوی فایل..."><div className="space-y-6"><MediaPageHeader/><MediaStats/><MediaWorkspace/></div></DashboardLayout>; }

