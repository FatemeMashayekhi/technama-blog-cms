import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AuthorsManager } from "@/components/authors/authors-manager";

export const metadata: Metadata = { title: "نویسندگان" };
export default function AuthorsPage() { return <DashboardLayout headerTitle="مدیریت نویسندگان" headerSubtitle="اعضای تیم تحریریه"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-[13px] font-bold text-(--accent)">تیم تحریریه</p><h2 className="text-xl font-bold tracking-[-.03em] text-(--text-strong) sm:text-2xl">نویسندگان</h2><p className="mt-2 text-xs text-(--muted)">مدیریت نویسندگان و اعضای تیم تحریریه</p></div><Link href="/admin/authors/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-4 text-xs font-bold text-white hover:bg-(--brand-navy-hover)"><Plus size={17} /> افزودن نویسنده</Link></div><AuthorsManager /></DashboardLayout>; }

