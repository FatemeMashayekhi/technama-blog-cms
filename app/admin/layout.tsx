import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardSessionProvider } from "@/components/layout/dashboard-session-provider";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import { getDashboardCurrentUser } from "@/lib/dashboard-service";
import { isSupabaseConfigured } from "@/lib/env";
export const metadata: Metadata = { title: { default: "اتاق خبر", template: "%s | اتاق خبر تک‌نما" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (isSupabaseConfigured) {
    await requireUser();
    const profile = await getCurrentProfile();
    if (!profile?.is_active) redirect("/login?error=inactive");
  }
  const user = await getDashboardCurrentUser();
  return <DashboardSessionProvider user={user}>{children}</DashboardSessionProvider>;
}
