import { ArrowRight, FileQuestion } from "lucide-react";
import Link from "next/link";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
export default function NotFound() { return <div className="public-site min-h-screen"><PublicHeader/><main id="main-content" tabIndex={-1} className="grid min-h-[65vh] place-items-center px-4 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-(--radius-lg) bg-(--surface-muted) text-(--text-secondary)"><FileQuestion size={25}/></span><h1 className="mt-5 text-xl font-bold text-(--text-strong)">مقاله پیدا نشد</h1><p className="mt-2 text-[13px] text-(--text-muted)">ممکن است مقاله حذف شده، منتشر نشده یا آدرس آن تغییر کرده باشد.</p><Link href="/" className="mt-6 inline-flex h-10 items-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-4 text-[12px] font-bold text-white"><ArrowRight size={13}/> بازگشت به مقالات</Link></div></main><PublicFooter/></div>; }

