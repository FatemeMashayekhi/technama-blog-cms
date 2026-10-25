"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Code2, Eye, FolderTree, MoreHorizontal, PenLine, Search, Sparkles, Tags, Trash2 } from "lucide-react";
import type { Category } from "@/lib/taxonomy-data";
import { taxonomyService } from "@/lib/taxonomy-service";
import { StatCard } from "@/components/dashboard/stat-card";
import { useToast } from "@/components/ui/toast-provider";
import { TaxonomyDeleteDialog } from "./confirm-dialog";
import { TaxonomySkeleton } from "./taxonomy-skeleton";
import { useDashboardSession } from "@/components/layout/dashboard-session-provider";

const iconMap = { Sparkles, Code2, FolderTree };

export function CategoriesManager() {
  const user = useDashboardSession();
  const [items, setItems] = useState<Category[]>([]);
  const [tagCount, setTagCount] = useState(0);
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const { toast } = useToast();
  useEffect(() => { let active = true; Promise.all([taxonomyService.categories(), taxonomyService.tags()]).then(([categories, tags]) => { if (!active) return; setItems(categories); setTagCount(tags.length); }).catch((cause) => { if (active) toast({ tone: "error", message: cause instanceof Error ? cause.message : "دریافت دسته‌بندی‌ها انجام نشد." }); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [toast]);
  const filtered = useMemo(() => { const term = query.trim().toLocaleLowerCase("fa"); return items.filter((item) => !term || [item.name, item.slug].some((value) => value.toLocaleLowerCase("fa").includes(term))); }, [items, query]);
  const top = [...items].sort((a, b) => b.articleCount - a.articleCount)[0];
  const number = new Intl.NumberFormat("fa-IR");
  const remove = async () => { if (!pending || mutating) return; setMutating(true); try { await taxonomyService.removeCategory(pending.id); setItems((current) => current.filter((item) => item.id !== pending.id)); setPending(null); toast({ tone: "success", message: "دسته‌بندی حذف شد." }); } catch (cause) { toast({ tone: "error", message: cause instanceof Error ? cause.message : "حذف دسته‌بندی انجام نشد." }); } finally { setMutating(false); } };
  if (loading) return <TaxonomySkeleton/>;
  const stats = [{ label: "تعداد دسته‌بندی‌ها", value: items.length, trend: "", icon: FolderTree }, { label: "تعداد برچسب‌ها", value: tagCount, trend: "", icon: Tags }, { label: "مقالات دسته‌بندی‌شده", value: items.reduce((sum, item) => sum + item.articleCount, 0), trend: "", icon: Code2, accent: true }, { label: "پرکاربردترین دسته", value: top?.name ?? "—", trend: "", icon: Sparkles, accent: true }];
  return <>
    <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((item) => <StatCard key={item.label} label={item.label} value={typeof item.value === "number" ? number.format(item.value) : item.value} trend={item.trend} icon={item.icon} accent={item.accent}/>)}</section>
    <section className="mt-4 rounded-(--radius) border border-(--border) bg-white p-3"><label className="flex h-10 items-center gap-2 rounded-(--radius-sm) border border-(--border) bg-(--surface-subtle) px-3 text-(--text-muted) focus-within:border-(--border-strong)"><Search size={16}/><span className="sr-only">جست‌وجوی دسته‌بندی</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجوی دسته‌بندی..." className="h-full flex-1 bg-transparent text-[14px] outline-none"/></label></section>
    {filtered.length ? <section className={`mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3 ${mutating ? "pointer-events-none opacity-60" : ""}`} aria-busy={mutating}>{filtered.map((item) => { const Icon = iconMap[item.icon as keyof typeof iconMap] ?? FolderTree; const parent = items.find((candidate) => candidate.id === item.parentId); return <article key={item.id} className="rounded-(--radius) border border-(--border) bg-white p-5 transition hover:border-(--border-strong)"><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-(--radius)" style={{ backgroundColor: `${item.color}16`, color: item.color }}><Icon size={19}/></span><div className="min-w-0 flex-1"><h3 className="text-[14px] font-bold text-(--text-strong)">{item.name}</h3><p dir="ltr" className="mt-1 truncate text-right text-[12px] text-(--text-muted)">/{item.slug}</p></div>{!user.readOnly && <details className="relative"><summary aria-label={`عملیات ${item.name}`} className="grid size-10 cursor-pointer list-none place-items-center rounded-lg text-(--text-muted) hover:bg-(--surface-muted) [&::-webkit-details-marker]:hidden"><MoreHorizontal size={18}/></summary><div className="absolute left-0 top-9 z-20 w-40 rounded-(--radius-sm) border border-(--border) bg-white p-1.5 shadow-lg"><Link href={`/admin/categories/${item.id}/edit`} className="flex h-10 items-center gap-2 rounded-md px-2 text-[13px] text-(--text-secondary) hover:bg-(--surface-muted)"><PenLine size={13}/> ویرایش</Link><button type="button" onClick={() => setPending(item)} className="flex h-10 w-full items-center gap-2 rounded-md px-2 text-[13px] font-bold text-(--danger) hover:bg-(--danger-soft)"><Trash2 size={13}/> حذف</button></div></details>}</div><p className="mt-4 line-clamp-2 min-h-10 text-[13px] leading-5 text-(--text-secondary)">{item.description}</p>{parent && <p className="mt-3 text-[12px] text-(--text-muted)">زیرمجموعه {parent.name}</p>}<div className="mt-4 grid grid-cols-2 divide-x divide-x-reverse divide-(--border-subtle) rounded-(--radius-sm) bg-(--surface-subtle) py-3"><div className="px-3"><strong className="block text-sm">{number.format(item.articleCount)}</strong><span className="text-[12px] text-(--text-muted)">مقاله</span></div><div className="px-3"><strong className="block text-sm">{number.format(item.views)}</strong><span className="flex items-center gap-1 text-[12px] text-(--text-muted)"><Eye size={11}/> بازدید</span></div></div></article>; })}</section> : <section className="mt-4 grid min-h-72 place-items-center rounded-(--radius) border border-(--border) bg-white text-center"><div><FolderTree className="mx-auto text-(--text-muted)"/><h3 className="mt-3 text-sm font-bold">موردی پیدا نشد</h3><p className="mt-2 text-[12px] text-(--text-muted)">{items.length ? "عبارت جست‌وجو را تغییر دهید." : "هنوز دسته‌بندی‌ای ایجاد نشده است."}</p></div></section>}
    {!user.readOnly && <TaxonomyDeleteDialog open={Boolean(pending)} label={pending?.name ?? ""} type="دسته‌بندی" onCancel={() => setPending(null)} onConfirm={() => void remove()}/>}
  </>;
}
