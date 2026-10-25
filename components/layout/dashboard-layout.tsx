"use client";
import { useState } from "react";
import type { DashboardNotification, DashboardSearchItem } from "@/lib/dashboard-data";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Eye, ShieldCheck } from "lucide-react";
import { useDashboardSession } from "./dashboard-session-provider";

type DashboardLayoutProps = {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  searchPlaceholder?: string;
  searchItems?: DashboardSearchItem[];
  notifications?: DashboardNotification[];
  pendingCommentCount?: number;
};

export function DashboardLayout({
  children,
  headerTitle,
  headerSubtitle,
  searchPlaceholder,
  searchItems,
  notifications,
  pendingCommentCount,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useDashboardSession();
  return (
    <div className="dashboard-shell min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} pendingCommentCount={pendingCommentCount} />
      <div className="lg:mr-67">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={headerTitle}
          subtitle={headerSubtitle}
          searchPlaceholder={searchPlaceholder}
          searchItems={searchItems}
          notifications={notifications}
        />
        {user.readOnly && <div role="status" className="border-b border-(--accent-border) bg-(--accent-soft) px-4 py-3 md:px-7 lg:px-8"><div className="mx-auto flex max-w-380 items-start gap-3 text-(--brand-teal)"><span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-white"><ShieldCheck size={16}/></span><div><strong className="flex items-center gap-1.5 text-[13px]"><Eye size={14}/> حالت فقط‌خواندنی</strong><p className="mt-0.5 text-[12px] leading-6 text-(--text-secondary)">{user.demoAccount ? "شما با حساب نمایشی رزومه وارد شده‌اید." : "مدیر برای این حساب دسترسی مشاهده تعیین کرده است."} ایجاد، ویرایش، حذف و تغییر تنظیمات غیرفعال است.</p></div></div></div>}
        <main className="mx-auto max-w-380 p-4 md:p-7 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
