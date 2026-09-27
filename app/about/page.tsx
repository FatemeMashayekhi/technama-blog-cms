import type { Metadata } from "next";
import { ArrowLeft, BookOpenCheck, CheckCircle2, Compass, FileSearch, HeartHandshake, MessageSquareQuote, PenLine, Scale, Sparkles, UsersRound } from "lucide-react";
import Link from "next/link";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export const metadata: Metadata = {
  title: "درباره تک‌نما؛ تحریریه‌ای برای فهم عمیق فناوری",
  description: "با داستان، مأموریت، اصول تحریریه و فرایند تولید محتوای مجله فناوری تک‌نما آشنا شوید.",
  alternates: { canonical: "https://technama.ir/about" },
};

const values = [
  { icon: Compass, index: "۰۱", title: "معنا پیش از هیاهو", text: "هر موج خبری را از فاصله‌ای دقیق نگاه می‌کنیم تا اثر واقعی آن بر محصول، کسب‌وکار و زندگی دیجیتال روشن شود." },
  { icon: Scale, index: "۰۲", title: "استقلال و شفافیت", text: "مرز محتوای تحریریه و همکاری تجاری را آشکار نگه می‌داریم و خطاها یا تعارض منافع را بی‌پرده توضیح می‌دهیم." },
  { icon: UsersRound, index: "۰۳", title: "چندصدایی متخصصان", text: "مهندسان، طراحان و تحلیل‌گران کنار هم می‌نویسند تا هر موضوع از بیش از یک زاویه دیده و سنجیده شود." },
];

const workflow = [
  { icon: Sparkles, title: "انتخاب مسئله", text: "موضوعی را انتخاب می‌کنیم که برای مخاطب تصمیم یا درک تازه‌ای بسازد؛ نه صرفاً کلیک بیشتر." },
  { icon: FileSearch, title: "پژوهش و راستی‌آزمایی", text: "منابع اصلی، داده‌ها و ادعاهای کلیدی بررسی می‌شوند و زمینه لازم به روایت اضافه می‌شود." },
  { icon: PenLine, title: "ویرایش تحریریه", text: "ساختار، دقت، لحن و خوانایی متن در یک بازبینی مستقل اصلاح و یکدست می‌شود." },
  { icon: BookOpenCheck, title: "انتشار و به‌روزرسانی", text: "مطالب مهم بعد از انتشار نیز بازبینی می‌شوند و اصلاحات معنادار به‌صورت شفاف ثبت می‌شوند." },
];

const commitments = [
  "تا جای ممکن به منبع اصلی و داده قابل بررسی ارجاع می‌دهیم.",
  "محتوای حمایت‌شده را از قضاوت مستقل تحریریه جدا و مشخص می‌کنیم.",
  "پیچیدگی فنی را ساده می‌کنیم، بدون آنکه دقت را قربانی کنیم.",
  "بازخورد و اصلاح مستند را بخشی از کیفیت انتشار می‌دانیم.",
];

