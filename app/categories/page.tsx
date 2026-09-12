import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { publicCategories } from "@/lib/public-data";

export const metadata: Metadata = { title: "دسته‌بندی‌ها", description: "موضوعات اصلی مجله فناوری تک‌نما را مرور کنید.", alternates: { canonical: "/categories" } };

export default function CategoriesPage() {
  return <div className="public-site min-h-screen"><PublicHeader/><main id="main-content" tabIndex={-1}><header className="border-b border-(--border) bg-white"><div className="mx-auto max-w-360 px-4 py-14 md:px-7 md:py-20"><p className="editorial-kicker">نقشه محتوای مجله</p><h1 className="mt-3 max-w-3xl text-[36px] font-black leading-[1.5] tracking-[-.05em] sm:text-[50px]">موضوعی را انتخاب کنید و عمیق‌تر بخوانید</h1><p className="mt-5 max-w-2xl text-[17px] leading-8 text-(--text-secondary)">از هوش مصنوعی و مهندسی نرم‌افزار تا طراحی محصول، امنیت و اقتصاد نوآوری.</p></div></header><section className="mx-auto grid max-w-360 gap-5 px-4 py-12 sm:grid-cols-2 md:px-7 md:py-16 lg:grid-cols-3">{publicCategories.map((category, index) => <Link key={category.id} href={`/categories/${category.slug}`} className={`group relative min-h-72 overflow-hidden rounded-[22px] border border-(--border) p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(16,42,58,.09)] ${index === 0 ? "bg-(--public-ink) text-white sm:col-span-2" : "bg-white"}`}><span aria-hidden="true" className="absolute -left-16 -top-16 size-52 rounded-full opacity-20" style={{ backgroundColor: category.color }}/><span className="relative block h-1.5 w-14 rounded-full" style={{ backgroundColor: category.color }}/><h2 className={`relative mt-6 text-[24px] font-black ${index === 0 ? "text-white" : "text-(--public-ink) group-hover:text-(--editorial-coral)"}`}>{category.name}</h2><p className={`relative mt-3 max-w-xl text-[15px] leading-8 ${index === 0 ? "text-white/70" : "text-(--text-secondary)"}`}>{category.description}</p><span className={`absolute bottom-6 right-6 inline-flex items-center gap-1.5 text-[13px] font-black ${index === 0 ? "text-(--editorial-gold)" : "text-(--text-muted)"}`}>{category.articleCount.toLocaleString("fa-IR")} مقاله <ArrowLeft size={14}/></span></Link>)}</section><NewsletterSection/></main><PublicFooter/></div>;
}
