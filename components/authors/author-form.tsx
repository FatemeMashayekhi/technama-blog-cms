"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AtSign, BriefcaseBusiness, Camera, Check, Code2, Globe2, LoaderCircle, Save } from "lucide-react";
import { roleLabels, saveMockAuthor, validateAuthor, type AuthorFormData, type AuthorFormErrors, type AuthorRole, type AuthorStatus } from "@/lib/authors-data";

const inputClass = "mt-1.5 h-11 w-full rounded-(--radius-sm) border border-(--border) bg-(--surface-subtle) px-3 text-[14px] text-(--text-secondary) outline-none transition-colors focus:border-(--focus-border) focus:bg-white";

export function AuthorForm({ mode, initialData, editingId }: { mode: "create" | "edit"; initialData: AuthorFormData; editingId?: string }) {
  const router = useRouter();
  const avatarInput = useRef<HTMLInputElement>(null);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<AuthorFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const setField = <K extends keyof AuthorFormData>(key: K, value: AuthorFormData[K]) => { setData((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); };
  const initials = data.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("") || "ن";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateAuthor(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { document.getElementById("author-name")?.focus(); return; }
    setSaving(true);
    try { await saveMockAuthor(data, mode === "create", editingId); }
    catch (error) { setSaving(false); setNotice(error instanceof Error ? error.message : "ذخیره نویسنده انجام نشد."); return; }
    setSaving(false);
    setNotice(mode === "create" ? "نویسنده با موفقیت ایجاد شد." : "اطلاعات نویسنده با موفقیت به‌روزرسانی شد.");
    window.setTimeout(() => router.push("/admin/authors"), 900);
  };

  const uploadAvatar = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => setField("avatar", String(reader.result)); reader.readAsDataURL(file); };
  const socialFields = [{ key: "website", label: "وب‌سایت", icon: Globe2, placeholder: "https://example.com" }, { key: "linkedin", label: "LinkedIn", icon: BriefcaseBusiness, placeholder: "linkedin.com/in/username" }, { key: "twitter", label: "X / Twitter", icon: AtSign, placeholder: "x.com/username" }, { key: "github", label: "GitHub", icon: Code2, placeholder: "github.com/username" }] as const;

  return <form onSubmit={submit} noValidate>
    <header className="mb-6 flex flex-col gap-4 border-b border-(--border) pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-[13px] font-bold text-(--accent)">تیم تحریریه</p><h2 className="text-xl font-bold tracking-[-.03em] text-(--text-strong) sm:text-2xl">{mode === "create" ? "افزودن نویسنده" : "ویرایش نویسنده"}</h2><p className="mt-2 text-xs text-(--muted)">{mode === "create" ? "یک عضو جدید به تیم تحریریه اضافه کنید" : "اطلاعات نویسنده را به‌روزرسانی کنید"}</p></div><div className="flex gap-2"><Link href="/admin/authors" className="flex h-10 items-center rounded-(--radius-sm) border border-(--border) bg-white px-4 text-[13px] font-bold text-(--text-secondary) hover:bg-(--surface-subtle)">انصراف</Link><button type="submit" disabled={saving} className="flex h-10 items-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-4 text-[13px] font-bold text-white hover:bg-(--brand-navy-hover) disabled:opacity-60">{saving ? <LoaderCircle size={14} className="animate-spin" /> : <Save size={14} />}{saving ? "در حال ذخیره..." : mode === "create" ? "ذخیره" : "ذخیره تغییرات"}</button></div></header>
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <main className="space-y-4">
        <section className="rounded-(--radius) border border-(--border) bg-white p-5 sm:p-6"><h3 className="text-xs font-bold text-(--text-strong)">اطلاعات پایه</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-[13px] font-bold text-(--text-secondary)">نام و نام خانوادگی<input id="author-name" value={data.name} onChange={(event) => setField("name", event.target.value)} className={`${inputClass} ${errors.name ? "border-(--danger-border)" : ""}`} placeholder="مثلاً مریم احمدی" />{errors.name && <span className="mt-1 block text-[12px] text-(--danger)">{errors.name}</span>}</label><label className="text-[13px] font-bold text-(--text-secondary)">نام کاربری<div className="relative"><span className="absolute right-3 top-[17px] text-[14px] text-(--text-muted)">@</span><input dir="ltr" value={data.username} onChange={(event) => setField("username", event.target.value.replace(/^@/, ""))} className={`${inputClass} pr-7 text-left ${errors.username ? "border-(--danger-border)" : ""}`} placeholder="maryam" /></div>{errors.username && <span className="mt-1 block text-[12px] text-(--danger)">{errors.username}</span>}</label><label className="text-[13px] font-bold text-(--text-secondary) sm:col-span-2">ایمیل<input dir="ltr" type="email" value={data.email} onChange={(event) => setField("email", event.target.value)} className={`${inputClass} text-left ${errors.email ? "border-(--danger-border)" : ""}`} placeholder="author@technama.ir" />{errors.email && <span className="mt-1 block text-[12px] text-(--danger)">{errors.email}</span>}</label><label className="text-[13px] font-bold text-(--text-secondary) sm:col-span-2">درباره نویسنده<textarea value={data.bio} onChange={(event) => setField("bio", event.target.value)} rows={5} maxLength={320} className={`mt-1.5 w-full resize-none rounded-(--radius-sm) border bg-(--surface-subtle) p-3 text-[14px] leading-6 outline-none focus:border-(--focus-border) ${errors.bio ? "border-(--danger-border)" : "border-(--border)"}`} placeholder="درباره نویسنده بنویسید..." /><span className="mt-1 flex justify-between text-[14px] font-normal text-(--text-muted)"><span>{errors.bio && <span className="text-(--danger)">{errors.bio}</span>}</span><span>{new Intl.NumberFormat("fa-IR").format(data.bio.length)}/۳۲۰</span></span></label></div></section>
        <section className="rounded-(--radius) border border-(--border) bg-white p-5 sm:p-6"><h3 className="text-xs font-bold text-(--text-strong)">لینک‌های اجتماعی <span className="mr-1 text-[12px] font-normal text-(--text-muted)">اختیاری</span></h3><div className="mt-5 grid gap-4 sm:grid-cols-2">{socialFields.map((field) => <label key={field.key} className="text-[13px] font-bold text-(--text-secondary)"><span className="flex items-center gap-1.5"><field.icon size={13} />{field.label}</span><input dir="ltr" value={data.socialLinks[field.key]} onChange={(event) => setField("socialLinks", { ...data.socialLinks, [field.key]: event.target.value })} className={`${inputClass} text-left`} placeholder={field.placeholder} /></label>)}</div></section>
      </main>
      <aside className="space-y-4"><section className="rounded-(--radius) border border-(--border) bg-white p-5"><h3 className="text-xs font-bold text-(--text-strong)">تصویر پروفایل</h3><input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={(event) => uploadAvatar(event.target.files?.[0])} /><button type="button" onClick={() => avatarInput.current?.click()} className="mx-auto mt-5 block"><span className="relative grid size-24 place-items-center overflow-hidden rounded-full bg-(--surface-muted) text-xl font-bold text-(--brand-teal)">{data.avatar ? <span className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${data.avatar})` }} /> : initials}<span className="absolute bottom-0 grid h-7 w-full place-items-center bg-(--brand-navy)/85 text-white"><Camera size={13} /></span></span></button><p className="mt-3 text-center text-[14px] leading-4 text-(--text-muted)">JPG یا PNG، حداکثر ۲ مگابایت</p></section>
        <section className="rounded-(--radius) border border-(--border) bg-white p-5"><h3 className="text-xs font-bold text-(--text-strong)">دسترسی و وضعیت</h3><div className="mt-5 space-y-4"><label className="block text-[13px] font-bold text-(--text-secondary)">نقش<select value={data.role} onChange={(event) => setField("role", event.target.value as AuthorRole)} className={inputClass}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><fieldset><legend className="mb-2 text-[13px] font-bold text-(--text-secondary)">وضعیت</legend><div className="grid grid-cols-2 gap-2">{(["active", "inactive"] as AuthorStatus[]).map((item) => <label key={item} className={`flex cursor-pointer items-center justify-center gap-2 rounded-(--radius-sm) border px-2 py-3 text-[13px] font-bold ${data.status === item ? "border-(--border-strong) bg-(--accent-soft) text-(--brand-teal)" : "border-(--border) text-(--text-secondary)"}`}><input type="radio" className="sr-only" checked={data.status === item} onChange={() => setField("status", item)} />{data.status === item && <Check size={12} />}{item === "active" ? "فعال" : "غیرفعال"}</label>)}</div></fieldset></div></section></aside>
    </div>{notice && <div className="fixed bottom-5 left-5 z-[90] rounded-(--radius-sm) bg-(--brand-navy) px-4 py-3 text-[13px] font-bold text-white shadow-[0_10px_30px_rgba(16,35,49,.2)]" role="status"><Check size={13} className="ml-1 inline" />{notice}</div>}
  </form>;
}
