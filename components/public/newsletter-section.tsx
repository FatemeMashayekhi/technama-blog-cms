"use client";

import { CheckCircle2, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState(""); const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); const [submitting, setSubmitting] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return setError("وارد کردن ایمیل الزامی است.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("یک ایمیل معتبر وارد کنید.");
    setError(""); setSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const result = await response.json() as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "عضویت انجام نشد.");
      setSuccess(true); setEmail("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "عضویت انجام نشد."); }
    finally { setSubmitting(false); }
  };
  return <section className="mx-auto max-w-360 px-4 pb-14 md:px-7 md:pb-18"><div className="overflow-hidden rounded-(--radius-lg) bg-(--brand-navy) px-5 py-9 text-white sm:px-9 lg:flex lg:items-center lg:justify-between lg:gap-10"><div className="max-w-xl"><span className="grid size-10 place-items-center rounded-(--radius) bg-white/10 text-(--text-on-dark-muted)"><Mail size={18}/></span><h2 className="mt-4 text-xl font-bold tracking-[-.03em]">تازه‌های فناوری را از دست ندهید</h2><p className="mt-2 text-[13px] leading-6 text-white/65">خلاصه مهم‌ترین مقاله‌ها را مستقیم در ایمیل خود دریافت کنید.</p></div><div className="mt-6 w-full max-w-lg lg:mt-0">{success ? <div role="status" className="flex min-h-13 items-center gap-2 rounded-(--radius) border border-(--border-strong)/40 bg-white/10 px-4 text-[13px] font-bold text-(--text-on-dark-muted)"><CheckCircle2 size={16}/> عضویت شما با موفقیت ثبت شد.</div> : <form onSubmit={submit} noValidate><div className="flex flex-col gap-2 sm:flex-row"><label className="sr-only" htmlFor="newsletter-email">ایمیل شما</label><input id="newsletter-email" dir="ltr" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="ایمیل شما" aria-invalid={Boolean(error)} aria-describedby={error ? "newsletter-error" : undefined} className="h-12 min-w-0 flex-1 rounded-(--radius-sm) border border-white/15 bg-white px-4 text-left text-[14px] text-(--text-strong) outline-none placeholder:text-(--text-faint)"/><button type="submit" disabled={submitting} className="h-12 rounded-(--radius-sm) bg-(--accent-soft) px-6 text-[13px] font-bold text-(--brand-teal) hover:bg-white disabled:opacity-60">{submitting ? "در حال ثبت..." : "عضویت"}</button></div>{error && <p id="newsletter-error" role="alert" className="mt-2 text-[12px] text-(--text-on-dark)">{error}</p>}</form>}<p className="mt-2 text-[14px] text-white/45">بدون اسپم؛ لغو عضویت در هر زمان ممکن است.</p></div></div></section>;
}
