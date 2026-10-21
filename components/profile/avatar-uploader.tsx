"use client";

import { Camera, CheckCircle2, ImagePlus, LoaderCircle, RotateCcw, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { uploadMedia } from "@/lib/media-service";
import { useToast } from "@/components/ui/toast-provider";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSize = 4 * 1024 * 1024;

export function AvatarUploader({ value, name, disabled, pendingSave = false, onChange, onBusyChange }: { value: string; name: string; disabled?: boolean; pendingSave?: boolean; onChange: (url: string) => void; onBusyChange?: (busy: boolean) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("") || "ک";

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const resetSelection = () => { if (preview) URL.revokeObjectURL(preview); setFile(null); setPreview(""); setError(""); if (inputRef.current) inputRef.current.value = ""; };
  const choose = (selected?: File) => {
    resetSelection();
    if (!selected) return;
    if (!allowedTypes.has(selected.type)) { setError("فقط تصویر JPEG، PNG یا WebP مجاز است."); return; }
    if (selected.size <= 0 || selected.size > maxSize) { setError("حجم تصویر باید کمتر از ۴ مگابایت باشد."); return; }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };
  const upload = async () => {
    if (!file || uploading) return;
    setUploading(true); onBusyChange?.(true); setError("");
    try {
      const asset = await uploadMedia(file);
      onChange(asset.url);
      toast({ tone: "success", message: "تصویر پروفایل با موفقیت آپلود شد؛ برای ثبت نهایی، تغییرات پروفایل را ذخیره کنید." });
      resetSelection();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "آپلود تصویر پروفایل انجام نشد.";
      setError(message); toast({ tone: "error", message });
    } finally { setUploading(false); onBusyChange?.(false); }
  };
  const shown = preview || value;

  return <section aria-labelledby="avatar-uploader-title" className="rounded-(--radius-sm) border border-(--border) bg-(--surface-subtle) p-4">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-(--surface-muted) text-(--brand-teal) shadow-sm sm:mx-0">
        {shown ? <Image unoptimized src={shown} alt={`پیش‌نمایش تصویر ${name}`} width={96} height={96} className="size-full object-cover" /> : <span className="grid size-full place-items-center text-xl font-black">{initials}</span>}
        <span className="absolute bottom-0 left-0 grid size-10 place-items-center rounded-tr-xl bg-(--brand-navy) text-white"><Camera size={14}/></span>
      </div>
      <div className="min-w-0 flex-1">
        <h2 id="avatar-uploader-title" className="text-[13px] font-bold text-(--text-strong)">تصویر پروفایل</h2>
        <p className="mt-1 text-[12px] leading-6 text-(--text-muted)">JPEG، PNG یا WebP تا ۴ مگابایت. فایل در سرور اعتبارسنجی و به WebP امن تبدیل می‌شود.</p>
        {file && <p className="mt-2 flex items-center gap-1.5 truncate text-[12px] font-bold text-(--text-secondary)" dir="ltr"><ImagePlus size={14}/>{file.name}</p>}
        {error && <p role="alert" className="mt-2 text-[12px] font-bold text-(--danger)">{error}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" disabled={disabled || uploading} onClick={() => inputRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-(--radius-sm) border border-(--border) bg-white px-3 text-[12px] font-bold text-(--text-secondary) disabled:opacity-50"><RotateCcw size={14}/>{value || file ? "انتخاب تصویر دیگر" : "انتخاب از دستگاه"}</button>
          {file && <button type="button" disabled={uploading} onClick={upload} className="inline-flex min-h-10 items-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-3 text-[12px] font-bold text-white disabled:opacity-50">{uploading ? <LoaderCircle size={14} className="animate-spin"/> : <Upload size={14}/>} {uploading ? "در حال بارگذاری..." : "آپلود تصویر"}</button>}
          {file && <button type="button" disabled={uploading} onClick={resetSelection} className="inline-flex min-h-10 items-center gap-2 rounded-(--radius-sm) px-3 text-[12px] font-bold text-(--danger) hover:bg-(--danger-soft) disabled:opacity-50"><Trash2 size={14}/> لغو</button>}
          {!file && value && pendingSave && <span className="inline-flex min-h-10 items-center gap-1.5 text-[12px] font-bold text-(--brand-teal)"><CheckCircle2 size={14}/> تصویر پایدار آماده ذخیره است</span>}
        </div>
      </div>
    </div>
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" disabled={disabled || uploading} onChange={(event) => choose(event.target.files?.[0])}/>
  </section>;
}
