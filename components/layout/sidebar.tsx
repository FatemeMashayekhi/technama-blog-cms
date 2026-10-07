"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  BarChart3,
  BookOpenText,
  ChevronLeft,
  FolderTree,
  LayoutDashboard,
  MessageSquareText,
  PenLine,
  Settings,
  Users,
  X,
  Images,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useDashboardSession } from "@/components/layout/dashboard-session-provider";

const navigation = [
  { label: "داشبورد", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "مقالات", icon: BookOpenText, href: "/admin/posts" },
  { label: "دسته‌بندی‌ها", icon: FolderTree, href: "/admin/categories" },
  { label: "نویسندگان", icon: Users, href: "/admin/authors" },
  { label: "رسانه", icon: Images, href: "/admin/media" },
  { label: "دیدگاه‌ها", icon: MessageSquareText, href: "/admin/comments" },
  { label: "آمار و تحلیل", icon: BarChart3, href: "/admin/analytics" },
];

type SidebarProps = { open?: boolean; onClose?: () => void; pendingCommentCount?: number };

export function Sidebar({ open = false, onClose, pendingCommentCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const user = useDashboardSession();
  const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  const roleLabel = user.role === "admin" ? "مدیر" : user.role === "editor" ? "ویراستار" : "نویسنده";
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeWithEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose?.(); };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [onClose, open]);

  return (
    <>
      {open && (
        <button
          aria-label="بستن منو"
          className="fixed inset-0 z-40 bg-(--brand-navy)/35 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-67 flex-col border-l border-(--brand-teal) bg-(--brand-navy) text-white transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0 animate-slide-in" : "translate-x-full"}`}
      >
        <div className="flex h-19 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3"
            aria-label="تک‌نما - داشبورد"
          >
            <span className="grid size-10 place-items-center rounded-(--radius) bg-(--surface-muted) text-(--brand-teal)">
              <PenLine size={18} strokeWidth={2.2} />
            </span>
            <span>
              <strong className="block text-[16px] tracking-[-.02em]">
                تک‌نما
              </strong>
              <small className="mt-0.5 block text-[13px] text-(--text-faint)">
                اتاق خبر تکنولوژی
              </small>
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="بستن منو"
            className="grid size-10 place-items-center rounded-lg text-(--text-on-dark-muted) hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto px-3 py-6"
          aria-label="منوی اصلی"
        >
          <p className="mb-2 px-3 text-[13px] font-bold tracking-wide text-(--text-muted)">
            مدیریت محتوا
          </p>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = item.href === "/admin/posts"
                ? pathname.startsWith("/admin/posts")
                : item.href === "/admin/authors"
                  ? pathname.startsWith("/admin/authors")
                  : item.href === "/admin/categories"
                    ? pathname.startsWith("/admin/categories") || pathname.startsWith("/admin/tags")
                    : item.href === "/admin/media"
                      ? pathname.startsWith("/admin/media")
                      : item.href === "/admin/comments"
                        ? pathname.startsWith("/admin/comments")
                        : item.href === "/admin/analytics"
                          ? pathname.startsWith("/admin/analytics")
                    : item.href === pathname;
              return item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={onClose}
                  className={`group flex h-11 items-center gap-3 rounded-(--radius-sm) px-3 text-[13px] transition-colors ${isActive ? "bg-white/11 font-bold text-white" : "text-(--text-faint) hover:bg-white/6 hover:text-white"}`}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span className="flex-1">{item.label}</span>
                  {item.href === "/admin/comments" && pendingCommentCount > 0 ? <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white">{pendingCommentCount.toLocaleString("fa-IR")}</span> : !isActive && <ChevronLeft size={14} className="opacity-35" />}
                </Link>
              ) : (
                null
              );
            })}
          </div>
          <div className="my-5 border-t border-white/10" />
          <Link href="/admin/settings" onClick={onClose} aria-current={pathname.startsWith("/admin/settings") ? "page" : undefined} className={`flex h-11 w-full items-center gap-3 rounded-(--radius-sm) px-3 text-[13px] ${pathname.startsWith("/admin/settings") ? "bg-white/11 font-bold text-white" : "text-(--text-faint) hover:bg-white/6 hover:text-white"}`}>
            <Settings size={18} strokeWidth={pathname.startsWith("/admin/settings") ? 2.2 : 1.8} />
            <span>تنظیمات</span>
          </Link>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2 rounded-(--radius) px-2 py-2 hover:bg-white/5">
            <Link href="/admin/settings?section=profile" onClick={onClose} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-1" aria-label={`نمایه ${user.name}`}>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-(--surface-muted) text-xs font-bold text-(--brand-teal)">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-xs">{user.name}</strong>
              <small className="mt-1 block text-[13px] text-(--text-faint)">
                {roleLabel}
              </small>
            </span>
            </Link>
            <SignOutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
