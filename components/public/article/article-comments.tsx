"use client";

import { CheckCircle2, Heart, MessageSquareReply, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { MagazineComment } from "@/lib/comments-data";

type LocalComment = { id: string; name: string; content: string; replyTo: string | null };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ArticleComments({ articleId, comments }: { articleId: string; comments: MagazineComment[] }) {
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({}); const [localComments, setLocalComments] = useState<LocalComment[]>([]);
  const [success, setSuccess] = useState(false); const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSuccess(false);
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "وارد کردن نام الزامی است.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "یک ایمیل معتبر وارد کنید.";
    if (content.trim().length < 5) next.content = "دیدگاه باید حداقل ۵ کاراکتر باشد.";
    setErrors(next); if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      if (uuidPattern.test(articleId)) {
        const response = await fetch("/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ articleId, parentId: replyTo?.id ?? null, name: name.trim(), email, content: content.trim(), website: "" }) });
        const result = await response.json() as { ok: boolean; error?: string };
        if (!response.ok || !result.ok) throw new Error(result.error || "ثبت دیدگاه انجام نشد.");
      }
      setLocalComments((items) => [{ id: `local-${Date.now()}`, name: name.trim(), content: content.trim(), replyTo: replyTo?.name ?? null }, ...items]);
      setSuccess(true); setName(""); setEmail(""); setContent(""); setReplyTo(null);
    } catch (error) { setErrors({ form: error instanceof Error ? error.message : "ثبت دیدگاه انجام نشد." }); }
    finally { setSubmitting(false); }
  };
  const toggleLike = (id: string) => setLiked((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  return <section className="mx-auto max-w-3xl px-4 py-14 md:px-7 md:py-18" id="comments">
    <div className="editorial-rule flex items-end justify-between border-b border-(--border-strong) pb-5"><div><p className="editorial-kicker">گفت‌وگوی خوانندگان</p><h2 className="mt-2 text-[27px] font-black text-(--public-ink)">دیدگاه‌ها</h2></div><span className="text-[13px] text-(--text-muted)">{(comments.length + localComments.length).toLocaleString("fa-IR")} دیدگاه</span></div>
    <div className="mt-7 space-y-6">
      {localComments.map((comment) => <article key={comment.id} className="rounded-(--radius-lg) border border-(--editorial-coral)/30 bg-white p-5"><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f8ded7] text-[14px] font-black text-(--editorial-coral)">{comment.name.slice(0, 2)}</span><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-[14px] font-black text-(--public-ink)">{comment.name}</h3><span className="rounded-full bg-(--public-paper-deep) px-2 py-0.5 text-[11px] font-bold text-(--text-muted)">در انتظار بررسی</span></div>{comment.replyTo && <p className="mt-1 text-[12px] text-(--text-muted)">پاسخ به {comment.replyTo}</p>}<p className="mt-3 text-[15px] leading-8 text-(--text-secondary)">{comment.content}</p></div></div></article>)}
      {comments.length ? comments.map((comment) => <article key={comment.id} className="border-b border-(--border-strong) pb-6"><div className="flex items-start gap-3"><span className={`grid size-11 shrink-0 place-items-center rounded-full text-[14px] font-black ${comment.commenter.color}`}>{comment.commenter.initials}</span><div className="min-w-0 flex-1"><h3 className="text-[14px] font-black text-(--public-ink)">{comment.commenter.name}</h3><time className="mt-1 block text-[12px] text-(--text-muted)">{new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(comment.createdAt))}</time><p className="mt-3 text-[15px] leading-8 text-(--text-secondary)">{comment.content}</p><div className="mt-3 flex gap-4"><button type="button" onClick={() => toggleLike(comment.id)} aria-pressed={liked.has(comment.id)} title="پسند در مرورگر شما ثبت می‌شود" className={`flex min-h-11 items-center gap-1.5 text-[13px] font-bold ${liked.has(comment.id) ? "text-(--danger)" : "text-(--text-muted)"}`}><Heart size={14} fill={liked.has(comment.id) ? "currentColor" : "none"}/>{(comment.likes + Number(liked.has(comment.id))).toLocaleString("fa-IR")}</button><button type="button" onClick={() => { setReplyTo({ id: comment.id, name: comment.commenter.name }); document.getElementById("comment-content")?.focus(); }} className="flex min-h-11 items-center gap-1.5 text-[13px] font-bold text-(--text-muted) hover:text-(--editorial-coral)"><MessageSquareReply size={14}/> پاسخ</button></div></div></div></article>) : !localComments.length && <p className="rounded-(--radius-lg) bg-(--public-paper-deep) p-6 text-center text-[14px] text-(--text-muted)">هنوز دیدگاه تأییدشده‌ای برای این مقاله ثبت نشده است.</p>}
    </div>
    <div className="mt-12 rounded-[20px] border border-(--border) bg-white p-5 shadow-[0_12px_38px_rgba(16,42,58,.05)] sm:p-7"><h3 className="text-lg font-black text-(--public-ink)">دیدگاه خود را بنویسید</h3><p className="mt-2 text-[13px] leading-6 text-(--text-muted)">دیدگاه شما پس از بررسی تحریریه منتشر می‌شود. ایمیل شما نمایش عمومی داده نخواهد شد.</p>
      {success && <div role="status" className="mt-5 flex items-start gap-2 rounded-(--radius-sm) bg-(--accent-soft) p-4 text-[13px] font-bold leading-6 text-(--brand-teal)"><CheckCircle2 className="mt-0.5 shrink-0" size={16}/> دیدگاه با موفقیت ثبت شد و در انتظار بررسی است.</div>}
      {errors.form && <p role="alert" className="mt-4 rounded-(--radius-sm) bg-(--danger-soft) p-3 text-[12px] font-bold text-(--danger)">{errors.form}</p>}
      <form onSubmit={submit} noValidate className="mt-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="نام شما" error={errors.name}><input value={name} onChange={(event) => { setName(event.target.value); setErrors({ ...errors, name: "", form: "" }); }} className={inputClass}/></Field><Field label="ایمیل شما" error={errors.email}><input dir="ltr" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setErrors({ ...errors, email: "", form: "" }); }} className={`${inputClass} text-left`}/></Field></div><div className="mt-4"><Field label={replyTo ? `پاسخ به ${replyTo.name}` : "متن دیدگاه"} error={errors.content}><textarea id="comment-content" rows={5} value={content} onChange={(event) => { setContent(event.target.value); setErrors({ ...errors, content: "", form: "" }); }} placeholder="دیدگاه خود را بنویسید..." className={`${inputClass} h-auto resize-none py-3 leading-7`}/></Field></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3">{replyTo ? <button type="button" onClick={() => setReplyTo(null)} className="min-h-11 text-[13px] font-bold text-(--text-muted)">لغو پاسخ</button> : <span/>}<button type="submit" disabled={submitting} className="flex min-h-11 items-center gap-2 rounded-full bg-(--public-ink) px-6 text-[13px] font-black text-white hover:bg-(--editorial-coral) disabled:opacity-60"><Send size={14}/> {submitting ? "در حال ارسال..." : "ارسال دیدگاه"}</button></div></form>
    </div>
  </section>;
}

const inputClass = "mt-2 h-12 w-full rounded-(--radius-sm) border border-(--border-strong) bg-(--public-paper) px-3 text-[14px] text-(--text-secondary) outline-none focus:border-(--editorial-coral) focus:bg-white";
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block"><span className="text-[13px] font-bold text-(--text-secondary)">{label}</span>{children}{error && <span role="alert" className="mt-1 block text-[12px] text-(--danger)">{error}</span>}</label>; }
