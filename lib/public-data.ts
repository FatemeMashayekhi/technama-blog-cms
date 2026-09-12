import { mockAuthors, type Author } from "@/lib/authors-data";
import { mockArticles, type PostArticle } from "@/lib/posts-data";
import { mockCategories, type Category } from "@/lib/taxonomy-data";

export type PublicArticle = PostArticle & {
  image: string;
  readingTime: number;
  publicDateLabel: string;
  authorUsername: string;
  categorySlug: string;
};

export type PublicAuthor = Pick<Author, "id" | "name" | "username" | "initials" | "avatarColor" | "bio" | "articleCount"> & { roleLabel: string };
export type PublicCategory = Pick<Category, "id" | "name" | "slug" | "description" | "articleCount" | "color">;

const articleImages: Record<string, string> = {
  "post-001": "/media/ai-future.svg", "post-002": "/media/code-workspace.svg", "post-003": "/media/design-system.svg", "post-004": "/media/code-workspace.svg", "post-005": "/media/security.svg", "post-006": "/media/chip.svg", "post-007": "/media/design-system.svg", "post-008": "/media/startup-team.svg", "post-009": "/media/conference.svg", "post-010": "/media/mobile-ui.svg", "post-011": "/media/ai-future.svg", "post-012": "/media/security.svg",
};
const readingTimes = [8, 6, 7, 9, 8, 6, 7, 10, 5, 6, 8, 7];

function toPublicArticle(article: PostArticle, index: number): PublicArticle {
  const author = mockAuthors.find((item) => item.id === article.author.id);
  const category = mockCategories.find((item) => item.id === article.category.id || item.name === article.category.name);
  return { ...article, image: articleImages[article.id] || "/editor-cover.svg", readingTime: readingTimes[index] || 6, publicDateLabel: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt || article.createdAt)), authorUsername: author?.username || article.author.id, categorySlug: category?.slug || article.category.id };
}

const archiveTitleTemplates = [
  (name: string) => `راهنمای عملی ${name} برای تیم‌های محصول`,
  (name: string) => `پنج روند مهم ${name} که باید دنبال کرد`,
  (name: string) => `از ایده تا اجرا؛ تجربه‌های واقعی در ${name}`,
  (name: string) => `اشتباه‌های رایج در ${name} و راه پیشگیری از آن‌ها`,
  (name: string) => `گفت‌وگو با متخصصان؛ آینده ${name} در ایران`,
  (name: string) => `چشم‌انداز ${name} در سال پیش رو`,
];
const categoryImages: Record<string, string> = { ai: "/media/ai-future.svg", programming: "/media/code-workspace.svg", product: "/media/design-system.svg", security: "/media/security.svg", startup: "/media/startup-team.svg", hardware: "/media/chip.svg", gadgets: "/media/mobile-ui.svg" };
const archiveArticles: PublicArticle[] = mockCategories.filter((category) => !category.parentId).flatMap((category, categoryIndex) => archiveTitleTemplates.map((makeTitle, index) => {
  const author = mockAuthors[(categoryIndex + index) % Math.min(mockAuthors.length, 6)];
  const createdAt = `2026-07-${String(10 + index).padStart(2, "0")}T08:00:00Z`;
  return { id: `archive-${category.id}-${index + 1}`, title: makeTitle(category.name), slug: `${category.slug}-editorial-${index + 1}`, excerpt: `${category.description}؛ در این مقاله تجربه‌های عملی، تصمیم‌های مهم و مسیرهای قابل اجرا را مرور می‌کنیم.`, thumbnail: { background: "bg-[#dcebe8]", accent: "text-[#176a62]" }, author: { id: author.id, name: author.name, initials: author.initials, color: author.avatarColor }, category: { id: category.id, name: category.name }, status: "published", views: 1800 + categoryIndex * 270 + index * 210, createdAt, updatedAt: createdAt, updatedLabel: "تابستان ۱۴۰۵", publishedAt: createdAt, image: categoryImages[category.id] || "/editor-cover.svg", readingTime: 5 + index % 4, publicDateLabel: `${(20 + index).toLocaleString("fa-IR")} تیر ۱۴۰۵`, authorUsername: author.username, categorySlug: category.slug };
}));

export const publicArticles = [...mockArticles.map(toPublicArticle), ...archiveArticles];
export const publishedPublicArticles = publicArticles.filter((item) => item.status === "published");
export const featuredArticle = publishedPublicArticles.find((item) => item.id === "post-001") || publishedPublicArticles[0];
export const secondaryFeatured = ["post-002", "post-005", "post-008"].map((id) => publishedPublicArticles.find((item) => item.id === id)).filter((item): item is PublicArticle => Boolean(item));
export const latestPublicArticles = [...publishedPublicArticles].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 9);
export const popularPublicArticles = [...publishedPublicArticles].sort((a, b) => b.views - a.views).slice(0, 5);
export const publicCategories: PublicCategory[] = mockCategories.filter((item) => !item.parentId).map(({ id, name, slug, description, articleCount, color }) => ({ id, name, slug, description, articleCount, color }));
export const publicAuthors: PublicAuthor[] = mockAuthors.filter((item) => item.status === "active").map(({ id, name, username, initials, avatarColor, bio, articleCount, role }) => ({ id, name, username, initials, avatarColor, bio, articleCount, roleLabel: role === "admin" ? "سردبیر و نویسنده ارشد" : role === "editor" ? "ویراستار و نویسنده" : "نویسنده تخصصی" }));

export type PublicHomeData = { featured: PublicArticle; secondary: PublicArticle[]; latest: PublicArticle[]; popular: PublicArticle[]; categories: PublicCategory[]; authors: PublicAuthor[] };
