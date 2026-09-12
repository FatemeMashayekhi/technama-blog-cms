export type CommentStatus = "pending" | "approved" | "rejected" | "spam";

export type MagazineComment = {
  id: string;
  content: string;
  commenter: { name: string; email: string; initials: string; color: string };
  article: { id: string; title: string; slug: string };
  author: { id: string; name: string; initials: string };
  status: CommentStatus;
  likes: number;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
};

const articles = {
  ai: { id: "post-001", title: "آینده هوش مصنوعی مولد در توسعه نرم‌افزار", slug: "future-of-generative-ai-in-software" },
  react: { id: "post-010", title: "React Compiler چه چیزی را برای ما تغییر می‌دهد؟", slug: "react-compiler-explained" },
  next: { id: "post-002", title: "چرا معماری Server Components اهمیت دارد؟", slug: "why-server-components-matter" },
  security: { id: "post-005", title: "امنیت زنجیره تأمین نرم‌افزار", slug: "software-supply-chain-security" },
  design: { id: "post-007", title: "راهنمای طراحی یک Design System پایدار", slug: "sustainable-design-system-guide" },
  startup: { id: "post-008", title: "از ایده تا بازار؛ روایت سه استارتاپ ایرانی", slug: "iranian-startups-from-idea-to-market" },
  hardware: { id: "post-006", title: "تراشه‌های هوش مصنوعی چه مسیری را طی می‌کنند؟", slug: "future-of-ai-chips" },
};
const authors = {
  maryam: { id: "author-1", name: "مریم احمدی", initials: "ما" },
  ali: { id: "author-2", name: "علی رضایی", initials: "عر" },
  sara: { id: "author-3", name: "سارا اکبری", initials: "سا" },
  kian: { id: "author-4", name: "کیان نادری", initials: "کن" },
  nima: { id: "author-5", name: "نیما فرهمند", initials: "نف" },
};
const people = [
  { name: "امیرحسین کاظمی", email: "amir.k@example.com", initials: "اک", color: "bg-[#dbe8f2] text-[#315d78]" },
  { name: "نگار محمدی", email: "negar.m@example.com", initials: "نم", color: "bg-[#efe1e8] text-[#80516a]" },
  { name: "رضا یوسفی", email: "reza.y@example.com", initials: "ری", color: "bg-[#e2eee9] text-[#396a5e]" },
  { name: "حدیث کریمی", email: "hadis.k@example.com", initials: "حک", color: "bg-[#eee6d9] text-[#7c633c]" },
  { name: "پارسا نیک‌پی", email: "parsa.n@example.com", initials: "پن", color: "bg-[#e6e3f1] text-[#62567d]" },
  { name: "الهه موسوی", email: "elahe.m@example.com", initials: "ام", color: "bg-[#dcebee] text-[#416b76]" },
  { name: "آرمان صادقی", email: "arman.s@example.com", initials: "آص", color: "bg-[#eee3dc] text-[#805945]" },
  { name: "ترانه اکبری", email: "taraneh.a@example.com", initials: "تا", color: "bg-[#e4ecdc] text-[#5d713f]" },
];

