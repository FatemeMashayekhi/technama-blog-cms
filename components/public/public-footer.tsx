import { ArrowLeft, BookOpenText, BriefcaseBusiness, Camera, Code2, Mail, PenLine, Send, Sparkles } from "lucide-react";
import Link from "next/link";

const groups = [
  { title: "مجله", links: [["درباره تک‌نما", "/about"], ["تماس با تحریریه", "/contact"], ["نویسندگان", "/authors"]] },
  { title: "کشف محتوا", links: [["آخرین مقالات", "/articles"], ["پرمخاطب‌ترین‌ها", "/articles?sort=popular"], ["دسته‌بندی‌ها", "/categories"], ["نمایه برچسب‌ها", "/tags"]] },
];

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-[#0c2738] text-white">
      <span aria-hidden="true" className="absolute -left-20 top-18 font-mono text-[260px] font-black leading-none text-white/[.025] sm:text-[360px]">ت</span>
      <div aria-hidden="true" className="absolute -right-28 top-24 size-96 rounded-full bg-(--brand-teal)/15 blur-3xl" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 md:px-7 md:pt-14">
        <section className="grid gap-7 rounded-[26px] border border-white/10 bg-white/[.055] px-5 py-7 shadow-[0_24px_70px_rgba(0,0,0,.16)] backdrop-blur sm:px-7 sm:py-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-10">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-[12px] font-black tracking-[.05em] text-(--editorial-gold) sm:text-[13px]"><Sparkles size={15} /> یک گفت‌وگوی خوب از یک سؤال دقیق شروع می‌شود</p>
            <h2 className="mt-3 text-[24px] font-black leading-[1.6] tracking-[-.045em] text-balance sm:text-[30px] lg:text-[36px]">موضوعی برای بررسی دارید یا می‌خواهید با تحریریه همکاری کنید؟</h2>
            <p className="mt-3 max-w-2xl text-[13px] leading-7 text-white/62 sm:text-[14px] lg:text-[15px] lg:leading-8">ایده، اصلاحیه یا تجربه‌ای که ارزش روایت دارد را برای ما بفرستید. هر پیام با دقت توسط تحریریه بررسی می‌شود.</p>
          </div>
          <Link href="/contact" className="group inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-(--editorial-coral) px-6 text-[13px] font-black text-white transition hover:-translate-y-0.5 hover:bg-(--editorial-coral-dark) sm:text-[14px]">گفت‌وگو با تک‌نما <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /></Link>
        </section>
      </div>

      <div className="relative mx-auto grid max-w-360 gap-10 px-4 py-12 sm:grid-cols-2 md:px-7 md:py-16 lg:grid-cols-[1.35fr_.65fr_.65fr_.9fr] lg:gap-12">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="تک‌نما؛ صفحه اصلی">
            <span className="grid size-12 place-items-center rounded-full bg-white text-(--public-ink) shadow-[0_8px_24px_rgba(0,0,0,.16)] sm:size-13"><PenLine size={20} /></span>
            <span><strong className="block text-[20px] font-black tracking-[-.045em] sm:text-[22px]">تک‌نما</strong><small className="block text-[11px] font-bold text-white/45 sm:text-[12px]">مجله فناوری و نوآوری</small></span>
          </Link>
          <p className="mt-5 max-w-md text-[13px] leading-7 text-white/60 sm:text-[14px] lg:text-[15px] lg:leading-8">روایت دقیق و مستقل از فناوری، محصول و آدم‌هایی که آینده دیجیتال را می‌سازند؛ با زمینه، داده و نگاه انسانی.</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/articles" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[.04] px-4 text-[12px] font-black text-white/75 transition hover:border-white/30 hover:bg-white/[.08] hover:text-white sm:text-[13px]"><BookOpenText size={15} /> مطالعه مجله</Link>
            <Link href="/admin/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 px-4 text-[12px] font-black text-white/55 transition hover:border-white/30 hover:text-white sm:text-[13px]"><Code2 size={15} /> اتاق خبر</Link>
          </div>
        </div>

        {groups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="flex items-center gap-2 text-[13px] font-black text-white sm:text-[14px]"><span className="h-px w-5 bg-(--editorial-coral)" />{group.title}</h3>
            <div className="mt-4 space-y-1">
              {group.links.map(([label, href]) => <Link key={href} href={href} className="group flex min-h-11 items-center justify-between gap-3 text-[13px] font-medium text-white/56 transition hover:text-white sm:text-[14px] lg:text-[15px]"><span>{label}</span><ArrowLeft size={14} className="opacity-0 transition group-hover:-translate-x-1 group-hover:opacity-100" /></Link>)}
            </div>
          </nav>
        ))}

        <div>
          <h3 className="flex items-center gap-2 text-[13px] font-black text-white sm:text-[14px]"><span className="h-px w-5 bg-(--editorial-coral)" />همراه تک‌نما</h3>
          <p className="mt-5 text-[13px] leading-7 text-white/55 sm:text-[14px]">برای پیشنهاد موضوع، اصلاح مقاله یا همکاری تحریریه با ما در ارتباط باشید.</p>
          <a dir="ltr" href="mailto:editorial@technama.ir" className="mt-4 inline-flex min-h-11 items-center gap-2 text-left text-[12px] font-bold text-white/78 transition hover:text-white sm:text-[13px]"><Mail size={15} /> editorial@technama.ir</a>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="شبکه‌های اجتماعی"><Social icon={Camera} label="اینستاگرام" /><Social icon={Send} label="تلگرام" /><Social icon={BriefcaseBusiness} label="لینکدین" /><Social icon={Code2} label="گیت‌هاب" /></div>
        </div>
      </div>

      <div className="relative border-t border-white/9">
        <div className="mx-auto flex max-w-360 flex-col gap-4 px-4 py-6 text-[11px] font-medium text-white/42 sm:text-[12px] md:px-7 lg:flex-row lg:items-center lg:text-[13px]">
          <p>© ۱۴۰۵ تک‌نما؛ تمام حقوق محفوظ است.</p>
          <p className="lg:mr-2">ساخته‌شده برای روایت دقیق‌تر فناوری.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:mr-auto"><Link href="/privacy" className="transition hover:text-white">حریم خصوصی</Link><Link href="/terms" className="transition hover:text-white">قوانین استفاده</Link><Link href="/contact" className="transition hover:text-white">ارتباط با ما</Link></div>
        </div>
      </div>
    </footer>
  );
}

function Social({ icon: Icon, label }: { icon: typeof Camera; label: string }) {
  return <span aria-label={`${label}؛ به‌زودی`} title={`${label}؛ به‌زودی`} className="grid size-11 place-items-center rounded-full border border-white/12 bg-white/[.035] text-white/48 transition hover:border-white/25 hover:text-white"><Icon size={16} /></span>;
}
