"use client";

import { Bell, CheckCheck, ChevronDown, ExternalLink, FileText, LogOut, Menu, MessageSquareText, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/login/actions";
import { DashboardSearch } from "@/components/layout/dashboard-search";
import { useDashboardSession } from "@/components/layout/dashboard-session-provider";
import { formatDashboardDate, formatRelativeDashboardTime, type DashboardNotification, type DashboardSearchItem } from "@/lib/dashboard-data";

type HeaderProps = {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchItems?: DashboardSearchItem[];
  notifications?: DashboardNotification[];
};

export function Header({ onMenuClick, title = "داشبورد تحریریه", subtitle, searchPlaceholder = "جست‌وجوی مقاله، نویسنده...", searchItems = [], notifications: initialNotifications = [] }: HeaderProps) {
  const user = useDashboardSession();
  const [dateLabel, setDateLabel] = useState(() => formatDashboardDate(new Date()));
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  const roleLabel = user.role === "admin" ? "مدیر" : user.role === "editor" ? "ویراستار" : "نویسنده";

  useEffect(() => {
    const dateTimer = window.setInterval(() => setDateLabel(formatDashboardDate(new Date())), 60_000);
    const closeMenus = (event: PointerEvent) => {
      if (!notificationsRef.current?.contains(event.target as Node)) setNotificationsOpen(false);
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setNotificationsOpen(false); setProfileOpen(false); }
    };
    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      window.clearInterval(dateTimer);
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  const markAsRead = (id: string) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item));

  return (
    <header className="sticky top-0 z-30 flex h-19 items-center gap-3 border-b border-(--border) bg-white/95 px-4 backdrop-blur md:px-7 lg:px-8">
      <button type="button" onClick={onMenuClick} aria-label="باز کردن منو" className="grid size-10 place-items-center rounded-(--radius-sm) border border-(--border) text-(--text-secondary) hover:bg-(--surface-subtle) lg:hidden"><Menu size={20} /></button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-bold tracking-[-.02em] text-(--text-strong)">{title}</h1>
        <p suppressHydrationWarning={!subtitle} className="mt-1 hidden text-[13px] text-(--muted) sm:block">{subtitle ?? dateLabel}</p>
      </div>

      <DashboardSearch items={searchItems} placeholder={searchPlaceholder} />
      <DashboardSearch items={searchItems} placeholder={searchPlaceholder} mobile />

      <Link href="/" target="_blank" rel="noreferrer" className="hidden h-10 items-center gap-2 rounded-(--radius-sm) border border-(--border) px-3 text-xs font-bold text-(--text-secondary) hover:bg-(--surface-subtle) sm:flex">مشاهده سایت <ExternalLink size={15} /></Link>

      <div ref={notificationsRef} className="relative">
        <button type="button" aria-label={unreadCount ? `اعلان‌ها، ${unreadCount.toLocaleString("fa-IR")} اعلان خوانده‌نشده` : "اعلان‌ها"} aria-haspopup="menu" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((current) => !current); setProfileOpen(false); }} className="relative grid size-10 place-items-center rounded-(--radius-sm) border border-(--border) text-(--text-secondary) hover:bg-(--surface-subtle)">
          <Bell size={18} />
          {unreadCount > 0 && <span className="absolute left-1.5 top-1.5 grid min-w-4.5 place-items-center rounded-full border-2 border-white bg-(--danger) px-1 text-[11px] font-bold leading-3.5 text-white">{unreadCount.toLocaleString("fa-IR")}</span>}
        </button>
        {notificationsOpen && <div role="menu" className="absolute left-0 top-[calc(100%+10px)] w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-(--radius) border border-(--border) bg-white shadow-[0_20px_60px_rgba(16,35,49,.18)]">
          <div className="flex items-center justify-between border-b border-(--border-subtle) px-4 py-3"><div><h2 className="text-[13px] font-bold text-(--text-strong)">اعلان‌ها</h2><p className="mt-1 text-[11px] text-(--text-muted)">{unreadCount ? `${unreadCount.toLocaleString("fa-IR")} مورد خوانده‌نشده` : "همه اعلان‌ها خوانده شده‌اند"}</p></div>{unreadCount > 0 && <button type="button" onClick={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-(--brand-teal) hover:bg-(--accent-soft)"><CheckCheck size={15} /> خواندن همه</button>}</div>
          {notifications.length ? <div className="max-h-92 overflow-y-auto p-2">{notifications.map((notification) => { const Icon = notification.type === "comment" ? MessageSquareText : FileText; return <Link key={notification.id} href={notification.href} role="menuitem" onClick={() => { markAsRead(notification.id); setNotificationsOpen(false); }} className={`flex gap-3 rounded-(--radius-sm) p-3 transition hover:bg-(--surface-subtle) ${notification.read ? "opacity-65" : "bg-(--accent-soft)/45"}`}><span className="grid size-10 shrink-0 place-items-center rounded-(--radius-sm) bg-white text-(--brand-teal) shadow-sm"><Icon size={16} /></span><span className="min-w-0 flex-1"><strong className="block text-[12px] text-(--text-strong)">{notification.title}</strong><span className="mt-1 block text-[11px] leading-5 text-(--text-muted)">{notification.description}</span><time className="mt-1.5 block text-[11px] text-(--text-faint)">{formatRelativeDashboardTime(notification.createdAt)}</time></span>{!notification.read && <span className="mt-1 size-2 shrink-0 rounded-full bg-(--danger)" />}</Link>; })}</div> : <div className="px-5 py-10 text-center"><Bell size={22} className="mx-auto text-(--text-faint)" /><p className="mt-3 text-[12px] font-bold text-(--text-secondary)">اعلان تازه‌ای ندارید</p><p className="mt-1 text-[11px] text-(--text-muted)">رویدادهای تحریریه اینجا نمایش داده می‌شوند.</p></div>}
          <Link href="/admin/comments" onClick={() => setNotificationsOpen(false)} className="flex min-h-11 items-center justify-center border-t border-(--border-subtle) text-[12px] font-bold text-(--brand-teal) hover:bg-(--surface-subtle)">مرکز دیدگاه‌ها</Link>
        </div>}
      </div>

      <div ref={profileRef} className="relative">
        <button type="button" aria-label={`نمایه ${user.name}`} aria-haspopup="menu" aria-expanded={profileOpen} onClick={() => { setProfileOpen((current) => !current); setNotificationsOpen(false); }} className="flex h-10 items-center gap-2 rounded-full bg-(--surface-muted) pl-2 text-xs font-bold text-(--brand-teal) hover:bg-(--accent-soft)"><span className="grid size-10 place-items-center rounded-full bg-white shadow-sm">{initials}</span><ChevronDown size={14} className={`hidden transition-transform sm:block ${profileOpen ? "rotate-180" : ""}`} /></button>
        {profileOpen && <div role="menu" className="absolute left-0 top-[calc(100%+10px)] w-60 overflow-hidden rounded-(--radius) border border-(--border) bg-white p-2 shadow-[0_20px_60px_rgba(16,35,49,.18)]">
          <div className="border-b border-(--border-subtle) px-3 py-3"><strong className="block truncate text-[13px] text-(--text-strong)">{user.name}</strong><span className="mt-1 block truncate text-[11px] text-(--text-muted)">{roleLabel}{user.email ? ` · ${user.email}` : ""}</span></div>
          <Link href="/profile" role="menuitem" onClick={() => setProfileOpen(false)} className="mt-1 flex min-h-11 items-center gap-3 rounded-(--radius-sm) px-3 text-[12px] font-bold text-(--text-secondary) hover:bg-(--surface-subtle)"><UserRound size={16} /> پروفایل من</Link>
          <Link href="/settings" role="menuitem" onClick={() => setProfileOpen(false)} className="flex min-h-11 items-center gap-3 rounded-(--radius-sm) px-3 text-[12px] font-bold text-(--text-secondary) hover:bg-(--surface-subtle)"><Settings size={16} /> تنظیمات</Link>
          <form action={signOut} className="border-t border-(--border-subtle) pt-1"><button type="submit" role="menuitem" className="flex min-h-11 w-full items-center gap-3 rounded-(--radius-sm) px-3 text-right text-[12px] font-bold text-(--danger) hover:bg-(--danger-soft)"><LogOut size={16} /> خروج از حساب</button></form>
        </div>}
      </div>
    </header>
  );
}
