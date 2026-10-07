import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { RequestSecurityError } from "@/lib/request-security";

const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
};

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, error: message, ...(details ? { details } : {}) }, { status, headers: privateHeaders });
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status, headers: privateHeaders });
}

export function handleApiError(error: unknown) {
  if (error instanceof RequestSecurityError) return apiError(error.message, error.status);
  if (error instanceof ZodError) return apiError("داده‌های ارسال‌شده معتبر نیستند.", 422, error.flatten());
  if (typeof error === "object" && error && "code" in error) {
    const code = String((error as { code?: unknown }).code ?? "");
    if (code === "23505") return apiError("رکوردی با این مقدار از قبل وجود دارد.", 409);
    if (code === "PGRST116") return apiError("رکورد موردنظر پیدا نشد.", 404);
    if (code === "42501") return apiError("برای این عملیات دسترسی کافی ندارید.", 403);
  }
  if (error instanceof Error && error.message.startsWith("دسته‌بندی")) return apiError(error.message, 422);
  console.error(error);
  return apiError("خطای غیرمنتظره‌ای در سرور رخ داد.", 500);
}
