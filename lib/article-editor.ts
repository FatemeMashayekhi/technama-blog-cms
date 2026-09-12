import { mockArticles } from "@/lib/posts-data";
import { isSupabaseConfigured } from "@/lib/env";

export type EditorArticleStatus = "draft" | "review" | "published" | "scheduled";

export type ArticleFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  authorId: string;
  tags: string[];
  featuredImage?: string;
  featuredImageName?: string;
  status: EditorArticleStatus;
  publishMode: "now" | "scheduled";
  publishAt?: string;
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImage: string;
  };
};

export type ArticleFormErrors = Partial<Record<"title" | "slug" | "excerpt" | "content" | "categoryId" | "authorId" | "publishAt", string>>;

export const editorAuthors = [
  { id: "author-1", name: "مریم احمدی", initials: "ما" },
  { id: "author-2", name: "علی رضایی", initials: "عر" },
  { id: "author-3", name: "سارا محمدی", initials: "سم" },
  { id: "author-4", name: "امیر کریمی", initials: "اک" },
];

const sampleContent = `<h2>هوش مصنوعی؛ از ابزار تا همکار توسعه</h2><p>هوش مصنوعی مولد در مدت کوتاهی از یک ابزار آزمایشی به بخشی از جریان روزمره توسعه نرم‌افزار تبدیل شده است. امروز تیم‌ها از این فناوری برای تحلیل کد، نوشتن آزمون و مستندسازی استفاده می‌کنند.</p><p>با این حال، ارزش واقعی این ابزارها زمانی آشکار می‌شود که در کنار قضاوت مهندسی و فرایندهای دقیق بازبینی قرار بگیرند.</p><blockquote><p>آینده متعلق به تیم‌هایی است که سرعت هوش مصنوعی را با دقت انسانی ترکیب می‌کنند.</p></blockquote><h3>معماری همچنان اهمیت دارد</h3><p>تولید سریع کد جایگزین تصمیم‌های معماری نمی‌شود. مرزبندی درست ماژول‌ها، قراردادهای شفاف و مشاهده‌پذیری سیستم همچنان پایه‌های یک محصول پایدار هستند.</p><pre><code>const future = humanJudgment + assistedDevelopment;</code></pre><p>در نهایت، هوش مصنوعی نقش توسعه‌دهنده را حذف نمی‌کند؛ بلکه سطح مسئله‌هایی را که می‌توانیم حل کنیم بالاتر می‌برد.</p>`;

export const emptyArticle: ArticleFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  categoryId: "",
  authorId: "author-1",
  tags: [],
  status: "draft",
  publishMode: "now",
  seo: { title: "", description: "", canonicalUrl: "", ogImage: "" },
};

export function getMockArticleForEditor(id: string): ArticleFormData | null {
  const article = mockArticles.find((item) => item.id === id);
  if (!article) return null;
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: sampleContent,
    categoryId: article.category.name,
    authorId: article.author.id === "author-3" ? "author-3" : article.author.id,
    tags: article.category.id === "ai" ? ["AI", "توسعه نرم‌افزار", "آینده فناوری"] : ["Next.js", "React", "Frontend"],
    featuredImage: "/editor-cover.svg",
    featuredImageName: "technology-editorial-cover.svg",
    status: article.status,
    publishMode: "now",
    seo: {
      title: article.title,
      description: article.excerpt,
      canonicalUrl: `https://technama.ir/articles/${article.slug}`,
      ogImage: "/editor-cover.svg",
    },
  };
}

export async function saveMockArticle(data: ArticleFormData) {
  await new Promise((resolve) => window.setTimeout(resolve, 650));
  return { ...data, savedAt: new Date().toISOString() };
}

export async function saveArticleToCms(data: ArticleFormData, articleId?: string) {
  if (!isSupabaseConfigured) return { ...(await saveMockArticle(data)), id: articleId };
  const response = await fetch(articleId ? `/api/articles/${articleId}` : "/api/articles", {
    method: articleId ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  });
  const result = await response.json() as { ok: boolean; data?: { id: string }; error?: string };
  if (!response.ok || !result.ok || !result.data) throw new Error(result.error || "ذخیره مقاله انجام نشد.");
  return result.data;
}

export function validateArticle(data: ArticleFormData): ArticleFormErrors {
  const errors: ArticleFormErrors = {};
  if (!data.title.trim()) errors.title = "عنوان مقاله الزامی است.";
  if (!data.slug.trim()) errors.slug = "آدرس مقاله الزامی است.";
  if (data.excerpt.trim().length < 30) errors.excerpt = "خلاصه مقاله باید حداقل ۳۰ کاراکتر باشد.";
  if (!data.content.replace(/<[^>]*>/g, "").trim()) errors.content = "محتوای مقاله نمی‌تواند خالی باشد.";
  if (!data.categoryId) errors.categoryId = "انتخاب دسته‌بندی الزامی است.";
  if (!data.authorId) errors.authorId = "انتخاب نویسنده الزامی است.";
  if (data.publishMode === "scheduled" && !data.publishAt) errors.publishAt = "تاریخ انتشار را انتخاب کنید.";
  return errors;
}
