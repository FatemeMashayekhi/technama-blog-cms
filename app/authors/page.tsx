import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsletterSection } from "@/components/public/newsletter-section";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { getPublicAuthors } from "@/lib/public-author-service";

export const revalidate = 300;

export const metadata: Metadata = { title: "نویسندگان", description: "با نویسندگان و متخصصان تحریریه تک‌نما آشنا شوید.", alternates: { canonical: "/authors" } };

export default async function AuthorsPage() {
  const authors = await getPublicAuthors();
  return <div className="public-site min-h-screen"><PublicHeader/><main id="main-content" tabIndex={-1}><header className="border-b border-(--border) bg-white"><div className="mx-auto max-w-360 px-4 py-14 md:px-7 md:py-20"><p className="editorial-kicker">تحریریه چندصدایی</p><h1 className="mt-3 max-w-3xl text-[36px] font-black leading-[1.5] tracking-[-.05em] sm:text-[50px]">آدم‌هایی که فناوری را برای شما معنا می‌کنند</h1><p className="mt-5 max-w-2xl text-[17px] leading-8 text-(--text-secondary)">ترکیبی از مهندسی، طراحی، امنیت و کسب‌وکار؛ هر نویسنده با زاویه‌ای روشن و تجربه‌ای واقعی.</p></div></header><section className="mx-auto grid max-w-360 gap-5 px-4 py-12 sm:grid-cols-2 md:px-7 md:py-16 lg:grid-cols-3">{authors.map((author, index) => <Link key={author.id} href={`/authors/${author.username}`} className={`group relative min-h-80 overflow-hidden rounded-[22px] border border-(--border) p-6 transition duration-300 hover:-translate-y-1 hover:border-(--editorial-coral) hover:shadow-[0_18px_44px_rgba(16,42,58,.09)] ${index === 0 ? "bg-(--public-ink) text-white sm:col-span-2" : "bg-white"}`}><span className={`grid size-17 place-items-center rounded-full text-lg font-black ring-4 ${author.avatarColor} ${index === 0 ? "ring-white/10" : "ring-(--public-paper-deep)"}`}>{author.initials}</span><h2 className={`mt-5 text-[22px] font-black ${index === 0 ? "text-white" : "text-(--public-ink) group-hover:text-(--editorial-coral)"}`}>{author.name}</h2><p className={`mt-1 text-[13px] font-bold ${index === 0 ? "text-(--editorial-gold)" : "text-(--text-muted)"}`}>{author.roleLabel}</p><p className={`mt-4 max-w-xl text-[15px] leading-8 ${index === 0 ? "text-white/70" : "text-(--text-secondary)"}`}>{author.bio}</p><span className={`absolute bottom-6 right-6 inline-flex items-center gap-1.5 text-[13px] font-black ${index === 0 ? "text-(--editorial-gold)" : "text-(--text-muted)"}`}>{author.articleCount.toLocaleString("fa-IR")} مقاله <ArrowLeft size={14}/></span></Link>)}</section><NewsletterSection/></main><PublicFooter/></div>;
}
