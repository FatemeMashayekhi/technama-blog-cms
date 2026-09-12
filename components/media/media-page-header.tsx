"use client";

import { Plus } from "lucide-react";

export function MediaPageHeader() {
  const openUploader = () => document.getElementById("media-uploader")?.scrollIntoView({ behavior: "smooth", block: "center" });
  return <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-[13px] font-bold text-(--accent)">مدیریت محتوا</p><h2 className="text-xl font-bold tracking-[-.03em] text-(--text-strong) sm:text-2xl">رسانه</h2><p className="mt-2 text-xs text-(--muted)">مدیریت تصاویر و فایل‌های مورد استفاده در مجله</p></div><button type="button" onClick={openUploader} className="inline-flex h-11 items-center justify-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-4 text-xs font-bold text-white transition-colors hover:bg-(--brand-navy-hover)"><Plus size={17} strokeWidth={2.2} /> آپلود رسانه</button></div>;
}

