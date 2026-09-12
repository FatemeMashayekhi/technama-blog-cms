import { mockMediaAssets, type MediaAsset } from "@/lib/media-data";
import { isSupabaseConfigured } from "@/lib/env";

const wait = (duration = 450) => new Promise((resolve) => setTimeout(resolve, duration));

export const mediaService = {
  async list(): Promise<MediaAsset[]> {
    if (isSupabaseConfigured) {
      const response = await fetch("/api/media"); const result = await response.json() as { ok: boolean; data?: DbMedia[]; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "دریافت رسانه‌ها انجام نشد.");
      return (result.data ?? []).map(toMediaAsset);
    }
    await wait(120);
    return [...mockMediaAssets];
  },
  async rename(asset: MediaAsset, name: string): Promise<MediaAsset> {
    if (isSupabaseConfigured) return updateMedia(asset, { name });
    await wait();
    return { ...asset, name };
  },
  async updateAlt(asset: MediaAsset, altText: string): Promise<MediaAsset> {
    if (isSupabaseConfigured) return updateMedia(asset, { altText });
    await wait(300);
    return { ...asset, altText };
  },
  async remove(ids: string[] = []): Promise<void> {
    if (isSupabaseConfigured) { for (const id of ids) { const response = await fetch(`/api/media/${id}`, { method: "DELETE" }); if (!response.ok) throw new Error("حذف رسانه انجام نشد."); } return; }
    await wait(350);
  },
};

type DbMedia = { id: string; name: string; url: string; mime_type: string; size: number; width: number | null; height: number | null; alt_text: string; created_at: string; owner?: { id: string; display_name: string } | null };
function toMediaAsset(row: DbMedia): MediaAsset { const name = row.owner?.display_name ?? "عضو تحریریه"; return { id: row.id, name: row.name, type: row.mime_type.startsWith("image/") ? "image" : "document", mimeType: row.mime_type, url: row.url, size: Number(row.size), width: row.width ?? undefined, height: row.height ?? undefined, altText: row.alt_text, uploadedBy: { id: row.owner?.id ?? "", name, initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("") }, createdAt: row.created_at }; }
async function updateMedia(asset: MediaAsset, body: { name?: string; altText?: string }) { const response = await fetch(`/api/media/${asset.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const result = await response.json() as { ok: boolean; data?: DbMedia; error?: string }; if (!response.ok || !result.ok || !result.data) throw new Error(result.error || "ویرایش رسانه انجام نشد."); return toMediaAsset(result.data); }

export async function uploadMedia(file: File): Promise<MediaAsset> {
  if (!isSupabaseConfigured) return createUploadedAsset(file, URL.createObjectURL(file));
  const form = new FormData(); form.set("file", file);
  const response = await fetch("/api/media", { method: "POST", body: form }); const result = await response.json() as { ok: boolean; data?: DbMedia; error?: string };
  if (!response.ok || !result.ok || !result.data) throw new Error(result.error || "آپلود رسانه انجام نشد."); return toMediaAsset(result.data);
}

export function createUploadedAsset(file: File, url: string): MediaAsset {
  return {
    id: `media-local-${Date.now()}-${file.name}`,
    name: file.name,
    type: file.type.startsWith("image/") ? "image" : "document",
    mimeType: file.type || "application/octet-stream",
    url,
    size: file.size,
    width: file.type.startsWith("image/") ? 1600 : undefined,
    height: file.type.startsWith("image/") ? 900 : undefined,
    altText: "",
    uploadedBy: { id: "current-user", name: "مریم موسوی", initials: "مم" },
    createdAt: new Date().toISOString(),
  };
}
