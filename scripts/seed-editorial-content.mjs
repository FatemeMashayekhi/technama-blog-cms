import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

async function loadEnvironment() {
  const source = await readFile(new URL("../.env.local", import.meta.url), "utf8");
  return Object.fromEntries(source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const separator = line.indexOf("=");
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^['\"]|['\"]$/g, "")];
  }));
}

const categories = [
  { name: "هوش مصنوعی", slug: "artificial-intelligence", description: "تحلیل کاربردهای هوش مصنوعی، مدل‌های زبانی و زیرساخت یادگیری ماشین", icon: "Sparkles", color: "#176f66" },
  { name: "برنامه‌نویسی", slug: "programming", description: "توسعه نرم‌افزار، معماری سیستم و ابزارهای برنامه‌نویسی", icon: "Code2", color: "#315f86" },
  { name: "طراحی محصول", slug: "product-design", description: "تجربه کاربری، سیستم طراحی و فرایند ساخت محصول دیجیتال", icon: "PenTool", color: "#8a5c3d" },
  { name: "امنیت", slug: "cybersecurity", description: "امنیت سایبری، حریم خصوصی و محافظت از زیرساخت", icon: "ShieldCheck", color: "#924c4c" },
  { name: "استارتاپ", slug: "startup", description: "ساخت کسب‌وکار نوآور، محصول و روایت بنیان‌گذاران", icon: "Rocket", color: "#836327" },
  { name: "سخت‌افزار", slug: "hardware", description: "تراشه‌ها، رایانه‌ها و فناوری‌های پردازشی", icon: "Cpu", color: "#5d6932" },
  { name: "گجت‌ها", slug: "gadgets", description: "بررسی محصولات دیجیتال و ابزارهای هوشمند روزمره", icon: "Smartphone", color: "#745579" },
  { name: "اخبار فناوری", slug: "tech-news", description: "مرور تحلیلی رویدادهایی که مسیر صنعت فناوری را تغییر می‌دهند", icon: "Newspaper", color: "#416a79" },
];

