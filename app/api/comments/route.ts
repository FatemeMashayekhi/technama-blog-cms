import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { assertJsonMutation, enforceApiRateLimit } from "@/lib/api-security";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicCommentSchema, uuidSchema } from "@/lib/validation";

export async function GET(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const url = new URL(request.url);
    const supabase = await createSupabaseServerClient();
    if (url.searchParams.get("scope") === "admin") {
      const access = await requireRole(["admin", "editor", "author"]);
      if (!access.ok) return apiError(access.error, access.status);
      const { data, error } = await supabase.from("comments").select("*,article:articles!comments_article_id_fkey(id,title,slug,author:profiles!articles_author_id_fkey(id,display_name))").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return apiSuccess(data);
    }
    const articleId = uuidSchema.safeParse(url.searchParams.get("articleId"));
    if (!articleId.success) return apiError("شناسه مقاله معتبر نیست.", 422);
    const { data, error } = await supabase.rpc("get_public_comments", { target_article_id: articleId.data });
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertJsonMutation(request, 8 * 1024);
    const input = publicCommentSchema.parse(await request.json());
    if (input.website) return apiSuccess({ accepted: true }, 202);
    const supabase = await createSupabaseServerClient();
    await enforceApiRateLimit(request, "comment", 5, 600);
    const { data: { user } } = await supabase.auth.getUser();
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return apiError("سرویس ثبت دیدگاه موقتاً در دسترس نیست.", 503);
    const admin = createSupabaseAdminClient();
    const { data: article } = await admin.from("articles").select("id,status,published_at").eq("id", input.articleId).maybeSingle();
    if (!article || article.status !== "published" || !article.published_at || Date.parse(article.published_at) > Date.now()) return apiError("مقاله برای دریافت دیدگاه در دسترس نیست.", 404);
    if (input.parentId) {
      const { data: parent } = await admin.from("comments").select("id").eq("id", input.parentId).eq("article_id", input.articleId).eq("status", "approved").maybeSingle();
      if (!parent) return apiError("دیدگاه والد معتبر نیست.", 422);
    }
    const { data, error } = await admin.from("comments").insert({ article_id: input.articleId, parent_id: input.parentId ?? null, user_id: user?.id ?? null, name: input.name, email: input.email.toLowerCase(), content: input.content, status: "pending" }).select("id,created_at").single();
    if (error) throw error;
    return apiSuccess({ ...data, status: "pending" }, 201);
  } catch (error) { return handleApiError(error); }
}
