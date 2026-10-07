import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, Clock3, Mail, MessageSquareText, Newspaper, PenLine, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export const metadata: Metadata = { title: "تماس با تک‌نما", description: "پیشنهاد موضوع، اصلاح مقاله و راه‌های همکاری با تحریریه مجله فناوری تک‌نما.", alternates: { canonical: "https://technama.ir/contact" } };

const contactPaths = [
  { icon: Newspaper, title: "پیشنهاد موضوع", text: "سوژه، محصول یا روندی را معرفی کنید که به بررسی دقیق‌تر نیاز دارد.", label: "ارسال پیشنهاد", subject: "پیشنهاد موضوع برای تک‌نما" },
  { icon: PenLine, title: "اصلاح یک مطلب", text: "اگر خطا، ابهام یا منبع دقیق‌تری پیدا کرده‌اید، جزئیات را برای ما بفرستید.", label: "ارسال اصلاحیه", subject: "اصلاحیه برای یکی از مطالب تک‌نما" },
  { icon: UsersRound, title: "همکاری تحریریه", text: "برای نویسندگی، پژوهش، طراحی یا همکاری پروژه‌ای با تیم تک‌نما گفت‌وگو کنید.", label: "شروع همکاری", subject: "همکاری با تحریریه تک‌نما" },
];

