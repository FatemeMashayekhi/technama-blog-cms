"use client";

import { ArrowLeft, Menu, PenLine, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDialogFocus } from "./use-dialog-focus";

const nav = [
  { label: "خانه", href: "/", match: (path: string) => path === "/" },
  { label: "مقالات", href: "/articles", match: (path: string) => path.startsWith("/articles") },
  { label: "دسته‌بندی‌ها", href: "/categories", match: (path: string) => path.startsWith("/categories") },
  { label: "نویسندگان", href: "/authors", match: (path: string) => path.startsWith("/authors") },
  { label: "برچسب‌ها", href: "/tags", match: (path: string) => path.startsWith("/tags") },
  { label: "درباره ما", href: "/about", match: (path: string) => path === "/about" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuDialogRef = useRef<HTMLElement>(null);
  const searchDialogRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useDialogFocus(menuOpen, menuDialogRef, menuTriggerRef, closeMenu);
  useDialogFocus(searchOpen, searchDialogRef, searchTriggerRef, closeSearch);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen, searchOpen]);

  return <>
    <a href="#main-content" className="skip-link">رفتن به محتوای اصلی</a>
    <div className="hidden border-b border-white/10 bg-(--brand-navy) text-white md:block">
      <div className="mx-auto flex h-10 max-w-360 items-center justify-between px-7 text-[12px] text-white/72">
        <span>روایت مستقل فناوری؛ با زمینه، داده و نگاه انسانی</span>
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 font-bold hover:text-white">نسخه نمایشی اتاق خبر <ArrowLeft size={12}/></Link>
      </div>
    </div>
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--public-paper)/92 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-360 items-center px-4 md:px-7">
        <Link href="/" aria-label="تک‌نما - صفحه اصلی" className="group flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-(--public-ink) text-white transition-transform group-hover:-rotate-3"><PenLine size={18}/></span>
          <span><strong className="block text-[17px] font-black tracking-[-.04em] text-(--public-ink)">تک‌نما</strong><small className="block text-[12px] font-medium tracking-[-.01em] text-(--text-muted)">مجله فناوری و نوآوری</small></span>
        </Link>
        <nav className="mr-10 hidden items-center gap-6 lg:flex" aria-label="منوی اصلی سایت">
          {nav.map((item) => { const active = item.match(pathname); return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`relative flex h-18 items-center text-[14px] font-bold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-right after:bg-(--editorial-coral) after:transition-transform ${active ? "text-(--public-ink) after:scale-x-100" : "text-(--text-secondary) after:scale-x-0 hover:text-(--public-ink) hover:after:scale-x-100"}`}>{item.label}</Link>; })}
        </nav>
        <div className="mr-auto flex items-center gap-1.5">
          <button ref={searchTriggerRef} type="button" onClick={() => setSearchOpen(true)} aria-label="باز کردن جستجو" aria-expanded={searchOpen} aria-haspopup="dialog" className="grid size-11 place-items-center rounded-full border border-(--border) text-(--text-secondary) transition hover:border-(--public-ink) hover:bg-white hover:text-(--public-ink)"><Search size={18}/></button>
          <button ref={menuTriggerRef} type="button" onClick={() => setMenuOpen(true)} aria-label="باز کردن منو" aria-expanded={menuOpen} aria-haspopup="dialog" className="grid size-11 place-items-center rounded-full border border-(--border) text-(--text-secondary) hover:border-(--public-ink) hover:bg-white lg:hidden"><Menu size={20}/></button>
        </div>
      </div>
    </header>

    {menuOpen && <div className="fixed inset-0 z-[70] lg:hidden"><button type="button" aria-label="بستن منو" onClick={closeMenu} className="absolute inset-0 bg-(--public-ink)/55 backdrop-blur-sm"/><aside ref={menuDialogRef} role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title" className="absolute inset-y-0 right-0 w-[min(88vw,360px)] bg-(--public-paper) p-5 shadow-2xl"><div className="flex h-12 items-center justify-between border-b border-(--border) pb-4"><strong id="mobile-menu-title" className="text-base font-black text-(--public-ink)">فهرست تک‌نما</strong><button type="button" data-autofocus onClick={closeMenu} aria-label="بستن منو" className="grid size-11 place-items-center rounded-full hover:bg-(--surface-muted)"><X size={20}/></button></div><nav className="mt-5 space-y-1" aria-label="منوی موبایل">{nav.map((item) => <Link key={item.href} href={item.href} onClick={closeMenu} className="flex min-h-12 items-center justify-between rounded-(--radius-sm) px-3 text-[15px] font-bold text-(--text-secondary) hover:bg-white hover:text-(--public-ink)">{item.label}<ArrowLeft size={15}/></Link>)}</nav><Link href="/admin/dashboard" className="mt-7 flex min-h-12 items-center justify-center rounded-(--radius-sm) border border-(--border-strong) bg-white text-[13px] font-bold text-(--text-secondary)">نسخه نمایشی اتاق خبر</Link></aside></div>}

    {searchOpen && <div ref={searchDialogRef} role="dialog" aria-modal="true" aria-labelledby="search-dialog-title" className="fixed inset-0 z-[80] grid place-items-start bg-(--public-ink)/62 p-4 pt-[12vh] backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSearch(); }}><div className="mx-auto w-full max-w-2xl"><h2 id="search-dialog-title" className="mb-3 text-sm font-bold text-white">جستجو در آرشیو تک‌نما</h2><form action="/search" role="search" className="flex w-full items-center gap-2 rounded-(--radius-lg) bg-white p-2 shadow-2xl"><Search className="mr-2 shrink-0 text-(--text-muted)" size={20}/><label htmlFor="public-search" className="sr-only">جستجو در مجله</label><input id="public-search" name="q" data-autofocus required placeholder="موضوع، مقاله یا نویسنده..." className="h-12 min-w-0 flex-1 bg-transparent text-[16px] text-(--text-strong) outline-none"/><button type="submit" className="h-11 rounded-(--radius-sm) bg-(--editorial-coral) px-5 text-[14px] font-bold text-white hover:bg-(--editorial-coral-dark)">جستجو</button><button type="button" onClick={closeSearch} aria-label="بستن جستجو" className="grid size-11 shrink-0 place-items-center rounded-full text-(--text-secondary) hover:bg-(--surface-muted)"><X size={18}/></button></form><p className="mt-3 text-[13px] text-white/70">کلید Escape پنجره را می‌بندد و تمرکز را به دکمه جستجو برمی‌گرداند.</p></div></div>}
  </>;
}
