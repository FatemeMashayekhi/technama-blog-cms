import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { assertJsonMutation, enforceApiRateLimit } from "@/lib/api-security";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { categoryInputSchema } from "@/lib/validation";

export async function GET() {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try { const { data, error } = await (await createSupabaseServerClient()).from("categories").select("*").order("name").limit(200); if (error) throw error; return apiSuccess(data); }
  catch (error) { return handleApiError(error); }
}
export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertJsonMutation(request, 16 * 1024);
    const access = await requireRole(["admin", "editor"]); if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "taxonomy-write", 60, 600, access.profile.id);
    const input = categoryInputSchema.parse(await request.json());
    const { data, error } = await (await createSupabaseServerClient()).from("categories").upsert({ name: input.name, slug: input.slug, description: input.description, icon: input.icon, color: input.color, parent_id: input.parentId || null, cover_image: input.coverImage ?? null, seo: input.seo }, { onConflict: "slug" }).select("*").single();
    if (error) throw error; return apiSuccess(data, 201);
  } catch (error) { return handleApiError(error); }
}
