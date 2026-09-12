import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "ورود به پنل مدیریت", robots: { index: false, follow: false } };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/admin/dashboard" } = await searchParams;
  const safeNext = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin/dashboard";
  if (await getCurrentUser()) redirect(safeNext);
  return <main className="grid min-h-screen place-items-center bg-(--surface-subtle) px-4 py-12"><LoginForm next={safeNext} allowSignup={process.env.NEXT_PUBLIC_ALLOW_SIGNUP === "true"} configured={isSupabaseConfigured}/></main>;
}
