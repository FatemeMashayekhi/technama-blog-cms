import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardSessionProvider } from "@/components/layout/dashboard-session-provider";
import { ProfileForm, type EditableProfile } from "@/components/profile/profile-form";
import { getCurrentProfile, getCurrentUser, requireUser } from "@/lib/auth";
import { defaultDashboardUser } from "@/lib/dashboard-data";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "پروفایل من", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (!isSupabaseConfigured && process.env.NODE_ENV === "production") redirect("/login?error=configuration");
  let editable: EditableProfile = { displayName: defaultDashboardUser.name, username: "editor", email: defaultDashboardUser.email, avatarUrl: "", bio: "", role: defaultDashboardUser.role };
  if (isSupabaseConfigured) {
    const user = await requireUser("/profile");
    const profile = await getCurrentProfile();
    if (!profile?.is_active) redirect("/login?error=inactive");
    editable = { displayName: profile.display_name, username: profile.username, email: user.email ?? "", avatarUrl: profile.avatar_url ?? "", bio: profile.bio ?? "", role: profile.role };
  }
  const sessionUser = { id: isSupabaseConfigured ? (await getCurrentUser())?.id ?? defaultDashboardUser.id : defaultDashboardUser.id, name: editable.displayName, email: editable.email, avatar: editable.avatarUrl || undefined, role: editable.role };
  return <DashboardSessionProvider user={sessionUser}><DashboardLayout headerTitle="پروفایل من" headerSubtitle="مدیریت هویت و اطلاعات حساب"><ProfileForm initialProfile={editable} configured={isSupabaseConfigured}/></DashboardLayout></DashboardSessionProvider>;
}
