"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionState = { error: string };
function safeNext(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/admin") && !path.startsWith("//") ? path : "/admin/dashboard";
}

export async function signIn(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!isSupabaseConfigured) return { error: "ابتدا متغیرهای محیطی Supabase را تنظیم کنید." };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 6) return { error: "ایمیل و رمز عبور معتبر وارد کنید." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "ایمیل یا رمز عبور صحیح نیست." };
  redirect(safeNext(formData.get("next")));
}

export async function signUp(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (process.env.NEXT_PUBLIC_ALLOW_SIGNUP !== "true") return { error: "ثبت‌نام عمومی غیرفعال است." };
  if (!isSupabaseConfigured) return { error: "ابتدا متغیرهای محیطی Supabase را تنظیم کنید." };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!email || password.length < 8 || displayName.length < 2) return { error: "نام، ایمیل و رمز حداقل ۸ کاراکتری وارد کنید." };
  const supabase = await createSupabaseServerClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName }, emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext(formData.get("next")))}` } });
  if (error) return { error: "ساخت حساب انجام نشد؛ ممکن است این ایمیل قبلاً ثبت شده باشد." };
  return { error: "لینک تأیید حساب برای شما ایمیل شد." };
}

export async function signOut() {
  if (isSupabaseConfigured) await (await createSupabaseServerClient()).auth.signOut();
  redirect("/login");
}
