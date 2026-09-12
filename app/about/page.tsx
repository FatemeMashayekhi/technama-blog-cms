import type { Metadata } from "next";
import { CheckCircle2, Compass, Scale, UsersRound } from "lucide-react";
import { StaticPageLayout } from "@/components/public/static-page-layout";

export const metadata: Metadata = { title: "درباره تک‌نما", description: "با مأموریت، اصول تحریریه و شیوه کار مجله فناوری تک‌نما آشنا شوید.", alternates: { canonical: "https://technama.ir/about" } };

const values = [
  { icon: Compass, title: "تحلیل به‌جای هیاهو", text: "خبر را در زمینه درست قرار می‌دهیم و به پیامدهای واقعی آن برای مخاطب می‌پردازیم." },
  { icon: Scale, title: "استقلال تحریریه", text: "مرز محتوای تحریریه و همکاری تجاری را شفاف نگه می‌داریم و تعارض منافع را اعلام می‌کنیم." },
  { icon: UsersRound, title: "تخصص چندصدایی", text: "نویسندگان حوزه‌های مهندسی، طراحی، امنیت و کسب‌وکار از زاویه تخصص خود می‌نویسند." },
];

export default function AboutPage() {
  return <StaticPageLayout eyebrow="پشت صحنه مجله" title="درباره تک‌نما" intro="تک‌نما یک مجله فناوری چندنویسنده‌ای است؛ جایی برای روایت دقیق روندهایی که محصول، کسب‌وکار و زندگی دیجیتال ما را شکل می‌دهند."><section className="grid gap-4 md:grid-cols-3">{values.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-(--radius-lg) border border-(--border-strong) bg-white p-5"><span className="grid size-11 place-items-center rounded-(--radius) bg-(--surface-muted) text-(--brand-teal)"><Icon size={19}/></span><h2 className="mt-4 text-base font-black text-(--text-strong)">{title}</h2><p className="mt-2 text-[13px] leading-7 text-(--text-secondary)">{text}</p></article>)}</section><section className="mt-8 rounded-(--radius-lg) border border-(--border-strong) bg-white p-6 sm:p-8"><p className="text-[12px] font-bold text-(--brand-teal)">استاندارد انتشار</p><h2 className="mt-2 text-xl font-black text-(--text-strong)">هر مطلب چگونه آماده می‌شود؟</h2><ul className="mt-5 space-y-3">{["موضوع و ادعاهای اصلی پیش از نگارش بررسی می‌شوند.", "متن از نظر دقت، خوانایی و سازگاری با لحن مجله ویرایش می‌شود.", "اصلاحات مهم پس از انتشار به‌صورت شفاف در مطلب ثبت می‌شوند."].map((item) => <li key={item} className="flex gap-3 text-[14px] leading-7 text-(--text-secondary)"><CheckCircle2 className="mt-1 shrink-0 text-(--brand-teal)" size={17}/>{item}</li>)}</ul></section></StaticPageLayout>;
}