const articles = [
  { slug: "future-of-generative-ai-in-software", title: "آینده هوش مصنوعی مولد در توسعه نرم‌افزار", excerpt: "هوش مصنوعی مولد چگونه فرایند طراحی، توسعه و نگهداری نرم‌افزار را تغییر می‌دهد؟", category: "artificial-intelligence", cover: "/media/ai-future.svg", readingTime: 8, views: 12480, publishedAt: "2026-08-24T07:00:00Z", tags: ["ai", "typescript", "cloud"], intro: "هوش مصنوعی مولد از یک ابزار آزمایشی به بخشی از جریان روزمره توسعه نرم‌افزار تبدیل شده است. تیم‌ها از آن برای تحلیل کد، نوشتن آزمون و مستندسازی استفاده می‌کنند.", shift: "این تغییر بیشتر از تولید چند خط کد، درباره جابه‌جایی مرکز ثقل کار مهندسی است. سهم طراحی، بازبینی و تصمیم‌گیری فنی افزایش پیدا می‌کند.", practice: "خروجی مدل را مانند پیشنهاد یک همکار تازه‌کار بررسی کنید: سریع و مفید، اما نیازمند زمینه، آزمون و مسئولیت‌پذیری انسانی.", list: ["تعریف مرز روشن برای داده‌های مجاز", "بازبینی انسانی تغییرهای حساس", "آزمون خودکار پیش از ادغام", "ثبت دلیل تصمیم‌های تولیدشده"] },
  { slug: "new-ui-design-trends", title: "بررسی روندهای جدید طراحی رابط کاربری", excerpt: "از رابط‌های تطبیقی تا طراحی مبتنی بر محتوا؛ روندهایی که ارزش دنبال‌کردن دارند.", category: "product-design", cover: "/media/design-system.svg", readingTime: 7, views: 8920, publishedAt: "2026-08-18T09:00:00Z", tags: ["ux", "product", "frontend"], intro: "رابط‌های کاربری از الگوهای یکسان فاصله می‌گیرند و به‌سمت تجربه‌هایی حرکت می‌کنند که با زمینه و نیاز هر کاربر سازگار می‌شوند.", shift: "طراحی خوب دیگر مجموعه‌ای از صفحه‌های ثابت نیست؛ سیستمی زنده است که محتوا، دسترسی‌پذیری و بازخورد کاربران را هم‌زمان در نظر می‌گیرد.", practice: "هر انتخاب بصری را به یک هدف رفتاری یا نیاز محتوایی پیوند دهید و کیفیت را فقط با زیبایی ظاهری نسنجید.", list: ["سلسله‌مراتب محتوایی روشن", "کنتراست و دسترسی‌پذیری", "حرکت کوتاه و هدفمند", "آزمون روی دستگاه واقعی"] },
  { slug: "software-supply-chain-security", title: "امنیت زنجیره تأمین نرم‌افزار؛ تهدیدی که دیده نمی‌شود", excerpt: "چرا وابستگی‌های کوچک می‌توانند به بزرگ‌ترین نقطه ضعف یک محصول تبدیل شوند؟", category: "cybersecurity", cover: "/media/security.svg", readingTime: 8, views: 6375, publishedAt: "2026-08-12T08:30:00Z", tags: ["cybersecurity", "cloud", "typescript"], intro: "وابستگی‌های نرم‌افزاری سرعت توسعه را بالا می‌برند، اما هر بسته کوچک می‌تواند بخشی از سطح حمله محصول باشد.", shift: "حمله‌کننده گاهی به‌جای زیرساخت اصلی، یک ابزار build یا حساب نگهدارنده پکیج را هدف می‌گیرد و از آن مسیر به محصولات متعدد می‌رسد.", practice: "فهرست دقیق وابستگی‌ها، به‌روزرسانی کنترل‌شده و امضای artifactها را به بخشی از فرایند مهندسی تبدیل کنید.", list: ["تولید و نگهداری SBOM", "قفل‌کردن نسخه وابستگی‌ها", "اسکن آسیب‌پذیری در CI", "محدودکردن دسترسی انتشار"] },
  { slug: "iranian-startups-from-idea-to-market", title: "از ایده تا بازار؛ روایت سه استارتاپ ایرانی", excerpt: "سه بنیان‌گذار درباره ساخت محصول، یافتن بازار و عبور از نخستین بحران‌ها می‌گویند.", category: "startup", cover: "/media/startup-team.svg", readingTime: 10, views: 15120, publishedAt: "2026-08-01T06:00:00Z", tags: ["startup", "product", "ai"], intro: "مسیر بنیان‌گذاران متفاوت است، اما بازار واقعی فرضیه‌های زیبا را خیلی زود به چالش می‌کشد.", shift: "محصول اولیه نباید نسخه کوچک‌شده رؤیای نهایی باشد؛ باید سریع‌ترین راه برای سنجش مهم‌ترین ریسک کسب‌وکار را فراهم کند.", practice: "گفت‌وگوی مستقیم با مشتری، تمرکز روی یک مسئله و مدیریت جریان نقدی در ماه‌های نخست از رشد ظاهری مهم‌تر است.", list: ["تعریف دقیق نخستین مشتری", "اندازه‌گیری رفتار به‌جای نظر", "کاهش هزینه یادگیری", "تصمیم‌گیری بر اساس شواهد"] },
  { slug: "weekly-tech-news-roundup", title: "مرور مهم‌ترین رویدادهای فناوری این هفته", excerpt: "خلاصه‌ای دقیق از خبرها و محصولاتی که این هفته دنیای فناوری را شکل دادند.", category: "tech-news", cover: "/media/conference.svg", readingTime: 5, views: 7340, publishedAt: "2026-08-29T10:00:00Z", tags: ["ai", "cloud", "frontend"], intro: "از ابزارهای تازه هوش مصنوعی تا تغییرهای پلتفرم‌های توسعه، چند رویداد مهم می‌توانند بر مسیر محصولات دیجیتال اثر بگذارند.", shift: "ارزش مرور هفتگی در کنار هم دیدن رویدادهاست؛ مجموعه خبرهای کوچک می‌تواند جهت حرکت صنعت را روشن‌تر کند.", practice: "دنبال‌کردن خبر زمانی مفید است که به آزمایش محدود، سنجش اثر و یک تصمیم مشخص منتهی شود.", list: ["ابزارهای تازه توسعه", "مدل‌های کوچک روی دستگاه", "قوانین حریم خصوصی", "رقابت بازار تراشه"] },
  { slug: "how-passkeys-work", title: "رمز عبور بدون رمز؛ Passkey چگونه کار می‌کند؟", excerpt: "آشنایی با استاندارد Passkey و مسیری که برای حذف رمزهای عبور پیش رو داریم.", category: "cybersecurity", cover: "/media/security.svg", readingTime: 7, views: 9840, publishedAt: "2026-08-21T07:00:00Z", tags: ["cybersecurity", "cloud", "product"], intro: "Passkey به‌جای راز مشترکی که ممکن است افشا شود، روی یک جفت کلید رمزنگاری‌شده تکیه می‌کند.", shift: "کلید خصوصی دستگاه را ترک نمی‌کند و سرویس فقط کلید عمومی را نگه می‌دارد؛ بنابراین فیشینگ و نشت پایگاه داده اثر کمتری دارند.", practice: "بازیابی حساب، همگام‌سازی میان دستگاه‌ها و آموزش کوتاه کاربر را از ابتدا در جریان ورود طراحی کنید.", list: ["مقاومت در برابر فیشینگ", "ورود سریع با زیست‌سنجی", "حذف رمزهای تکراری", "پشتیبانی از چند دستگاه"] },
  { slug: "nextjs-rendering-model-explained", title: "مدل رندرینگ Next.js؛ چه چیزی کجا اجرا می‌شود؟", excerpt: "راهنمای تصمیم‌گیری میان Server Component، Client Component، SSR و تولید ایستا در App Router.", category: "programming", cover: "/media/code-workspace.svg", readingTime: 9, views: 7820, publishedAt: "2026-08-27T07:30:00Z", tags: ["nextjs", "react", "typescript", "frontend"], intro: "در App Router، هر بخش می‌تواند بر اساس نیاز داده، میزان تعامل و حساسیت به تازگی محتوا روی سرور یا مرورگر اجرا شود.", shift: "مرز Client Component باید جایی باشد که رفتار تعاملی آغاز می‌شود، نه جایی که ساختار فایل‌ها راحت‌تر به نظر می‌رسد.", practice: "از سرور شروع کنید، وابستگی‌های مرورگر را در کوچک‌ترین مرز نگه دارید و cache را برای هر منبع آگاهانه انتخاب کنید.", list: ["دریافت داده نزدیک به منبع", "کوچک نگه‌داشتن مرز client", "تعریف سیاست cache", "اندازه‌گیری حجم JavaScript"] },
  { slug: "typescript-boundaries-in-large-codebases", title: "مرزبندی TypeScript در کدبیس‌های بزرگ", excerpt: "چطور قراردادهای داده، ماژول‌ها و لایه‌های دامنه را طوری طراحی کنیم که تغییر ارزان‌تر شود؟", category: "programming", cover: "/media/code-workspace.svg", readingTime: 10, views: 6940, publishedAt: "2026-08-25T09:00:00Z", tags: ["typescript", "frontend", "cloud"], intro: "در کدبیس بزرگ، ارزش TypeScript از مرزهایی می‌آید که تغییرات را محدود و قرارداد میان بخش‌های سیستم را روشن می‌کنند.", shift: "اگر مدل دیتابیس، پاسخ API و رابط کاربری یک نوع مشترک باشند، تغییر کوچک در یک لایه به سراسر محصول نشت می‌کند.", practice: "ورودی بیرونی را در runtime اعتبارسنجی کنید، مدل دامنه را مستقل نگه دارید و خروجی عمومی هر ماژول را عمداً کوچک طراحی کنید.", list: ["اعتبارسنجی ورودی", "جداسازی مدل دامنه", "خروجی عمومی محدود", "حذف any"] },
  { slug: "ai-chips-memory-bandwidth-bottleneck", title: "گلوگاه واقعی تراشه‌های هوش مصنوعی فقط توان پردازش نیست", excerpt: "چرا پهنای باند حافظه، مصرف انرژی و انتقال داده به‌اندازه تعداد هسته‌ها اهمیت دارند؟", category: "hardware", cover: "/media/chip.svg", readingTime: 8, views: 8110, publishedAt: "2026-08-23T06:45:00Z", tags: ["ai", "cloud", "product"], intro: "توان تراشه‌های هوش مصنوعی با عددهای بزرگ معرفی می‌شود، اما مدل زمانی سریع اجرا می‌شود که داده نیز با سرعت کافی به واحدهای محاسباتی برسد.", shift: "در بسیاری از بارهای کاری، پهنای باند حافظه و انرژی انتقال داده زودتر از توان خام پردازش به سقف می‌رسد.", practice: "شتاب‌دهنده‌ها را با بار کاری واقعی، ظرفیت حافظه، دقت عددی و عملکرد به‌ازای وات مقایسه کنید.", list: ["پهنای باند حافظه", "عملکرد به‌ازای وات", "پشتیبانی نرم‌افزاری", "هزینه کل زیرساخت"] },
  { slug: "design-tokens-as-a-team-contract", title: "Design Token؛ قرارداد مشترک طراحی و توسعه", excerpt: "توکن‌ها چه زمانی از یک فایل رنگ و فاصله عبور می‌کنند و به زیرساخت واقعی محصول تبدیل می‌شوند؟", category: "product-design", cover: "/media/design-system.svg", readingTime: 8, views: 5720, publishedAt: "2026-08-19T10:15:00Z", tags: ["ux", "product", "frontend"], intro: "Design Token نام معناداری برای تصمیم‌های طراحی است؛ از رنگ و فاصله تا تایپوگرافی و motion.", shift: "توکن باید سلسله‌مراتب، مالک مشخص و مسیر تغییر قابل ردیابی در طراحی، کد و مستندات داشته باشد.", practice: "با توکن‌های پایه و معنایی شروع کنید و انتشار نسخه‌های جدید را مانند یک کتابخانه نرم‌افزاری مدیریت کنید.", list: ["تفکیک توکن پایه و معنایی", "نام‌گذاری مستقل از ظاهر", "نسخه‌بندی تغییر", "خروجی هماهنگ وب و موبایل"] },
  { slug: "react-compiler-practical-guide", title: "React Compiler در عمل؛ بهینه‌سازی بدون حدس", excerpt: "کامپایلر React چه مسئله‌ای را حل می‌کند، چه پیش‌نیازهایی دارد و کجا هنوز باید اندازه‌گیری کنیم؟", category: "programming", cover: "/media/code-workspace.svg", readingTime: 7, views: 9360, publishedAt: "2026-08-16T08:20:00Z", tags: ["react", "frontend", "typescript"], intro: "React Compiler بخشی از بهینه‌سازی‌های دستی را از روی معنای کد استخراج می‌کند تا رندرهای غیرضروری کاهش پیدا کنند.", shift: "کامپایلر جای معماری درست را نمی‌گیرد؛ state نامناسب یا effect دارای چرخه بازخورد همچنان مسئله باقی می‌ماند.", practice: "قواعد React را رعایت کنید، کامپایلر را مرحله‌ای فعال کنید و نتیجه را با Profiler در سناریوی واقعی بسنجید.", list: ["رفع نقض Rules of React", "فعال‌سازی مرحله‌ای", "اندازه‌گیری با Profiler", "حذف memoization پس از اطمینان"] },
  { slug: "small-language-models-on-device", title: "مدل‌های زبانی کوچک و آینده هوش مصنوعی روی دستگاه", excerpt: "اجرای مدل روی موبایل و لپ‌تاپ چگونه تأخیر، هزینه و حریم خصوصی محصولات هوشمند را تغییر می‌دهد؟", category: "artificial-intelligence", cover: "/media/ai-future.svg", readingTime: 9, views: 10480, publishedAt: "2026-08-14T11:10:00Z", tags: ["ai", "cloud", "product"], intro: "مدل‌های زبانی کوچک برای یک دامنه محدود، سخت‌افزار مشخص و پاسخ سریع بهینه می‌شوند.", shift: "اجرای محلی بخشی از داده را روی دستگاه نگه می‌دارد، اما محدودیت حافظه، باتری و به‌روزرسانی مدل اهمیت بیشتری پیدا می‌کند.", practice: "کیفیت را روی وظیفه واقعی بسنجید و اندازه مدل را با نیاز تجربه کاربری و توان سخت‌افزار متعادل کنید.", list: ["معیار کیفیت مخصوص وظیفه", "زمان پاسخ روی دستگاه", "مصرف حافظه و انرژی", "سیاست نگهداری داده"] },
  { slug: "privacy-first-wearables", title: "گجت‌های پوشیدنی چگونه حریم خصوصی را بازطراحی می‌کنند؟", excerpt: "پردازش محلی، حداقل‌سازی داده و رضایت آگاهانه چه نقشی در نسل بعدی ابزارهای پوشیدنی دارند؟", category: "gadgets", cover: "/media/mobile-ui.svg", readingTime: 7, views: 4880, publishedAt: "2026-08-11T07:50:00Z", tags: ["product", "ux", "cybersecurity"], intro: "گجت پوشیدنی از نزدیک‌ترین حسگرها به بدن استفاده می‌کند و داده‌هایی بسیار شخصی تولید می‌کند.", shift: "پردازش محلی می‌تواند خروجی مفید را بدون ارسال مداوم داده خام بسازد، اما کاربر همچنان باید هدف و مدت نگهداری را بداند.", practice: "حداقل داده لازم را جمع کنید، کنترل‌ها را در لحظه تصمیم نمایش دهید و حذف داده را ساده نگه دارید.", list: ["پردازش روی دستگاه", "رضایت جداگانه برای داده حساس", "مدت نگهداری محدود", "حذف و انتقال‌پذیری ساده"] },
];

