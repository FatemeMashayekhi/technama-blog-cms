"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isSupabaseConfigured } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";
import { safeAdminPath, stableSecuritySubject } from "@/lib/request-security";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionState = { error: string };
async function allowAuthAttempt(namespace: "login" | "signup", email: string, maxHits: number) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return process.env.NODE_ENV !== "production";
  const source = await headers();
  const limiter = createSupabaseAdminClient();
  const ipAllowed = await checkRateLimit(limiter, source, `${namespace}-ip`, namespace === "login" ? 40 : 10, 900);
  if (!ipAllowed) return false;
  return checkRateLimit(limiter, source, `${namespace}-account`, maxHits, 900, stableSecuritySubject(email));
}

export async function signIn(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!isSupabaseConfigured) return { error: "ابتدا متغیرهای محیطی Supabase را تنظیم کنید." };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 6) return { error: "ایمیل و رمز عبور معتبر وارد کنید." };
  if (!await allowAuthAttempt("login", email, 10)) return { error: "تعداد تلاش‌ها زیاد است؛ کمی بعد دوباره امتحان کنید." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "ایمیل یا رمز عبور صحیح نیست." };
  redirect(safeAdminPath(formData.get("next")));
}

export async function signUp(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (process.env.NEXT_PUBLIC_ALLOW_SIGNUP !== "true") return { error: "ثبت‌نام عمومی غیرفعال است." };
  if (!isSupabaseConfigured) return { error: "ابتدا متغیرهای محیطی Supabase را تنظیم کنید." };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!email || password.length < 8 || displayName.length < 2) return { error: "نام، ایمیل و رمز حداقل ۸ کاراکتری وارد کنید." };
  if (!await allowAuthAttempt("signup", email, 4)) return { error: "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره امتحان کنید." };
  const supabase = await createSupabaseServerClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName }, emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeAdminPath(formData.get("next")))}` } });
  if (error) return { error: "ساخت حساب انجام نشد؛ ممکن است این ایمیل قبلاً ثبت شده باشد." };
  return { error: "لینک تأیید حساب برای شما ایمیل شد." };
}

export async function signOut() {
  if (isSupabaseConfigured) await (await createSupabaseServerClient()).auth.signOut();
  redirect("/login");
}
