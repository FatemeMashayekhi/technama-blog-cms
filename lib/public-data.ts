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
  return {
    ...article,
    author: author ? { id: author.id, name: author.name, initials: author.initials, color: author.avatarColor } : article.author,
    image: articleImages[article.id] || "/editor-cover.svg",
    readingTime: readingTimes[index] || 6,
    publicDateLabel: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt || article.createdAt)),
    authorUsername: author?.username || article.author.id,
    categorySlug: category?.slug || article.category.id,
  };
}

type EditorialSeed = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorId: string;
  categoryId: string;
  image: string;
  readingTime: number;
  views: number;
  publishedAt: string;
};

const editorialSeeds: EditorialSeed[] = [
  { id: "editorial-next-rendering", title: "مدل رندرینگ Next.js؛ چه چیزی کجا اجرا می‌شود؟", slug: "nextjs-rendering-model-explained", excerpt: "راهنمای تصمیم‌گیری میان Server Component، Client Component، SSR و تولید ایستا در App Router.", authorId: "author-2", categoryId: "programming", image: "/media/code-workspace.svg", readingTime: 9, views: 7820, publishedAt: "2026-08-27T07:30:00Z" },
  { id: "editorial-typescript-boundaries", title: "مرزبندی TypeScript در کدبیس‌های بزرگ", slug: "typescript-boundaries-in-large-codebases", excerpt: "چطور قراردادهای داده، ماژول‌ها و لایه‌های دامنه را طوری طراحی کنیم که تغییر ارزان‌تر شود؟", authorId: "author-1", categoryId: "programming", image: "/media/code-workspace.svg", readingTime: 10, views: 6940, publishedAt: "2026-08-25T09:00:00Z" },
  { id: "editorial-ai-chips", title: "گلوگاه واقعی تراشه‌های هوش مصنوعی فقط توان پردازش نیست", slug: "ai-chips-memory-bandwidth-bottleneck", excerpt: "چرا پهنای باند حافظه، مصرف انرژی و انتقال داده به‌اندازه تعداد هسته‌ها اهمیت دارند؟", authorId: "author-5", categoryId: "hardware", image: "/media/chip.svg", readingTime: 8, views: 8110, publishedAt: "2026-08-23T06:45:00Z" },
  { id: "editorial-design-tokens", title: "Design Token؛ قرارداد مشترک طراحی و توسعه", slug: "design-tokens-as-a-team-contract", excerpt: "توکن‌ها چه زمانی از یک فایل رنگ و فاصله عبور می‌کنند و به زیرساخت واقعی محصول تبدیل می‌شوند؟", authorId: "author-3", categoryId: "product", image: "/media/design-system.svg", readingTime: 8, views: 5720, publishedAt: "2026-08-19T10:15:00Z" },
  { id: "editorial-react-compiler", title: "React Compiler در عمل؛ بهینه‌سازی بدون حدس", slug: "react-compiler-practical-guide", excerpt: "کامپایلر React چه مسئله‌ای را حل می‌کند، چه پیش‌نیازهایی دارد و کجا هنوز باید اندازه‌گیری کنیم؟", authorId: "author-2", categoryId: "programming", image: "/media/code-workspace.svg", readingTime: 7, views: 9360, publishedAt: "2026-08-16T08:20:00Z" },
  { id: "editorial-on-device-ai", title: "مدل‌های زبانی کوچک و آینده هوش مصنوعی روی دستگاه", slug: "small-language-models-on-device", excerpt: "اجرای مدل روی موبایل و لپ‌تاپ چگونه تأخیر، هزینه و حریم خصوصی محصولات هوشمند را تغییر می‌دهد؟", authorId: "author-5", categoryId: "ai", image: "/media/ai-future.svg", readingTime: 9, views: 10480, publishedAt: "2026-08-14T11:10:00Z" },
  { id: "editorial-wearables", title: "گجت‌های پوشیدنی چگونه حریم خصوصی را بازطراحی می‌کنند؟", slug: "privacy-first-wearables", excerpt: "پردازش محلی، حداقل‌سازی داده و رضایت آگاهانه چه نقشی در نسل بعدی ابزارهای پوشیدنی دارند؟", authorId: "author-6", categoryId: "gadgets", image: "/media/mobile-ui.svg", readingTime: 7, views: 4880, publishedAt: "2026-08-11T07:50:00Z" },
];

function toEditorialArticle(seed: EditorialSeed): PublicArticle {
  const author = mockAuthors.find((item) => item.id === seed.authorId);
  const category = mockCategories.find((item) => item.id === seed.categoryId);
  if (!author || !category) throw new Error(`Invalid editorial seed: ${seed.id}`);
  return {
    id: seed.id,
    title: seed.title,
    slug: seed.slug,
    excerpt: seed.excerpt,
    thumbnail: { background: "bg-[#dcebe8]", accent: "text-[#176a62]" },
    author: { id: author.id, name: author.name, initials: author.initials, color: author.avatarColor },
    category: { id: category.id, name: category.name },
    status: "published",
    views: seed.views,
    createdAt: seed.publishedAt,
    updatedAt: seed.publishedAt,
    updatedLabel: "منتشرشده در تحریریه",
    publishedAt: seed.publishedAt,
    image: seed.image,
    readingTime: seed.readingTime,
    publicDateLabel: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(seed.publishedAt)),
    authorUsername: author.username,
    categorySlug: category.slug,
  };
}

export const publicArticles = [...mockArticles.map(toPublicArticle), ...editorialSeeds.map(toEditorialArticle)];
export const publishedPublicArticles = publicArticles.filter((item) => item.status === "published");
export const featuredArticle = publishedPublicArticles.find((item) => item.id === "post-001") || publishedPublicArticles[0];
export const secondaryFeatured = ["post-002", "post-005", "post-008"].map((id) => publishedPublicArticles.find((item) => item.id === id)).filter((item): item is PublicArticle => Boolean(item));
export const latestPublicArticles = [...publishedPublicArticles].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 9);
export const popularPublicArticles = [...publishedPublicArticles].sort((a, b) => b.views - a.views).slice(0, 5);
export const publicCategories: PublicCategory[] = mockCategories.filter((item) => !item.parentId).map(({ id, name, slug, description, color }) => ({ id, name, slug, description, articleCount: publishedPublicArticles.filter((article) => article.category.id === id).length, color }));
export const publicAuthors: PublicAuthor[] = mockAuthors.filter((item) => item.status === "active").map(({ id, name, username, initials, avatarColor, bio, role }) => ({ id, name, username, initials, avatarColor, bio, articleCount: publishedPublicArticles.filter((article) => article.author.id === id).length, roleLabel: role === "admin" ? "سردبیر و نویسنده ارشد" : role === "editor" ? "ویراستار و نویسنده" : "نویسنده تخصصی" }));

export type PublicHomeData = { featured: PublicArticle; secondary: PublicArticle[]; latest: PublicArticle[]; popular: PublicArticle[]; categories: PublicCategory[]; authors: PublicAuthor[] };
