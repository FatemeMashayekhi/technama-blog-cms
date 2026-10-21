"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Save, SearchCheck, Trash2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { uploadMedia } from "@/lib/media-service";
import type { Category, CategoryFormData } from "@/lib/taxonomy-data";
import { taxonomyService } from "@/lib/taxonomy-service";

const field = "mt-1.5 h-11 w-full rounded-(--radius-sm) border border-(--border) bg-(--surface-subtle) px-3 text-[14px] outline-none focus:border-(--focus-border) focus:bg-white disabled:cursor-not-allowed disabled:opacity-60";
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 4 * 1024 * 1024;

export function CategoryForm({ mode, initialData, editingId }: { mode: "create" | "edit"; initialData: CategoryFormData; editingId?: string }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [data, setData] = useState(initialData);
  const [parents, setParents] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    let active = true;
    taxonomyService.categories()
      .then((items) => { if (active) setParents(items.filter((item) => item.id !== editingId)); })
      .catch((cause) => { if (active) toast({ tone: "error", message: cause instanceof Error ? cause.message : "دریافت دسته‌بندی‌های والد انجام نشد." }); });
    return () => { active = false; };
  }, [editingId, toast]);

  const set = <K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };
  const slugify = () => set("slug", data.name.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (data.name.trim().length < 2) next.name = "نام دسته‌بندی باید حداقل ۲ کاراکتر باشد.";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug.trim())) next.slug = "نامک باید با حروف انگلیسی، عدد و خط تیره نوشته شود.";
    if (data.description.trim().length < 20) next.description = "توضیحات باید حداقل ۲۰ کاراکتر باشد.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await taxonomyService.saveCategory(data, editingId);
      toast({ tone: "success", message: mode === "create" ? "دسته‌بندی ایجاد شد." : "دسته‌بندی به‌روزرسانی شد." });
      router.push("/admin/categories");
      router.refresh();
    } catch (cause) {
      toast({ tone: "error", message: cause instanceof Error ? cause.message : "ذخیره دسته‌بندی انجام نشد." });
    } finally {
      setSaving(false);
    }
  };

  const uploadCover = async (file?: File) => {
    setUploadError("");
    if (!file) return;
    if (!allowedTypes.has(file.type)) { setUploadError("فقط تصویر JPEG، PNG یا WebP مجاز است."); return; }
    if (file.size <= 0 || file.size > maxFileSize) { setUploadError("حجم تصویر باید کمتر از ۴ مگابایت باشد."); return; }
    setUploading(true);
    try {
      const asset = await uploadMedia(file);
      set("coverImage", asset.url);
      toast({ tone: "success", message: "تصویر کاور با موفقیت آپلود شد." });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "آپلود تصویر کاور انجام نشد.";
      setUploadError(message);
      toast({ tone: "error", message });
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const busy = saving || uploading;
  return <form onSubmit={submit}>
    <header className="mb-6 flex flex-col gap-4 border-b border-(--border) pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="mb-2 text-[13px] font-bold text-(--accent)">ساختار محتوا</p><h2 className="text-xl font-bold text-(--text-strong) sm:text-2xl">{mode === "create" ? "افزودن دسته‌بندی" : "ویرایش دسته‌بندی"}</h2><p className="mt-2 text-xs text-(--muted)">{mode === "create" ? "ساختار جدیدی برای محتوای مجله ایجاد کنید" : "اطلاعات دسته‌بندی را به‌روزرسانی کنید"}</p></div>
      <div className="flex gap-2"><Link href="/admin/categories" className="flex h-10 items-center rounded-(--radius-sm) border border-(--border) bg-white px-4 text-[13px] font-bold">انصراف</Link><button disabled={busy} className="flex h-10 items-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-4 text-[13px] font-bold text-white disabled:opacity-50">{saving ? <LoaderCircle size={14} className="animate-spin" /> : <Save size={14} />}ذخیره</button></div>
    </header>
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">
      <main className="space-y-4">
        <section className="rounded-(--radius) border border-(--border) bg-white p-5 sm:p-6">
          <h3 className="text-xs font-bold text-(--text-strong)">اطلاعات دسته‌بندی</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Label text="نام"><input disabled={busy} value={data.name} onChange={(event) => set("name", event.target.value)} className={`${field} ${errors.name ? "border-(--danger-border)" : ""}`} />{errors.name && <ErrorMessage text={errors.name} />}</Label>
            <Label text="نامک (Slug)"><div className="flex gap-2"><input disabled={busy} dir="ltr" value={data.slug} onChange={(event) => set("slug", event.target.value.toLowerCase())} className={`${field} min-w-0 text-left ${errors.slug ? "border-(--danger-border)" : ""}`} /><button disabled={busy} type="button" onClick={slugify} className="mt-1.5 rounded-(--radius-sm) border border-(--border) px-3 text-[12px] font-bold disabled:opacity-50">ساخت</button></div>{errors.slug && <ErrorMessage text={errors.slug} />}</Label>
            <label className="text-[13px] font-bold text-(--text-secondary) sm:col-span-2">توضیحات<textarea disabled={busy} value={data.description} onChange={(event) => set("description", event.target.value)} rows={5} className={`mt-1.5 w-full resize-none rounded-(--radius-sm) border bg-(--surface-subtle) p-3 text-[14px] leading-6 outline-none focus:border-(--focus-border) disabled:opacity-60 ${errors.description ? "border-(--danger-border)" : "border-(--border)"}`} />{errors.description && <ErrorMessage text={errors.description} />}</label>
            <Label text="دسته‌بندی والد"><select disabled={busy} value={data.parentId} onChange={(event) => set("parentId", event.target.value)} className={field}><option value="">بدون والد</option>{parents.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Label>
            <Label text="آیکن"><select disabled={busy} value={data.icon} onChange={(event) => set("icon", event.target.value)} className={field}>{["Folder", "Sparkles", "Code2", "PenTool", "ShieldCheck", "Rocket", "Cpu", "Smartphone"].map((item) => <option key={item}>{item}</option>)}</select></Label>
          </div>
        </section>
        <section className="rounded-(--radius) border border-(--border) bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2"><SearchCheck size={16} /><h3 className="text-xs font-bold text-(--text-strong)">تنظیمات SEO</h3></div>
          <div className="mt-5 space-y-4"><Label text={`SEO Title — ${data.seo.title.length}/۶۰`}><input disabled={busy} value={data.seo.title} onChange={(event) => set("seo", { ...data.seo, title: event.target.value })} className={field} /></Label><label className="text-[13px] font-bold text-(--text-secondary)">Meta Description<textarea disabled={busy} value={data.seo.description} onChange={(event) => set("seo", { ...data.seo, description: event.target.value })} rows={3} className="mt-1.5 w-full rounded-(--radius-sm) border border-(--border) bg-(--surface-subtle) p-3 text-[14px] outline-none focus:border-(--focus-border) disabled:opacity-60" /></label><Label text="Canonical URL"><input disabled={busy} dir="ltr" value={data.seo.canonicalUrl} onChange={(event) => set("seo", { ...data.seo, canonicalUrl: event.target.value })} className={`${field} text-left`} /></Label><div className="rounded-(--radius-sm) border border-(--border-strong) bg-(--surface-subtle) p-3"><p className="text-[12px] text-(--text-muted)">technama.ir › category</p><p className="mt-1 text-[12px] text-(--info)">{data.seo.title || data.name || "عنوان دسته‌بندی"}</p><p className="mt-1 text-[12px] leading-4 text-(--text-secondary)">{data.seo.description || data.description || "توضیحات متا در این قسمت نمایش داده می‌شود."}</p></div></div>
        </section>
      </main>
      <aside className="space-y-4">
        <section className="rounded-(--radius) border border-(--border) bg-white p-5"><h3 className="text-xs font-bold text-(--text-strong)">هویت بصری</h3><Label text="رنگ"><div className="mt-2 flex items-center gap-3"><input disabled={busy} aria-label="انتخاب رنگ دسته‌بندی" type="color" value={data.color} onChange={(event) => set("color", event.target.value)} className="size-11 cursor-pointer rounded-lg border-0 bg-transparent disabled:opacity-60" /><input disabled={busy} dir="ltr" value={data.color} onChange={(event) => set("color", event.target.value)} className={`${field} mt-0 text-left`} /></div></Label></section>
        <section className="rounded-(--radius) border border-(--border) bg-white p-5"><h3 className="text-xs font-bold text-(--text-strong)">تصویر کاور <span className="text-[14px] font-normal text-(--text-muted)">اختیاری</span></h3><p className="mt-2 text-[11px] leading-5 text-(--text-muted)">JPEG، PNG یا WebP تا ۴ مگابایت</p><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" disabled={busy} onChange={(event) => uploadCover(event.target.files?.[0])} />
          {data.coverImage ? <><div className="relative mt-4 aspect-video overflow-hidden rounded-(--radius-sm) bg-(--surface-muted)"><Image unoptimized fill sizes="310px" src={data.coverImage} alt={`کاور دسته‌بندی ${data.name || "جدید"}`} className="object-cover" /></div><div className="mt-3 flex gap-2"><button disabled={busy} type="button" onClick={() => fileInput.current?.click()} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-(--radius-sm) border border-(--border) text-[12px] font-bold disabled:opacity-50">{uploading ? <LoaderCircle size={13} className="animate-spin" /> : <Upload size={13} />}جایگزینی</button><button disabled={busy} aria-label="حذف تصویر کاور" type="button" onClick={() => set("coverImage", undefined)} className="grid size-10 place-items-center rounded-(--radius-sm) border border-(--danger-border) text-(--danger) disabled:opacity-50"><Trash2 size={13} /></button></div></> : <button disabled={busy} type="button" onClick={() => fileInput.current?.click()} className="mt-4 grid aspect-video w-full place-items-center rounded-(--radius-sm) border border-dashed border-(--border-strong) bg-(--surface-subtle) disabled:opacity-50"><span>{uploading ? <LoaderCircle size={20} className="mx-auto animate-spin text-(--brand-teal)" /> : <ImagePlus size={20} className="mx-auto text-(--text-muted)" />}<small className="mt-2 block text-[12px]">{uploading ? "در حال بارگذاری..." : "انتخاب و آپلود تصویر"}</small></span></button>}
          {uploadError && <p role="alert" className="mt-2 text-[12px] font-bold leading-5 text-(--danger)">{uploadError}</p>}
        </section>
      </aside>
    </div>
  </form>;
}

function Label({ text, children }: { text: string; children: React.ReactNode }) { return <label className="text-[13px] font-bold text-(--text-secondary)">{text}{children}</label>; }
function ErrorMessage({ text }: { text: string }) { return <span role="alert" className="mt-1 block text-[12px] text-(--danger)">{text}</span>; }
