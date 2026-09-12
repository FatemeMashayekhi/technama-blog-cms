export type ThemeMode = "light" | "dark" | "system";
export type ContentDensity = "comfortable" | "compact";
export type DefaultArticleStatus = "draft" | "review";

export interface GeneralSettings {
  magazineName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  timezone: string;
  language: "fa";
  dateFormat: "jalali-long" | "jalali-short" | "iso";
}

export interface MagazineSettings {
  logoUrl: string;
  faviconUrl: string;
  displayName: string;
  shortDescription: string;
  defaultAuthorId: string;
  defaultCategoryId: string;
}

export interface AppearanceSettings {
  theme: ThemeMode;
  accentColor: string;
  density: ContentDensity;
}

export interface ContentSettings {
  articlesPerPage: number;
  defaultArticleStatus: DefaultArticleStatus;
  allowComments: boolean;
  moderateComments: boolean;
  allowAuthorReplies: boolean;
}

export interface SeoSettings {
  defaultTitle: string;
  metaDescription: string;
  siteUrl: string;
  openGraphImageUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export interface NotificationSettings {
  newComment: boolean;
  moderationRequired: boolean;
  articlePublished: boolean;
  articleReview: boolean;
  authorActivity: boolean;
}

export interface SecuritySettings {
  sessionTimeoutMinutes: 30 | 60 | 120 | 480;
  loginNotification: boolean;
  twoFactorEnabled: boolean;
  activeSessions: { id: string; device: string; location: string; lastActive: string; current: boolean }[];
}

export interface SettingsData {
  general: GeneralSettings;
  magazine: MagazineSettings;
  appearance: AppearanceSettings;
  content: ContentSettings;
  seo: SeoSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

export const initialSettings: SettingsData = {
  general: { magazineName: "مجله تکنولوژی", description: "مجله‌ای برای علاقه‌مندان به فناوری، برنامه‌نویسی و نوآوری", contactEmail: "hello@technama.ir", contactPhone: "۰۲۱-۸۸۷۷۶۶۵۵", timezone: "Asia/Tehran", language: "fa", dateFormat: "jalali-long" },
  magazine: { logoUrl: "/media/design-system.svg", faviconUrl: "/media/chip.svg", displayName: "تک‌نما", shortDescription: "روایت دقیق دنیای فناوری", defaultAuthorId: "author-1", defaultCategoryId: "ai" },
  appearance: { theme: "light", accentColor: "#0f7b70", density: "comfortable" },
  content: { articlesPerPage: 12, defaultArticleStatus: "draft", allowComments: true, moderateComments: true, allowAuthorReplies: true },
  seo: { defaultTitle: "تک‌نما؛ مجله فناوری و نوآوری", metaDescription: "تحلیل تازه‌ترین روندهای فناوری، برنامه‌نویسی، هوش مصنوعی و طراحی محصول", siteUrl: "https://technama.ir", openGraphImageUrl: "/media/ai-future.svg", robotsIndex: true, robotsFollow: true },
  notifications: { newComment: true, moderationRequired: true, articlePublished: true, articleReview: true, authorActivity: false },
  security: { sessionTimeoutMinutes: 60, loginNotification: true, twoFactorEnabled: false, activeSessions: [{ id: "session-1", device: "Chrome روی Windows", location: "تهران، ایران", lastActive: "همین حالا", current: true }, { id: "session-2", device: "Safari روی iPhone", location: "تهران، ایران", lastActive: "۲ ساعت پیش", current: false }] },
};

export const settingsSections = [
  { id: "general", label: "عمومی" },
  { id: "magazine", label: "مجله" },
  { id: "appearance", label: "ظاهر" },
  { id: "content", label: "محتوا" },
  { id: "notifications", label: "اعلان‌ها" },
  { id: "seo", label: "SEO" },
  { id: "security", label: "امنیت" },
] as const;
export type SettingsSectionId = typeof settingsSections[number]["id"];

