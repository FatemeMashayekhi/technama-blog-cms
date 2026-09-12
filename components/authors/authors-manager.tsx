"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileText, Search, Star, Users, X } from "lucide-react";
import { mockAuthors, type Author, type AuthorRole, type AuthorStatus } from "@/lib/authors-data";
import { StatCard } from "@/components/dashboard/stat-card";
import { AuthorCard } from "./author-card";
import { AuthorProfileDialog, DeleteAuthorDialog } from "./author-dialogs";
import { authorsService } from "@/lib/authors-service";

type Sort = "articles" | "views" | "newest" | "oldest";
const selectClass = "h-10 rounded-(--radius-sm) border border-(--border) bg-white px-3 text-[13px] font-bold text-(--text-secondary) outline-none focus:border-(--focus-border)";

export function AuthorsManager() {
  const [authors, setAuthors] = useState(mockAuthors);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | AuthorStatus>("all");
  const [role, setRole] = useState<"all" | AuthorRole>("all");
  const [sort, setSort] = useState<Sort>("articles");
  const [profile, setProfile] = useState<Author | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Author | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => { let active = true; authorsService.list().then((items) => { if (active) setAuthors(items); }).catch(() => undefined); return () => { active = false; }; }, []);
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2500); };

  const filtered = useMemo(() => authors.filter((author) => {
    const term = query.trim().toLocaleLowerCase("fa");
    const matches = !term || [author.name, author.username, author.email].some((value) => value.toLocaleLowerCase("fa").includes(term));
    return matches && (status === "all" || author.status === status) && (role === "all" || author.role === role);
  }).sort((a, b) => sort === "articles" ? b.articleCount - a.articleCount : sort === "views" ? b.totalViews - a.totalViews : sort === "newest" ? Date.parse(b.joinedAt) - Date.parse(a.joinedAt) : Date.parse(a.joinedAt) - Date.parse(b.joinedAt)), [authors, query, role, sort, status]);

  const reset = () => { setQuery(""); setStatus("all"); setRole("all"); };
  const topAuthor = [...authors].sort((a, b) => b.totalViews - a.totalViews)[0];
  const stats = [
    { label: "کل نویسندگان", value: authors.length, trend: "۱۴٪", icon: Users },
    { label: "نویسندگان فعال", value: authors.filter((item) => item.status === "active").length, trend: "۸٪", icon: CheckCircle2, accent: true },
    { label: "مقالات منتشر شده", value: authors.reduce((sum, item) => sum + articlePublishedCount(item), 0), trend: "۱۲٪", icon: FileText },
    { label: "نویسنده برتر", value: topAuthor?.name.split(" ")[0] ?? "—", trend: "۱۸٪", icon: Star, accent: true },
  ];

  return <>
    <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((item) => <StatCard key={item.label} label={item.label} value={typeof item.value === "number" ? new Intl.NumberFormat("fa-IR").format(item.value) : item.value} trend={item.trend} icon={item.icon} accent={item.accent} />)}</section>
    <section className="mt-4 rounded-(--radius) border border-(--border) bg-white p-3 sm:p-4"><div className="flex flex-col gap-3 xl:flex-row"><label className="flex h-10 flex-1 items-center gap-2 rounded-(--radius-sm) border border-(--border) bg-(--surface-subtle) px-3 text-(--muted) focus-within:border-(--border-strong) focus-within:bg-white"><Search size={16} /><span className="sr-only">جست‌وجوی نویسنده</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجوی نویسنده..." className="h-full w-full bg-transparent text-[14px] outline-none" />{query && <button type="button" onClick={() => setQuery("")} aria-label="پاک‌کردن جست‌وجو"><X size={14} /></button>}</label><div className="grid grid-cols-1 gap-2 sm:grid-cols-3"><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} aria-label="فیلتر وضعیت" className={selectClass}><option value="all">همه وضعیت‌ها</option><option value="active">فعال</option><option value="inactive">غیرفعال</option></select><select value={role} onChange={(event) => setRole(event.target.value as typeof role)} aria-label="فیلتر نقش" className={selectClass}><option value="all">همه نقش‌ها</option><option value="admin">مدیر</option><option value="editor">ویراستار</option><option value="author">نویسنده</option></select><select value={sort} onChange={(event) => setSort(event.target.value as Sort)} aria-label="مرتب‌سازی" className={selectClass}><option value="articles">بیشترین مقاله</option><option value="views">بیشترین بازدید</option><option value="newest">جدیدترین</option><option value="oldest">قدیمی‌ترین</option></select></div></div><div className="mt-3 flex justify-between border-t border-(--border-subtle) pt-3 text-[12px] text-(--text-muted)"><span>{new Intl.NumberFormat("fa-IR").format(filtered.length)} نویسنده</span>{(query || status !== "all" || role !== "all") && <button type="button" onClick={reset} className="font-bold text-(--accent)">پاک‌کردن فیلترها</button>}</div></section>
    {filtered.length ? <section className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">{filtered.map((author) => <AuthorCard key={author.id} author={author} onPreview={() => setProfile(author)} onCopy={async () => { try { await navigator.clipboard.writeText(`${window.location.origin}/authors/${author.username}`); showNotice("لینک پروفایل کپی شد."); } catch { showNotice("امکان کپی لینک وجود نداشت."); } }} onToggle={() => { setAuthors((items) => items.map((item) => item.id === author.id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item)); showNotice("وضعیت نویسنده تغییر کرد."); }} onDelete={() => setPendingDelete(author)} />)}</section> : <section className="mt-4 grid min-h-80 place-items-center rounded-(--radius) border border-(--border) bg-white p-8 text-center"><div><span className="mx-auto grid size-12 place-items-center rounded-(--radius) bg-(--surface-muted) text-(--text-secondary)"><Users size={22} /></span><h3 className="mt-4 text-sm font-bold text-(--text-strong)">{authors.length ? "نویسنده‌ای پیدا نشد" : "هنوز نویسنده‌ای اضافه نشده است"}</h3><p className="mt-2 text-[13px] text-(--text-muted)">{authors.length ? "عبارت جست‌وجو یا فیلترهای خود را تغییر دهید." : "با افزودن اولین نویسنده، تیم تحریریه خود را ایجاد کنید."}</p>{authors.length && <button type="button" onClick={reset} className="mt-4 h-10 rounded-(--radius-sm) border border-(--border) px-3 text-[13px] font-bold">پاک‌کردن فیلترها</button>}</div></section>}
    <AuthorProfileDialog author={profile} onClose={() => setProfile(null)} />
    <DeleteAuthorDialog author={pendingDelete} onCancel={() => setPendingDelete(null)} onConfirm={() => { if (pendingDelete) setAuthors((items) => items.filter((item) => item.id !== pendingDelete.id)); setPendingDelete(null); showNotice("نویسنده حذف شد."); }} />
    {notice && <div className="fixed bottom-5 left-5 z-[90] rounded-(--radius-sm) bg-(--brand-navy) px-4 py-3 text-[13px] font-bold text-white shadow-[0_10px_30px_rgba(16,35,49,.2)]" role="status">{notice}</div>}
  </>;
}

function articlePublishedCount(author: Author) { return Math.round(author.articleCount * author.publishedRate / 100); }
