import { createArticleDetail, type ArticleContentBlock, type PublicArticleDetail } from "@/lib/public-article-data";
import { isSupabaseConfigured } from "@/lib/env";
import { publishedPublicArticles, type PublicArticle } from "@/lib/public-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MagazineComment } from "@/lib/comments-data";
import type { Tag } from "@/lib/taxonomy-data";

// Supabase is intentionally untyped until project-generated Database types are available.
type DbArticle = Record<string, any>;
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
  const author = row.author ?? {}; const category = row.category ?? {};
  const createdAt = row.created_at as string; const publishedAt = row.published_at as string | null;
  return { id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt, thumbnail: { background: "bg-[#dcebe8]", accent: "text-[#176a62]" }, author: { id: author.id, name: author.display_name ?? "تحریریه تک‌نما", initials: initials(author.display_name ?? "تک نما"), color: "bg-[#dbe8f2] text-[#254e6e]" }, category: { id: category.id ?? "general", name: category.name ?? "فناوری" }, status: "published", views: Number(row.views ?? 0), createdAt, updatedAt: row.updated_at, updatedLabel: "به‌روزرسانی اخیر", publishedAt: publishedAt ?? undefined, image: row.cover_url || "/editor-cover.svg", readingTime: Number(row.reading_time ?? 1), publicDateLabel: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(publishedAt ?? createdAt)), authorUsername: author.username ?? author.id, categorySlug: category.slug ?? category.id };
}

async function loadDbArticle(slug: string): Promise<PublicArticleDetail | null> {
  const supabase = await createSupabaseServerClient();
  const { data: row, error } = await supabase.from("articles").select("*,author:profiles!articles_author_id_fkey(*),category:categories(*),article_tags(tag:tags(*))").eq("slug", slug).eq("status", "published").lte("published_at", new Date().toISOString()).maybeSingle();
  if (error || !row) return null;
  const base = mapDatabaseArticle(row);
  const { data: commentRows } = await supabase.rpc("get_public_comments", { target_article_id: row.id });
  const comments: MagazineComment[] = (commentRows ?? []).map((comment: DbArticle) => ({ id: comment.id, content: comment.content, commenter: { name: comment.name, email: "", initials: initials(comment.name), color: "bg-[#dbe8f2] text-[#315d78]" }, article: { id: row.id, title: row.title, slug: row.slug }, author: { id: row.author.id, name: row.author.display_name, initials: initials(row.author.display_name) }, status: "approved", likes: comment.likes, createdAt: comment.created_at, parentId: comment.parent_id ?? undefined }));
  const tags: Tag[] = (row.article_tags ?? []).filter((item: DbArticle) => item.tag).map((item: DbArticle) => ({ id: item.tag.id, name: item.tag.name, slug: item.tag.slug, articleCount: 0, createdAt: item.tag.created_at }));
  const authorName = row.author.display_name as string;
  return { ...base, content: htmlToBlocks(row.content), tags, approvedComments: comments, authorDetails: { id: row.author.id, name: authorName, username: row.author.username, email: "", avatar: row.author.avatar_url ?? undefined, avatarColor: "bg-[#dbe8f2] text-[#254e6e]", initials: initials(authorName), bio: row.author.bio ?? "", role: row.author.role, status: row.author.is_active ? "active" : "inactive", articleCount: 0, totalViews: 0, publishedRate: 0, joinedAt: row.author.created_at, joinedLabel: "عضو تحریریه", socialLinks: { website: "", linkedin: "", twitter: "", github: "" }, recentArticles: [] } };
}

export async function getArticleBySlug(slug: string): Promise<PublicArticleDetail | null> {
  if (isSupabaseConfigured) return loadDbArticle(slug);
  const article = publishedPublicArticles.find((item) => item.slug === slug);
  return article ? createArticleDetail(article) : null;
}
export async function getRelatedArticles(article: PublicArticle): Promise<PublicArticle[]> {
  if (!isSupabaseConfigured) return publishedPublicArticles.filter((item) => item.id !== article.id).sort((a, b) => Number(b.category.id === article.category.id) - Number(a.category.id === article.category.id)).slice(0, 3);
  const { data } = await (await createSupabaseServerClient()).from("articles").select("*,author:profiles!articles_author_id_fkey(*),category:categories(*)").eq("status", "published").neq("id", article.id).lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(3);
  return (data ?? []).map(mapDatabaseArticle);
}
export function getPublishedArticleSlugs() { return publishedPublicArticles.map((item) => item.slug); }
