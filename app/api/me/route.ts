import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { getCurrentProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
export async function GET() { if (!isSupabaseConfigured) return apiSuccess(null); try { const profile = await getCurrentProfile(); if (!profile) return apiError("وارد حساب نشده‌اید.", 401); return apiSuccess(profile); } catch (error) { return handleApiError(error); } }
