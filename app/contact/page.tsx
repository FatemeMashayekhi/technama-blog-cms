import type { Metadata } from "next";
import { Mail, MessageSquareText } from "lucide-react";
import { StaticPageLayout } from "@/components/public/static-page-layout";

export const metadata: Metadata = { title: "تماس با تک‌نما", description: "راه‌های ارتباط با تحریریه مجله فناوری تک‌نما.", alternates: { canonical: "https://technama.ir/contact" } };

export default function ContactPage() {
  return <StaticPageLayout eyebrow="ارتباط با تحریریه" title="تماس با ما" intro="برای پیشنهاد موضوع، اصلاح یک مطلب یا گفت‌وگو درباره همکاری تحریریه، مستقیماً با ما در تماس باشید."><div className="grid gap-4 sm:grid-cols-2"><a dir="ltr" href="mailto:editorial@technama.ir" className="rounded-(--radius-lg) border border-(--border-strong) bg-white p-6 text-left transition hover:border-(--border-strong)"><Mail className="text-(--brand-teal)"/><strong className="mt-4 block text-[15px] text-(--text-strong)">editorial@technama.ir</strong><span dir="rtl" className="mt-2 block text-right text-[13px] text-(--text-muted)">پیشنهاد موضوع و ارتباط با تحریریه</span></a><a dir="ltr" href="mailto:hello@technama.ir" className="rounded-(--radius-lg) border border-(--border-strong) bg-white p-6 text-left transition hover:border-(--border-strong)"><MessageSquareText className="text-(--brand-teal)"/><strong className="mt-4 block text-[15px] text-(--text-strong)">hello@technama.ir</strong><span dir="rtl" className="mt-2 block text-right text-[13px] text-(--text-muted)">همکاری و پرسش‌های عمومی</span></a></div><p className="mt-6 rounded-(--radius) bg-(--surface-muted) p-4 text-[13px] leading-7 text-(--text-secondary)">این پروژه نسخه نمایشی پورتفولیو است؛ آدرس‌های ایمیل نمونه‌اند و پیش از انتشار واقعی باید با اطلاعات مالک سایت جایگزین شوند.</p></StaticPageLayout>;
}
