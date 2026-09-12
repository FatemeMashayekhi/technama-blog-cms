import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const vazirmatn = localFont({
  src: "../public/fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://technama.ir"),
  title: { default: "تک‌نما | مجله فناوری و نوآوری", template: "%s | تک‌نما" },
  description: "مجله فناوری چندنویسنده‌ای و پنل نمایشی مدیریت محتوای تک‌نما",
  applicationName: "تک‌نما",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.variable}>{children}</body>
    </html>
  );
}
