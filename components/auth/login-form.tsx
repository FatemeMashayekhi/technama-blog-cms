"use client";

import { useActionState, useState } from "react";
import { Eye, LoaderCircle, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { signIn, signInDemo, signUp, type AuthActionState } from "@/app/login/actions";

const initialState: AuthActionState = { error: "" };
const inputClass = "h-12 w-full rounded-(--radius-sm) border border-(--border) bg-white px-11 text-sm outline-none focus:border-(--focus-border)";

export function LoginForm({ next, allowSignup, configured, demoEnabled }: { next: string; allowSignup: boolean; configured: boolean; demoEnabled: boolean }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState(signIn, initialState);
  const [signupState, signupAction, signupPending] = useActionState(signUp, initialState);
  const [demoState, demoAction, demoPending] = useActionState(signInDemo, initialState);
  const state = mode === "login" ? loginState : signupState;
  const pending = loginPending || signupPending || demoPending;
  return <div className="w-full max-w-md rounded-[22px] border border-(--border) bg-white p-6 shadow-[0_24px_70px_rgba(16,42,58,.12)] sm:p-8">
    <div className="text-center"><span className="mx-auto grid size-12 place-items-center rounded-(--radius) bg-(--brand-navy) text-white"><LockKeyhole size={21}/></span><h1 className="mt-5 text-2xl font-black text-(--text-strong)">{mode === "login" ? "ورود به اتاق خبر" : "ساخت حساب اولیه"}</h1><p className="mt-2 text-sm leading-7 text-(--text-muted)">مدیریت امن محتوای تک‌نما</p></div>
    {!configured && <p className="mt-5 rounded-(--radius-sm) border border-(--warning-border) bg-(--warning-soft) p-3 text-xs leading-6 text-(--text-secondary)">Supabase هنوز تنظیم نشده است. مقادیر فایل <span dir="ltr">.env.local</span> را تکمیل کنید.</p>}
    <form action={mode === "login" ? loginAction : signupAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next}/>
      {mode === "signup" && <label className="relative block"><span className="mb-1.5 block text-xs font-bold text-(--text-secondary)">نام نمایشی</span><UserRound className="absolute right-3 top-9 text-(--text-muted)" size={17}/><input name="displayName" autoComplete="name" required maxLength={100} aria-invalid={Boolean(state.fieldErrors?.displayName)} aria-describedby={state.fieldErrors?.displayName ? "auth-name-error" : undefined} className={inputClass}/>{state.fieldErrors?.displayName && <span id="auth-name-error" className="mt-1 block text-[12px] text-(--danger)">{state.fieldErrors.displayName}</span>}</label>}
      <label className="relative block"><span className="mb-1.5 block text-xs font-bold text-(--text-secondary)">ایمیل</span><Mail className="absolute right-3 top-9 text-(--text-muted)" size={17}/><input dir="ltr" type="email" name="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(state.fieldErrors?.email)} aria-describedby={state.fieldErrors?.email ? "auth-email-error" : undefined} className={`${inputClass} text-left`}/>{state.fieldErrors?.email && <span id="auth-email-error" className="mt-1 block text-[12px] text-(--danger)">{state.fieldErrors.email}</span>}</label>
      <label className="relative block"><span className="mb-1.5 block text-xs font-bold text-(--text-secondary)">رمز عبور</span><LockKeyhole className="absolute right-3 top-9 text-(--text-muted)" size={17}/><input dir="ltr" type="password" name="password" minLength={mode === "signup" ? 8 : 6} maxLength={200} autoComplete={mode === "login" ? "current-password" : "new-password"} required aria-invalid={Boolean(state.fieldErrors?.password)} aria-describedby={state.fieldErrors?.password ? "auth-password-error" : undefined} className={`${inputClass} text-left`}/>{state.fieldErrors?.password && <span id="auth-password-error" className="mt-1 block text-[12px] text-(--danger)">{state.fieldErrors.password}</span>}</label>
      {state.error && <p role="alert" className="rounded-(--radius-sm) bg-(--danger-soft) p-3 text-xs font-bold leading-6 text-(--danger)">{state.error}</p>}
      {state.success && <p role="status" className="rounded-(--radius-sm) bg-(--accent-soft) p-3 text-xs font-bold leading-6 text-(--brand-teal)">{state.success}</p>}
      <button disabled={pending || !configured} className="flex h-12 w-full items-center justify-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) text-sm font-black text-white hover:bg-(--brand-navy-hover) disabled:opacity-50">{pending && <LoaderCircle size={17} className="animate-spin"/>}{mode === "login" ? "ورود" : "ایجاد حساب"}</button>
    </form>
    {mode === "login" && demoEnabled && <div className="mt-5 border-t border-(--border-subtle) pt-5">
      <div className="rounded-(--radius) border border-(--accent-border) bg-(--accent-soft) p-4">
        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-(--brand-teal)"><ShieldCheck size={18}/></span><div><h2 className="text-[13px] font-black text-(--text-strong)">بازدید امن از پنل رزومه</h2><p className="mt-1 text-[12px] leading-6 text-(--text-secondary)">این حساب فقط امکان مشاهده دارد؛ ایجاد، ویرایش، حذف و تغییر تنظیمات برای آن غیرفعال است.</p></div></div>
        <form action={demoAction} className="mt-3"><button disabled={pending} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-(--radius-sm) border border-(--accent-border) bg-white px-4 text-[13px] font-black text-(--brand-teal) hover:bg-(--surface-subtle) disabled:opacity-50">{demoPending ? <LoaderCircle size={16} className="animate-spin"/> : <Eye size={16}/>} ورود به نسخه نمایشی</button></form>
        {demoState.error && <p role="alert" className="mt-2 text-[12px] font-bold leading-6 text-(--danger)">{demoState.error}</p>}
      </div>
    </div>}
    {allowSignup && <button type="button" onClick={() => setMode((value) => value === "login" ? "signup" : "login")} className="mt-5 min-h-11 w-full text-xs font-bold text-(--brand-teal)">{mode === "login" ? "اولین کاربر هستید؟ ساخت حساب مدیر" : "حساب دارید؟ وارد شوید"}</button>}
  </div>;
}
