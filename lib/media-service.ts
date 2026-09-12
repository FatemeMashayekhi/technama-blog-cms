import { mockMediaAssets, type MediaAsset } from "@/lib/media-data";

const wait = (duration = 450) => new Promise((resolve) => setTimeout(resolve, duration));

export const mediaService = {
  async list(): Promise<MediaAsset[]> {
    await wait(120);
    return [...mockMediaAssets];
  },
  async rename(asset: MediaAsset, name: string): Promise<MediaAsset> {
    await wait();
    return { ...asset, name };
  },
  async updateAlt(asset: MediaAsset, altText: string): Promise<MediaAsset> {
    await wait(300);
    return { ...asset, altText };
  },
  async remove(): Promise<void> {
    await wait(350);
  },
};

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
