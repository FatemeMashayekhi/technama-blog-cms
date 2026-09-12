import { FolderX } from "lucide-react";
import Link from "next/link";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export default function CategoryNotFound() {
  return <div className="public-site min-h-screen"><PublicHeader/><main id="main-content" tabIndex={-1} className="grid min-h-[65vh] place-items-center px-4 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-(--surface-muted) text-(--brand-teal)"><FolderX size={26}/></span><h1 className="mt-5 text-2xl font-black text-(--text-strong)">این دسته‌بندی پیدا نشد</h1><p className="mt-2 text-[13px] leading-6 text-(--text-muted)">ممکن است آدرس تغییر کرده باشد یا این دسته‌بندی هنوز منتشر نشده باشد.</p><Link href="/" className="mt-6 inline-flex rounded-(--radius-sm) bg-(--brand-navy) px-5 py-3 text-[12px] font-bold text-white">بازگشت به صفحه اصلی</Link></div></main><PublicFooter/></div>;
}
