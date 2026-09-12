import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requested = url.searchParams.get("next") ?? "/admin/dashboard";
  const next = requested.startsWith("/admin") && !requested.startsWith("//") ? requested : "/admin/dashboard";
  if (code) {
    const { error } = await (await createSupabaseServerClient()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/login?error=callback", url.origin));
}