export default function AboutPage() {
  return (
    <div className="public-site min-h-screen">
      <PublicHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="relative overflow-hidden border-b border-(--border) bg-(--public-paper)">
          <div aria-hidden="true" className="absolute -left-24 -top-32 size-128 rounded-full bg-[#e7d4b5]/45 blur-3xl" />
          <div aria-hidden="true" className="absolute -right-32 bottom-0 size-112 rounded-full bg-[#cfe6e1]/45 blur-3xl" />
          <div className="relative mx-auto grid max-w-360 gap-10 px-4 py-14 md:px-7 md:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,.72fr)] lg:items-center lg:py-24">
            <div>
              <p className="editorial-kicker flex items-center gap-2"><span className="h-px w-8 bg-(--editorial-coral)" /> درباره تحریریه</p>
              <h1 className="mt-5 max-w-4xl text-[40px] font-black leading-[1.42] tracking-[-.055em] text-balance text-(--public-ink) sm:text-[54px] lg:text-[66px]">
                فناوری را با فاصله‌ای به اندازه <span className="text-(--editorial-coral)">فهمیدن</span> روایت می‌کنیم.
              </h1>
              <p className="mt-6 max-w-3xl text-[16px] leading-9 text-(--text-secondary) sm:text-[18px]">تک‌نما یک مجله مستقل و چندنویسنده‌ای برای کسانی است که می‌خواهند از تیتر روز عبور کنند و بفهمند فناوری چگونه انتخاب‌ها، محصولات و آینده ما را تغییر می‌دهد.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/articles" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-(--public-ink) px-6 text-[14px] font-black text-white transition hover:bg-(--brand-navy-hover)">مطالعه مجله <ArrowLeft size={16} /></Link>
                <Link href="/authors" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-(--border-strong) bg-white/70 px-6 text-[14px] font-black text-(--public-ink) transition hover:border-(--public-ink)">آشنایی با نویسندگان</Link>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-[28px] border border-white/10 bg-(--public-ink) p-7 text-white shadow-[0_28px_80px_rgba(16,42,58,.2)] sm:p-9">
              <div aria-hidden="true" className="absolute -left-16 -top-16 size-48 rounded-full border-[28px] border-white/5" />
              <MessageSquareQuote className="relative text-(--editorial-gold)" size={34} strokeWidth={1.7} />
              <blockquote className="relative mt-8 text-balance text-[23px] font-black leading-[1.85] tracking-[-.025em] sm:text-[27px]">«کار ما پیش‌بینی آینده نیست؛ ساختن زمینه‌ای است که مخاطب بتواند آینده را بهتر ببیند.»</blockquote>
              <div className="relative mt-8 border-t border-white/15 pt-5">
                <p className="text-[13px] font-black text-white">مانیفست تک‌نما</p>
                <p className="mt-1 text-[12px] text-white/55">دقت، وضوح و کنجکاوی مسئولانه</p>
              </div>
            </aside>
          </div>
        </section>

        <section aria-label="نگاه تک‌نما در یک قاب" className="border-b border-(--border) bg-white">
          <div className="mx-auto grid max-w-360 grid-cols-1 divide-y divide-(--border) px-4 md:grid-cols-3 md:divide-x md:divide-x-reverse md:divide-y-0 md:px-7">
            {[{ value: "۵", label: "حوزه تخصصی" }, { value: "۳", label: "لایه بررسی پیش از انتشار" }, { value: "۱", label: "معیار ثابت؛ اعتماد مخاطب" }].map((item) => <div key={item.label} className="flex items-baseline justify-center gap-3 py-6 md:py-8"><strong className="font-mono text-[34px] font-black tracking-[-.06em] text-(--editorial-coral)">{item.value}</strong><span className="text-[13px] font-bold text-(--text-secondary)">{item.label}</span></div>)}
          </div>
        </section>

        <section className="mx-auto max-w-360 px-4 py-16 md:px-7 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="editorial-kicker">چرا تک‌نما؟</p>
              <h2 className="mt-3 text-[30px] font-black leading-[1.55] tracking-[-.045em] text-(--public-ink) sm:text-[38px]">برای تصمیم‌گیری بهتر، اطلاعات بیشتری کافی نیست.</h2>
              <p className="mt-5 text-[15px] leading-8 text-(--text-secondary)">آنچه کم داریم، زمینه، اولویت و روایت قابل اعتماد است. مأموریت ما تبدیل سیل خبر و داده به تصویری روشن است که بتوان با آن فکر کرد، گفت‌وگو کرد و تصمیم گرفت.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {values.map(({ icon: Icon, index, title, text }) => <article key={title} className="group relative overflow-hidden rounded-[22px] border border-(--border) bg-white p-6 shadow-[0_12px_35px_rgba(16,42,58,.045)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(16,42,58,.08)]"><span className="font-mono text-[12px] font-black tracking-[.08em] text-(--text-faint)">{index}</span><span className="mt-8 grid size-11 place-items-center rounded-2xl bg-(--public-paper-deep) text-(--editorial-coral)"><Icon size={20} /></span><h3 className="mt-5 text-[17px] font-black text-(--public-ink)">{title}</h3><p className="mt-3 text-[13px] leading-7 text-(--text-secondary)">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="border-y border-(--border) bg-(--public-paper-deep)">
          <div className="mx-auto max-w-360 px-4 py-16 md:px-7 md:py-24">
            <div className="max-w-2xl"><p className="editorial-kicker">از ایده تا انتشار</p><h2 className="mt-3 text-[30px] font-black tracking-[-.045em] text-(--public-ink) sm:text-[38px]">هر مطلب چگونه ساخته می‌شود؟</h2><p className="mt-4 text-[15px] leading-8 text-(--text-secondary)">فرایند تحریریه برای کند کردن انتشار نیست؛ برای بالا بردن کیفیت هر تصمیمی است که مخاطب بر اساس آن می‌گیرد.</p></div>
            <ol className="relative mt-12 grid gap-5 lg:grid-cols-4 lg:gap-0">
              {workflow.map(({ icon: Icon, title, text }, index) => <li key={title} className="group relative rounded-[22px] border border-(--border) bg-white p-6 lg:rounded-none lg:border-l-0 lg:first:rounded-r-[22px] lg:last:rounded-l-[22px] lg:last:border-l"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-(--surface-muted) text-(--brand-teal)"><Icon size={20} /></span><span className="font-mono text-[24px] font-black text-(--text-faint)">{(index + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}</span></div><h3 className="mt-8 text-[17px] font-black text-(--public-ink)">{title}</h3><p className="mt-3 text-[13px] leading-7 text-(--text-secondary)">{text}</p></li>)}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-360 gap-8 px-4 py-16 md:px-7 md:py-24 lg:grid-cols-[1fr_.85fr] lg:items-stretch">
          <div className="rounded-[26px] border border-(--border) bg-white p-7 sm:p-10">
            <p className="editorial-kicker">پیمان ما با مخاطب</p>
            <h2 className="mt-3 text-[28px] font-black tracking-[-.04em] text-(--public-ink)">اعتماد، قابلیت یک مطلب نیست؛ حاصل یک فرایند است.</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">{commitments.map((item) => <li key={item} className="flex gap-3 rounded-2xl bg-(--surface-subtle) p-4 text-[13px] leading-7 text-(--text-secondary)"><CheckCircle2 className="mt-1 shrink-0 text-(--brand-teal)" size={18} /><span>{item}</span></li>)}</ul>
          </div>
          <div className="flex flex-col justify-between rounded-[26px] bg-(--editorial-coral) p-7 text-white shadow-[0_24px_60px_rgba(201,79,53,.2)] sm:p-10">
            <div><HeartHandshake size={32} /><h2 className="mt-8 text-[29px] font-black leading-[1.55] tracking-[-.04em]">روایت یا تخصصی دارید که باید شنیده شود؟</h2><p className="mt-4 text-[14px] leading-8 text-white/78">پیشنهاد موضوع، تجربه حرفه‌ای یا نقد خود را برای تحریریه بفرستید. بهترین گفتگوها از یک پرسش خوب آغاز می‌شوند.</p></div>
            <Link href="/contact" className="mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-[14px] font-black text-(--editorial-coral) transition hover:bg-(--public-paper)">گفت‌وگو با تحریریه <ArrowLeft size={16} /></Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
