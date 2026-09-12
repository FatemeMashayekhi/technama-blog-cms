import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AuthorForm } from "@/components/authors/author-form";
import { emptyAuthor } from "@/lib/authors-data";
export const metadata: Metadata = { title: "افزودن نویسنده" };
export default function NewAuthorPage() { return <DashboardLayout headerTitle="مدیریت نویسندگان" headerSubtitle="افزودن عضو جدید"><AuthorForm mode="create" initialData={emptyAuthor} /></DashboardLayout>; }

