import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AuthorForm } from "@/components/authors/author-form";
import { getAuthorForm } from "@/lib/author-server";
export const metadata: Metadata = { title: "ویرایش نویسنده" };
export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const author = await getAuthorForm(id); if (!author) notFound(); return <DashboardLayout headerTitle="مدیریت نویسندگان" headerSubtitle="به‌روزرسانی عضو تحریریه"><AuthorForm mode="edit" editingId={id} initialData={author} /></DashboardLayout>; }
