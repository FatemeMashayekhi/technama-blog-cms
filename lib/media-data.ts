export type MediaType = "image" | "document";

export type MediaUploader = {
  id: string;
  name: string;
  initials: string;
};

export type MediaAsset = {
  id: string;
  name: string;
  type: MediaType;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  width?: number;
  height?: number;
  altText: string;
  uploadedBy: MediaUploader;
  createdAt: string;
};

const maryam: MediaUploader = { id: "author-1", name: "مریم احمدی", initials: "ما" };
const ali: MediaUploader = { id: "author-2", name: "علی رضایی", initials: "عر" };
const sara: MediaUploader = { id: "author-3", name: "سارا اکبری", initials: "سا" };

export const mockMediaAssets: MediaAsset[] = [
  { id: "media-001", name: "ai-future-cover.webp", type: "image", mimeType: "image/webp", url: "/media/ai-future.svg", size: 253952, width: 1920, height: 1080, altText: "تصویر انتزاعی از آینده هوش مصنوعی", uploadedBy: maryam, createdAt: "2026-09-08T06:40:00Z" },
  { id: "media-002", name: "nextjs-workspace.webp", type: "image", mimeType: "image/webp", url: "/media/code-workspace.svg", size: 187392, width: 1600, height: 1000, altText: "محیط توسعه پروژه Next.js روی لپ‌تاپ", uploadedBy: ali, createdAt: "2026-09-07T10:20:00Z" },
  { id: "media-003", name: "design-system-grid.png", type: "image", mimeType: "image/png", url: "/media/design-system.svg", size: 425984, width: 1440, height: 960, altText: "اجزای یک سیستم طراحی در چیدمان شبکه‌ای", uploadedBy: sara, createdAt: "2026-09-06T08:15:00Z" },
  { id: "media-004", name: "cybersecurity-lock.webp", type: "image", mimeType: "image/webp", url: "/media/security.svg", size: 314368, width: 1800, height: 1200, altText: "قفل دیجیتال در شبکه امنیت سایبری", uploadedBy: ali, createdAt: "2026-09-05T14:45:00Z" },
  { id: "media-005", name: "startup-team.jpg", type: "image", mimeType: "image/jpeg", url: "/media/startup-team.svg", size: 692224, width: 2048, height: 1365, altText: "تیم استارتاپ در جلسه برنامه‌ریزی محصول", uploadedBy: maryam, createdAt: "2026-09-04T09:30:00Z" },
  { id: "media-006", name: "tech-conference-stage.jpg", type: "image", mimeType: "image/jpeg", url: "/media/conference.svg", size: 843776, width: 2400, height: 1600, altText: "صحنه کنفرانس فناوری و نمایشگر اصلی", uploadedBy: sara, createdAt: "2026-09-03T16:10:00Z" },
  { id: "media-007", name: "ai-chip-architecture.webp", type: "image", mimeType: "image/webp", url: "/media/chip.svg", size: 278528, width: 1600, height: 900, altText: "نمای نزدیک از معماری تراشه هوش مصنوعی", uploadedBy: ali, createdAt: "2026-09-02T11:00:00Z" },
  { id: "media-008", name: "mobile-ui-prototype.png", type: "image", mimeType: "image/png", url: "/media/mobile-ui.svg", size: 512000, width: 1400, height: 1050, altText: "نمونه اولیه رابط کاربری اپلیکیشن موبایل", uploadedBy: sara, createdAt: "2026-09-01T07:25:00Z" },
  { id: "media-009", name: "react-server-components.webp", type: "image", mimeType: "image/webp", url: "/media/code-workspace.svg", size: 221184, width: 1920, height: 1080, altText: "نمودار معماری React Server Components", uploadedBy: ali, createdAt: "2026-08-29T12:35:00Z" },
  { id: "media-010", name: "product-roadmap.png", type: "image", mimeType: "image/png", url: "/media/design-system.svg", size: 364544, width: 1600, height: 1000, altText: "نقشه راه محصول روی بورد تیم طراحی", uploadedBy: maryam, createdAt: "2026-08-27T15:50:00Z" },
  { id: "media-011", name: "zero-trust-network.webp", type: "image", mimeType: "image/webp", url: "/media/security.svg", size: 294912, width: 1800, height: 1080, altText: "تصویر مفهومی شبکه با معماری اعتماد صفر", uploadedBy: ali, createdAt: "2026-08-25T06:40:00Z" },
  { id: "media-012", name: "founders-interview.jpg", type: "image", mimeType: "image/jpeg", url: "/media/startup-team.svg", size: 774144, width: 2200, height: 1467, altText: "گفت‌وگو با بنیان‌گذاران یک استارتاپ ایرانی", uploadedBy: maryam, createdAt: "2026-08-22T10:10:00Z" },
  { id: "media-013", name: "weekly-tech-roundup.webp", type: "image", mimeType: "image/webp", url: "/media/conference.svg", size: 241664, width: 1600, height: 900, altText: "منتخبی از خبرهای مهم فناوری هفته", uploadedBy: sara, createdAt: "2026-08-20T08:05:00Z" },
  { id: "media-014", name: "on-device-ai-chip.png", type: "image", mimeType: "image/png", url: "/media/chip.svg", size: 458752, width: 1500, height: 1000, altText: "تراشه هوش مصنوعی برای پردازش روی دستگاه", uploadedBy: ali, createdAt: "2026-08-18T13:20:00Z" },
  { id: "media-015", name: "editorial-guidelines.pdf", type: "document", mimeType: "application/pdf", url: "/media/document.svg", size: 1126400, altText: "راهنمای نگارش و استانداردهای تحریریه", uploadedBy: maryam, createdAt: "2026-08-15T09:00:00Z" },
  { id: "media-016", name: "accessibility-checklist.pdf", type: "document", mimeType: "application/pdf", url: "/media/document.svg", size: 716800, altText: "چک‌لیست دسترسی‌پذیری محتوای مجله", uploadedBy: sara, createdAt: "2026-08-12T11:30:00Z" },
];

export const mediaStats = {
  total: 248,
  usedBytes: 1932735283,
  images: 231,
  thisMonth: 18,
};
