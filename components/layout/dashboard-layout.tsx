"use client";
import { useState } from "react";
import type { DashboardNotification, DashboardSearchItem } from "@/lib/dashboard-data";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

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
        <main className="mx-auto max-w-380 p-4 md:p-7 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
