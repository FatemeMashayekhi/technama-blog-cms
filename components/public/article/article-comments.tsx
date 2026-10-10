"use client";

import { CheckCircle2, Clock3, Heart, MessageSquareReply, Send } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { MagazineComment } from "@/lib/comments-data";
import { Skeleton } from "@/components/ui/skeleton";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxContentLength = 2_000;

type OwnComment = {
  id: string;
  parentId: string | null;
  name: string;
  content: string;
  status: "pending" | "approved" | "rejected" | "spam";
  createdAt: string;
};

type SubmitResponse = { ok: boolean; data?: OwnComment; error?: string; details?: { fieldErrors?: Record<string, string[]> } };
type StatusResponse = { ok: boolean; data?: OwnComment[] };

function isStoredComment(value: unknown): value is OwnComment {
  if (!value || typeof value !== "object") return false;
  const comment = value as Partial<OwnComment>;
  return typeof comment.id === "string" && uuidPattern.test(comment.id) &&
    typeof comment.name === "string" && typeof comment.content === "string" &&
    typeof comment.createdAt === "string" && (comment.status === "pending" || comment.status === "approved");
}

function readStoredReceipts(storageKey: string) {
  const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as unknown;
  if (!Array.isArray(stored)) return { ids: [] as string[], cached: [] as OwnComment[] };
  const cached = stored.filter(isStoredComment).slice(0, 20);
  const ids = stored.flatMap((item) => {
    if (typeof item === "string" && uuidPattern.test(item)) return [item];
    if (isStoredComment(item)) return [item.id];
    return [];
  }).slice(0, 20);
  return { ids: [...new Set(ids)], cached };
}

function storeReceipts(storageKey: string, comments: OwnComment[]) {
  localStorage.setItem(storageKey, JSON.stringify(comments.slice(0, 20)));
}

