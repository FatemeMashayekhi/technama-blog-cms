import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/public/static-page-layout";

export const metadata: Metadata = { title: "حریم خصوصی", description: "چارچوب نمونه حریم خصوصی وب‌سایت تک‌نما.", robots: { index: false, follow: true } };

export default function PrivacyPage() {
  return <StaticPageLayout eyebrow="شفافیت" title="حریم خصوصی" intro="این متن برای نسخه نمایشی پروژه نوشته شده و پیش از راه‌اندازی تجاری باید توسط مشاور حقوقی و متناسب با سرویس‌های واقعی بازبینی شود."><article className="space-y-7 rounded-(--radius-lg) border border-(--border-strong) bg-white p-6 sm:p-8">{[["داده‌هایی که دریافت می‌شود", "در نسخه فعلی داده‌ای به سرور ارسال یا در پایگاه داده ذخیره نمی‌شود. فرم‌های نمایشی فقط رفتار رابط کاربری را شبیه‌سازی می‌کنند."], ["کوکی و تحلیل رفتار", "در نسخه فعلی ابزار تحلیل رفتار، تبلیغات یا کوکی بازاریابی فعال نیست. در صورت افزودن این سرویس‌ها، رضایت و جزئیات پردازش باید در این صفحه اعلام شود."], ["حقوق کاربران", "پس از اتصال به سرویس واقعی، روش درخواست دسترسی، اصلاح یا حذف داده‌ها و مدت نگهداری آن‌ها باید به‌صورت شفاف درج شود."]].map(([title, text]) => <section key={title}><h2 className="text-lg font-black text-(--text-strong)">{title}</h2><p className="mt-2 text-[14px] leading-8 text-(--text-secondary)">{text}</p></section>)}</article></StaticPageLayout>;
}
