"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isSupabaseConfigured } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";
import { safeAdminPath, stableSecuritySubject } from "@/lib/request-security";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginInputSchema, signupInputSchema } from "@/lib/validation";

export type AuthActionState = { error: string; success?: string; fieldErrors?: Partial<Record<"email" | "password" | "displayName", string>> };
function authValidationErrors(error: { flatten: () => { fieldErrors: Record<string, string[]> } }): AuthActionState { const fields = error.flatten().fieldErrors; return { error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: { email: fields.email?.[0], password: fields.password?.[0], displayName: fields.displayName?.[0] } }; }
function authErrorMessage(error: { code?: string; status?: number; message?: string }) { if (error.code === "invalid_credentials") return "ایمیل یا رمز عبور صحیح نیست."; if (error.code === "email_not_confirmed") return "ابتدا ایمیل حساب را تأیید کنید."; if (error.status === 429) return "تعداد تلاش‌ها زیاد است؛ کمی بعد دوباره امتحان کنید."; if (error.status === 0 || /fetch|network/i.test(error.message ?? "")) return "ارتباط با سرویس ورود برقرار نشد؛ اتصال اینترنت و تنظیمات Supabase را بررسی کنید."; return "ورود انجام نشد؛ کمی بعد دوباره تلاش کنید."; }
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
  const input = loginInputSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!input.success) return authValidationErrors(input.error);
  try {
    if (!await allowAuthAttempt("login", input.data.email, 10)) return { error: "تعداد تلاش‌ها زیاد است؛ کمی بعد دوباره امتحان کنید." };
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword(input.data);
    if (error) return { error: authErrorMessage(error) };
    if (!data.session || !data.user) return { error: "پاسخ سرویس ورود کامل نبود؛ دوباره تلاش کنید." };
  } catch (error) { return { error: authErrorMessage(error instanceof Error ? error : {}) }; }
  redirect(safeAdminPath(formData.get("next")));
}

export async function signUp(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (process.env.NEXT_PUBLIC_ALLOW_SIGNUP !== "true") return { error: "ثبت‌نام عمومی غیرفعال است." };
  if (!isSupabaseConfigured) return { error: "ابتدا متغیرهای محیطی Supabase را تنظیم کنید." };
  const input = signupInputSchema.safeParse({ email: formData.get("email"), password: formData.get("password"), displayName: formData.get("displayName") });
  if (!input.success) return authValidationErrors(input.error);
  try {
    if (!await allowAuthAttempt("signup", input.data.email, 4)) return { error: "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره امتحان کنید." };
    const supabase = await createSupabaseServerClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { error } = await supabase.auth.signUp({ email: input.data.email, password: input.data.password, options: { data: { display_name: input.data.displayName }, emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeAdminPath(formData.get("next")))}` } });
    if (error) return { error: authErrorMessage(error) };
  } catch (error) { return { error: authErrorMessage(error instanceof Error ? error : {}) }; }
  return { error: "", success: "لینک تأیید حساب برای شما ایمیل شد." };
}

export async function signOut() {
  if (isSupabaseConfigured) await (await createSupabaseServerClient()).auth.signOut();
  redirect("/login");
}
