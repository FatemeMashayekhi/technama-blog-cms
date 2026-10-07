import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { enforceApiRateLimit } from "@/lib/api-security";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { assertMutationRequest } from "@/lib/request-security";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSize = 4 * 1024 * 1024;
const maxPixels = 40_000_000;

function sniffImageType(buffer: Buffer) {
  if (buffer.length >= 12 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

function safeFilename(value: string) {
  return value.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 180) || "image.webp";
}
export async function GET() {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    const { data, error } = await (await createSupabaseServerClient()).from("media").select("*,owner:profiles!media_owner_id_fkey(id,display_name)").order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) { return handleApiError(error); }
}
export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertMutationRequest(request, { maxBytes: maxSize + 128 * 1024, contentTypes: ["multipart/form-data"], requireBody: true });
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "media-upload", 20, 3600, access.profile.id);
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return apiError("فایل ارسال نشده است.", 422);
    if (!allowedTypes.has(file.type) || file.size <= 0 || file.size > maxSize) return apiError("نوع فایل یا حجم آن مجاز نیست (حداکثر ۴ مگابایت).", 422);
    const source = Buffer.from(await file.arrayBuffer());
    const detectedType = sniffImageType(source);
    if (!detectedType || detectedType !== file.type) return apiError("محتوای فایل با نوع اعلام‌شده مطابقت ندارد.", 422);
    const { data: processed, info } = await sharp(source, { failOn: "warning", limitInputPixels: maxPixels })
      .rotate()
      .webp({ quality: 85, effort: 4 })
      .toBuffer({ resolveWithObject: true });
    if (!info.width || !info.height || info.width * info.height > maxPixels) return apiError("ابعاد تصویر بیشتر از حد مجاز است.", 422);
    const path = `${access.profile.id}/${randomUUID()}.webp`;
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return apiError("سرویس امن آپلود موقتاً در دسترس نیست.", 503);
    const supabase = createSupabaseAdminClient();
    const { error: uploadError } = await supabase.storage.from("media").upload(path, processed, { contentType: "image/webp", upsert: false, cacheControl: "31536000" });
    if (uploadError) throw uploadError;
    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
    const { data, error } = await supabase.from("media").insert({ owner_id: access.profile.id, name: safeFilename(file.name), path, url: publicUrl.publicUrl, mime_type: "image/webp", size: processed.length, width: info.width, height: info.height, alt_text: String(form.get("altText") ?? "").trim().slice(0, 300) }).select("*,owner:profiles!media_owner_id_fkey(id,display_name)").single();
    if (error) { await supabase.storage.from("media").remove([path]); throw error; }
    return apiSuccess(data, 201);
  } catch (error) { return handleApiError(error); }
}
