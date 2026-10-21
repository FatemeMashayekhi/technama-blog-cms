"use client";

import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type ToastTone = "success" | "error" | "info";
type ToastInput = { message: string; tone?: ToastTone; duration?: number };
type ToastItem = Required<ToastInput> & { id: number };
type ToastContextValue = { toast: (input: string | ToastInput) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const dismiss = useCallback((id: number) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const toast = useCallback((input: string | ToastInput) => {
    const value = typeof input === "string" ? { message: input } : input;
    const message = value.message.trim();
    if (!message) return;
    const id = ++nextId.current;
    const item: ToastItem = { id, message, tone: value.tone ?? "info", duration: value.duration ?? 4200 };
    setItems((current) => [...current.filter((existing) => existing.message !== message), item].slice(-4));
    window.setTimeout(() => dismiss(id), item.duration);
  }, [dismiss]);
  useEffect(() => { const handler = (event: Event) => toast((event as CustomEvent<ToastInput>).detail); window.addEventListener("technama:toast", handler); return () => window.removeEventListener("technama:toast", handler); }, [toast]);
  const context = useMemo(() => ({ toast }), [toast]);

  return <ToastContext.Provider value={context}>
    {children}
    <div className="pointer-events-none fixed inset-x-3 bottom-4 z-[120] flex flex-col items-end gap-2 sm:inset-x-auto sm:left-5" aria-live="polite" aria-atomic="false">
      {items.map((item) => {
        const Icon = item.tone === "success" ? CheckCircle2 : item.tone === "error" ? CircleAlert : Info;
        return <div key={item.id} role={item.tone === "error" ? "alert" : "status"} className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-(--radius-sm) border px-4 py-3.5 text-[13px] font-bold shadow-[0_16px_44px_rgba(16,35,49,.2)] sm:w-88 ${item.tone === "error" ? "border-(--danger-border) bg-[#fff7f6] text-(--danger)" : item.tone === "success" ? "border-[#b8ded7] bg-[#f3fbf9] text-(--brand-teal)" : "border-(--border-strong) bg-(--brand-navy) text-white"}`}>
          <Icon size={18} className="mt-0.5 shrink-0" />
          <span className="min-w-0 flex-1 leading-6">{item.message}</span>
          <button type="button" onClick={() => dismiss(item.id)} aria-label="بستن پیام" className="grid size-10 shrink-0 place-items-center rounded-lg opacity-70 hover:bg-black/5 hover:opacity-100"><X size={15}/></button>
        </div>;
      })}
    </div>
  </ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

export function dispatchToast(input: ToastInput) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("technama:toast", { detail: input }));
}
