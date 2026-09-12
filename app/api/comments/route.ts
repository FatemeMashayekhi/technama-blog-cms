import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicCommentSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const url = new URL(request.url);
    const supabase = await createSupabaseServerClient();
    if (url.searchParams.get("scope") === "admin") {
      const access = await requireRole(["admin", "editor", "author"]);
      if (!access.ok) return apiError(access.error, access.status);
      const { data, error } = await supabase.from("comments").select("*,article:articles!comments_article_id_fkey(id,title,slug,author:profiles!articles_author_id_fkey(id,display_name))").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return apiSuccess(data);
    }
    const articleId = url.searchParams.get("articleId");
    if (!articleId) return apiError("شناسه مقاله الزامی است.", 422);
    const { data, error } = await supabase.rpc("get_public_comments", { target_article_id: articleId });
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const input = publicCommentSchema.parse(await request.json());
    if (input.website) return apiSuccess({ accepted: true }, 202);
    const supabase = await createSupabaseServerClient();
    if (!await checkRateLimit(supabase, request, "comment", 5, 600)) return apiError("تعداد درخواست‌ها زیاد است؛ چند دقیقه دیگر دوباره تلاش کنید.", 429);
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("comments").insert({ article_id: input.articleId, parent_id: input.parentId ?? null, user_id: user?.id ?? null, name: input.name, email: input.email.toLowerCase(), content: input.content, status: "pending" }).select("id,created_at").single();
    if (error) throw error;
    return apiSuccess({ ...data, status: "pending" }, 201);
  } catch (error) { return handleApiError(error); }
}
