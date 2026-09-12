import type { Metadata } from "next";
import { CommentsManager } from "@/components/comments/comments-manager";
import { CommentsPageHeader } from "@/components/comments/comments-page-header";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
export const metadata: Metadata = { title: "مدیریت دیدگاه‌ها", description: "مدیریت، بررسی و نظارت بر دیدگاه‌های کاربران" };
export default function CommentsPage() { return <DashboardLayout headerTitle="مدیریت دیدگاه‌ها" searchPlaceholder="جستجو در دیدگاه‌ها..."><CommentsPageHeader/><CommentsManager/></DashboardLayout>; }

