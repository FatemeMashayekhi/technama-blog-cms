"use client";

import { Bell, ExternalLink, Menu, Search } from "lucide-react";
import Link from "next/link";

type HeaderProps = {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
};

export function Header({
  onMenuClick,
  title = "داشبورد تحریریه",
  subtitle = "سه‌شنبه، ۱۸ شهریور ۱۴۰۵",
  searchPlaceholder = "جست‌وجوی مقاله، نویسنده...",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-19 items-center gap-3 border-b border-(--border) bg-white/95 px-4 backdrop-blur md:px-7 lg:px-8">
      <button
        onClick={onMenuClick}
        aria-label="باز کردن منو"
        className="grid size-10 place-items-center rounded-(--radius-sm) border border-(--border) text-(--text-secondary) hover:bg-(--surface-subtle) lg:hidden"
      >
        <Menu size={20} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-bold tracking-[-.02em] text-(--text-strong)">
          {title}
        </h1>
        <p className="mt-1 hidden text-[14px] text-(--muted) sm:block">
          {subtitle}
        </p>
      </div>
      <div className="hidden w-full max-w-75 items-center gap-2 rounded-(--radius-sm) border border-(--border) bg-(--surface-subtle) px-3 text-(--muted) transition-colors focus-within:border-(--border-strong) focus-within:bg-white md:flex">
        <Search size={17} />
        <input
          aria-label="جست‌وجو در داشبورد"
          className="h-10 w-full bg-transparent text-xs outline-none placeholder:text-(--text-faint)"
          placeholder={searchPlaceholder}
        />
        <kbd className="rounded border border-(--border-strong) bg-white px-1.5 py-0.5 text-[12px] text-(--text-muted)">
          ⌘ K
        </kbd>
      </div>
      <button
        aria-label="جست‌وجو"
        className="grid size-10 place-items-center rounded-(--radius-sm) border border-(--border) text-(--text-secondary) hover:bg-(--surface-subtle) md:hidden"
      >
        <Search size={18} />
      </button>
      <Link
        href="/"
        target="_blank"
        className="hidden h-10 items-center gap-2 rounded-(--radius-sm) border border-(--border) px-3 text-xs font-bold text-(--text-secondary) hover:bg-(--surface-subtle) sm:flex"
      >
        مشاهده سایت <ExternalLink size={15} />
      </Link>
      <button
        aria-label="اعلان‌ها، ۳ اعلان خوانده‌نشده"
        className="relative grid size-10 place-items-center rounded-(--radius-sm) border border-(--border) text-(--text-secondary) hover:bg-(--surface-subtle)"
      >
        <Bell size={18} />
        <span className="absolute left-2 top-2 size-2 rounded-full border-2 border-white bg-(--danger)" />
      </button>
      <button
        aria-label="نمایه مریم موسوی"
        className="grid size-10 place-items-center rounded-full bg-(--surface-muted) text-xs font-bold text-(--brand-teal) ring-offset-2 hover:ring-2 hover:ring-(--border-strong)"
      >
        مم
      </button>
    </header>
  );
}
