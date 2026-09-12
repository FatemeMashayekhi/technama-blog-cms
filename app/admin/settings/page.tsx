import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SettingsForm } from "@/components/settings/settings-form";
import { SettingsPageHeader } from "@/components/settings/settings-page-header";
export const metadata: Metadata = { title: "تنظیمات", description: "مدیریت تنظیمات عمومی، محتوا و امنیت مجله" };
export default function SettingsPage() { return <DashboardLayout headerTitle="تنظیمات"><div className="space-y-6"><SettingsPageHeader/><SettingsForm/></div></DashboardLayout>; }

