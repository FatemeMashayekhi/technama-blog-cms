"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, FileText, Library } from "lucide-react";
import type { ArticleStatus } from "@/lib/dashboard-data";
import { mockArticles, type PostArticle } from "@/lib/posts-data";
import { StatCard } from "@/components/dashboard/stat-card";
import { Pagination } from "@/components/ui/pagination";
import { ArticleToolbar, type SortOption, type StatusFilter } from "./article-toolbar";
import { ArticlesTable } from "./articles-table";
import { BulkActions } from "./bulk-actions";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { PostsEmptyState } from "./empty-state";

const PAGE_SIZE = 8;

const statusOrder: Record<ArticleStatus, ArticleStatus> = {
  published: "draft",
  draft: "review",
  review: "published",
};

export function PostsManager() {
  const [articles, setArticles] = useState<PostArticle[]>(mockArticles);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

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

  const updateNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const updateSelectedStatus = (nextStatus: ArticleStatus) => {
    setArticles((items) => items.map((article) => selectedIds.has(article.id) ? { ...article, status: nextStatus, updatedAt: new Date().toISOString(), updatedLabel: "همین حالا" } : article));
    updateNotice(nextStatus === "published" ? "مقالات انتخاب‌شده منتشر شدند." : "مقالات انتخاب‌شده به پیش‌نویس منتقل شدند.");
    setSelectedIds(new Set());
  };

  const confirmDelete = () => {
    const deleteSet = new Set(pendingDeleteIds);
    setArticles((items) => items.filter((article) => !deleteSet.has(article.id)));
    setSelectedIds((items) => new Set([...items].filter((id) => !deleteSet.has(id))));
    updateNotice(pendingDeleteIds.length > 1 ? "مقالات انتخاب‌شده حذف شدند." : "مقاله حذف شد.");
    setPendingDeleteIds([]);
  };

  const stats = [
    { label: "همه مقالات", value: articles.length, trend: "۱۲٪", icon: Library },
    { label: "منتشر شده", value: articles.filter((item) => item.status === "published").length, trend: "۸٪", icon: CheckCircle2, accent: true },
    { label: "پیش‌نویس", value: articles.filter((item) => item.status === "draft").length, trend: "۳٪", icon: FileText },
    { label: "در انتظار بررسی", value: articles.filter((item) => item.status === "review").length, trend: "۶٪", icon: Clock3 },
  ];

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

        <BulkActions count={selectedIds.size} onPublish={() => updateSelectedStatus("published")} onDraft={() => updateSelectedStatus("draft")} onDelete={() => setPendingDeleteIds([...selectedIds])} onClear={() => setSelectedIds(new Set())} />

        <section className="rounded-(--radius) border border-(--border) bg-white">
          {filteredArticles.length ? <>
            <ArticlesTable
              articles={visibleArticles}
              selectedIds={selectedIds}
              allVisibleSelected={allVisibleSelected}
              onSelect={(id) => setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })}
              onSelectAll={() => setSelectedIds((current) => { const next = new Set(current); visibleArticles.forEach((article) => allVisibleSelected ? next.delete(article.id) : next.add(article.id)); return next; })}
              onDelete={(article) => setPendingDeleteIds([article.id])}
              onStatusChange={(id) => { setArticles((items) => items.map((article) => article.id === id ? { ...article, status: statusOrder[article.status], updatedAt: new Date().toISOString(), updatedLabel: "همین حالا" } : article)); updateNotice("وضعیت مقاله تغییر کرد."); }}
              onCopy={async (article) => { try { await navigator.clipboard.writeText(`${window.location.origin}/articles/${article.slug}`); updateNotice("لینک عمومی مقاله کپی شد."); } catch { updateNotice("امکان کپی لینک وجود نداشت."); } }}
            />
            <Pagination page={safePage} pageCount={pageCount} start={pageStart + 1} end={Math.min(pageStart + PAGE_SIZE, filteredArticles.length)} total={filteredArticles.length} onPageChange={setPage} />
          </> : <PostsEmptyState hasArticles={articles.length > 0} onReset={resetFilters} />}
        </section>
      </div>

      <DeleteConfirmationDialog open={pendingDeleteIds.length > 0} count={pendingDeleteIds.length} articleTitle={pendingArticle?.title} onCancel={() => setPendingDeleteIds([])} onConfirm={confirmDelete} />
      {notice && <div className="fixed bottom-5 left-5 z-[80] rounded-(--radius-sm) bg-(--brand-navy) px-4 py-3 text-[14px] font-bold text-white shadow-[0_10px_30px_rgba(16,35,49,.2)]" role="status">{notice}</div>}
    </>
  );
}