export default function ContactPage() {
  return (
    <div className="public-site min-h-screen">
      <PublicHeader />
      <main id="main-content" tabIndex={-1}>
        <header className="relative overflow-hidden bg-(--public-ink) text-white">
          <span aria-hidden="true" className="absolute -left-10 -top-24 font-mono text-[300px] font-black leading-none text-white/[.035] sm:text-[440px]">@</span>
          <div aria-hidden="true" className="absolute -right-32 bottom-0 size-96 rounded-full bg-(--brand-teal)/25 blur-3xl" />
          <div className="relative mx-auto grid max-w-360 gap-10 px-4 py-14 md:px-7 md:py-20 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-center lg:py-24">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-[12px] font-black tracking-[.05em] text-(--editorial-gold) sm:text-[13px]"><Sparkles size={15} /> ارتباط مستقیم با تحریریه</p>
              <h1 className="mt-4 text-[38px] font-black leading-[1.45] tracking-[-.055em] text-balance sm:text-[52px] lg:text-[62px]">هر روایت خوب، با یک <span className="text-(--editorial-coral)">گفت‌وگوی دقیق</span> شروع می‌شود.</h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-8 text-white/66 sm:text-[17px] sm:leading-9">برای پیشنهاد سوژه، اصلاح یک مطلب یا شکل‌دادن به همکاری تازه، پیام شما مستقیماً به تحریریه تک‌نما می‌رسد.</p>
            </div>
            <div className="rounded-[26px] border border-white/12 bg-white/[.065] p-6 shadow-[0_24px_70px_rgba(0,0,0,.18)] backdrop-blur sm:p-7">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-(--editorial-gold)"><MessageSquareText size={22} /></span>
              <h2 className="mt-5 text-[20px] font-black sm:text-[23px]">پیام شما در صف پاسخ عمومی گم نمی‌شود</h2>
              <p className="mt-3 text-[13px] leading-7 text-white/60 sm:text-[14px]">هر ایمیل بر اساس موضوع به عضو مرتبط تحریریه ارجاع می‌شود.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <div><Clock3 size={17} className="text-(--editorial-gold)" /><strong className="mt-3 block text-[19px] font-black sm:text-[22px]">۲ تا ۳ روز</strong><span className="text-[11px] text-white/45 sm:text-[12px]">زمان پاسخ معمول</span></div>
                <div><ShieldCheck size={17} className="text-(--editorial-gold)" /><strong className="mt-3 block text-[19px] font-black sm:text-[22px]">محرمانه</strong><span className="text-[11px] text-white/45 sm:text-[12px]">اطلاعات تماس شما</span></div>
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-360 px-4 py-12 md:px-7 md:py-18" aria-labelledby="contact-paths-title">
          <div className="editorial-rule border-b border-(--border-strong) pb-5">
            <p className="editorial-kicker">مسیر درست پیام</p>
            <h2 id="contact-paths-title" className="mt-2 text-[27px] font-black tracking-[-.04em] text-(--public-ink) sm:text-[34px]">چطور می‌توانیم کمک کنیم؟</h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {contactPaths.map(({ icon: Icon, title, text, label, subject }, index) => (
              <article key={title} className={`group relative flex min-h-72 flex-col overflow-hidden rounded-[24px] border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(16,42,58,.09)] sm:p-7 ${index === 0 ? "border-(--public-ink) bg-(--public-ink) text-white" : "border-(--border) bg-white"}`}>
                <span aria-hidden="true" className={`absolute -left-5 -top-9 font-mono text-[110px] font-black opacity-[.045] ${index === 0 ? "text-white" : "text-(--public-ink)"}`}>0{index + 1}</span>
                <span className={`relative grid size-12 place-items-center rounded-2xl ${index === 0 ? "bg-white/10 text-(--editorial-gold)" : "bg-(--public-paper-deep) text-(--editorial-coral)"}`}><Icon size={21} /></span>
                <h3 className={`relative mt-6 text-[20px] font-black ${index === 0 ? "text-white" : "text-(--public-ink)"}`}>{title}</h3>
                <p className={`relative mt-3 text-[14px] leading-7 ${index === 0 ? "text-white/62" : "text-(--text-secondary)"}`}>{text}</p>
                <a href={`mailto:editorial@technama.ir?subject=${encodeURIComponent(subject)}`} className={`relative mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-[13px] font-black ${index === 0 ? "text-(--editorial-gold)" : "text-(--editorial-coral)"}`}>{label} <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-(--border) bg-(--public-paper-deep)">
          <div className="mx-auto grid max-w-360 gap-8 px-4 py-12 md:px-7 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.72fr)] lg:items-center">
            <div>
              <p className="editorial-kicker">برای پاسخ دقیق‌تر</p>
              <h2 className="mt-3 text-[28px] font-black leading-[1.55] tracking-[-.04em] text-(--public-ink) sm:text-[36px]">در پیام خود چه چیزهایی بنویسید؟</h2>
              <p className="mt-4 max-w-2xl text-[14px] leading-8 text-(--text-secondary) sm:text-[15px]">نیازی به متن رسمی و طولانی نیست؛ چند جزئیات مشخص کمک می‌کند پیام سریع‌تر به فرد درست برسد.</p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {["موضوع را در یک جمله روشن کنید", "اگر درباره مقاله‌ای است، لینک آن را بفرستید", "منبع یا زمینه لازم را اضافه کنید", "روش مناسب پاسخ‌گویی را مشخص کنید"].map((item) => <li key={item} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 text-[13px] font-bold leading-6 text-(--text-secondary) shadow-[0_8px_24px_rgba(16,42,58,.035)] sm:text-[14px]"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-(--brand-teal)" />{item}</li>)}
              </ul>
            </div>
            <div className="rounded-[26px] bg-white p-6 shadow-[0_18px_55px_rgba(16,42,58,.08)] sm:p-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-[#e1efec] text-(--brand-teal)"><Mail size={21} /></span>
              <p className="mt-6 text-[12px] font-black text-(--text-muted) sm:text-[13px]">ایمیل مستقیم تحریریه</p>
              <a dir="ltr" href="mailto:editorial@technama.ir" className="mt-2 block break-all text-left font-mono text-[18px] font-black tracking-[-.03em] text-(--public-ink) transition hover:text-(--editorial-coral) sm:text-[22px]">editorial@technama.ir</a>
              <p className="mt-5 border-t border-(--border-subtle) pt-5 text-[12px] leading-6 text-(--text-muted) sm:text-[13px]">این آدرس برای ارتباط تحریریه در نسخه پورتفولیو تعریف شده و پیش از انتشار روی دامنه واقعی باید به صندوق ایمیل فعال متصل شود.</p>
              <a href="mailto:editorial@technama.ir?subject=%D8%A7%D8%B1%D8%AA%D8%A8%D8%A7%D8%B7%20%D8%A8%D8%A7%20%D8%AA%D8%AD%D8%B1%DB%8C%D8%B1%DB%8C%D9%87%20%D8%AA%DA%A9%E2%80%8C%D9%86%D9%85%D8%A7" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-(--editorial-coral) px-6 text-[13px] font-black text-white transition hover:bg-(--editorial-coral-dark)">نوشتن ایمیل <ArrowLeft size={16} /></a>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
