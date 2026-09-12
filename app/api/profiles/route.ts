import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { inviteAuthorSchema } from "@/lib/validation";

export async function GET(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try { const url = new URL(request.url); if (url.searchParams.get("scope") === "admin") { const access = await requireRole(["admin","editor"]); if (!access.ok) return apiError(access.error, access.status); } const { data,error } = await (await createSupabaseServerClient()).from("profiles").select("id,display_name,username,avatar_url,bio,role,is_active,created_at,articles(id,title,status,views)").order("display_name"); if(error)throw error; return apiSuccess(data); }
  catch(error){return handleApiError(error);}
}
export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return apiError("کلید server-only برای دعوت نویسنده تنظیم نشده است.", 503);
  try { const access=await requireRole(["admin"]);if(!access.ok)return apiError(access.error,access.status);const input=inviteAuthorSchema.parse(await request.json());const admin=createSupabaseAdminClient();const origin=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";const{data,error}=await admin.auth.admin.inviteUserByEmail(input.email,{data:{display_name:input.displayName},redirectTo:`${origin}/auth/callback`});if(error)throw error;if(data.user){const{error:updateError}=await admin.from("profiles").update({role:input.role}).eq("id",data.user.id);if(updateError)throw updateError;}return apiSuccess({id:data.user?.id,email:input.email},201);}catch(error){return handleApiError(error);}
}
