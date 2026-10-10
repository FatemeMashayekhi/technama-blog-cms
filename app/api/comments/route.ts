import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { assertJsonMutation, enforceApiRateLimit } from "@/lib/api-security";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicCommentSchema, uuidSchema } from "@/lib/validation";

type ArticleSelector = { articleId?: string; articleSlug?: string };

async function findPublishedArticle(admin: ReturnType<typeof createSupabaseAdminClient>, selector: ArticleSelector) {
  let query = admin.from("articles").select("id,status,published_at");
  query = selector.articleId ? query.eq("id", selector.articleId) : query.eq("slug", selector.articleSlug!);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  if (!data || data.status !== "published" || !data.published_at || Date.parse(data.published_at) > Date.now()) return null;
  return data;
}

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
    let resolvedArticleId = articleId.success ? articleId.data : "";
    if (!resolvedArticleId) {
      const articleSlug = url.searchParams.get("articleSlug")?.trim();
      if (!articleSlug) return apiError("شناسه یا نامک مقاله معتبر نیست.", 422);
      const { data: article, error: articleError } = await supabase.from("articles").select("id").eq("slug", articleSlug).eq("status", "published").lte("published_at", new Date().toISOString()).maybeSingle();
      if (articleError) throw articleError;
      if (!article) return apiError("مقاله پیدا نشد.", 404);
      resolvedArticleId = article.id;
    }
    const { data, error } = await supabase.rpc("get_public_comments", { target_article_id: resolvedArticleId });
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
    const article = await findPublishedArticle(admin, input);
    if (!article) return apiError("مقاله برای دریافت دیدگاه در دسترس نیست.", 404);
    if (input.parentId) {
      const { data: parent } = await admin.from("comments").select("id").eq("id", input.parentId).eq("article_id", article.id).eq("status", "approved").maybeSingle();
      if (!parent) return apiError("دیدگاه والد معتبر نیست.", 422);
    }
    const { data, error } = await admin.from("comments").insert({ article_id: article.id, parent_id: input.parentId ?? null, user_id: user?.id ?? null, name: input.name, email: input.email, content: input.content, status: "pending" }).select("id,parent_id,name,content,status,created_at").single();
    if (error) throw error;
    return apiSuccess({ id: data.id, parentId: data.parent_id, name: data.name, content: data.content, status: data.status, createdAt: data.created_at }, 201);
  } catch (error) { return handleApiError(error); }
}
