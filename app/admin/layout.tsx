import type { Metadata } from "next";
export const metadata: Metadata = { title: { default: "اتاق خبر", template: "%s | اتاق خبر تک‌نما" }, robots: { index: false, follow: false } };
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