function validateComment(name: string, email: string, content: string) {
  const errors: Record<string, string> = {};
  const cleanName = name.trim();
  const cleanContent = content.trim();
  if (cleanName.length < 2) errors.name = "نام باید دست‌کم ۲ کاراکتر باشد.";
  else if (cleanName.length > 80) errors.name = "نام نمی‌تواند بیشتر از ۸۰ کاراکتر باشد.";
  else if (/[<>\u0000-\u001F\u007F]/u.test(cleanName)) errors.name = "نام شامل کاراکتر غیرمجاز است.";
  if (!emailPattern.test(email.trim()) || email.trim().length > 254) errors.email = "یک ایمیل معتبر وارد کنید.";
  if (cleanContent.length < 10) errors.content = "دیدگاه باید دست‌کم ۱۰ کاراکتر باشد.";
  else if (cleanContent.length > maxContentLength) errors.content = "دیدگاه نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد.";
  else if ((cleanContent.match(/https?:\/\//gi) ?? []).length > 2) errors.content = "در هر دیدگاه حداکثر دو پیوند مجاز است.";
  return errors;
}

export function ArticleComments({ articleId, articleSlug, comments }: { articleId: string; articleSlug: string; comments: MagazineComment[] }) {
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ownComments, setOwnComments] = useState<OwnComment[]>([]);
  const [receiptState, setReceiptState] = useState<"checking" | "ready">("checking");
  const storageKey = `technama:comment-receipts:${articleSlug}`;
  const selector = useMemo(() => uuidPattern.test(articleId) ? { articleId, articleSlug } : { articleSlug }, [articleId, articleSlug]);

  useEffect(() => {
    let active = true;
    const syncReceipts = async () => {
      try {
        const { ids, cached } = readStoredReceipts(storageKey);
        if (active && cached.length) setOwnComments(cached);
        if (!ids.length) return;
        const response = await fetch("/api/comments/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...selector, ids }),
        });
        const result = await response.json() as StatusResponse;
        if (!response.ok || !result.ok || !result.data) return;
        const visible = result.data.filter((comment) => comment.status === "pending" || comment.status === "approved");
        if (!active) return;
        setOwnComments(visible);
        storeReceipts(storageKey, visible);
      } catch {
        // Keep the last verified browser copy visible if the status request is temporarily unavailable.
      } finally {
        if (active) setReceiptState("ready");
      }
    };
    void syncReceipts();
    return () => { active = false; };
  }, [selector, storageKey]);

  const visibleOwnComments = ownComments.filter((own) => !comments.some((comment) => comment.id === own.id));

  const rememberReceipt = (comment: OwnComment) => {
    try {
      const { cached } = readStoredReceipts(storageKey);
      storeReceipts(storageKey, [comment, ...cached.filter((item) => item.id !== comment.id)]);
    } catch {
      storeReceipts(storageKey, [comment]);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSuccess(false);
    const next = validateComment(name, email, content);
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selector, parentId: replyTo?.id ?? null, name: name.trim(), email: email.trim().toLowerCase(), content: content.trim(), website: "" }),
      });
      const result = await response.json() as SubmitResponse;
      if (!response.ok || !result.ok || result.data?.status !== "pending") {
        const fields = result.details?.fieldErrors;
        if (fields) setErrors({ name: fields.name?.[0] ?? "", email: fields.email?.[0] ?? "", content: fields.content?.[0] ?? "", form: result.error ?? "اطلاعات دیدگاه معتبر نیست." });
        else setErrors({ form: result.error || "پاسخ سرویس ثبت دیدگاه معتبر نبود." });
        return;
      }
      rememberReceipt(result.data);
      setOwnComments((current) => [result.data!, ...current.filter((item) => item.id !== result.data!.id)]);
      setReceiptState("ready");
      setSuccess(true);
      setName("");
      setEmail("");
      setContent("");
      setReplyTo(null);
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "ثبت دیدگاه انجام نشد." });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = (id: string) => setLiked((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return <section className="mx-auto max-w-3xl px-4 py-14 md:px-7 md:py-18" id="comments">
    <div className="editorial-rule flex items-end justify-between border-b border-(--border-strong) pb-5"><div><p className="editorial-kicker">گفت‌وگوی خوانندگان</p><h2 className="mt-2 text-[27px] font-black text-(--public-ink)">دیدگاه‌ها</h2></div><span className="text-[13px] text-(--text-muted)">{comments.length.toLocaleString("fa-IR")} دیدگاه تأییدشده</span></div>

    {receiptState === "checking" && visibleOwnComments.length === 0 && <OwnCommentsSkeleton/>}

    {visibleOwnComments.length > 0 && <section aria-labelledby="own-comments-title" className="mt-7 rounded-(--radius-lg) border border-(--warning-border) bg-(--warning-soft) p-4 sm:p-5">
      <div className="flex items-center gap-2"><Clock3 size={16} className="text-(--warning)"/><h3 id="own-comments-title" className="text-[14px] font-black text-(--text-strong)">دیدگاه‌های ثبت‌شده شما</h3></div>
      <p className="mt-1 text-[12px] leading-6 text-(--text-muted)">این بخش فقط در همین مرورگر نمایش داده می‌شود تا وضعیت دیدگاه‌های ناشناس را تا زمان انتشار دنبال کنید.</p>
      <div className="mt-4 space-y-3">{visibleOwnComments.map((comment) => <article key={comment.id} className="rounded-(--radius-sm) border border-white/80 bg-white/80 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-[13px] text-(--public-ink)">{comment.name}</strong><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${comment.status === "approved" ? "bg-(--accent-soft) text-(--brand-teal)" : "bg-(--warning-soft) text-(--warning)"}`}>{comment.status === "approved" ? "تأیید شده" : "در انتظار بررسی"}</span></div><p className="mt-2 whitespace-pre-wrap text-[14px] leading-7 text-(--text-secondary)">{comment.content}</p></article>)}</div>
    </section>}

    <div className="mt-7 space-y-6">
      {comments.length ? comments.map((comment) => <article key={comment.id} className="border-b border-(--border-strong) pb-6"><div className="flex items-start gap-3"><span className={`grid size-11 shrink-0 place-items-center rounded-full text-[14px] font-black ${comment.commenter.color}`}>{comment.commenter.initials}</span><div className="min-w-0 flex-1"><h3 className="text-[14px] font-black text-(--public-ink)">{comment.commenter.name}</h3><time className="mt-1 block text-[12px] text-(--text-muted)">{new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(comment.createdAt))}</time><p className="mt-3 whitespace-pre-wrap text-[15px] leading-8 text-(--text-secondary)">{comment.content}</p><div className="mt-3 flex gap-4"><button type="button" onClick={() => toggleLike(comment.id)} aria-pressed={liked.has(comment.id)} title="پسند در مرورگر شما ثبت می‌شود" className={`flex min-h-11 items-center gap-1.5 text-[13px] font-bold ${liked.has(comment.id) ? "text-(--danger)" : "text-(--text-muted)"}`}><Heart size={14} fill={liked.has(comment.id) ? "currentColor" : "none"}/>{(comment.likes + Number(liked.has(comment.id))).toLocaleString("fa-IR")}</button><button type="button" onClick={() => { setReplyTo({ id: comment.id, name: comment.commenter.name }); document.getElementById("comment-content")?.focus(); }} className="flex min-h-11 items-center gap-1.5 text-[13px] font-bold text-(--text-muted) hover:text-(--editorial-coral)"><MessageSquareReply size={14}/> پاسخ</button></div></div></div></article>) : <p className="rounded-(--radius-lg) bg-(--public-paper-deep) p-6 text-center text-[14px] text-(--text-muted)">هنوز دیدگاه تأییدشده‌ای برای این مقاله ثبت نشده است.</p>}
    </div>

    <div className="mt-12 rounded-[20px] border border-(--border) bg-white p-5 shadow-[0_12px_38px_rgba(16,42,58,.05)] sm:p-7"><h3 className="text-lg font-black text-(--public-ink)">دیدگاه خود را بنویسید</h3><p className="mt-2 text-[13px] leading-6 text-(--text-muted)">دیدگاه شما در پایگاه داده ذخیره و پس از بررسی تحریریه منتشر می‌شود. ایمیل شما هرگز نمایش عمومی داده نخواهد شد.</p>
      {success && <div role="status" className="mt-5 flex items-start gap-2 rounded-(--radius-sm) bg-(--accent-soft) p-4 text-[13px] font-bold leading-6 text-(--brand-teal)"><CheckCircle2 className="mt-0.5 shrink-0" size={16}/> دیدگاه با موفقیت ذخیره شد. وضعیت آن پس از تازه‌سازی صفحه نیز در بخش «دیدگاه‌های ثبت‌شده شما» باقی می‌ماند.</div>}
      {errors.form && <p role="alert" className="mt-4 rounded-(--radius-sm) bg-(--danger-soft) p-3 text-[12px] font-bold text-(--danger)">{errors.form}</p>}
      <form onSubmit={submit} noValidate className="mt-6"><div className="grid gap-4 sm:grid-cols-2"><Field id="comment-name" label="نام شما" error={errors.name}><input id="comment-name" autoComplete="name" required minLength={2} maxLength={80} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "comment-name-error" : undefined} value={name} onChange={(event) => { setName(event.target.value); setErrors((current) => ({ ...current, name: "", form: "" })); }} className={inputClass}/></Field><Field id="comment-email" label="ایمیل شما" error={errors.email}><input id="comment-email" dir="ltr" type="email" inputMode="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "comment-email-error" : "comment-email-help"} value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: "", form: "" })); }} className={`${inputClass} text-left`}/><span id="comment-email-help" className="mt-1 block text-[11px] text-(--text-muted)">فقط برای مدیریت دیدگاه استفاده می‌شود.</span></Field></div><div className="mt-4"><Field id="comment-content" label={replyTo ? `پاسخ به ${replyTo.name}` : "متن دیدگاه"} error={errors.content}><textarea id="comment-content" rows={5} required minLength={10} maxLength={maxContentLength} aria-invalid={Boolean(errors.content)} aria-describedby={`${errors.content ? "comment-content-error " : ""}comment-content-help`} value={content} onChange={(event) => { setContent(event.target.value); setErrors((current) => ({ ...current, content: "", form: "" })); }} placeholder="دیدگاه خود را روشن و مرتبط با موضوع مقاله بنویسید..." className={`${inputClass} h-auto resize-y py-3 leading-7`}/><span id="comment-content-help" className={`mt-1 block text-[12px] ${content.length > maxContentLength * .9 ? "text-(--warning)" : "text-(--text-muted)"}`}>{content.length.toLocaleString("fa-IR")} از {maxContentLength.toLocaleString("fa-IR")} کاراکتر</span></Field></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3">{replyTo ? <button type="button" onClick={() => setReplyTo(null)} className="min-h-11 text-[13px] font-bold text-(--text-muted)">لغو پاسخ</button> : <span/>}<button type="submit" disabled={submitting} className="flex min-h-11 items-center gap-2 rounded-full bg-(--public-ink) px-6 text-[13px] font-black text-white hover:bg-(--editorial-coral) disabled:cursor-not-allowed disabled:opacity-60"><Send size={14}/> {submitting ? "در حال ارسال..." : "ارسال دیدگاه"}</button></div></form>
    </div>
  </section>;
}

const inputClass = "mt-2 h-12 w-full rounded-(--radius-sm) border border-(--border-strong) bg-(--public-paper) px-3 text-[14px] text-(--text-secondary) outline-none focus:border-(--editorial-coral) focus:bg-white";
function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return <label htmlFor={id} className="block"><span className="text-[13px] font-bold text-(--text-secondary)">{label}</span>{children}{error && <span id={`${id}-error`} role="alert" className="mt-1 block text-[12px] text-(--danger)">{error}</span>}</label>;
}

function OwnCommentsSkeleton() {
  return <div aria-busy="true" aria-live="polite" className="mt-7 rounded-(--radius-lg) border border-(--warning-border) bg-(--warning-soft) p-4 sm:p-5">
    <span className="sr-only">در حال بازیابی دیدگاه‌های ثبت‌شده شما</span>
    <div className="flex items-center gap-2"><Skeleton className="size-4 rounded-full"/><Skeleton className="h-3.5 w-40 rounded"/></div>
    <Skeleton className="mt-3 h-3 w-3/4 max-w-md rounded"/>
    <div className="mt-4 rounded-(--radius-sm) border border-white/80 bg-white/80 p-4"><div className="flex justify-between gap-3"><Skeleton className="h-3 w-24 rounded"/><Skeleton className="h-6 w-24 rounded-full"/></div><Skeleton className="mt-4 h-3 w-full rounded"/><Skeleton className="mt-2 h-3 w-2/3 rounded"/></div>
  </div>;
}
