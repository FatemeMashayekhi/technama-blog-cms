import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui/toast-provider";
import { getSiteOrigin } from "@/lib/env";
import "./globals.css";

const vazirmatn = localFont({
  src: "../public/fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: { default: "تک‌نما | مجله فناوری و نوآوری", template: "%s | تک‌نما" },
  description: "مجله فناوری چندنویسنده‌ای و پنل نمایشی مدیریت محتوای تک‌نما",
  applicationName: "تک‌نما",
  manifest: "/manifest.webmanifest",
  openGraph: { type: "website", locale: "fa_IR", siteName: "تک‌نما", title: "تک‌نما | مجله فناوری و نوآوری", description: "تحلیل عمیق فناوری، محصول و نوآوری", images: [{ url: "/media/ai-future.svg", width: 1200, height: 630, alt: "مجله فناوری تک‌نما" }] },
  twitter: { card: "summary_large_image", title: "تک‌نما | مجله فناوری و نوآوری", description: "تحلیل عمیق فناوری، محصول و نوآوری", images: ["/media/ai-future.svg"] },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.variable}><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