export const mockComments: MagazineComment[] = [
  { id: "comment-001", content: "تحلیل بسیار دقیقی بود. مخصوصاً بخش مربوط به تأثیر مدل‌های مولد روی فرایند بازبینی کد برای تیم ما کاملاً ملموس است.", commenter: people[0], article: articles.ai, author: authors.maryam, status: "pending", likes: 12, createdAt: "2026-09-08T07:42:00Z" },
  { id: "comment-002", content: "آیا React Compiler در پروژه‌های قدیمی هم بدون بازنویسی گسترده قابل استفاده است؟ تجربه عملی تیم‌ها در این زمینه جالب خواهد بود.", commenter: people[1], article: articles.react, author: authors.kian, status: "approved", likes: 24, createdAt: "2026-09-08T06:18:00Z" },
  { id: "comment-003", content: "تفکیک Server و Client Component را خیلی روشن توضیح دادید. مثال مربوط به کاهش حجم جاوااسکریپت واقعاً کاربردی بود.", commenter: people[2], article: articles.next, author: authors.ali, status: "approved", likes: 18, createdAt: "2026-09-07T16:30:00Z" },
  { id: "comment-004", content: "در کنار بررسی وابستگی‌ها، امضای artifactهای build هم باید جدی گرفته شود. شاید در نسخه بعدی مقاله به SLSA هم بپردازید.", commenter: people[3], article: articles.security, author: authors.ali, status: "pending", likes: 9, createdAt: "2026-09-07T13:05:00Z" },
  { id: "comment-005", content: "این دیدگاه شامل تبلیغ نامرتبط و لینک‌های تکراری بوده و توسط سامانه پالایش علامت‌گذاری شده است.", commenter: people[4], article: articles.startup, author: authors.maryam, status: "spam", likes: 0, createdAt: "2026-09-07T10:22:00Z" },
  { id: "comment-006", content: "به نظرم Design Tokenها زمانی ارزش واقعی پیدا می‌کنند که قرارداد مشترک میان تیم طراحی و توسعه باشند، نه فقط یک فایل JSON.", commenter: people[5], article: articles.design, author: authors.sara, status: "approved", likes: 31, createdAt: "2026-09-06T15:48:00Z" },
  { id: "comment-007", content: "مقایسه مصرف انرژی تراشه‌ها با معیار عملکرد به‌ازای وات می‌توانست نتیجه‌گیری مقاله را کامل‌تر کند.", commenter: people[6], article: articles.hardware, author: authors.nima, status: "pending", likes: 7, createdAt: "2026-09-06T11:10:00Z" },
  { id: "comment-008", content: "من با بخش مربوط به حذف کامل برنامه‌نویس موافق نیستم؛ ابزارها نقش را تغییر می‌دهند اما درک مسئله همچنان انسانی باقی می‌ماند.", commenter: people[7], article: articles.ai, author: authors.maryam, status: "approved", likes: 42, createdAt: "2026-09-05T18:20:00Z", parentId: "comment-001" },
  { id: "comment-009", content: "متن حاوی توهین مستقیم به نویسنده بود و مطابق سیاست گفت‌وگوی مجله قابل انتشار نیست.", commenter: people[4], article: articles.react, author: authors.kian, status: "rejected", likes: 1, createdAt: "2026-09-05T09:15:00Z" },
  { id: "comment-010", content: "برای پروژه‌های کوچک، استفاده از Server Components گاهی پیچیدگی بیشتری ایجاد می‌کند. بهتر است هزینه مهاجرت هم دیده شود.", commenter: people[0], article: articles.next, author: authors.ali, status: "approved", likes: 16, createdAt: "2026-09-04T14:00:00Z" },
  { id: "comment-011", content: "آیا ابزار مشخصی برای تهیه SBOM در پروژه‌های TypeScript پیشنهاد می‌کنید؟ ما بین Syft و ابزارهای اکوسیستم npm مردد هستیم.", commenter: people[1], article: articles.security, author: authors.ali, status: "pending", likes: 11, createdAt: "2026-09-03T08:40:00Z" },
  { id: "comment-012", content: "نمونه ساختار نام‌گذاری کامپوننت‌ها بسیار خوب بود؛ همین جزئیات کوچک در مقیاس بزرگ جلوی اختلاف‌های تیمی را می‌گیرد.", commenter: people[2], article: articles.design, author: authors.sara, status: "approved", likes: 27, createdAt: "2026-09-02T17:25:00Z", parentId: "comment-006" },
  { id: "comment-013", content: "پیام تکراری با هدف هدایت کاربران به یک سرویس سرمایه‌گذاری ناشناس؛ به‌صورت خودکار اسپم تشخیص داده شد.", commenter: people[6], article: articles.startup, author: authors.maryam, status: "spam", likes: 0, createdAt: "2026-09-01T12:12:00Z" },
  { id: "comment-014", content: "مصاحبه‌ها صادقانه بودند، به‌خصوص صحبت درباره پیدا کردن product-market fit در بازار ایران.", commenter: people[3], article: articles.startup, author: authors.maryam, status: "approved", likes: 35, createdAt: "2026-08-31T10:35:00Z" },
  { id: "comment-015", content: "در نسل بعدی تراشه‌ها حافظه HBM تعیین‌کننده‌تر از تعداد هسته‌ها خواهد بود. خوب است نمودار پهنای باند هم اضافه شود.", commenter: people[5], article: articles.hardware, author: authors.nima, status: "pending", likes: 14, createdAt: "2026-08-29T07:55:00Z" },
  { id: "comment-016", content: "این پاسخ از موضوع مقاله خارج شده و شامل اطلاعات تأییدنشده بود؛ رد شدن آن تصمیم درستی است.", commenter: people[7], article: articles.security, author: authors.ali, status: "rejected", likes: 3, createdAt: "2026-08-27T19:10:00Z", parentId: "comment-004" },
  { id: "comment-017", content: "آیا برنامه‌ای برای مقاله‌ای درباره RSC caching و رفتار آن در نسخه‌های جدید Next.js دارید؟", commenter: people[0], article: articles.next, author: authors.ali, status: "pending", likes: 8, createdAt: "2026-08-25T13:45:00Z" },
  { id: "comment-018", content: "تجربه ما نشان داد بدون مستندسازی تصمیم‌های طراحی، خود Design System بعد از چند ماه تبدیل به بدهی فنی می‌شود.", commenter: people[1], article: articles.design, author: authors.sara, status: "approved", likes: 29, createdAt: "2026-08-22T09:30:00Z" },
  { id: "comment-019", content: "لینک تبلیغاتی تکرارشونده و نامرتبط با موضوع هوش مصنوعی؛ نیازمند حذف از صف دیدگاه‌ها.", commenter: people[4], article: articles.ai, author: authors.maryam, status: "spam", likes: 0, createdAt: "2026-08-20T05:20:00Z" },
  { id: "comment-020", content: "مقاله دید خوبی از وضعیت فعلی می‌دهد، اما مسئله مالکیت کد تولیدشده با هوش مصنوعی هم ارزش بررسی مستقل دارد.", commenter: people[2], article: articles.ai, author: authors.maryam, status: "approved", likes: 21, createdAt: "2026-08-18T16:05:00Z" },
];

export const commentStatusMeta: Record<CommentStatus, { label: string; className: string }> = {
  pending: { label: "در انتظار بررسی", className: "bg-[#fff6df] text-[#8a651c]" },
  approved: { label: "تأیید شده", className: "bg-[#e9f6f3] text-[#176f66]" },
  rejected: { label: "رد شده", className: "bg-[#f1f2f4] text-[#646f77]" },
  spam: { label: "اسپم", className: "bg-[#fff0f0] text-[#a63f3f]" },
};

export const commentArticles = [...new Map(mockComments.map((item) => [item.article.id, item.article])).values()];
export const commentAuthors = [...new Map(mockComments.map((item) => [item.author.id, item.author])).values()];

