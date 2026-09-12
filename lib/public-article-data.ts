import { mockAuthors, type Author } from "@/lib/authors-data";
import { mockComments, type MagazineComment } from "@/lib/comments-data";
import { publicArticles, type PublicArticle } from "@/lib/public-data";
import { mockTags, type Tag } from "@/lib/taxonomy-data";

export type ArticleContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; id: string; text: string }
  | { type: "blockquote"; text: string }
  | { type: "unordered-list" | "ordered-list"; items: string[] }
  | { type: "code"; language: string; code: string }
  | { type: "image"; src: string; alt: string; caption: string }
  | { type: "separator" };

export type PublicArticleDetail = PublicArticle & {
  content: ArticleContentBlock[];
  tags: Tag[];
  authorDetails: Author;
  approvedComments: MagazineComment[];
};

const topicCopy: Record<string, { intro: string; shift: string; practice: string; list: string[]; quote: string }> = {
  "post-001": { intro: "هوش مصنوعی مولد در مدت کوتاهی از یک ابزار آزمایشی به بخشی از جریان روزمره توسعه نرم‌افزار تبدیل شده است. تیم‌ها اکنون از آن برای تحلیل کد، نوشتن آزمون، مستندسازی و کشف سریع‌تر مسیر حل مسئله استفاده می‌کنند.", shift: "این تغییر بیش از آنکه درباره تولید چند خط کد باشد، درباره جابه‌جایی مرکز ثقل کار مهندسی است. زمان کمتری صرف کارهای تکراری می‌شود و سهم طراحی، بازبینی و تصمیم‌گیری فنی افزایش پیدا می‌کند.", practice: "تیم‌های موفق، خروجی مدل را مانند پیشنهاد یک همکار تازه‌کار بررسی می‌کنند: مفید و سریع، اما نیازمند زمینه، آزمون و مسئولیت‌پذیری انسانی.", list: ["تعریف مرز روشن برای داده‌های مجاز", "بازبینی انسانی برای تغییرهای حساس", "آزمون خودکار پیش از ادغام کد", "ثبت منبع و دلیل تصمیم‌های تولیدشده"], quote: "آینده متعلق به تیم‌هایی است که سرعت هوش مصنوعی را با دقت و قضاوت انسانی ترکیب می‌کنند." },
  "post-003": { intro: "رابط‌های کاربری در حال فاصله گرفتن از الگوهای یکسان و حرکت به‌سمت تجربه‌هایی هستند که با زمینه، نیاز و رفتار هر کاربر سازگار می‌شوند.", shift: "طراحی خوب دیگر مجموعه‌ای از صفحه‌های ثابت نیست؛ سیستمی زنده است که محتوا، دسترسی‌پذیری و بازخورد واقعی کاربران را هم‌زمان در نظر می‌گیرد.", practice: "تیم محصول باید هر انتخاب بصری را با یک هدف رفتاری یا نیاز محتوایی پیوند دهد و کیفیت را فقط با زیبایی ظاهری نسنجد.", list: ["سلسله‌مراتب محتوایی روشن", "کنتراست و دسترسی‌پذیری", "حرکت‌های کوتاه و هدفمند", "آزمون در دستگاه‌های واقعی"], quote: "روندهای ماندگار، آن‌هایی هستند که مسئله کاربر را بهتر حل می‌کنند؛ نه آن‌هایی که فقط تازه به نظر می‌رسند." },
  "post-005": { intro: "وابستگی‌های نرم‌افزاری سرعت توسعه را بالا می‌برند، اما هر بسته کوچک می‌تواند بخشی از سطح حمله یک محصول باشد. امنیت زنجیره تأمین یعنی شناخت و کنترل همین مسیر پنهان.", shift: "حمله‌کننده لازم نیست مستقیماً زیرساخت اصلی را هدف بگیرد؛ گاهی نفوذ به یک ابزار build یا حساب نگهدارنده پکیج، راه کوتاه‌تری برای رسیدن به هزاران محصول است.", practice: "فهرست دقیق وابستگی‌ها، به‌روزرسانی کنترل‌شده و امضای artifactها باید بخشی از فرایند مهندسی باشند، نه واکنشی پس از رخداد.", list: ["تولید و نگهداری SBOM", "قفل‌کردن نسخه وابستگی‌ها", "اسکن آسیب‌پذیری در CI", "محدودکردن دسترسی انتشار"], quote: "امنیت زنجیره تأمین با یک ابزار حل نمی‌شود؛ حاصل انضباط مستمر در تمام مسیر تولید نرم‌افزار است." },
  "post-008": { intro: "سه بنیان‌گذار ایرانی مسیر متفاوتی را طی کرده‌اند، اما هر سه روی یک نکته توافق دارند: بازار واقعی، فرضیه‌های زیبا را خیلی زود به چالش می‌کشد.", shift: "محصول اولیه قرار نیست نسخه کوچک‌شده رؤیای نهایی باشد. باید سریع‌ترین راه برای سنجش مهم‌ترین ریسک کسب‌وکار را فراهم کند.", practice: "گفت‌وگوی مستقیم با مشتری، تمرکز روی یک مسئله مشخص و مدیریت جریان نقدی، در ماه‌های نخست از رشد ظاهری مهم‌ترند.", list: ["تعریف دقیق نخستین مشتری", "اندازه‌گیری رفتار به‌جای نظر", "کاهش هزینه یادگیری", "تصمیم‌گیری بر اساس شواهد"], quote: "استارتاپ خوب از یک ایده کامل شروع نمی‌شود؛ از یک سؤال مهم و توان یادگیری سریع آغاز می‌شود." },
  "post-009": { intro: "این هفته از معرفی ابزارهای تازه هوش مصنوعی تا تغییرهای مهم پلتفرم‌های توسعه، خبرهای متعددی منتشر شد که می‌توانند بر مسیر محصولات دیجیتال اثر بگذارند.", shift: "ارزش مرور هفتگی در کنار هم دیدن رویدادهاست. یک خبر منفرد ممکن است کوچک باشد، اما مجموعه آن‌ها جهت حرکت صنعت را روشن‌تر می‌کند.", practice: "برای تیم‌های محصول، دنبال‌کردن خبر زمانی مفید است که به آزمایش محدود، سنجش اثر و تصمیم مشخص منتهی شود.", list: ["به‌روزرسانی ابزارهای توسعه", "مدل‌های کوچک روی دستگاه", "قوانین تازه حریم خصوصی", "رقابت بازار تراشه"], quote: "خبر زمانی ارزش پیدا می‌کند که زمینه، پیامد و محدودیت آن را هم‌زمان ببینیم." },
  "post-012": { intro: "Passkey تلاش می‌کند تجربه ورود را هم ساده‌تر و هم امن‌تر کند. به‌جای راز مشترکی که ممکن است افشا شود، دستگاه کاربر یک جفت کلید رمزنگاری‌شده می‌سازد.", shift: "کلید خصوصی دستگاه را ترک نمی‌کند و سرویس فقط کلید عمومی را نگه می‌دارد. در نتیجه فیشینگ و نشت پایگاه داده رمز عبور بخش بزرگی از اثر خود را از دست می‌دهند.", practice: "مهاجرت موفق باید بازیابی حساب، همگام‌سازی میان دستگاه‌ها و آموزش کوتاه کاربر را از ابتدا در طراحی جریان ورود لحاظ کند.", list: ["مقاومت در برابر فیشینگ", "ورود سریع با زیست‌سنجی", "حذف رمزهای تکراری", "پشتیبانی از چند دستگاه"], quote: "آینده ورود امن، به خاطر سپردن رازهای پیچیده نیست؛ اثبات مالکیت یک کلید خصوصی است." },
};

