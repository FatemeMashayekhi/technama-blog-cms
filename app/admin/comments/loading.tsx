import { CommentsSkeleton } from "@/components/comments/comments-skeleton";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
export default function Loading() { return <DashboardLayout headerTitle="مدیریت دیدگاه‌ها"><CommentsSkeleton/></DashboardLayout>; }

