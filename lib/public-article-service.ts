import { cache } from "react";
import { createArticleDetail, type ArticleContentBlock, type PublicArticleDetail } from "@/lib/public-article-data";
import { isSupabaseConfigured } from "@/lib/env";
import { publishedPublicArticles, type PublicArticle } from "@/lib/public-data";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { MagazineComment } from "@/lib/comments-data";
import type { Tag } from "@/lib/taxonomy-data";

type DbAuthor = { id: string; display_name: string; username: string; avatar_url: string | null; bio: string; role: "admin" | "editor" | "author"; is_active: boolean; created_at: string };
type DbCategory = { id: string; name: string; slug: string; color: string };
type DbTag = { id: string; name: string; slug: string; created_at: string };
export type DbArticle = { id: string; title: string; slug: string; excerpt: string; content?: string; cover_url: string | null; status: string; views: number; created_at: string; updated_at: string; published_at: string | null; reading_time: number; author: DbAuthor; category: DbCategory | null; article_tags?: { tag: DbTag | null }[] };
type DbComment = { id: string; parent_id: string | null; name: string; content: string; likes: number; created_at: string };
const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join(""); }
function htmlToBlocks(html: string): ArticleContentBlock[] {
  const blocks: ArticleContentBlock[] = [];
  const pattern = /<(h2|h3|p|blockquote|pre|ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const match of html.matchAll(pattern)) {
    const tag = match[1].toLowerCase(); const body = match[2]; const text = plain(body); if (!text) continue;
    if (tag === "h2" || tag === "h3") blocks.push({ type: "heading", level: tag === "h2" ? 2 : 3, id: `section-${blocks.length + 1}`, text });
    else if (tag === "blockquote") blocks.push({ type: "blockquote", text });
    else if (tag === "pre") blocks.push({ type: "code", language: "text", code: text });
    else if (tag === "ul" || tag === "ol") blocks.push({ type: tag === "ul" ? "unordered-list" : "ordered-list", items: [...body.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((item) => plain(item[1])).filter(Boolean) });
    else blocks.push({ type: "paragraph", text });
  }
  return blocks.length ? blocks : [{ type: "paragraph", text: plain(html) }];
}

export function mapDatabaseArticle(row: DbArticle): PublicArticle {
  const author = row.author; const category = row.category;
  const createdAt = row.created_at as string; const publishedAt = row.published_at as string | null;
  return { id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt, thumbnail: { background: "bg-[#dcebe8]", accent: "text-[#176a62]" }, author: { id: author.id, name: author.display_name ?? "تحریریه تک‌نما", initials: initials(author.display_name ?? "تک نما"), color: "bg-[#dbe8f2] text-[#254e6e]" }, category: { id: category?.id ?? "general", name: category?.name ?? "فناوری" }, status: "published", views: Number(row.views ?? 0), createdAt, updatedAt: row.updated_at, updatedLabel: "به‌روزرسانی اخیر", publishedAt: publishedAt ?? undefined, image: row.cover_url || "/editor-cover.svg", readingTime: Number(row.reading_time ?? 1), publicDateLabel: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(publishedAt ?? createdAt)), authorUsername: author.username ?? author.id, categorySlug: category?.slug ?? category?.id ?? "general" };
}

async function loadDbArticle(slug: string): Promise<PublicArticleDetail | null> {
  try {
    const supabase = createSupabasePublicClient();
    const { data: row, error } = await supabase.from("articles").select("id,title,slug,excerpt,content,cover_url,status,views,created_at,updated_at,published_at,reading_time,author:profiles!articles_author_id_fkey(id,display_name,username,avatar_url,bio,role,is_active,created_at),category:categories(id,name,slug,color),article_tags(tag:tags(id,name,slug,created_at))").eq("slug", slug).eq("status", "published").lte("published_at", new Date().toISOString()).maybeSingle();
    if (error || !row) return null;
    const article = row as unknown as DbArticle;
    const base = mapDatabaseArticle(article);
    const rpc = supabase.rpc as unknown as (name: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
    const { data: commentRows } = await rpc("get_public_comments", { target_article_id: article.id });
    const comments: MagazineComment[] = ((commentRows ?? []) as DbComment[]).map((comment) => ({ id: comment.id, content: comment.content, commenter: { name: comment.name, email: "", initials: initials(comment.name), color: "bg-[#dbe8f2] text-[#315d78]" }, article: { id: article.id, title: article.title, slug: article.slug }, author: { id: article.author.id, name: article.author.display_name, initials: initials(article.author.display_name) }, status: "approved", likes: comment.likes, createdAt: comment.created_at, parentId: comment.parent_id ?? undefined }));
    const tags: Tag[] = (article.article_tags ?? []).flatMap((item) => item.tag ? [{ id: item.tag.id, name: item.tag.name, slug: item.tag.slug, articleCount: 0, createdAt: item.tag.created_at }] : []);
    const authorName = article.author.display_name;
    return { ...base, content: htmlToBlocks(article.content ?? ""), tags, approvedComments: comments, authorDetails: { id: article.author.id, name: authorName, username: article.author.username, email: "", avatar: article.author.avatar_url ?? undefined, avatarColor: "bg-[#dbe8f2] text-[#254e6e]", initials: initials(authorName), bio: article.author.bio ?? "", role: article.author.role, status: article.author.is_active ? "active" : "inactive", articleCount: 0, totalViews: 0, publishedRate: 0, joinedAt: article.author.created_at, joinedLabel: "عضو تحریریه", socialLinks: { website: "", linkedin: "", twitter: "", github: "" }, recentArticles: [] } };
  } catch {
    return null;
  }
}

export const getArticleBySlug = cache(async (slug: string): Promise<PublicArticleDetail | null> => {
  const localArticle = publishedPublicArticles.find((item) => item.slug === slug);
  if (!isSupabaseConfigured) return localArticle ? createArticleDetail(localArticle) : null;
  const databaseArticle = await loadDbArticle(slug);
  return databaseArticle ?? (localArticle ? createArticleDetail(localArticle) : null);
});
export async function getRelatedArticles(article: PublicArticle): Promise<PublicArticle[]> {
  const localRelated = () => publishedPublicArticles.filter((item) => item.id !== article.id).sort((a, b) => Number(b.category.id === article.category.id) - Number(a.category.id === article.category.id)).slice(0, 3);
  if (!isSupabaseConfigured || publishedPublicArticles.some((item) => item.id === article.id)) return localRelated();
  try {
    const { data, error } = await createSupabasePublicClient().from("articles").select("id,title,slug,excerpt,cover_url,status,views,created_at,updated_at,published_at,reading_time,author:profiles!articles_author_id_fkey(id,display_name,username,avatar_url,bio,role,is_active,created_at),category:categories(id,name,slug,color)").eq("status", "published").neq("id", article.id).lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(3);
    if (error || !data?.length) return localRelated();
    return (data as unknown as DbArticle[]).map(mapDatabaseArticle);
  } catch {
    return localRelated();
  }
}
export function getPublishedArticleSlugs() { return publishedPublicArticles.map((item) => item.slug); }
