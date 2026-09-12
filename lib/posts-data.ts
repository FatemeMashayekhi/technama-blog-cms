import type { ArticleStatus } from "@/lib/dashboard-data";

export type PostArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: { background: string; accent: string };
  author: {
    id: string;
    name: string;
    initials: string;
    color: string;
  };
  category: {
    id: string;
    name: string;
  };
  status: ArticleStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
  updatedLabel: string;
  publishedAt?: string;
};

export const technologyCategories = [
  "هوش مصنوعی",
  "برنامه‌نویسی",
  "طراحی محصول",
  "امنیت",
  "سخت‌افزار",
  "استارتاپ",
  "اخبار فناوری",
] as const;

export const mockArticles: PostArticle[] = [
  {
    id: "post-001",
    title: "آینده هوش مصنوعی مولد در توسعه نرم‌افزار",
    slug: "future-of-generative-ai-in-software",
    excerpt: "هوش مصنوعی مولد چگونه فرایند طراحی، توسعه و نگهداری نرم‌افزار را تغییر می‌دهد؟",
    thumbnail: { background: "bg-[#dcebe8]", accent: "text-[#176a62]" },
    author: { id: "author-1", name: "مریم احمدی", initials: "ما", color: "bg-[#dbe8f2] text-[#254e6e]" },
    category: { id: "ai", name: "هوش مصنوعی" },
    status: "published",
    views: 12480,
    createdAt: "2026-08-22T09:20:00Z",
    updatedAt: "2026-09-06T08:30:00Z",
    updatedLabel: "۲ روز پیش",
    publishedAt: "2026-08-24T07:00:00Z",
  },
  {
    id: "post-002",
    title: "چرا معماری Server Components اهمیت دارد؟",
    slug: "why-server-components-matter",
    excerpt: "نگاهی عملی به مرز جدید کامپوننت‌های سرور و تأثیر آن بر تجربه توسعه‌دهنده.",
    thumbnail: { background: "bg-[#e6ebf3]", accent: "text-[#435c80]" },
    author: { id: "author-2", name: "علی رضایی", initials: "عر", color: "bg-[#e8e2f2] text-[#604b78]" },
    category: { id: "programming", name: "برنامه‌نویسی" },
    status: "review",
    views: 0,
    createdAt: "2026-09-01T11:10:00Z",
    updatedAt: "2026-09-08T06:10:00Z",
    updatedLabel: "امروز، ۰۹:۴۰",
  },
  {
    id: "post-003",
    title: "بررسی روندهای جدید طراحی رابط کاربری",
    slug: "new-ui-design-trends",
    excerpt: "از رابط‌های تطبیقی تا طراحی مبتنی بر محتوا؛ روندهایی که ارزش دنبال‌کردن دارند.",
    thumbnail: { background: "bg-[#f4e8dc]", accent: "text-[#875d37]" },
    author: { id: "author-3", name: "سارا اکبری", initials: "سا", color: "bg-[#f4e5d8] text-[#82552f]" },
    category: { id: "product-design", name: "طراحی محصول" },
    status: "published",
    views: 8920,
    createdAt: "2026-08-15T14:00:00Z",
    updatedAt: "2026-09-05T12:00:00Z",
    updatedLabel: "۳ روز پیش",
    publishedAt: "2026-08-18T09:00:00Z",
  },
  {
    id: "post-004",
    title: "TypeScript؛ از تایپ ساده تا معماری مقیاس‌پذیر",
    slug: "typescript-scalable-architecture",
    excerpt: "الگوهایی برای ساخت کدبیس‌های TypeScript قابل نگهداری در تیم‌های محصول.",
    thumbnail: { background: "bg-[#dce8f3]", accent: "text-[#2d5e88]" },
    author: { id: "author-4", name: "کیان نادری", initials: "کن", color: "bg-[#ddefe9] text-[#30665c]" },
    category: { id: "programming", name: "برنامه‌نویسی" },
    status: "draft",
    views: 0,
    createdAt: "2026-09-03T10:00:00Z",
    updatedAt: "2026-09-07T15:20:00Z",
    updatedLabel: "دیروز، ۱۸:۵۰",
  },
  {
    id: "post-005",
    title: "امنیت زنجیره تأمین نرم‌افزار؛ تهدیدی که دیده نمی‌شود",
    slug: "software-supply-chain-security",
    excerpt: "چرا وابستگی‌های کوچک می‌توانند به بزرگ‌ترین نقطه ضعف یک محصول تبدیل شوند؟",
    thumbnail: { background: "bg-[#f0e2e2]", accent: "text-[#8a4747]" },
    author: { id: "author-2", name: "علی رضایی", initials: "عر", color: "bg-[#e8e2f2] text-[#604b78]" },
    category: { id: "security", name: "امنیت" },
    status: "published",
    views: 6375,
    createdAt: "2026-08-10T08:00:00Z",
    updatedAt: "2026-09-04T10:30:00Z",
    updatedLabel: "۴ روز پیش",
    publishedAt: "2026-08-12T08:30:00Z",
  },
  {
    id: "post-006",
    title: "تراشه‌های هوش مصنوعی چه مسیری را طی می‌کنند؟",
    slug: "future-of-ai-chips",
    excerpt: "رقابت معماری‌های پردازشی برای پاسخ به نیاز روزافزون مدل‌های هوش مصنوعی.",
    thumbnail: { background: "bg-[#e5e7dc]", accent: "text-[#666c38]" },
    author: { id: "author-5", name: "نیما فرهمند", initials: "نف", color: "bg-[#e8ecd9] text-[#626b31]" },
    category: { id: "hardware", name: "سخت‌افزار" },
    status: "review",
    views: 0,
    createdAt: "2026-09-02T07:30:00Z",
    updatedAt: "2026-09-07T08:00:00Z",
    updatedLabel: "دیروز، ۱۱:۳۰",
  },
  {
    id: "post-007",
    title: "راهنمای طراحی یک Design System پایدار",
    slug: "sustainable-design-system-guide",
    excerpt: "چطور میان انعطاف‌پذیری، انسجام و سرعت تیم طراحی و توسعه تعادل ایجاد کنیم؟",
    thumbnail: { background: "bg-[#eee3ef]", accent: "text-[#77537b]" },
    author: { id: "author-3", name: "سارا اکبری", initials: "سا", color: "bg-[#f4e5d8] text-[#82552f]" },
    category: { id: "product-design", name: "طراحی محصول" },
    status: "draft",
    views: 0,
    createdAt: "2026-08-30T13:40:00Z",
    updatedAt: "2026-09-03T16:00:00Z",
    updatedLabel: "۵ روز پیش",
  },
  {
    id: "post-008",
    title: "از ایده تا بازار؛ روایت سه استارتاپ ایرانی",
    slug: "iranian-startups-from-idea-to-market",
    excerpt: "سه بنیان‌گذار درباره ساخت محصول، یافتن بازار و عبور از نخستین بحران‌ها می‌گویند.",
    thumbnail: { background: "bg-[#f2e9d9]", accent: "text-[#80622d]" },
    author: { id: "author-6", name: "الهام مرادی", initials: "ام", color: "bg-[#efe1e8] text-[#814e68]" },
    category: { id: "startup", name: "استارتاپ" },
    status: "published",
    views: 15120,
    createdAt: "2026-07-28T09:00:00Z",
    updatedAt: "2026-09-02T11:45:00Z",
    updatedLabel: "۶ روز پیش",
    publishedAt: "2026-08-01T06:00:00Z",
  },
  {
    id: "post-009",
    title: "مرور مهم‌ترین رویدادهای فناوری این هفته",
    slug: "weekly-tech-news-roundup",
    excerpt: "خلاصه‌ای دقیق از خبرها و محصولاتی که این هفته دنیای فناوری را شکل دادند.",
    thumbnail: { background: "bg-[#dfe9ed]", accent: "text-[#416a79]" },
    author: { id: "author-1", name: "مریم احمدی", initials: "ما", color: "bg-[#dbe8f2] text-[#254e6e]" },
    category: { id: "tech-news", name: "اخبار فناوری" },
    status: "published",
    views: 7340,
    createdAt: "2026-08-29T06:20:00Z",
    updatedAt: "2026-09-01T07:20:00Z",
    updatedLabel: "۷ روز پیش",
    publishedAt: "2026-08-29T10:00:00Z",
  },
  {
    id: "post-010",
    title: "React Compiler چه چیزی را برای ما تغییر می‌دهد؟",
    slug: "react-compiler-explained",
    excerpt: "بررسی سازوکار کامپایلر React و تأثیر واقعی آن بر کدهای رابط کاربری.",
    thumbnail: { background: "bg-[#dcecef]", accent: "text-[#267081]" },
    author: { id: "author-4", name: "کیان نادری", initials: "کن", color: "bg-[#ddefe9] text-[#30665c]" },
    category: { id: "programming", name: "برنامه‌نویسی" },
    status: "draft",
    views: 0,
    createdAt: "2026-08-27T09:10:00Z",
    updatedAt: "2026-08-31T13:25:00Z",
    updatedLabel: "۸ روز پیش",
  },
  {
    id: "post-011",
    title: "مدل‌های زبانی کوچک؛ آینده هوش مصنوعی روی دستگاه",
    slug: "small-language-models-on-device-ai",
    excerpt: "چرا مدل‌های کوچک‌تر می‌توانند مسیر محصولات هوشمند و خصوصی‌تر را هموار کنند؟",
    thumbnail: { background: "bg-[#e3e6f2]", accent: "text-[#505f8b]" },
    author: { id: "author-5", name: "نیما فرهمند", initials: "نف", color: "bg-[#e8ecd9] text-[#626b31]" },
    category: { id: "ai", name: "هوش مصنوعی" },
    status: "review",
    views: 0,
    createdAt: "2026-08-26T12:00:00Z",
    updatedAt: "2026-08-30T09:00:00Z",
    updatedLabel: "۹ روز پیش",
  },
  {
    id: "post-012",
    title: "رمز عبور بدون رمز؛ Passkey چگونه کار می‌کند؟",
    slug: "how-passkeys-work",
    excerpt: "آشنایی با استاندارد Passkey و مسیری که برای حذف رمزهای عبور پیش رو داریم.",
    thumbnail: { background: "bg-[#e9e5dc]", accent: "text-[#726343]" },
    author: { id: "author-6", name: "الهام مرادی", initials: "ام", color: "bg-[#efe1e8] text-[#814e68]" },
    category: { id: "security", name: "امنیت" },
    status: "published",
    views: 9840,
    createdAt: "2026-08-20T08:10:00Z",
    updatedAt: "2026-08-28T14:10:00Z",
    updatedLabel: "۱۱ روز پیش",
    publishedAt: "2026-08-21T07:00:00Z",
  },
];

