import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { enforceApiRateLimit, readJsonMutation } from "@/lib/api-security";
import { requireWriteRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { assertMutationRequest } from "@/lib/request-security";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { profilePatchSchema, uuidSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return apiError("کلید server-only مدیریت کاربران تنظیم نشده است.", 503);
  try {
    const access = await requireWriteRole(["admin"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "profile-write", 30, 600, access.profile.id);
    const input = profilePatchSchema.parse(await readJsonMutation(request, 16 * 1024));
    const id = uuidSchema.parse((await params).id);
    if (id === access.profile.id && ((input.role !== undefined && input.role !== "admin") || input.isActive === false || input.readOnly === true)) {
      return apiError("نمی‌توانید دسترسی حساب مدیر فعال خودتان را محدود کنید.", 422);
    }
    if (id !== access.profile.id && input.role === "admin") return apiError("برای حفظ مالکیت پروژه، ایجاد مدیر دوم غیرفعال است.", 422);
    const admin = createSupabaseAdminClient();
    const { data: authData, error: getUserError } = await admin.auth.admin.getUserById(id);
    if (getUserError) throw getUserError;
    const readOnly = input.readOnly ?? authData.user.app_metadata?.read_only === true;
    if (input.email !== undefined || input.readOnly !== undefined) {
      const { error: updateUserError } = await admin.auth.admin.updateUserById(id, {
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.readOnly !== undefined ? { app_metadata: { ...authData.user.app_metadata, read_only: input.readOnly } } : {}),
      });
      if (updateUserError) throw updateUserError;
    }
    const row = {
      ...(input.displayName !== undefined ? { display_name: input.displayName } : {}),
      ...(input.username !== undefined ? { username: input.username } : {}),
      ...(input.avatarUrl !== undefined ? { avatar_url: input.avatarUrl } : {}),
      ...(input.bio !== undefined ? { bio: input.bio } : {}),
      ...(input.role !== undefined || readOnly ? { role: readOnly ? "author" : input.role } : {}),
      ...(input.isActive !== undefined ? { is_active: input.isActive } : {}),
    };
    const { data, error } = await admin.from("profiles").update(row).eq("id", id).select("*").single();
    if (error) throw error;
    return apiSuccess({ ...data, read_only: readOnly });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return apiError("کلید server-only مدیریت کاربران تنظیم نشده است.", 503);
  try {
    assertMutationRequest(request);
    const access = await requireWriteRole(["admin"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "profile-delete", 10, 3600, access.profile.id);
    const id = uuidSchema.parse((await params).id);
    if (id === access.profile.id) return apiError("نمی‌توانید حساب فعال خودتان را حذف کنید.", 422);
    const { error } = await createSupabaseAdminClient().auth.admin.deleteUser(id);
    if (error) throw error;
    return apiSuccess({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
