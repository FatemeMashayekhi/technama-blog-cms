import { z } from "zod";
import { normalizeWebUrl } from "@/lib/url-security";

const slug = z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "نامک باید با حروف انگلیسی، عدد و خط تیره نوشته شود.");
const safeWebUrl = z.string().trim().max(2_000).refine((value) => !value || normalizeWebUrl(value, { allowRelative: true }) !== null, "آدرس اینترنتی معتبر نیست.");
const optionalUuid = z.preprocess((value) => value === "" ? null : value, z.string().uuid().nullable().optional());
const scheduledAt = z.preprocess((value) => value === "" ? null : value, z.string().datetime({ offset: true }).max(40).nullable().optional());
export const uuidSchema = z.string().uuid();

const articleFields = {
  title: z.string().trim().min(1).max(220), slug,
  excerpt: z.string().trim().max(500), content: z.string().max(200_000),
  categoryId: z.string().max(100), authorId: z.string().min(1).optional(), tags: z.array(z.string().min(1)).max(20).default([]),
  featuredImage: safeWebUrl.optional().nullable(), status: z.enum(["draft", "review", "published", "scheduled"]),
  publishMode: z.enum(["now", "scheduled"]).default("now"), publishAt: scheduledAt,
  seo: z.object({ title: z.string().max(70).default(""), description: z.string().max(180).default(""), canonicalUrl: safeWebUrl.default(""), ogImage: safeWebUrl.default("") }),
};
export const articleInputSchema = z.object(articleFields).superRefine((value, context) => {
  if (value.status === "draft") return;
  if (value.excerpt.length < 30) context.addIssue({ code: "custom", path: ["excerpt"], message: "خلاصه مقاله باید حداقل ۳۰ کاراکتر باشد." });
  if (!value.content.replace(/<[^>]*>/g, "").trim()) context.addIssue({ code: "custom", path: ["content"], message: "محتوا الزامی است." });
  if (!value.categoryId) context.addIssue({ code: "custom", path: ["categoryId"], message: "دسته‌بندی الزامی است." });
  if (value.status === "scheduled" && !value.publishAt) context.addIssue({ code: "custom", path: ["publishAt"], message: "زمان انتشار الزامی است." });
  else if (value.status === "scheduled" && Date.parse(value.publishAt!) <= Date.now()) context.addIssue({ code: "custom", path: ["publishAt"], message: "زمان انتشار باید در آینده باشد." });
});
export const articlePatchSchema = z.object(articleFields).partial().superRefine((value, context) => {
  if (value.status === "scheduled" && !value.publishAt) context.addIssue({ code: "custom", path: ["publishAt"], message: "زمان انتشار الزامی است." });
  else if (value.status === "scheduled" && Date.parse(value.publishAt!) <= Date.now()) context.addIssue({ code: "custom", path: ["publishAt"], message: "زمان انتشار باید در آینده باشد." });
});

const publicCommentArticleFields = {
  articleId: z.string().uuid().optional(),
  articleSlug: slug.optional(),
};
const publicCommentName = z.string().trim()
  .min(2, "نام باید دست‌کم ۲ کاراکتر باشد.")
  .max(80, "نام نمی‌تواند بیشتر از ۸۰ کاراکتر باشد.")
  .refine((value) => !/[<>\u0000-\u001F\u007F]/u.test(value), "نام شامل کاراکتر غیرمجاز است.");
const publicCommentContent = z.string().trim()
  .min(10, "دیدگاه باید دست‌کم ۱۰ کاراکتر باشد.")
  .max(2_000, "دیدگاه نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد.")
  .refine((value) => (value.match(/https?:\/\//gi) ?? []).length <= 2, "در هر دیدگاه حداکثر دو پیوند مجاز است.");
export const publicCommentSchema = z.object({
  ...publicCommentArticleFields,
  parentId: optionalUuid,
  name: publicCommentName,
  email: z.string().trim().toLowerCase().email("یک ایمیل معتبر وارد کنید.").max(254),
  content: publicCommentContent,
  website: z.literal("").optional(),
}).refine((value) => value.articleId || value.articleSlug, { message: "شناسه یا نامک مقاله الزامی است.", path: ["articleId"] });
export const publicCommentReceiptSchema = z.object({
  ...publicCommentArticleFields,
  ids: z.array(z.string().uuid()).min(1).max(20),
}).refine((value) => value.articleId || value.articleSlug, { message: "شناسه یا نامک مقاله الزامی است.", path: ["articleId"] });
export const commentModerationSchema = z.object({ status: z.enum(["pending", "approved", "rejected", "spam"]) });
export const mediaPatchSchema = z.object({ name: z.string().trim().min(1).max(180).optional(), altText: z.string().trim().max(300).optional() }).refine((value) => value.name !== undefined || value.altText !== undefined);
export const categoryInputSchema = z.object({ name: z.string().trim().min(2).max(100), slug, description: z.string().trim().min(20).max(1_000), icon: z.string().max(60).default("Folder"), color: z.string().regex(/^#[0-9a-fA-F]{6}$/), parentId: optionalUuid, coverImage: safeWebUrl.optional().nullable(), seo: z.object({ title: z.string().max(70), description: z.string().max(180), canonicalUrl: safeWebUrl }) });
export const tagInputSchema = z.object({ name: z.string().trim().min(1).max(60), slug });
export const newsletterSchema = z.object({ email: z.string().email().max(254) });
export const loginInputSchema = z.object({ email: z.string().trim().toLowerCase().email("ایمیل معتبر وارد کنید.").max(254), password: z.string().min(6, "رمز عبور باید دست‌کم ۶ کاراکتر باشد.").max(200) });
export const signupInputSchema = loginInputSchema.extend({ password: z.string().min(8, "رمز عبور باید دست‌کم ۸ کاراکتر باشد.").max(200), displayName: z.string().trim().min(2, "نام نمایشی باید دست‌کم ۲ کاراکتر باشد.").max(100) });
export const inviteAuthorSchema = z.object({ email: z.string().email().max(254), displayName: z.string().trim().min(2).max(100), role: z.enum(["admin", "editor", "author"]).default("author") });
export const profilePatchSchema = z.object({ displayName: z.string().trim().min(2).max(100).optional(), username: z.string().trim().regex(/^[a-zA-Z0-9._-]{3,40}$/).optional(), email: z.string().email().max(254).optional(), avatarUrl: safeWebUrl.optional().nullable(), bio: z.string().trim().max(500).optional(), role: z.enum(["admin", "editor", "author"]).optional(), isActive: z.boolean().optional() }).refine((value) => Object.keys(value).length > 0);
export const ownProfilePatchSchema = z.object({ displayName: z.string().trim().min(2).max(100), username: z.string().trim().regex(/^[a-zA-Z0-9._-]{3,40}$/, "نام کاربری باید ۳ تا ۴۰ کاراکتر و شامل حروف انگلیسی، عدد، نقطه، خط تیره یا زیرخط باشد."), avatarUrl: safeWebUrl.optional().nullable(), bio: z.string().trim().max(500) });
export const settingsInputSchema = z.object({ key: z.literal("cms"), value: z.record(z.string(), z.unknown()).refine((value) => JSON.stringify(value).length <= 50_000, "حجم تنظیمات بیشتر از حد مجاز است.") });

export const articleListQuerySchema = z.object({
  scope: z.enum(["admin"]).optional(),
  slug: slug.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
