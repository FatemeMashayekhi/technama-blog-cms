import { initialSettings, type SettingsData } from "@/lib/settings-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
const wait = (duration = 450) => new Promise((resolve) => setTimeout(resolve, duration));
const clone = (settings: SettingsData): SettingsData => JSON.parse(JSON.stringify(settings)) as SettingsData;
export const settingsService = {
  async get(): Promise<SettingsData> { if (isSupabaseConfigured) { const response = await fetch("/api/settings"); const result = await response.json() as { ok: boolean; data?: { key: string; value: SettingsData }[]; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error || "دریافت تنظیمات انجام نشد."); return clone(result.data?.find((item) => item.key === "cms")?.value ?? initialSettings); } await wait(280); return clone(initialSettings); },
  async save(settings: SettingsData): Promise<SettingsData> { if (isSupabaseConfigured) { const response = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "cms", value: settings }) }); const result = await response.json() as { ok: boolean; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error || "ذخیره تنظیمات انجام نشد."); return clone(settings); } await wait(700); return clone(settings); },
  async resetDemoData(): Promise<void> { await wait(650); },
  async signOutOtherSessions(): Promise<void> { if (isSupabaseConfigured) { const { error } = await createSupabaseBrowserClient().auth.signOut({ scope: "others" }); if (error) throw error; return; } await wait(500); },
};
