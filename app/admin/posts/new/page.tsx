import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ArticleEditor } from "@/components/editor/article-editor";
import { emptyArticle } from "@/lib/article-editor";

export const metadata: Metadata = { title: "ایجاد مقاله جدید" };

export default function NewArticlePage() {
  return <DashboardLayout headerTitle="ویرایشگر مقاله" headerSubtitle="ایجاد محتوای تازه برای مجله"><ArticleEditor mode="create" initialData={emptyArticle} /></DashboardLayout>;
}

