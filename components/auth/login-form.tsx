"use client";

import { useActionState, useState } from "react";
import { LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { signIn, signUp, type AuthActionState } from "@/app/login/actions";

const initialState: AuthActionState = { error: "" };
const inputClass = "h-12 w-full rounded-(--radius-sm) border border-(--border) bg-white px-11 text-sm outline-none focus:border-(--focus-border)";

export function LoginForm({ next, allowSignup, configured }: { next: string; allowSignup: boolean; configured: boolean }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState(signIn, initialState);
  const [signupState, signupAction, signupPending] = useActionState(signUp, initialState);
  const state = mode === "login" ? loginState : signupState;
  const pending = loginPending || signupPending;
  return <div className="w-full max-w-md rounded-[22px] border border-(--border) bg-white p-6 shadow-[0_24px_70px_rgba(16,42,58,.12)] sm:p-8">
    <div className="text-center"><span className="mx-auto grid size-12 place-items-center rounded-(--radius) bg-(--brand-navy) text-white"><LockKeyhole size={21}/></span><h1 className="mt-5 text-2xl font-black text-(--text-strong)">{mode === "login" ? "ورود به اتاق خبر" : "ساخت حساب اولیه"}</h1><p className="mt-2 text-sm leading-7 text-(--text-muted)">مدیریت امن محتوای تک‌نما</p></div>
    {!configured && <p className="mt-5 rounded-(--radius-sm) border border-(--warning-border) bg-(--warning-soft) p-3 text-xs leading-6 text-(--text-secondary)">Supabase هنوز تنظیم نشده است. مقادیر فایل <span dir="ltr">.env.local</span> را تکمیل کنید.</p>}
    <form action={mode === "login" ? loginAction : signupAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next}/>
      {mode === "signup" && <label className="relative block"><span className="mb-1.5 block text-xs font-bold text-(--text-secondary)">نام نمایشی</span><UserRound className="absolute right-3 top-9 text-(--text-muted)" size={17}/><input name="displayName" autoComplete="name" required className={inputClass}/></label>}
      <label className="relative block"><span className="mb-1.5 block text-xs font-bold text-(--text-secondary)">ایمیل</span><Mail className="absolute right-3 top-9 text-(--text-muted)" size={17}/><input dir="ltr" type="email" name="email" autoComplete="email" required className={`${inputClass} text-left`}/></label>
      <label className="relative block"><span className="mb-1.5 block text-xs font-bold text-(--text-secondary)">رمز عبور</span><LockKeyhole className="absolute right-3 top-9 text-(--text-muted)" size={17}/><input dir="ltr" type="password" name="password" minLength={mode === "signup" ? 8 : 6} autoComplete={mode === "login" ? "current-password" : "new-password"} required className={`${inputClass} text-left`}/></label>
      {state.error && <p role="status" className="rounded-(--radius-sm) bg-(--surface-subtle) p-3 text-xs font-bold leading-6 text-(--text-secondary)">{state.error}</p>}
      <button disabled={pending || !configured} className="flex h-12 w-full items-center justify-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) text-sm font-black text-white hover:bg-(--brand-navy-hover) disabled:opacity-50">{pending && <LoaderCircle size={17} className="animate-spin"/>}{mode === "login" ? "ورود" : "ایجاد حساب"}</button>
    </form>
    {allowSignup && <button type="button" onClick={() => setMode((value) => value === "login" ? "signup" : "login")} className="mt-5 min-h-11 w-full text-xs font-bold text-(--brand-teal)">{mode === "login" ? "اولین کاربر هستید؟ ساخت حساب مدیر" : "حساب دارید؟ وارد شوید"}</button>}
  </div>;
}
