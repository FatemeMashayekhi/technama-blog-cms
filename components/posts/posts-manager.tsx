"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Clock3, FileText, Library, RefreshCw } from "lucide-react";
import type { ArticleStatus } from "@/lib/dashboard-data";
import type { PostArticle } from "@/lib/posts-data";
import { StatCard } from "@/components/dashboard/stat-card";
import { Pagination } from "@/components/ui/pagination";
import { ArticleToolbar, type SortOption, type StatusFilter } from "./article-toolbar";
import { ArticlesTable } from "./articles-table";
import { BulkActions } from "./bulk-actions";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { PostsEmptyState } from "./empty-state";
import { postsService } from "@/lib/posts-service";
import { ArticlesTableSkeleton } from "./articles-table-skeleton";
import { useToast } from "@/components/ui/toast-provider";
import { useDashboardSession } from "@/components/layout/dashboard-session-provider";

const PAGE_SIZE = 8;

const statusOrder: Record<ArticleStatus, ArticleStatus> = {
  published: "draft",
  draft: "review",
  review: "published",
};

export function PostsManager() {
  const user = useDashboardSession();
  const [articles, setArticles] = useState<PostArticle[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const requestId = useRef(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [mutating, setMutating] = useState(false);
  const { toast } = useToast();
  const loadArticles = useCallback(async () => { const id = ++requestId.current; setLoadState("loading"); setLoadError(""); try { const items = await postsService.list(); if (id !== requestId.current) return; setArticles(items); setLoadState("ready"); } catch (cause) { if (id !== requestId.current) return; setLoadError(cause instanceof Error ? cause.message : "دریافت مقاله‌ها انجام نشد."); setLoadState("error"); } }, []);
  useEffect(() => { const id = ++requestId.current; let active = true; postsService.list().then((items) => { if (!active || id !== requestId.current) return; setArticles(items); setLoadState("ready"); }).catch((cause) => { if (!active || id !== requestId.current) return; setLoadError(cause instanceof Error ? cause.message : "دریافت مقاله‌ها انجام نشد."); setLoadState("error"); }); return () => { active = false; requestId.current += 1; }; }, []);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fa");
    return articles
      .filter((article) => {
        const matchesQuery = !normalizedQuery || [article.title, article.author.name, article.category.name].some((value) => value.toLocaleLowerCase("fa").includes(normalizedQuery));
        return matchesQuery && (status === "all" || article.status === status) && (category === "all" || article.category.name === category);
      })
      .sort((first, second) => {
        if (sort === "views") return second.views - first.views;
        if (sort === "oldest") return Date.parse(first.createdAt) - Date.parse(second.createdAt);
        if (sort === "updated") return Date.parse(second.updatedAt) - Date.parse(first.updatedAt);
        return Date.parse(second.createdAt) - Date.parse(first.createdAt);
      });
  }, [articles, category, query, sort, status]);

  const pageCount = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visibleArticles = filteredArticles.slice(pageStart, pageStart + PAGE_SIZE);
  const allVisibleSelected = visibleArticles.length > 0 && visibleArticles.every((article) => selectedIds.has(article.id));
  const pendingArticle = articles.find((article) => article.id === pendingDeleteIds[0]);

  const resetFilters = () => {
    setQuery("");
    setStatus("all");
    setCategory("all");
    setPage(1);
  };

  const updateSelectedStatus = async (nextStatus: ArticleStatus) => {
    if (!selectedIds.size || mutating) return; setMutating(true);
    try { await Promise.all([...selectedIds].map((id) => postsService.status(id, nextStatus))); setArticles((items) => items.map((article) => selectedIds.has(article.id) ? { ...article, status: nextStatus, updatedAt: new Date().toISOString(), updatedLabel: "همین حالا" } : article)); toast({ tone: "success", message: nextStatus === "published" ? "مقالات انتخاب‌شده منتشر شدند." : "مقالات انتخاب‌شده به پیش‌نویس منتقل شدند." }); setSelectedIds(new Set()); }
    catch (cause) { toast({ tone: "error", message: cause instanceof Error ? cause.message : "تغییر وضعیت مقاله‌ها انجام نشد." }); }
    finally { setMutating(false); }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteIds.length || mutating) return; setMutating(true);
    try { await postsService.remove(pendingDeleteIds); const deleteSet = new Set(pendingDeleteIds); setArticles((items) => items.filter((article) => !deleteSet.has(article.id))); setSelectedIds((items) => new Set([...items].filter((id) => !deleteSet.has(id)))); toast({ tone: "success", message: pendingDeleteIds.length > 1 ? "مقالات انتخاب‌شده حذف شدند." : "مقاله حذف شد." }); setPendingDeleteIds([]); }
    catch (cause) { toast({ tone: "error", message: cause instanceof Error ? cause.message : "حذف مقاله انجام نشد." }); }
    finally { setMutating(false); }
  };

  const stats = [
    { label: "همه مقالات", value: articles.length, trend: "۱۲٪", icon: Library },
    { label: "منتشر شده", value: articles.filter((item) => item.status === "published").length, trend: "۸٪", icon: CheckCircle2, accent: true },
    { label: "پیش‌نویس", value: articles.filter((item) => item.status === "draft").length, trend: "۳٪", icon: FileText },
    { label: "در انتظار بررسی", value: articles.filter((item) => item.status === "review").length, trend: "۶٪", icon: Clock3 },
  ];

  if (loadState === "loading") return <ArticlesTableSkeleton/>;
  if (loadState === "error") return <section role="alert" className="mt-6 rounded-(--radius) border border-(--danger-border) bg-white p-8 text-center"><h2 className="text-sm font-bold text-(--text-strong)">دریافت مقاله‌ها انجام نشد</h2><p className="mt-2 text-[13px] leading-6 text-(--danger)">{loadError}</p><button type="button" onClick={() => void loadArticles()} className="mx-auto mt-5 flex min-h-11 items-center gap-2 rounded-(--radius-sm) bg-(--brand-navy) px-4 text-[12px] font-bold text-white"><RefreshCw size={15}/> تلاش دوباره</button></section>;
  return (
    <>
      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => <StatCard key={item.label} label={item.label} value={new Intl.NumberFormat("fa-IR").format(item.value)} trend={item.trend} icon={item.icon} accent={item.accent} />)}
      </section>

      <div className="mt-4 space-y-3">
        <ArticleToolbar
          query={query}
          status={status}
          category={category}
          sort={sort}
          resultCount={filteredArticles.length}
          onQueryChange={(value) => { setQuery(value); setPage(1); }}
          onStatusChange={(value) => { setStatus(value); setPage(1); }}
          onCategoryChange={(value) => { setCategory(value); setPage(1); }}
          onSortChange={(value) => { setSort(value); setPage(1); }}
          onReset={resetFilters}
        />

        {!user.readOnly && <BulkActions count={selectedIds.size} onPublish={() => updateSelectedStatus("published")} onDraft={() => updateSelectedStatus("draft")} onDelete={() => setPendingDeleteIds([...selectedIds])} onClear={() => setSelectedIds(new Set())} />}

        <section className="rounded-(--radius) border border-(--border) bg-white">
          {filteredArticles.length ? <>
            <ArticlesTable
              articles={visibleArticles}
              readOnly={user.readOnly}
              selectedIds={selectedIds}
              allVisibleSelected={allVisibleSelected}
              onSelect={(id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })}
              onSelectAll={() => setSelectedIds((current) => { const next = new Set(current); visibleArticles.forEach((article) => allVisibleSelected ? next.delete(article.id) : next.add(article.id)); return next; })}
              onDelete={(article) => setPendingDeleteIds([article.id])}
              onStatusChange={(id) => { const article = articles.find((item) => item.id === id); if (!article || mutating) return; const nextStatus = statusOrder[article.status]; setMutating(true); void postsService.status(id, nextStatus).then(() => { setArticles((items) => items.map((item) => item.id === id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString(), updatedLabel: "همین حالا" } : item)); toast({ tone: "success", message: "وضعیت مقاله تغییر کرد." }); }).catch((cause) => toast({ tone: "error", message: cause instanceof Error ? cause.message : "تغییر وضعیت انجام نشد." })).finally(() => setMutating(false)); }}
              onCopy={async (article) => { try { await navigator.clipboard.writeText(`${window.location.origin}/articles/${article.slug}`); toast({ tone: "success", message: "لینک عمومی مقاله کپی شد." }); } catch { toast({ tone: "error", message: "امکان کپی لینک وجود نداشت." }); } }}
            />
            <Pagination page={safePage} pageCount={pageCount} start={pageStart + 1} end={Math.min(pageStart + PAGE_SIZE, filteredArticles.length)} total={filteredArticles.length} onPageChange={setPage} />
          </> : <PostsEmptyState hasArticles={articles.length > 0} onReset={resetFilters} readOnly={user.readOnly} />}
        </section>
      </div>

      {!user.readOnly && <DeleteConfirmationDialog open={pendingDeleteIds.length > 0} count={pendingDeleteIds.length} articleTitle={pendingArticle?.title} onCancel={() => setPendingDeleteIds([])} onConfirm={confirmDelete} />}
    </>
  );
}
