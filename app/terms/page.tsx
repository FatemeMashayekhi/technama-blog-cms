import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/public/static-page-layout";

export const metadata: Metadata = { title: "قوانین استفاده", description: "شرایط نمونه استفاده از وب‌سایت تک‌نما.", robots: { index: false, follow: true } };

export default function TermsPage() {
  return <StaticPageLayout eyebrow="قواعد استفاده" title="قوانین استفاده" intro="این شرایط مربوط به نسخه پورتفولیوی تک‌نما است و جایگزین متن حقوقی متناسب با کسب‌وکار واقعی نیست."><article className="space-y-7 rounded-(--radius-lg) border border-(--border-strong) bg-white p-6 sm:p-8">{[["محتوای مجله", "مقاله‌های منتشرشده در پایگاه داده نگهداری می‌شوند و برای نمایش یک جریان تحریریه کامل، از نگارش تا انتشار، آماده شده‌اند."], ["استفاده مسئولانه", "کاربر نباید برای ایجاد اختلال، دسترسی غیرمجاز یا بازنشر گمراه‌کننده از سرویس استفاده کند."], ["مدیریت محتوا", "پنل تحریریه با احراز هویت، سطح دسترسی و ذخیره‌سازی پایدار Supabase محافظت می‌شود؛ دسترسی مدیریتی فقط برای اعضای مجاز است."]].map(([title, text]) => <section key={title}><h2 className="text-lg font-black text-(--text-strong)">{title}</h2><p className="mt-2 text-[14px] leading-8 text-(--text-secondary)">{text}</p></section>)}</article></StaticPageLayout>;
}