const articleAuthors = {
  "future-of-generative-ai-in-software": "neda.ai",
  "new-ui-design-trends": "sara.product",
  "software-supply-chain-security": "amir.security",
  "iranian-startups-from-idea-to-market": "elham.startup",
  "weekly-tech-news-roundup": "elham.startup",
  "how-passkeys-work": "amir.security",
  "nextjs-rendering-model-explained": "arman.frontend",
  "typescript-boundaries-in-large-codebases": "arman.frontend",
  "ai-chips-memory-bandwidth-bottleneck": "nima.hardware",
  "design-tokens-as-a-team-contract": "sara.product",
  "react-compiler-practical-guide": "arman.frontend",
  "small-language-models-on-device": "neda.ai",
  "privacy-first-wearables": "nima.hardware",
};

const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const contentHtml = (article) => `<p>${escapeHtml(article.intro)}</p><h2>چه چیزی در حال تغییر است؟</h2><p>${escapeHtml(article.shift)}</p><blockquote>${escapeHtml(article.excerpt)}</blockquote><h2>مسیر عملی برای تیم‌ها</h2><p>${escapeHtml(article.practice)}</p><ul>${article.list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><h2>جمع‌بندی</h2><p>نتیجه پایدار از ترکیب فناوری، فرایند روشن، مسئولیت مشخص و یادگیری مستمر به‌دست می‌آید. این مقاله نقطه شروعی برای تصمیم‌گیری آگاهانه و آزمایش قابل سنجش است.</p>`;

