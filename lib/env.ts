import { z } from "zod";

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
});

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project"),
);

export function getSupabaseEnvironment() {
  const result = publicEnvironmentSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  if (!result.success) throw new Error("Supabase environment variables are not configured.");
  return { url: result.data.NEXT_PUBLIC_SUPABASE_URL, publishableKey: result.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY };
}

const defaultSiteOrigin = "https://technama.ir";

export function getSiteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return defaultSiteOrigin;
  try {
    const url = new URL(configured);
    const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";
    if (process.env.NODE_ENV === "production" && isLocalhost) return defaultSiteOrigin;
    return url.origin;
  } catch {
    return defaultSiteOrigin;
  }
}

export function getSiteUrl(path = "/") {
  return new URL(path, `${getSiteOrigin()}/`).toString();
}
