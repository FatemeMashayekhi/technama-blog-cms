import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "editor" | "author";
export type AuthProfile = { id: string; display_name: string; username: string; avatar_url: string | null; bio: string; role: AppRole; is_active: boolean; read_only: boolean; demo_account: boolean };

export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async (): Promise<AuthProfile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("profiles").select("id,display_name,username,avatar_url,bio,role,is_active").eq("id", user.id).single();
  if (error) throw new Error("Unable to load the authenticated profile.");
  return {
    ...(data as Omit<AuthProfile, "read_only" | "demo_account">),
    read_only: user.app_metadata?.read_only === true,
    demo_account: user.app_metadata?.demo_account === true,
  };
});

export async function requireUser(nextPath = "/admin/dashboard") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

export async function requireRole(allowed: AppRole[]) {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false as const, status: 401, error: "برای انجام این عملیات وارد شوید." };
  if (!profile.is_active || !allowed.includes(profile.role)) return { ok: false as const, status: 403, error: "برای این عملیات دسترسی کافی ندارید." };
  return { ok: true as const, profile };
}

export async function requireWriteRole(allowed: AppRole[]) {
  const access = await requireRole(allowed);
  if (!access.ok) return access;
  if (access.profile.read_only) return { ok: false as const, status: 403, error: "این حساب فقط دسترسی مشاهده دارد و امکان تغییر داده‌ها برای آن غیرفعال است." };
  return access;
}
