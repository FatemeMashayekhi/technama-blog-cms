import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { enforceApiRateLimit, readJsonMutation } from "@/lib/api-security";
import { requireWriteRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { assertMutationRequest } from "@/lib/request-security";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assertValidCategoryParent } from "@/lib/taxonomy-server";
import { categoryInputSchema, uuidSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireWriteRole(["admin", "editor"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "taxonomy-write", 60, 600, access.profile.id);
    const schema = categoryInputSchema.partial().refine((value) => Object.keys(value).length > 0);
    const input = schema.parse(await readJsonMutation(request, 16 * 1024));
    const id = uuidSchema.parse((await params).id);
    const supabase = await createSupabaseServerClient();
    if (input.parentId !== undefined) await assertValidCategoryParent(supabase, id, input.parentId ?? null);
    const row = {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
      ...(input.parentId !== undefined ? { parent_id: input.parentId || null } : {}),
      ...(input.coverImage !== undefined ? { cover_image: input.coverImage } : {}),
      ...(input.seo !== undefined ? { seo: input.seo } : {}),
    };
    const { data, error } = await supabase.from("categories").update(row).eq("id", id).select("*").single();
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertMutationRequest(request);
    const access = await requireWriteRole(["admin", "editor"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "taxonomy-delete", 20, 600, access.profile.id);
    const id = uuidSchema.parse((await params).id);
    const supabase = await createSupabaseServerClient();
    const { count, error: usageError } = await supabase.from("articles").select("id", { count: "exact", head: true }).eq("category_id", id);
    if (usageError) throw usageError;
    if ((count ?? 0) > 0) return apiError("پیش از حذف، مقاله‌های این دسته‌بندی را به دسته دیگری منتقل کنید.", 409);
    const { data, error } = await supabase.from("categories").delete().eq("id", id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return apiError("دسته‌بندی پیدا نشد.", 404);
    return apiSuccess({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
