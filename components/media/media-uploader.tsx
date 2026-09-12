"use client";

import { CheckCircle2, FileImage, UploadCloud, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/media-service";
import type { MediaAsset } from "@/lib/media-data";

type UploadItem = { id: string; name: string; progress: number; state: "uploading" | "success" | "error"; message?: string };
const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
const maxSize = 6 * 1024 * 1024;

export function MediaUploader({ onUploaded }: { onUploaded: (assets: MediaAsset[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null); const [dragging, setDragging] = useState(false); const [uploads, setUploads] = useState<UploadItem[]>([]);
  const processFiles = async (files: File[]) => {
    const rows = files.map((file, index): UploadItem => { const invalidType = !acceptedTypes.includes(file.type); const oversized = file.size > maxSize; return { id: `${Date.now()}-${index}`, name: file.name, progress: invalidType || oversized ? 0 : 15, state: invalidType || oversized ? "error" : "uploading", message: invalidType ? "فرمت فایل پشتیبانی نمی‌شود." : oversized ? "حجم فایل بیشتر از ۶ مگابایت است." : undefined }; });
    setUploads(rows); const completed: MediaAsset[] = [];
    for (let index = 0; index < files.length; index += 1) {
      const row = rows[index]; if (row.state === "error") continue;
      try { const asset = await uploadMedia(files[index]); completed.push(asset); setUploads((current) => current.map((item) => item.id === row.id ? { ...item, progress: 100, state: "success" } : item)); }
      catch (error) { setUploads((current) => current.map((item) => item.id === row.id ? { ...item, progress: 0, state: "error", message: error instanceof Error ? error.message : "آپلود انجام نشد." } : item)); }
    }
    if (completed.length) onUploaded(completed);
  };
  return <section id="media-uploader" className="rounded-(--radius) border border-(--border) bg-white p-3 sm:p-4"><button type="button" onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); void processFiles(Array.from(event.dataTransfer.files)); }} className={`flex min-h-32 w-full flex-col items-center justify-center rounded-(--radius) border border-dashed px-5 py-5 text-center transition-colors ${dragging ? "border-(--brand-teal) bg-(--accent-soft)" : "border-(--border-strong) bg-(--surface-subtle) hover:bg-(--surface-muted)"}`}><span className="grid size-10 place-items-center rounded-(--radius) bg-(--surface-muted) text-(--brand-teal)"><UploadCloud size={20}/></span><strong className="mt-3 text-xs text-(--text-strong)">{dragging ? "فایل‌ها را رها کنید" : "فایل‌ها را اینجا بکشید و رها کنید"}</strong><span className="mt-1 text-[13px] text-(--text-muted)">یا برای انتخاب فایل کلیک کنید</span><span className="mt-2 text-[12px] text-(--text-faint)">PNG، JPG، WEBP، GIF و PDF تا ۶ مگابایت</span></button><input ref={inputRef} className="sr-only" type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.pdf" multiple aria-label="انتخاب فایل برای آپلود" onChange={(event) => { void processFiles(Array.from(event.target.files ?? [])); event.target.value = ""; }}/>{uploads.length > 0 && <div className="mt-3 space-y-2" aria-live="polite">{uploads.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-(--radius-sm) border border-(--border-subtle) px-3 py-2.5"><span className={`grid size-10 shrink-0 place-items-center rounded-lg ${item.state === "error" ? "bg-(--danger-soft) text-(--danger)" : "bg-(--accent-soft) text-(--brand-teal)"}`}>{item.state === "error" ? <XCircle size={16}/> : item.state === "success" ? <CheckCircle2 size={16}/> : <FileImage size={16}/>}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3 text-[13px]"><span className="truncate font-bold text-(--text-secondary)" dir="ltr">{item.name}</span><span className={item.state === "error" ? "text-(--danger)" : "text-(--text-secondary)"}>{item.state === "success" ? "آپلود شد" : item.state === "error" ? item.message : "در حال آپلود..."}</span></div>{item.state === "uploading" && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-(--surface-muted)"><div className="h-full w-1/3 animate-pulse rounded-full bg-(--brand-teal)"/></div>}</div></div>)}</div>}</section>;
}
