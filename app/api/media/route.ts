import { randomUUID } from "node:crypto";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
const maxSize = 6 * 1024 * 1024;
export async function GET() {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    const { data, error } = await (await createSupabaseServerClient()).from("media").select("*,owner:profiles!media_owner_id_fkey(id,display_name)").order("created_at", { ascending: false });
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) { return handleApiError(error); }
}
export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return apiError("فایل ارسال نشده است.", 422);
    if (!allowedTypes.has(file.type) || file.size <= 0 || file.size > maxSize) return apiError("نوع فایل یا حجم آن مجاز نیست (حداکثر ۶ مگابایت).", 422);
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const path = `${access.profile.id}/${randomUUID()}.${extension}`;
    const supabase = await createSupabaseServerClient();
    const { error: uploadError } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false, cacheControl: "31536000" });
    if (uploadError) throw uploadError;
    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
    const { data, error } = await supabase.from("media").insert({ owner_id: access.profile.id, name: file.name.slice(0, 180), path, url: publicUrl.publicUrl, mime_type: file.type, size: file.size, alt_text: String(form.get("altText") ?? "").slice(0, 300) }).select("*,owner:profiles!media_owner_id_fkey(id,display_name)").single();
    if (error) { await supabase.storage.from("media").remove([path]); throw error; }
    return apiSuccess(data, 201);
  } catch (error) { return handleApiError(error); }
}
