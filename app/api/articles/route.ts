import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { createArticle } from "@/lib/cms-write";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { articleInputSchema } from "@/lib/validation";

export async function GET(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope");
    if (scope === "admin") {
      const access = await requireRole(["admin", "editor", "author"]);
      if (!access.ok) return apiError(access.error, access.status);
    }
    const supabase = await createSupabaseServerClient();
    let query = supabase.from("articles").select("*,author:profiles!articles_author_id_fkey(id,display_name,username,avatar_url),category:categories(id,name,slug,color),article_tags(tag:tags(id,name,slug))").order("created_at", { ascending: false });
    if (scope !== "admin") query = query.eq("status", "published").lte("published_at", new Date().toISOString());
    const slug = url.searchParams.get("slug");
    if (slug) query = query.eq("slug", slug);
    const { data, error } = await query.limit(Math.min(Number(url.searchParams.get("limit")) || 50, 100));
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    const input = articleInputSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const article = await createArticle(supabase, input, access.profile.id, access.profile.role !== "author");
    return apiSuccess(article, 201);
  } catch (error) { return handleApiError(error); }
}
