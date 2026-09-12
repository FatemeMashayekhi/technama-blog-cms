import { ArrowLeft, FileText, MoreHorizontal } from "lucide-react";
import { articles } from "@/lib/dashboard-data";
import { ArticleStatusBadge } from "./status-badge";

export function RecentArticles() {
  return (
    <section className="overflow-hidden rounded-(--radius) border border-(--border) bg-white xl:col-span-3">
      <div className="flex items-center justify-between border-b border-(--border) px-4 py-4 sm:px-6">
        <div>
          <h2 className="text-sm font-bold">مقالات اخیر</h2>
          <p className="mt-1 text-[13px] text-(--muted)">
            آخرین تغییرات محتوای تحریریه
          </p>
        </div>
        <button
          type="button"
          title="صفحه مقالات در مرحله بعد ساخته می‌شود"
          className="flex items-center gap-1.5 text-[14px] font-bold text-(--accent) hover:text-(--brand-teal)"
        >
          مشاهده همه <ArrowLeft size={14} />
        </button>
      </div>
      {articles.length === 0 ? (
        <div className="grid min-h-64 place-items-center p-8 text-center">
          <div>
            <span className="mx-auto grid size-11 place-items-center rounded-(--radius) bg-(--surface-muted) text-(--text-muted)">
              <FileText size={20} />
            </span>
            <h3 className="mt-3 text-xs font-bold text-(--text-strong)">
              هنوز مقاله‌ای وجود ندارد
            </h3>
            <p className="mt-1.5 text-[13px] text-(--text-muted)">
              اولین مقاله تحریریه را ایجاد کنید.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-205 text-right">
              <thead>
                <tr className="bg-(--surface-subtle) text-[13px] font-bold text-(--text-muted)">
                  <th className="px-6 py-3.5">مقاله</th>
                  <th className="px-4 py-3.5">نویسنده</th>
                  <th className="px-4 py-3.5">دسته‌بندی</th>
                  <th className="px-4 py-3.5">وضعیت</th>
                  <th className="px-4 py-3.5">بازدید</th>
                  <th className="px-4 py-3.5">تاریخ</th>
                  <th className="w-12 px-3 py-3.5">
                    <span className="sr-only">عملیات</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f2]">
                {articles.map((article) => (
                  <tr key={article.id} className="group hover:bg-(--surface-subtle)">
                    <td className="max-w-75 px-6 py-4">
                      <span className="block truncate text-[12px] font-bold text-(--text-strong)">
                        {article.title}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 whitespace-nowrap text-[14px] text-(--text-secondary)">
                        <span
                          className={`grid size-7 place-items-center rounded-full text-[12px] font-bold ${article.author.color}`}
                        >
                          {article.author.initials}
                        </span>
                        {article.author.name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[14px] text-(--text-secondary)">
                      {article.category}
                    </td>
                    <td className="px-4 py-4">
                      <ArticleStatusBadge status={article.status} />
                    </td>
                    <td className="px-4 py-4 text-[14px] font-bold text-(--text-secondary)">
                      {article.views}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[13px] text-(--text-muted)">
                      {article.date}
                    </td>
                    <td className="px-3 py-4">
                      <button
                        aria-label={`عملیات ${article.title}`}
                        className="grid size-10 place-items-center rounded-lg text-(--text-muted) opacity-60 hover:bg-(--surface-muted) group-hover:opacity-100"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-[#edf0f2] md:hidden">
            {articles.map((article) => (
              <article key={article.id} className="p-4 hover:bg-(--surface-subtle)">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[12px] font-bold leading-6">
                      {article.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <ArticleStatusBadge status={article.status} />
                      <span className="text-[13px] text-(--text-muted)">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <button
                    aria-label={`عملیات ${article.title}`}
                    className="grid size-10 shrink-0 place-items-center rounded-lg text-(--text-muted)"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-[13px] text-(--text-muted)">
                  <span>{article.author.name}</span>
                  <span>{article.date}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
