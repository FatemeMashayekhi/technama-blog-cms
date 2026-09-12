"use client";

import { useRef, useState } from "react";
import { CalendarClock, ChevronDown, ImagePlus, SearchCheck, Tag, Trash2, UserRound, Upload } from "lucide-react";
import { technologyCategories } from "@/lib/posts-data";
import { editorAuthors, type ArticleFormData, type ArticleFormErrors } from "@/lib/article-editor";
import { uploadMedia } from "@/lib/media-service";

type EditorSidebarProps = { data: ArticleFormData; errors: ArticleFormErrors; onChange: (patch: Partial<ArticleFormData>) => void };

function Section({ title, icon: Icon, children, open = true }: { title: string; icon: typeof CalendarClock; children: React.ReactNode; open?: boolean }) {
  return <details open={open} className="group rounded-(--radius) border border-(--border) bg-white"><summary className="flex h-12 cursor-pointer list-none items-center gap-2 px-4 text-xs font-bold text-(--text-strong) [&::-webkit-details-marker]:hidden"><Icon size={16} className="text-(--text-secondary)" /><span className="flex-1">{title}</span><ChevronDown size={15} className="transition-transform group-open:rotate-180" /></summary><div className="border-t border-(--border-subtle) p-4">{children}</div></details>;
}

const fieldClass = "h-10 w-full rounded-(--radius-sm) border border-(--border) bg-white px-3 text-[14px] text-(--text-secondary) outline-none focus:border-(--focus-border)";