const env = await loadEnvironment();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) throw new Error("Supabase URL or service role key is missing from .env.local.");

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
const authorUsernames = [...new Set(Object.values(articleAuthors))];
const { data: profiles, error: profileError } = await supabase.from("profiles").select("id,username").eq("is_active", true).in("username", authorUsernames);
if (profileError) throw profileError;
if (profiles?.length !== authorUsernames.length) throw new Error("Editorial authors are missing. Run npm run seed:authors before seeding content.");
const authorIds = new Map(profiles.map((profile) => [profile.username, profile.id]));

const { error: categoryWriteError } = await supabase.from("categories").upsert(categories, { onConflict: "slug" });
if (categoryWriteError) throw categoryWriteError;
const { data: categoryRows, error: categoryReadError } = await supabase.from("categories").select("id,slug").in("slug", categories.map((item) => item.slug));
if (categoryReadError) throw categoryReadError;
const categoryIds = new Map(categoryRows.map((item) => [item.slug, item.id]));

const articleRows = articles.map((article) => ({
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,
  content: contentHtml(article),
  cover_url: article.cover,
  author_id: authorIds.get(articleAuthors[article.slug]),
  category_id: categoryIds.get(article.category),
  status: "published",
  reading_time: article.readingTime,
  views: article.views,
  published_at: article.publishedAt,
  seo: { title: article.title, description: article.excerpt },
}));
if (articleRows.some((article) => !article.category_id || !article.author_id)) throw new Error("One or more article categories or authors could not be resolved.");
const { data: savedArticles, error: articleError } = await supabase.from("articles").upsert(articleRows, { onConflict: "slug" }).select("id,slug");
if (articleError) throw articleError;

const tagSlugs = [...new Set(articles.flatMap((article) => article.tags))];
const { data: tagRows, error: tagError } = await supabase.from("tags").select("id,slug").in("slug", tagSlugs);
if (tagError) throw tagError;
const tagIds = new Map(tagRows.map((item) => [item.slug, item.id]));
const savedArticleIds = new Map(savedArticles.map((item) => [item.slug, item.id]));
const relations = articles.flatMap((article) => article.tags.map((tag) => ({ article_id: savedArticleIds.get(article.slug), tag_id: tagIds.get(tag) }))).filter((item) => item.article_id && item.tag_id);
const { error: relationError } = await supabase.from("article_tags").upsert(relations, { onConflict: "article_id,tag_id", ignoreDuplicates: true });
if (relationError) throw relationError;

console.log(`Seeded ${savedArticles.length} published articles, ${categoryRows.length} categories and ${relations.length} article-tag relations.`);
