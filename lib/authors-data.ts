export type AuthorRole = "admin" | "editor" | "author";
export type AuthorStatus = "active" | "inactive";

export type AuthorSocialLinks = { website: string; linkedin: string; twitter: string; github: string };

export type Author = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  avatarColor: string;
  initials: string;
  bio: string;
  role: AuthorRole;
  status: AuthorStatus;
  articleCount: number;
  totalViews: number;
  publishedRate: number;
  joinedAt: string;
  joinedLabel: string;
  socialLinks: AuthorSocialLinks;
  recentArticles: string[];
};

export type AuthorFormData = Pick<Author, "name" | "username" | "email" | "avatar" | "bio" | "role" | "status" | "socialLinks">;
export type AuthorFormErrors = Partial<Record<"name" | "username" | "email" | "bio" | "role", string>>;

const socials = (github: string): AuthorSocialLinks => ({ website: "", linkedin: "", twitter: "", github });

export const mockAuthors: Author[] = [
  { id: "author-1", name: "مریم احمدی", username: "maryam", email: "maryam@technama.ir", initials: "ما", avatarColor: "bg-[#dbe8f2] text-[#254e6e]", bio: "نویسنده ارشد حوزه هوش مصنوعی و توسعه نرم‌افزار با تمرکز بر تأثیر فناوری‌های نو بر تیم‌های محصول.", role: "admin", status: "active", articleCount: 128, totalViews: 248900, publishedRate: 86, joinedAt: "2023-03-14", joinedLabel: "۲۳ اسفند ۱۴۰۱", socialLinks: socials("maryam-ahmadi"), recentArticles: ["آینده هوش مصنوعی مولد در توسعه نرم‌افزار", "مدل‌های زبانی کوچک و آینده محصولات هوشمند"] },
  { id: "author-2", name: "علی رضایی", username: "alirezaei", email: "ali@technama.ir", initials: "عر", avatarColor: "bg-[#e8e2f2] text-[#604b78]", bio: "مهندس نرم‌افزار و نویسنده حوزه برنامه‌نویسی، معماری سیستم و تجربه توسعه‌دهندگان.", role: "editor", status: "active", articleCount: 94, totalViews: 192450, publishedRate: 82, joinedAt: "2023-06-02", joinedLabel: "۱۲ خرداد ۱۴۰۲", socialLinks: socials("alirezaei"), recentArticles: ["چرا معماری Server Components اهمیت دارد؟", "امنیت زنجیره تأمین نرم‌افزار"] },
  { id: "author-3", name: "سارا محمدی", username: "sara.design", email: "sara@technama.ir", initials: "سم", avatarColor: "bg-[#f4e5d8] text-[#82552f]", bio: "طراح محصول و پژوهشگر تجربه کاربری؛ علاقه‌مند به Design System و طراحی سرویس‌های پیچیده.", role: "author", status: "active", articleCount: 76, totalViews: 164200, publishedRate: 79, joinedAt: "2023-08-19", joinedLabel: "۲۸ مرداد ۱۴۰۲", socialLinks: socials("saramohammadi"), recentArticles: ["بررسی روندهای جدید طراحی رابط کاربری", "راهنمای طراحی یک Design System پایدار"] },
  { id: "author-4", name: "امیر کریمی", username: "amirsec", email: "amir@technama.ir", initials: "اک", avatarColor: "bg-[#f0e0e0] text-[#844747]", bio: "پژوهشگر امنیت سایبری با تمرکز بر امنیت وب، حریم خصوصی و زیرساخت‌های ابری.", role: "author", status: "active", articleCount: 61, totalViews: 139780, publishedRate: 74, joinedAt: "2023-11-05", joinedLabel: "۱۴ آبان ۱۴۰۲", socialLinks: socials("amir-security"), recentArticles: ["رمز عبور بدون رمز؛ Passkey چگونه کار می‌کند؟"] },
  { id: "author-5", name: "نیما فرهمند", username: "nimaf", email: "nima@technama.ir", initials: "نف", avatarColor: "bg-[#e8ecd9] text-[#626b31]", bio: "روزنامه‌نگار فناوری و تحلیلگر سخت‌افزار، تراشه‌ها و صنعت نیمه‌رساناها.", role: "author", status: "active", articleCount: 53, totalViews: 118320, publishedRate: 77, joinedAt: "2024-01-21", joinedLabel: "۱ بهمن ۱۴۰۲", socialLinks: socials("nimaf"), recentArticles: ["تراشه‌های هوش مصنوعی چه مسیری را طی می‌کنند؟"] },
  { id: "author-6", name: "الهام مرادی", username: "elhammoradi", email: "elham@technama.ir", initials: "ام", avatarColor: "bg-[#efe1e8] text-[#814e68]", bio: "نویسنده کسب‌وکار فناوری و اکوسیستم استارتاپی با تمرکز بر روایت بنیان‌گذاران.", role: "editor", status: "active", articleCount: 48, totalViews: 126900, publishedRate: 81, joinedAt: "2024-03-10", joinedLabel: "۲۰ اسفند ۱۴۰۲", socialLinks: socials("elhammoradi"), recentArticles: ["از ایده تا بازار؛ روایت سه استارتاپ ایرانی"] },
  { id: "author-7", name: "آرمان شریفی", username: "arman.dev", email: "arman@technama.ir", initials: "آش", avatarColor: "bg-[#dce9ea] text-[#366a70]", bio: "توسعه‌دهنده Frontend و نویسنده موضوعات React، TypeScript و مهندسی رابط کاربری.", role: "author", status: "inactive", articleCount: 37, totalViews: 84200, publishedRate: 68, joinedAt: "2024-05-16", joinedLabel: "۲۷ اردیبهشت ۱۴۰۳", socialLinks: socials("armansharifi"), recentArticles: ["React Compiler چه چیزی را تغییر می‌دهد؟"] },
  { id: "author-8", name: "رها توکلی", username: "raha.tech", email: "raha@technama.ir", initials: "رت", avatarColor: "bg-[#eee4d8] text-[#786044]", bio: "خبرنگار فناوری‌های مصرفی، محصولات دیجیتال و روندهای رسانه‌های اجتماعی.", role: "author", status: "inactive", articleCount: 29, totalViews: 61750, publishedRate: 71, joinedAt: "2024-08-03", joinedLabel: "۱۳ مرداد ۱۴۰۳", socialLinks: socials("rahatavakoli"), recentArticles: ["مرور مهم‌ترین رویدادهای فناوری این هفته"] },
];

