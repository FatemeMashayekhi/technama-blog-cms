import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnvironment, isSupabaseConfigured } from "@/lib/env";

export async function updateSupabaseSession(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next({ request });
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
  const path = request.nextUrl.pathname;
  let user: User | null = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    if (path.startsWith("/admin")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", path);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }
  if (path.startsWith("/admin") && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }
  if (path === "/login" && user) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  return response;
}
