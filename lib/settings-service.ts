import { initialSettings, type SettingsData } from "@/lib/settings-data";
const wait = (duration = 450) => new Promise((resolve) => setTimeout(resolve, duration));
const clone = (settings: SettingsData): SettingsData => JSON.parse(JSON.stringify(settings)) as SettingsData;
export const settingsService = {
  async get(): Promise<SettingsData> { await wait(280); return clone(initialSettings); },
  async save(settings: SettingsData): Promise<SettingsData> { await wait(700); return clone(settings); },
  async resetDemoData(): Promise<void> { await wait(650); },
  async signOutOtherSessions(): Promise<void> { await wait(500); },
};
