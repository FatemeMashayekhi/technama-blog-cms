"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Save, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export type EditableProfile = { displayName: string; username: string; email: string; avatarUrl: string; bio: string; role: "admin" | "editor" | "author" };
type Errors = Partial<Record<"displayName" | "username" | "avatarUrl" | "bio" | "form", string>>;
const roleLabels = { admin: "مدیر", editor: "ویراستار", author: "نویسنده" };
const fieldClass = "mt-2 h-12 w-full rounded-(--radius-sm) border border-(--border) bg-white px-3 text-[14px] text-(--text-strong) outline-none transition focus:border-(--focus-border) disabled:cursor-not-allowed disabled:bg-(--surface-subtle) disabled:text-(--text-muted)";

export function ProfileForm({ initialProfile, configured }: { initialProfile: EditableProfile; configured: boolean }) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const dirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(initialProfile), [initialProfile, profile]);
  const initials = profile.displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("") || "ک";

  useEffect(() => { const beforeUnload = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); }; window.addEventListener("beforeunload", beforeUnload); return () => window.removeEventListener("beforeunload", beforeUnload); }, [dirty]);

  const update = (key: keyof EditableProfile, value: string) => { setProfile((current) => ({ ...current, [key]: value })); setState("idle"); setErrors((current) => ({ ...current, [key]: undefined, form: undefined })); };
  const validate = () => { const next: Errors = {}; if (profile.displayName.trim().length < 2) next.displayName = "نام نمایشی باید دست‌کم ۲ کاراکتر باشد."; if (!/^[a-zA-Z0-9._-]{3,40}$/.test(profile.username.trim())) next.username = "۳ تا ۴۰ کاراکتر انگلیسی، عدد، نقطه، خط تیره یا زیرخط وارد کنید."; if (profile.avatarUrl && !/^https?:\/\//i.test(profile.avatarUrl)) next.avatarUrl = "آدرس تصویر باید با http یا https شروع شود."; if (profile.bio.trim().length > 500) next.bio = "معرفی کوتاه نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد."; return next; };
  const submit = async (event: FormEvent) => { event.preventDefault(); const next = validate(); setErrors(next); if (Object.keys(next).length || !configured || !dirty) return; setState("saving"); try { const response = await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ displayName: profile.displayName.trim(), username: profile.username.trim(), avatarUrl: profile.avatarUrl.trim() || null, bio: profile.bio.trim() }) }); const result = await response.json() as { ok: boolean; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error || "ذخیره پروفایل انجام نشد."); setState("saved"); router.refresh(); } catch (error) { setState("idle"); setErrors({ form: error instanceof Error ? error.message : "ذخیره پروفایل انجام نشد." }); } };

  return <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,760px)]">
    <aside className="rounded-(--radius) border border-(--border) bg-white p-6 text-center xl:sticky xl:top-26 xl:self-start">
      <div className="mx-auto grid size-24 place-items-center overflow-hidden rounded-full bg-(--surface-muted) text-2xl font-black text-(--brand-teal)" style={profile.avatarUrl ? { backgroundImage: `url(${profile.avatarUrl})`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}>{profile.avatarUrl ? <span className="sr-only">تصویر پروفایل {profile.displayName}</span> : initials}</div>
      <h2 className="mt-4 text-lg font-bold text-(--text-strong)">{profile.displayName}</h2><p dir="ltr" className="mt-1 text-[13px] text-(--text-muted)">@{profile.username}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-(--accent-soft) px-3 py-1.5 text-[12px] font-bold text-(--brand-teal)"><ShieldCheck size={14}/>{roleLabels[profile.role]}</span>
      <p className="mt-5 border-t border-(--border-subtle) pt-5 text-[12px] leading-6 text-(--text-muted)">نقش و سطح دسترسی فقط توسط مدیر سامانه قابل تغییر است.</p>
    </aside>
    <form onSubmit={submit} noValidate className="rounded-(--radius) border border-(--border) bg-white p-5 sm:p-7">
      <div className="flex items-start gap-3 border-b border-(--border-subtle) pb-5"><span className="grid size-11 shrink-0 place-items-center rounded-(--radius-sm) bg-(--surface-muted) text-(--brand-teal)"><UserRound size={19}/></span><div><h1 className="text-lg font-bold text-(--text-strong)">پروفایل من</h1><p className="mt-1 text-[13px] leading-6 text-(--text-muted)">اطلاعات عمومی حساب و هویت نویسندگی خود را مدیریت کنید.</p></div></div>
      {!configured && <p className="mt-5 rounded-(--radius-sm) bg-(--warning-soft) p-3 text-[12px] leading-6 text-(--text-secondary)">این صفحه در حالت نمایشی است. برای ذخیره واقعی، اتصال Supabase را فعال کنید.</p>}
      {errors.form && <p role="alert" className="mt-5 rounded-(--radius-sm) bg-(--danger-soft) p-3 text-[12px] font-bold text-(--danger)">{errors.form}</p>}
      <div className="mt-6 grid gap-5 sm:grid-cols-2"><ProfileField id="profile-name" label="نام نمایشی" error={errors.displayName}><input id="profile-name" value={profile.displayName} maxLength={100} onChange={(event) => update("displayName", event.target.value)} aria-invalid={Boolean(errors.displayName)} aria-describedby={errors.displayName ? "profile-name-error" : undefined} className={fieldClass}/></ProfileField><ProfileField id="profile-username" label="نام کاربری" error={errors.username}><input id="profile-username" dir="ltr" value={profile.username} maxLength={40} onChange={(event) => update("username", event.target.value)} aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? "profile-username-error" : undefined} className={`${fieldClass} text-left`}/></ProfileField><ProfileField id="profile-email" label="ایمیل حساب"><input id="profile-email" dir="ltr" value={profile.email} readOnly aria-readonly="true" className={`${fieldClass} text-left`}/></ProfileField><ProfileField id="profile-role" label="نقش"><input id="profile-role" value={roleLabels[profile.role]} readOnly aria-readonly="true" className={fieldClass}/></ProfileField></div>
      <div className="mt-5"><ProfileField id="profile-avatar" label="آدرس تصویر پروفایل" error={errors.avatarUrl}><input id="profile-avatar" dir="ltr" type="url" value={profile.avatarUrl} onChange={(event) => update("avatarUrl", event.target.value)} aria-invalid={Boolean(errors.avatarUrl)} aria-describedby={errors.avatarUrl ? "profile-avatar-error" : "profile-avatar-help"} placeholder="https://example.com/avatar.jpg" className={`${fieldClass} text-left`}/><span id="profile-avatar-help" className="mt-1.5 block text-[12px] text-(--text-muted)">تصویر امن با آدرس HTTPS استفاده کنید.</span></ProfileField></div>
      <div className="mt-5"><ProfileField id="profile-bio" label="معرفی کوتاه" error={errors.bio}><textarea id="profile-bio" value={profile.bio} maxLength={500} rows={5} onChange={(event) => update("bio", event.target.value)} aria-invalid={Boolean(errors.bio)} aria-describedby={errors.bio ? "profile-bio-error" : "profile-bio-help"} className={`${fieldClass} h-auto resize-y py-3 leading-7`}/><span id="profile-bio-help" className="mt-1.5 block text-[12px] text-(--text-muted)">{profile.bio.length.toLocaleString("fa-IR")} از ۵۰۰ کاراکتر</span></ProfileField></div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-(--border-subtle) pt-5"><span aria-live="polite" className="flex min-h-10 items-center gap-2 text-[12px] text-(--text-muted)">{state === "saved" ? <><CheckCircle2 size={15} className="text-(--brand-teal)"/> تغییرات با موفقیت ذخیره شد.</> : dirty ? "تغییرات ذخیره‌نشده دارید." : "پروفایل به‌روز است."}</span><button type="submit" disabled={!configured || !dirty || state === "saving"} className="flex min-h-11 items-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{state === "saving" ? <LoaderCircle size={16} className="animate-spin"/> : <Save size={16}/>} ذخیره تغییرات</button></div>
    </form>
  </div>;
}

function ProfileField({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) { return <label htmlFor={id} className="block"><span className="text-[13px] font-bold text-(--text-secondary)">{label}</span>{children}{error && <span id={`${id}-error`} role="alert" className="mt-1.5 block text-[12px] text-(--danger)">{error}</span>}</label>; }
