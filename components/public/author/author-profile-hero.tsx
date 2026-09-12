import { AtSign, BriefcaseBusiness, CalendarDays, Code2, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PublicAuthorDetail } from "@/lib/public-author-service";

const socialConfig = {
  website: { label: "وب‌سایت", icon: Globe },
  linkedin: { label: "لینکدین", icon: BriefcaseBusiness },
  twitter: { label: "ایکس / توییتر", icon: AtSign },
  github: { label: "گیت‌هاب", icon: Code2 },
} as const;

export function AuthorProfileHero({ author, publishedCount, totalViews }: { author: PublicAuthorDetail; publishedCount: number; totalViews: number }) {
  const formatter = new Intl.NumberFormat("fa-IR");
  const socials = Object.entries(author.socialLinks).filter((entry): entry is [keyof typeof socialConfig, string] => Boolean(entry[1]));

  return (
    <section className="border-b border-(--border-strong) bg-white">
      <div className="mx-auto max-w-360 px-4 py-8 md:px-7 md:py-12">
        <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-2 text-[12px] text-(--text-muted)">
          <Link href="/" className="hover:text-(--brand-teal)">خانه</Link><span aria-hidden="true">/</span><Link href="/authors" className="hover:text-(--editorial-coral)">نویسندگان</Link><span aria-hidden="true">/</span><span aria-current="page" className="font-bold text-(--text-strong)">{author.name}</span>
        </nav>

        <div className="mt-8 grid items-center gap-7 md:grid-cols-[auto_minmax(0,1fr)] md:gap-9">
          {author.avatar ? <Image src={author.avatar} width={144} height={144} priority alt={`تصویر ${author.name}`} className="size-28 rounded-full border-4 border-(--border-subtle) object-cover shadow-sm sm:size-36"/> : <div role="img" aria-label={`تصویر نمادین ${author.name}`} className={`grid size-28 place-items-center rounded-full border-4 border-white text-3xl font-black shadow-[0_12px_35px_rgba(24,55,69,.12)] sm:size-36 ${author.avatarColor}`}>{author.initials}</div>}
          <div className="min-w-0">
            <p className="text-[12px] font-bold tracking-[.12em] text-(--brand-teal)">تیم تحریریه تک‌نما</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-.04em] text-(--text-strong) sm:text-4xl">{author.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]"><span dir="ltr" className="font-bold text-(--brand-teal)">@{author.username}</span><span className="text-(--text-faint)" aria-hidden="true">•</span><span className="font-bold text-(--text-secondary)">{author.roleLabel}</span></div>
            <p className="mt-4 max-w-3xl text-[16px] leading-8 text-(--text-secondary)">{author.bio}</p>
            {socials.length > 0 && <div className="mt-5 flex flex-wrap gap-2" aria-label="شبکه‌های اجتماعی نویسنده">{socials.map(([key, href]) => { const item = socialConfig[key]; const Icon = item.icon; const url = key === "github" && !href.startsWith("http") ? `https://github.com/${href}` : href; return <a key={key} href={url} target="_blank" rel="noreferrer noopener" aria-label={`${item.label} ${author.name}؛ باز شدن در پنجره جدید`} className="grid size-10 place-items-center rounded-(--radius-sm) border border-(--border-strong) text-(--text-secondary) hover:border-(--border-strong) hover:bg-(--surface-muted) hover:text-(--brand-teal)"><Icon size={15}/></a>; })}</div>}
          </div>
        </div>

        <dl className="mt-9 grid grid-cols-2 overflow-hidden rounded-(--radius) border border-(--border-strong) bg-(--surface-subtle) sm:grid-cols-3">
          <div className="border-l border-(--border-strong) p-4 sm:p-5"><dt className="text-[14px] font-bold text-(--text-muted)">مقالات منتشرشده</dt><dd className="mt-1 text-lg font-black text-(--text-strong)">{formatter.format(publishedCount)}</dd></div>
          <div className="p-4 sm:border-l sm:border-(--border-strong) sm:p-5"><dt className="text-[14px] font-bold text-(--text-muted)">مجموع بازدید مقالات</dt><dd className="mt-1 text-lg font-black text-(--text-strong)">{formatter.format(totalViews)}</dd></div>
          <div className="col-span-2 flex items-center gap-2 border-t border-(--border-strong) p-4 sm:col-span-1 sm:border-t-0 sm:p-5"><CalendarDays size={16} className="text-(--brand-teal)"/><div><dt className="text-[14px] font-bold text-(--text-muted)">همراه تک‌نما از</dt><dd className="mt-1 text-[14px] font-black text-(--text-strong)">{author.joinedLabel}</dd></div></div>
        </dl>
      </div>
    </section>
  );
}