const tagNames: Record<string, string[]> = { ai: ["AI", "TypeScript", "Cloud"], "product-design": ["UX", "Product", "Frontend"], security: ["Cybersecurity", "Cloud", "TypeScript"], startup: ["Startup", "Product", "AI"], "tech-news": ["AI", "Cloud", "Frontend"] };

function buildContent(article: PublicArticle): ArticleContentBlock[] {
  const copy = topicCopy[article.id] || { intro: article.excerpt, shift: `در ${article.category.name} فاصله میان یک ایده جذاب و نتیجه قابل اتکا را کیفیت اجرا، داده‌های واقعی و بازبینی مستمر مشخص می‌کند.`, practice: `تیم‌ها می‌توانند با یک دامنه محدود شروع کنند، معیارهای موفقیت را پیش از اجرا بنویسند و آموخته‌های مرتبط با ${article.category.name} را در چرخه‌های کوتاه به محصول بازگردانند.`, list: ["تعریف مسئله و معیار موفقیت", "شروع با یک آزمایش محدود", "ثبت بازخورد کاربران واقعی", "بازبینی و بهبود تدریجی"], quote: `پیشرفت پایدار در ${article.category.name} نتیجه تصمیم‌های کوچک، سنجیده و پیوسته است.` };
  return [
    { type: "paragraph", text: copy.intro },
    { type: "heading", level: 2, id: "what-is-changing", text: "چه چیزی در حال تغییر است؟" },
    { type: "paragraph", text: copy.shift },
    { type: "blockquote", text: copy.quote },
    { type: "heading", level: 2, id: "practical-path", text: "مسیر عملی برای تیم‌ها" },
    { type: "paragraph", text: copy.practice },
    { type: "unordered-list", items: copy.list },
    { type: "image", src: article.image, alt: `تصویر توضیحی مقاله ${article.title}`, caption: "تصویر: آرشیو رسانه‌ای تک‌نما" },
    { type: "heading", level: 3, id: "engineering-example", text: "یک نمونه فنی کوتاه" },
    { type: "paragraph", text: "اصل مهم این است که تصمیم‌ها قابل مشاهده، قابل آزمون و قابل بازگشت باقی بمانند. نمونه زیر یک قرارداد ساده TypeScript برای ثبت نتیجه بررسی را نشان می‌دهد." },
    { type: "code", language: "TypeScript", code: "type ReviewResult = {\n  approved: boolean;\n  reviewer: string;\n  notes: string[];\n};\n\nconst publish = (result: ReviewResult) =>\n  result.approved && result.notes.length === 0;" },
    { type: "heading", level: 2, id: "next-step", text: "قدم بعدی چیست؟" },
    { type: "ordered-list", items: ["یک مسئله محدود و قابل سنجش انتخاب کنید.", "خط پایه عملکرد و کیفیت را ثبت کنید.", "تغییر را در مقیاس کوچک آزمایش کنید.", "نتیجه را مستند و سپس درباره گسترش آن تصمیم بگیرید."] },
    { type: "separator" },
    { type: "paragraph", text: "فناوری زمانی به مزیت پایدار تبدیل می‌شود که در کنار فرایند روشن، مسئولیت مشخص و یادگیری مستمر قرار بگیرد. ابزار تازه فقط آغاز گفت‌وگو است؛ کیفیت تصمیم‌های بعدی نتیجه واقعی را می‌سازد." },
  ];
}

export function createArticleDetail(article: PublicArticle): PublicArticleDetail | null {
  if (article.status !== "published") return null;
  const authorDetails = mockAuthors.find((item) => item.id === article.author.id); if (!authorDetails) return null;
  const wantedTags = tagNames[article.category.id] || ["Next.js", "React", "TypeScript"];
  const tags = wantedTags.map((name) => mockTags.find((tag) => tag.name === name)).filter((tag): tag is Tag => Boolean(tag));
  const approvedComments = mockComments.filter((comment) => comment.article.id === article.id && comment.status === "approved");
  return { ...article, content: buildContent(article), tags, authorDetails, approvedComments };
}
