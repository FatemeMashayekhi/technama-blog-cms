import { z } from "zod";

const slug = z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "نامک باید با حروف انگلیسی، عدد و خط تیره نوشته شود.");
const optionalUuid = z.preprocess((value) => value === "" ? null : value, z.string().uuid().nullable().optional());

const articleFields = {
  title: z.string().trim().min(1).max(220), slug,
  excerpt: z.string().trim().max(500), content: z.string().max(500_000),
  categoryId: z.string().max(100), authorId: z.string().min(1).optional(), tags: z.array(z.string().min(1)).max(20).default([]),
  featuredImage: z.string().max(2_000).optional().nullable(), status: z.enum(["draft", "review", "published", "scheduled"]),
  publishMode: z.enum(["now", "scheduled"]).default("now"), publishAt: z.string().max(40).optional().nullable(),
  seo: z.object({ title: z.string().max(70).default(""), description: z.string().max(180).default(""), canonicalUrl: z.string().max(2_000).default(""), ogImage: z.string().max(2_000).default("") }),
};
export const articleInputSchema = z.object(articleFields).superRefine((value, context) => {
  if (value.status === "draft") return;
  if (value.excerpt.length < 30) context.addIssue({ code: "custom", path: ["excerpt"], message: "خلاصه مقاله باید حداقل ۳۰ کاراکتر باشد." });
  if (!value.content.replace(/<[^>]*>/g, "").trim()) context.addIssue({ code: "custom", path: ["content"], message: "محتوا الزامی است." });
  if (!value.categoryId) context.addIssue({ code: "custom", path: ["categoryId"], message: "دسته‌بندی الزامی است." });
  if (value.status === "scheduled" && !value.publishAt) context.addIssue({ code: "custom", path: ["publishAt"], message: "زمان انتشار الزامی است." });
});
export const articlePatchSchema = z.object(articleFields).partial();

export const publicCommentSchema = z.object({ articleId: z.string().uuid(), parentId: optionalUuid, name: z.string().trim().min(2).max(80), email: z.string().email().max(254), content: z.string().trim().min(5).max(5_000), website: z.string().max(0).optional() });
export const commentModerationSchema = z.object({ status: z.enum(["pending", "approved", "rejected", "spam"]) });
export const mediaPatchSchema = z.object({ name: z.string().trim().min(1).max(180).optional(), altText: z.string().trim().max(300).optional() }).refine((value) => value.name !== undefined || value.altText !== undefined);
export const categoryInputSchema = z.object({ name: z.string().trim().min(2).max(100), slug, description: z.string().trim().min(20).max(1_000), icon: z.string().max(60).default("Folder"), color: z.string().regex(/^#[0-9a-fA-F]{6}$/), parentId: optionalUuid, coverImage: z.string().max(2_000).optional().nullable(), seo: z.object({ title: z.string().max(70), description: z.string().max(180), canonicalUrl: z.string().max(2_000) }) });
export const tagInputSchema = z.object({ name: z.string().trim().min(1).max(60), slug });
export const newsletterSchema = z.object({ email: z.string().email().max(254) });
export const inviteAuthorSchema = z.object({ email: z.string().email().max(254), displayName: z.string().trim().min(2).max(100), role: z.enum(["admin", "editor", "author"]).default("author") });
export const profilePatchSchema = z.object({ displayName: z.string().trim().min(2).max(100).optional(), username: z.string().trim().regex(/^[a-zA-Z0-9._-]{3,40}$/).optional(), email: z.string().email().max(254).optional(), avatarUrl: z.string().max(2_000).optional().nullable(), bio: z.string().trim().max(500).optional(), role: z.enum(["admin", "editor", "author"]).optional(), isActive: z.boolean().optional() }).refine((value) => Object.keys(value).length > 0);
export const settingsInputSchema = z.object({ key: z.string().trim().min(2).max(80).regex(/^[a-z0-9._-]+$/), value: z.unknown() });
