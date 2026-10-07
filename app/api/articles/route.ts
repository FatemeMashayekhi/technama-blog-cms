import { revalidatePath } from "next/cache";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { assertJsonMutation, enforceApiRateLimit } from "@/lib/api-security";
import { requireRole } from "@/lib/auth";
import { createArticle } from "@/lib/cms-write";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { articleInputSchema, articleListQuerySchema } from "@/lib/validation";

export async function GET(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const url = new URL(request.url);
    const queryInput = articleListQuerySchema.parse(Object.fromEntries(url.searchParams));
    const scope = queryInput.scope;
    if (scope === "admin") {
      const access = await requireRole(["admin", "editor", "author"]);
      if (!access.ok) return apiError(access.error, access.status);
    }
    const supabase = await createSupabaseServerClient();
    let query = supabase.from("articles").select("*,author:profiles!articles_author_id_fkey(id,display_name,username,avatar_url),category:categories(id,name,slug,color),article_tags(tag:tags(id,name,slug))").order("created_at", { ascending: false });
    if (scope !== "admin") query = query.eq("status", "published").lte("published_at", new Date().toISOString());
    if (queryInput.slug) query = query.eq("slug", queryInput.slug);
    const { data, error } = await query.limit(queryInput.limit);
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertJsonMutation(request, 220 * 1024);
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "article-write", 60, 600, access.profile.id);
    const input = articleInputSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const article = await createArticle(supabase, input, access.profile.id, access.profile.role !== "author");
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/articles/${article.slug}`);
    return apiSuccess(article, 201);
  } catch (error) { return handleApiError(error); }
}
