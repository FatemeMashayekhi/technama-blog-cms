import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PostsManager } from "@/components/posts/posts-manager";
import { PostsPageHeader } from "@/components/posts/page-header";

export const metadata: Metadata = {
  title: "مدیریت مقالات",
  description: "مدیریت، ویرایش و انتشار محتوای مجله تک‌نما",
};

export default function PostsPage() {
  return (
    <DashboardLayout headerTitle="مدیریت مقالات" searchPlaceholder="جست‌وجوی مقاله...">
      <PostsPageHeader />
      <PostsManager />
    </DashboardLayout>
  );
}

