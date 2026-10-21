"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock3, Eye, FileText, LoaderCircle, Save, Send } from "lucide-react";
import { type ArticleFormData, type ArticleFormErrors, saveArticleToCms, validateArticle } from "@/lib/article-editor";
import { RichTextEditor } from "./rich-text-editor";
import { EditorSidebar } from "./editor-sidebar";
import { ArticlePreview } from "./article-preview";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";
import { useToast } from "@/components/ui/toast-provider";

type ArticleEditorProps = { mode: "create" | "edit"; initialData: ArticleFormData; articleId?: string };

function createSlug(title: string) {
  return title.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function ArticleEditor({ mode, initialData, articleId: initialArticleId }: ArticleEditorProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<ArticleFormErrors>({});
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "unsaved">("saved");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [unsavedOpen, setUnsavedOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const { toast } = useToast();
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editRevision = useRef(0);
  const [articleId, setArticleId] = useState(initialArticleId);

  const plainContent = useMemo(() => data.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), [data.content]);
  const wordCount = plainContent ? plainContent.split(" ").length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 220));

  const updateData = useCallback((patch: Partial<ArticleFormData>) => {
    editRevision.current += 1;
    setData((current) => ({ ...current, ...patch }));
    setDirty(true);
    setSaveState("unsaved");
    setErrors((current) => { const next = { ...current }; Object.keys(patch).forEach((key) => delete next[key as keyof ArticleFormErrors]); return next; });
  }, []);

  useEffect(() => {
    if (!dirty || imageUploading) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      const savingRevision = editRevision.current;
      setSaveState("saving");
      if (!articleId) { setSaveState("unsaved"); return; }
      try { await saveArticleToCms(data, articleId); if (editRevision.current === savingRevision) { setDirty(false); setSaveState("saved"); } else setSaveState("unsaved"); }
      catch (error) { setSaveState("unsaved"); toast({ tone: "error", message: error instanceof Error ? error.message : "ذخیره خودکار انجام نشد." }); }
    }, 1800);
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, [articleId, data, dirty, imageUploading, toast]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    const interceptLinks = (event: MouseEvent) => {
      if (!dirty) return;
      const link = (event.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.href === window.location.href) return;
      event.preventDefault();
      event.stopPropagation();
      setPendingHref(link.href);
      setUnsavedOpen(true);
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", interceptLinks, true);
    return () => { window.removeEventListener("beforeunload", beforeUnload); document.removeEventListener("click", interceptLinks, true); };
  }, [dirty]);

  const saveDraft = async (silent = false) => {
    if (!data.title.trim()) { setErrors((current) => ({ ...current, title: "عنوان مقاله الزامی است." })); document.getElementById("article-title")?.focus(); return false; }
    setSaveState("saving");
    const savingRevision = editRevision.current;
    if (imageUploading) { toast({ tone: "info", message: "لطفاً تا پایان بارگذاری تصویر صبر کنید." }); return false; }
    const draftSlug = data.slug || createSlug(data.title) || `draft-${Date.now()}`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draftSlug)) { setErrors((current) => ({ ...current, slug: "نامک فقط باید شامل حروف کوچک انگلیسی، عدد و خط تیره باشد." })); document.getElementById("article-slug")?.focus(); setSaveState("unsaved"); return false; }
    const draftData = { ...data, slug: draftSlug, status: "draft" as const };
    try {
      const saved = await saveArticleToCms(draftData, articleId);
      if (saved.id) setArticleId(saved.id);
    } catch (error) { setSaveState("unsaved"); toast({ tone: "error", message: error instanceof Error ? error.message : "ذخیره مقاله انجام نشد." }); return false; }
    if (editRevision.current === savingRevision) { setData(draftData); setDirty(false); setSaveState("saved"); } else setSaveState("unsaved");
    if (!silent) toast({ tone: "success", message: "پیش‌نویس با موفقیت ذخیره شد." });
    return true;
  };

  const publish = async () => {
    const nextErrors = validateArticle(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { toast({ tone: "error", message: "لطفاً خطاهای فرم را برطرف کنید." }); document.getElementById("article-title")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if (imageUploading) { toast({ tone: "info", message: "لطفاً تا پایان بارگذاری تصویر صبر کنید." }); return; }
    setSaveState("saving");
    const savingRevision = editRevision.current;
    try {
      const saved = await saveArticleToCms({ ...data, status: data.publishMode === "scheduled" ? "scheduled" : "published" }, articleId);
      if (saved.id) setArticleId(saved.id);
    } catch (error) { setSaveState("unsaved"); toast({ tone: "error", message: error instanceof Error ? error.message : "انتشار مقاله انجام نشد." }); return; }
    if (editRevision.current === savingRevision) { setData((current) => ({ ...current, status: current.publishMode === "scheduled" ? "scheduled" : "published" })); setDirty(false); setSaveState("saved"); } else setSaveState("unsaved");
    if (data.publishMode === "scheduled") toast({ tone: "success", message: "انتشار مقاله با موفقیت زمان‌بندی شد." });
    else { toast({ tone: "success", message: "مقاله با موفقیت منتشر شد." }); router.push("/admin/posts"); router.refresh(); }
  };

  const leave = () => { setDirty(false); setUnsavedOpen(false); const url = pendingHref; setPendingHref(""); if (url) router.push(new URL(url).pathname); };

  return <>
    <header className="mb-6 flex flex-col gap-4 border-b border-(--border) pb-5 xl:flex-row xl:items-end xl:justify-between">
      <div><p className="mb-2 text-[13px] font-bold text-(--accent)">{mode === "create" ? "مقاله تازه" : "ویرایش محتوا"}</p><h2 className="text-xl font-bold tracking-[-.03em] text-(--text-strong) sm:text-2xl">{mode === "create" ? "ایجاد مقاله جدید" : "ویرایش مقاله"}</h2><p className="mt-2 text-xs text-(--muted)">{mode === "create" ? "مقاله جدیدی برای مجله ایجاد کنید" : "مقاله را ویرایش و به‌روزرسانی کنید"}</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="ml-auto flex h-10 items-center gap-1.5 px-2 text-[12px] text-(--text-muted) xl:ml-2">{saveState === "saving" ? <><LoaderCircle size={13} className="animate-spin" /> در حال ذخیره...</> : saveState === "saved" ? <><Check size={13} className="text-(--accent)" /> ذخیره شد</> : <><Clock3 size={13} /> تغییرات ذخیره نشده</>}</span>
        <button type="button" onClick={() => saveDraft()} disabled={saveState === "saving" || imageUploading} className="flex h-10 items-center gap-1.5 rounded-(--radius-sm) border border-(--border) bg-white px-3 text-[13px] font-bold text-(--text-secondary) hover:bg-(--surface-subtle) disabled:opacity-50"><Save size={14} /> ذخیره پیش‌نویس</button>
        <button type="button" onClick={() => setPreviewOpen(true)} className="flex h-10 items-center gap-1.5 rounded-(--radius-sm) border border-(--border) bg-white px-3 text-[13px] font-bold text-(--text-secondary) hover:bg-(--surface-subtle)"><Eye size={14} /> پیش‌نمایش</button>
        <button type="button" onClick={publish} disabled={saveState === "saving" || imageUploading} className="flex h-10 items-center gap-1.5 rounded-(--radius-sm) bg-(--brand-navy) px-4 text-[13px] font-bold text-white hover:bg-(--brand-navy-hover) disabled:opacity-60"><Send size={14} /> {data.publishMode === "scheduled" ? "زمان‌بندی" : "انتشار"}</button>
      </div>
    </header>

    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
      <main className="min-w-0 space-y-4">
        <section className="rounded-(--radius) border border-(--border) bg-white p-5 sm:p-7">
          <label htmlFor="article-title" className="sr-only">عنوان مقاله</label>
          <textarea id="article-title" rows={2} maxLength={220} value={data.title} onChange={(event) => updateData({ title: event.target.value })} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "article-title-error" : undefined} placeholder="عنوان مقاله را وارد کنید" className={`min-h-24 w-full resize-y border-0 bg-transparent text-xl font-bold leading-[1.7] tracking-[-.03em] text-(--text-strong) outline-none placeholder:text-(--text-faint) sm:text-3xl ${errors.title ? "placeholder:text-(--danger)" : ""}`} />
          {errors.title && <p id="article-title-error" role="alert" className="mt-1 text-[12px] text-(--danger)">{errors.title}</p>}
          <div className="mt-5 border-t border-(--border-subtle) pt-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-end"><label className="min-w-0 flex-1" htmlFor="article-slug"><span className="mb-1.5 block text-[13px] font-bold text-(--text-secondary)">نامک (Slug)</span><input id="article-slug" dir="ltr" value={data.slug} onChange={(event) => { const slug = event.target.value; updateData({ slug }); setErrors((current) => ({ ...current, slug: slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? "نامک فقط باید شامل حروف کوچک انگلیسی، عدد و خط تیره باشد." : undefined })); }} autoCapitalize="none" autoCorrect="off" spellCheck={false} aria-invalid={Boolean(errors.slug)} aria-describedby={errors.slug ? "article-slug-error" : "article-slug-help"} placeholder="ai-future-software-development" className={`h-10 w-full rounded-(--radius-sm) border bg-(--surface-subtle) px-3 text-left text-[14px] outline-none focus:border-(--focus-border) ${errors.slug ? "border-(--danger-border)" : "border-(--border)"}`} /></label><button type="button" onClick={() => updateData({ slug: createSlug(data.title) })} disabled={!data.title.trim()} className="h-10 rounded-(--radius-sm) border border-(--border) px-3 text-[13px] font-bold text-(--text-secondary) hover:bg-(--surface-subtle) disabled:opacity-40">ساخت از عنوان</button></div><p id="article-slug-help" className="mt-1.5 text-[12px] leading-5 text-(--text-muted)">فقط حروف کوچک انگلیسی (a-z)، عدد و خط تیره مجاز است؛ نمونه: nextjs-performance-guide</p>{errors.slug && <p id="article-slug-error" role="alert" className="mt-1 text-[12px] font-bold text-(--danger)">{errors.slug}</p>}</div>
        </section>

        <section className="rounded-(--radius) border border-(--border) bg-white p-5 sm:p-6"><label htmlFor="article-excerpt" className="flex items-center justify-between text-[13px] font-bold text-(--text-secondary)"><span>خلاصه مقاله</span><span className={`font-normal ${data.excerpt.length > 200 ? "text-(--danger)" : "text-(--text-muted)"}`}>{new Intl.NumberFormat("fa-IR").format(data.excerpt.length)}/۲۲۰</span></label><textarea id="article-excerpt" value={data.excerpt} maxLength={220} onChange={(event) => updateData({ excerpt: event.target.value })} rows={4} aria-invalid={Boolean(errors.excerpt)} aria-describedby={errors.excerpt ? "article-excerpt-error" : undefined} placeholder="خلاصه کوتاهی از مقاله بنویسید..." className={`mt-3 min-h-28 w-full resize-y rounded-(--radius-sm) border bg-(--surface-subtle) p-3 text-[14px] leading-7 outline-none focus:border-(--focus-border) ${errors.excerpt ? "border-(--danger-border)" : "border-(--border)"}`} />{errors.excerpt && <p id="article-excerpt-error" role="alert" className="mt-1.5 text-[12px] text-(--danger)">{errors.excerpt}</p>}</section>

        <section><div className="mb-2 flex items-center justify-between px-1"><label className="text-[13px] font-bold text-(--text-secondary)">متن مقاله</label><div className="flex items-center gap-3 text-[12px] text-(--text-muted)"><span><FileText size={12} className="ml-1 inline" />{new Intl.NumberFormat("fa-IR").format(wordCount)} کلمه</span><span><Clock3 size={12} className="ml-1 inline" />{new Intl.NumberFormat("fa-IR").format(readingTime)} دقیقه مطالعه</span></div></div><RichTextEditor value={data.content} onChange={(content) => updateData({ content })} error={errors.content} />{errors.content && <p className="mt-1.5 px-1 text-[12px] text-(--danger)">{errors.content}</p>}</section>
      </main>
      <EditorSidebar data={data} errors={errors} onChange={updateData} onUploadStateChange={setImageUploading} />
    </div>

    <ArticlePreview open={previewOpen} data={data} readingTime={readingTime} onClose={() => setPreviewOpen(false)} />
    <UnsavedChangesDialog open={unsavedOpen} saving={saveState === "saving"} onCancel={() => { setUnsavedOpen(false); setPendingHref(""); }} onDiscard={leave} onSave={async () => { if (await saveDraft(true)) leave(); }} />
  </>;
}