export function EditorSidebar({ data, errors, onChange }: EditorSidebarProps) {
  const [tagValue, setTagValue] = useState("");
  const [imageError, setImageError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const author = editorAuthors.find((item) => item.id === data.authorId);
  const addTag = () => { const next = tagValue.trim(); if (next && !data.tags.includes(next)) onChange({ tags: [...data.tags, next] }); setTagValue(""); };
  const selectImage = async (file?: File) => { if (!file) return; setImageError(""); try { const asset = await uploadMedia(file); onChange({ featuredImage: asset.url, featuredImageName: asset.name }); } catch (error) { setImageError(error instanceof Error ? error.message : "آپلود تصویر انجام نشد."); } };

  return <aside className="space-y-3">
    <Section title="انتشار" icon={CalendarClock}>
      <div className="space-y-4">
        <label className="block"><span className="mb-1.5 block text-[13px] font-bold text-(--text-secondary)">وضعیت</span><select value={data.status} onChange={(event) => onChange({ status: event.target.value as ArticleFormData["status"] })} className={fieldClass}><option value="draft">پیش‌نویس</option><option value="review">در انتظار بررسی</option><option value="published">منتشر شده</option><option value="scheduled">زمان‌بندی شده</option></select></label>
        <fieldset><legend className="mb-2 text-[13px] font-bold text-(--text-secondary)">زمان انتشار</legend><div className="space-y-2"><label className="flex cursor-pointer items-center gap-2 text-[13px] text-(--text-secondary)"><input type="radio" checked={data.publishMode === "now"} onChange={() => onChange({ publishMode: "now", publishAt: "" })} className="accent-[#176f66]" /> انتشار فوری</label><label className="flex cursor-pointer items-center gap-2 text-[13px] text-(--text-secondary)"><input type="radio" checked={data.publishMode === "scheduled"} onChange={() => onChange({ publishMode: "scheduled", status: "scheduled" })} className="accent-[#176f66]" /> زمان‌بندی انتشار</label></div></fieldset>
        {data.publishMode === "scheduled" && <label className="block"><span className="sr-only">تاریخ و زمان انتشار</span><input type="datetime-local" value={data.publishAt ?? ""} onChange={(event) => onChange({ publishAt: event.target.value })} className={`${fieldClass} text-left`} dir="ltr" />{errors.publishAt && <span className="mt-1 block text-[12px] text-(--danger)">{errors.publishAt}</span>}</label>}
      </div>
    </Section>

    <Section title="دسته‌بندی و نویسنده" icon={UserRound}>
      <div className="space-y-4"><label className="block"><span className="mb-1.5 block text-[13px] font-bold text-(--text-secondary)">دسته‌بندی</span><select value={data.categoryId} onChange={(event) => onChange({ categoryId: event.target.value })} className={`${fieldClass} ${errors.categoryId ? "border-(--danger-border)" : ""}`}><option value="">انتخاب دسته‌بندی</option>{technologyCategories.map((item) => <option key={item}>{item}</option>)}</select>{errors.categoryId && <span className="mt-1 block text-[12px] text-(--danger)">{errors.categoryId}</span>}</label>
        <label className="block"><span className="mb-1.5 block text-[13px] font-bold text-(--text-secondary)">نویسنده</span><select value={data.authorId} onChange={(event) => onChange({ authorId: event.target.value })} className={`${fieldClass} ${errors.authorId ? "border-(--danger-border)" : ""}`}>{editorAuthors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        {author && <div className="flex items-center gap-2 rounded-lg bg-(--surface-subtle) p-2"><span className="grid size-7 place-items-center rounded-full bg-(--surface-muted) text-[12px] font-bold text-(--brand-teal)">{author.initials}</span><span className="text-[13px] text-(--text-secondary)">نویسنده مسئول: <strong>{author.name}</strong></span></div>}
      </div>
    </Section>

    <Section title="برچسب‌ها" icon={Tag}>
      <div className="flex gap-2"><input value={tagValue} onChange={(event) => setTagValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} placeholder="نام برچسب..." className={fieldClass} /><button type="button" onClick={addTag} disabled={!tagValue.trim()} className="h-10 rounded-(--radius-sm) bg-(--surface-muted) px-3 text-[13px] font-bold text-(--text-secondary) hover:bg-(--surface-muted) disabled:opacity-40">افزودن</button></div>
      <div className="mt-3 flex min-h-7 flex-wrap gap-1.5">{data.tags.length ? data.tags.map((tagItem) => <span key={tagItem} className="inline-flex items-center gap-1 rounded-md bg-(--surface-muted) px-2 py-1 text-[12px] text-(--text-secondary)">{tagItem}<button type="button" onClick={() => onChange({ tags: data.tags.filter((item) => item !== tagItem) })} aria-label={`حذف برچسب ${tagItem}`} className="text-(--text-muted) hover:text-(--danger)">×</button></span>) : <span className="text-[12px] text-(--text-muted)">با Enter برچسب را اضافه کنید.</span>}</div>
    </Section>

    <Section title="تصویر شاخص" icon={ImagePlus}>
      <input ref={imageInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif" className="hidden" onChange={(event) => { void selectImage(event.target.files?.[0]); }} />
      {imageError && <p role="alert" className="mb-2 text-[12px] text-(--danger)">{imageError}</p>}
      {data.featuredImage ? <div><div className="aspect-video w-full rounded-(--radius-sm) bg-cover bg-center" style={{ backgroundImage: `url(${data.featuredImage})` }} role="img" aria-label="پیش‌نمایش تصویر شاخص" /><p className="mt-2 truncate text-[12px] text-(--text-muted)" dir="ltr">{data.featuredImageName}</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => imageInputRef.current?.click()} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-(--radius-sm) border border-(--border) text-[13px] font-bold text-(--text-secondary) hover:bg-(--surface-subtle)"><Upload size={13} /> جایگزینی</button><button type="button" onClick={() => onChange({ featuredImage: undefined, featuredImageName: undefined })} aria-label="حذف تصویر شاخص" className="grid size-10 place-items-center rounded-(--radius-sm) border border-(--danger-border) text-(--danger) hover:bg-(--danger-soft)"><Trash2 size={14} /></button></div></div> : <button type="button" onClick={() => imageInputRef.current?.click()} className="grid aspect-video w-full place-items-center rounded-(--radius-sm) border border-dashed border-(--border-strong) bg-(--surface-subtle) text-center hover:border-(--border-strong) hover:bg-(--surface-subtle)"><span><ImagePlus size={21} className="mx-auto text-(--text-muted)" /><strong className="mt-2 block text-[13px] text-(--text-secondary)">انتخاب تصویر</strong><small className="mt-1 block text-[14px] text-(--text-muted)">تصویر اصلی مقاله را انتخاب کنید</small></span></button>}
    </Section>

    <Section title="تنظیمات SEO" icon={SearchCheck} open={false}>
      <div className="space-y-4">
        <label className="block"><span className="mb-1.5 flex justify-between text-[13px] font-bold text-(--text-secondary)"><span>SEO Title</span><span className="font-normal text-(--text-muted)">{data.seo.title.length}/۶۰</span></span><input value={data.seo.title} onChange={(event) => onChange({ seo: { ...data.seo, title: event.target.value } })} className={fieldClass} /></label>
        <label className="block"><span className="mb-1.5 flex justify-between text-[13px] font-bold text-(--text-secondary)"><span>Meta Description</span><span className="font-normal text-(--text-muted)">{data.seo.description.length}/۱۶۰</span></span><textarea value={data.seo.description} onChange={(event) => onChange({ seo: { ...data.seo, description: event.target.value } })} rows={3} className="w-full resize-none rounded-(--radius-sm) border border-(--border) p-3 text-[13px] leading-5 outline-none focus:border-(--focus-border)" /></label>
        <label className="block"><span className="mb-1.5 block text-[13px] font-bold text-(--text-secondary)">Canonical URL</span><input dir="ltr" value={data.seo.canonicalUrl} onChange={(event) => onChange({ seo: { ...data.seo, canonicalUrl: event.target.value } })} placeholder="https://technama.ir/..." className={`${fieldClass} text-left`} /></label>
        <label className="block"><span className="mb-1.5 block text-[13px] font-bold text-(--text-secondary)">Open Graph Image</span><input dir="ltr" value={data.seo.ogImage} onChange={(event) => onChange({ seo: { ...data.seo, ogImage: event.target.value } })} placeholder="/images/cover.jpg" className={`${fieldClass} text-left`} /></label>
        <div className="rounded-(--radius-sm) border border-(--border-strong) bg-(--surface-subtle) p-3"><p className="text-[12px] text-(--text-muted)">technama.ir › articles</p><p className="mt-1.5 line-clamp-1 text-[12px] text-(--info)">{data.seo.title || data.title || "عنوان مقاله"}</p><p className="mt-1 line-clamp-2 text-[12px] leading-4 text-(--text-secondary)">{data.seo.description || data.excerpt || "توضیحات متای مقاله در این قسمت نمایش داده می‌شود."}</p></div>
      </div>
    </Section>
  </aside>;
}
