import { Newspaper } from "lucide-react";
import type { PostArticle } from "@/lib/posts-data";
import { ArticleStatusBadge } from "@/components/dashboard/status-badge";
import { ArticleActions } from "./article-actions";

type ArticlesTableProps = {
  articles: PostArticle[];
  selectedIds: Set<string>;
  allVisibleSelected: boolean;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onDelete: (article: PostArticle) => void;
  onStatusChange: (id: string) => void;
  onCopy: (article: PostArticle) => void;
};

const numberFormatter = new Intl.NumberFormat("fa-IR");

function Thumbnail({ article }: { article: PostArticle }) {
  return <span className={`grid size-12 shrink-0 place-items-center rounded-(--radius-sm) ${article.thumbnail.background} ${article.thumbnail.accent}`} aria-hidden="true"><Newspaper size={19} strokeWidth={1.6} /></span>;
}

export function ArticlesTable({ articles, selectedIds, allVisibleSelected, onSelect, onSelectAll, onDelete, onStatusChange, onCopy }: ArticlesTableProps) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-(--border-subtle) bg-(--surface-subtle) px-4 py-3 lg:hidden">
        <label className="flex items-center gap-2 text-[13px] font-bold text-(--text-secondary)"><input type="checkbox" checked={allVisibleSelected} onChange={onSelectAll} aria-label="انتخاب همه مقالات این صفحه" className="size-4 accent-[#176f66]" /> انتخاب همه این صفحه</label>
        <span className="text-[12px] text-(--text-muted)">{numberFormatter.format(articles.length)} مقاله</span>
      </div>
      <div className="hidden lg:block">
        <table className="w-full table-fixed text-right">
          <thead><tr className="bg-(--surface-subtle) text-[13px] font-bold text-(--text-muted)">
            <th className="w-12 px-4 py-3.5"><input type="checkbox" checked={allVisibleSelected} onChange={onSelectAll} aria-label="انتخاب همه مقالات این صفحه" className="size-3.5 accent-[#176f66]" /></th>
            <th className="w-[32%] px-3 py-3.5">مقاله</th><th className="w-[17%] px-3 py-3.5">نویسنده</th><th className="w-[13%] px-3 py-3.5">دسته‌بندی</th><th className="w-[13%] px-3 py-3.5">وضعیت</th><th className="w-[9%] px-3 py-3.5">بازدید</th><th className="w-[12%] px-3 py-3.5">آخرین ویرایش</th><th className="w-12 px-3 py-3.5"><span className="sr-only">عملیات</span></th>
          </tr></thead>
          <tbody className="divide-y divide-[#edf0f2]">{articles.map((article) => {
            const selected = selectedIds.has(article.id);
            return <tr key={article.id} className={`group transition-colors ${selected ? "bg-(--surface-muted)" : "hover:bg-(--surface-subtle)"}`}>
              <td className="px-4 py-3.5"><input type="checkbox" checked={selected} onChange={() => onSelect(article.id)} aria-label={`انتخاب ${article.title}`} className="size-3.5 accent-[#176f66]" /></td>
              <td className="px-3 py-3.5"><div className="flex min-w-0 items-center gap-3"><Thumbnail article={article} /><div className="min-w-0"><p className="truncate text-[14px] font-bold text-(--text-strong)" title={article.title}>{article.title}</p><p className="mt-1 truncate text-[12px] text-(--text-muted)">/{article.slug}</p></div></div></td>
              <td className="px-3 py-3.5"><span className="flex min-w-0 items-center gap-2 text-[13px] text-(--text-secondary)"><span className={`grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-bold ${article.author.color}`}>{article.author.initials}</span><span className="truncate">{article.author.name}</span></span></td>
              <td className="truncate px-3 py-3.5 text-[13px] text-(--text-secondary)">{article.category.name}</td>
              <td className="px-3 py-3.5"><ArticleStatusBadge status={article.status} /></td>
              <td className="px-3 py-3.5 text-[13px] font-bold text-(--text-secondary)">{article.views ? numberFormatter.format(article.views) : "—"}</td>
              <td className="whitespace-nowrap px-3 py-3.5 text-[12px] text-(--text-muted)">{article.updatedLabel}</td>
              <td className="px-3 py-3.5"><ArticleActions article={article} onDelete={() => onDelete(article)} onStatusChange={() => onStatusChange(article.id)} onCopy={() => onCopy(article)} /></td>
            </tr>;
          })}</tbody>
        </table>
      </div>

      <div className="divide-y divide-[#edf0f2] lg:hidden">{articles.map((article) => {
        const selected = selectedIds.has(article.id);
        return <article key={article.id} className={`p-4 transition-colors ${selected ? "bg-(--surface-muted)" : "hover:bg-(--surface-subtle)"}`}>
          <div className="flex items-start gap-3">
            <input type="checkbox" checked={selected} onChange={() => onSelect(article.id)} aria-label={`انتخاب ${article.title}`} className="mt-4 size-4 shrink-0 accent-[#176f66]" />
            <Thumbnail article={article} />
            <div className="min-w-0 flex-1"><h3 className="text-[14px] font-bold leading-5 text-(--text-strong)">{article.title}</h3><div className="mt-2 flex flex-wrap items-center gap-2"><ArticleStatusBadge status={article.status} /><span className="text-[12px] text-(--text-muted)">{article.category.name}</span></div></div>
            <ArticleActions article={article} onDelete={() => onDelete(article)} onStatusChange={() => onStatusChange(article.id)} onCopy={() => onCopy(article)} />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-(--border-subtle) pt-3 text-[12px] text-(--text-muted)"><span className="flex items-center gap-1.5"><span className={`grid size-5 place-items-center rounded-full text-[14px] font-bold ${article.author.color}`}>{article.author.initials}</span>{article.author.name}</span><span>{article.views ? `${numberFormatter.format(article.views)} بازدید` : article.updatedLabel}</span></div>
        </article>;
      })}</div>
    </>
  );
}
