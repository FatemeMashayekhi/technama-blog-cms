import type { MediaAsset } from "@/lib/media-data";
import { MediaCard } from "./media-card";

export function MediaGrid({ assets, selectedIds, onSelect, onOpen, onRename, onCopy, onDelete }: { assets: MediaAsset[]; selectedIds: Set<string>; onSelect: (id: string) => void; onOpen: (asset: MediaAsset) => void; onRename: (asset: MediaAsset) => void; onCopy: (asset: MediaAsset) => void; onDelete: (asset: MediaAsset) => void }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{assets.map((asset) => <MediaCard key={asset.id} asset={asset} selected={selectedIds.has(asset.id)} onSelect={() => onSelect(asset.id)} onOpen={() => onOpen(asset)} onRename={() => onRename(asset)} onCopy={() => onCopy(asset)} onDelete={() => onDelete(asset)}/>)}</div>;
}

