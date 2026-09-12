"use client";
import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  searchPlaceholder?: string;
};

export function DashboardLayout({
  children,
  headerTitle,
  headerSubtitle,
  searchPlaceholder,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:mr-67">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={headerTitle}
          subtitle={headerSubtitle}
          searchPlaceholder={searchPlaceholder}
        />
        <main className="mx-auto max-w-380 p-4 md:p-7 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
