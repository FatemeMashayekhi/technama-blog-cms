"use client";

import { CheckSquare, Square } from "lucide-react";
import { useMemo, useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import type { MediaAsset } from "@/lib/media-data";
import { mediaService } from "@/lib/media-service";
import { DeleteMediaDialog, MediaPreview, RenameMediaDialog } from "./media-dialogs";
import { MediaBulkActions } from "./media-bulk-actions";
import { MediaEmptyState } from "./media-empty-state";
import { MediaGrid } from "./media-grid";
import { MediaSkeleton } from "./media-skeleton";
import { MediaToolbar, type MediaSort, type MediaTypeFilter } from "./media-toolbar";

const perPage = 12;

export function MediaManager({ assets, loading, onAssetsChange }: { assets: MediaAsset[]; loading: boolean; onAssetsChange: (assets: MediaAsset[]) => void }) {
  const [query, setQuery] = useState(""); const [type, setType] = useState<MediaTypeFilter>("all"); const [sort, setSort] = useState<MediaSort>("newest"); const [page, setPage] = useState(1); const [selected, setSelected] = useState<Set<string>>(new Set()); const [preview, setPreview] = useState<MediaAsset | null>(null); const [rename, setRename] = useState<MediaAsset | null>(null); const [deleteIds, setDeleteIds] = useState<string[]>([]); const [toast, setToast] = useState("");
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fa");
    return assets.filter((asset) => (type === "all" || asset.type === type) && (!normalized || asset.name.toLocaleLowerCase("fa").includes(normalized) || asset.altText.toLocaleLowerCase("fa").includes(normalized))).sort((a, b) => sort === "newest" ? +new Date(b.createdAt) - +new Date(a.createdAt) : sort === "oldest" ? +new Date(a.createdAt) - +new Date(b.createdAt) : sort === "size" ? b.size - a.size : a.name.localeCompare(b.name, "fa"));
  }, [assets, query, type, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const allVisibleSelected = visible.length > 0 && visible.every((asset) => selected.has(asset.id));
  const toggle = (id: string) => setSelected((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const selectVisible = () => setSelected((current) => { const next = new Set(current); visible.forEach((asset) => allVisibleSelected ? next.delete(asset.id) : next.add(asset.id)); return next; });
  const copyUrls = async (items: MediaAsset[]) => { await navigator.clipboard.writeText(items.map((asset) => asset.url.startsWith("http") ? asset.url : `${window.location.origin}${asset.url}`).join("\n")); showToast(items.length > 1 ? "لینک رسانه‌ها کپی شد." : "لینک رسانه کپی شد."); };
  const confirmRename = async (name: string) => { if (!rename) return; const updated = await mediaService.rename(rename, name); onAssetsChange(assets.map((item) => item.id === updated.id ? updated : item)); setPreview((item) => item?.id === updated.id ? updated : item); setRename(null); showToast("نام فایل با موفقیت تغییر کرد."); };
  const confirmDelete = async () => { await mediaService.remove(deleteIds); onAssetsChange(assets.filter((asset) => !deleteIds.includes(asset.id))); setSelected((current) => new Set([...current].filter((id) => !deleteIds.includes(id)))); if (preview && deleteIds.includes(preview.id)) setPreview(null); setDeleteIds([]); showToast("رسانه حذف شد."); };
  const saveAlt = async (altText: string) => { if (!preview) return; const updated = await mediaService.updateAlt(preview, altText); onAssetsChange(assets.map((item) => item.id === updated.id ? updated : item)); setPreview(updated); showToast("متن جایگزین ذخیره شد."); };
  const reset = () => { setQuery(""); setType("all"); setSort("newest"); setPage(1); };
  if (loading) return <MediaSkeleton/>;
  return <div className="space-y-4"><MediaToolbar query={query} type={type} sort={sort} resultCount={filtered.length} onQueryChange={(value) => { setQuery(value); setPage(1); }} onTypeChange={(value) => { setType(value); setPage(1); }} onSortChange={(value) => { setSort(value); setPage(1); }} onReset={reset}/><MediaBulkActions count={selected.size} onClear={() => setSelected(new Set())} onCopy={() => copyUrls(assets.filter((asset) => selected.has(asset.id)))} onDownload={() => showToast("دانلود گروهی در نسخه نمایشی شبیه‌سازی شد.")} onDelete={() => setDeleteIds([...selected])}/><section className="overflow-hidden rounded-(--radius) border border-(--border) bg-white"><div className="flex min-h-12 items-center justify-between border-b border-(--border-subtle) px-3 sm:px-4"><button type="button" onClick={selectVisible} disabled={!visible.length} className="flex items-center gap-2 text-[13px] font-bold text-(--text-secondary) disabled:opacity-40">{allVisibleSelected ? <CheckSquare size={16} className="text-(--brand-teal)"/> : <Square size={16}/>} انتخاب همه موارد این صفحه</button><span className="text-[12px] text-(--text-muted)">{selected.size ? `${selected.size.toLocaleString("fa-IR")} انتخاب` : "برای عملیات گروهی انتخاب کنید"}</span></div><div className="p-3 sm:p-4">{visible.length ? <MediaGrid assets={visible} selectedIds={selected} onSelect={toggle} onOpen={setPreview} onRename={setRename} onCopy={(asset) => copyUrls([asset])} onDelete={(asset) => setDeleteIds([asset.id])}/> : <MediaEmptyState hasMedia={assets.length > 0} onReset={reset} onUpload={() => document.getElementById("media-uploader")?.scrollIntoView({ behavior: "smooth" })}/>}</div><Pagination page={safePage} pageCount={pageCount} start={filtered.length ? (safePage - 1) * perPage + 1 : 0} end={Math.min(safePage * perPage, filtered.length)} total={filtered.length} onPageChange={setPage} itemLabel="فایل" ariaLabel="صفحه‌بندی رسانه‌ها"/></section><MediaPreview key={preview?.id ?? "closed-preview"} asset={preview} onClose={() => setPreview(null)} onCopy={() => preview && copyUrls([preview])} onRename={() => { if (preview) setRename(preview); }} onDelete={() => { if (preview) setDeleteIds([preview.id]); }} onAltSave={saveAlt}/><RenameMediaDialog key={rename?.id ?? "closed-rename"} asset={rename} onCancel={() => setRename(null)} onConfirm={confirmRename}/><DeleteMediaDialog open={deleteIds.length > 0} count={deleteIds.length} name={assets.find((asset) => asset.id === deleteIds[0])?.name} onCancel={() => setDeleteIds([])} onConfirm={confirmDelete}/>{toast && <div role="status" className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-(--radius-sm) bg-(--brand-navy) px-4 py-3 text-[13px] font-bold text-white shadow-lg">{toast}</div>}</div>;
}
