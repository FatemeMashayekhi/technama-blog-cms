import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ArticleEditor } from "@/components/editor/article-editor";
import { getArticleForEditor } from "@/lib/article-editor-server";

export const metadata: Metadata = { title: "ویرایش مقاله" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleForEditor(id);
  if (!article) notFound();
  return <DashboardLayout headerTitle="ویرایشگر مقاله" headerSubtitle="به‌روزرسانی محتوای تحریریه"><ArticleEditor mode="edit" articleId={id} initialData={article} /></DashboardLayout>;
}
