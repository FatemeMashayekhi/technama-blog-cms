import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { assertJsonMutation, enforceApiRateLimit } from "@/lib/api-security";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { publicCommentReceiptSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return apiError("سرویس پیگیری دیدگاه موقتاً در دسترس نیست.", 503);
  try {
    assertJsonMutation(request, 8 * 1024);
    const input = publicCommentReceiptSchema.parse(await request.json());
    await enforceApiRateLimit(request, "comment-status", 30, 600);
    const admin = createSupabaseAdminClient();
    let articleQuery = admin.from("articles").select("id");
    articleQuery = input.articleId ? articleQuery.eq("id", input.articleId) : articleQuery.eq("slug", input.articleSlug!);
    const { data: article, error: articleError } = await articleQuery.eq("status", "published").maybeSingle();
    if (articleError) throw articleError;
    if (!article) return apiError("مقاله پیدا نشد.", 404);
    const { data, error } = await admin.from("comments")
      .select("id,parent_id,name,content,status,created_at")
      .eq("article_id", article.id)
      .in("id", input.ids)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return apiSuccess((data ?? []).map((comment) => ({
      id: comment.id,
      parentId: comment.parent_id,
      name: comment.name,
      content: comment.content,
      status: comment.status,
      createdAt: comment.created_at,
    })));
  } catch (error) {
    return handleApiError(error);
  }
}