export const emptyAuthor: AuthorFormData = { name: "", username: "", email: "", bio: "", role: "author", status: "active", socialLinks: { website: "", linkedin: "", twitter: "", github: "" } };

export function getMockAuthor(id: string) { return mockAuthors.find((author) => author.id === id) ?? null; }
export function authorToForm(author: Author): AuthorFormData { return { name: author.name, username: author.username, email: author.email, avatar: author.avatar, bio: author.bio, role: author.role, status: author.status, socialLinks: { ...author.socialLinks } }; }
export async function saveMockAuthor(data: AuthorFormData, invite = false, editingId?: string) { if (isSupabaseConfigured && (invite || editingId)) { const response = await fetch(editingId ? `/api/profiles/${editingId}` : "/api/profiles", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingId ? { displayName: data.name, username: data.username, email: data.email, avatarUrl: data.avatar ?? null, bio: data.bio, role: data.role, isActive: data.status === "active" } : { email: data.email, displayName: data.name, role: data.role }) }); const result = await response.json() as { ok: boolean; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error || "ذخیره نویسنده انجام نشد."); return data; } await new Promise((resolve) => setTimeout(resolve, 650)); return data; }

export function validateAuthor(data: AuthorFormData): AuthorFormErrors {
  const errors: AuthorFormErrors = {};
  if (!data.name.trim()) errors.name = "نام نویسنده الزامی است.";
  if (!/^[a-zA-Z0-9._-]{3,}$/.test(data.username)) errors.username = "نام کاربری باید حداقل ۳ کاراکتر و با حروف انگلیسی باشد.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "ایمیل وارد شده معتبر نیست.";
  if (data.bio.trim().length < 30) errors.bio = "معرفی نویسنده باید حداقل ۳۰ کاراکتر باشد.";
  if (!data.role) errors.role = "انتخاب نقش الزامی است.";
  return errors;
}

export const roleLabels: Record<AuthorRole, string> = { admin: "مدیر", editor: "ویراستار", author: "نویسنده" };
import { isSupabaseConfigured } from "@/lib/env";
