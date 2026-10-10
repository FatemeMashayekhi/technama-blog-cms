import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnvironment, isSupabaseConfigured } from "@/lib/env";

export async function updateSupabaseSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedPath = path === "/profile" || path.startsWith("/admin");
  if (!isSupabaseConfigured) {
    if (process.env.NODE_ENV === "production" && isProtectedPath) {
      return NextResponse.json({ ok: false, error: "سامانه احراز هویت پیکربندی نشده است." }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
    }
    return NextResponse.next({ request });
  }
  const { url, publishableKey } = getSupabaseEnvironment();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  let user: User | null = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    if (isProtectedPath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", path);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }
  if (isProtectedPath && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }
  if (path === "/login" && user) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  return response;
}
