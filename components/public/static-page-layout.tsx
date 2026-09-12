import type { ReactNode } from "react";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export function StaticPageLayout({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-(--surface-subtle) text-(--text-strong)">
      <PublicHeader/>
      <main>
        <section className="border-b border-(--border-strong) bg-white"><div className="mx-auto max-w-4xl px-4 py-12 text-center md:px-7 md:py-18"><p className="text-[12px] font-bold tracking-[.12em] text-(--brand-teal)">{eyebrow}</p><h1 className="mt-2 text-3xl font-black tracking-[-.04em] text-(--text-strong) sm:text-4xl">{title}</h1><p className="mx-auto mt-4 max-w-2xl text-[14px] leading-8 text-(--text-secondary)">{intro}</p></div></section>
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-7 md:py-14">{children}</div>
      </main>
      <PublicFooter/>
    </div>
  );
}
