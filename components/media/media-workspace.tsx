"use client";

import { useEffect, useState } from "react";
import type { MediaAsset } from "@/lib/media-data";
import { mediaService } from "@/lib/media-service";
import { MediaManager } from "./media-manager";
import { MediaUploader } from "./media-uploader";

export function MediaWorkspace() {
  const [assets, setAssets] = useState<MediaAsset[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; mediaService.list().then((items) => { if (active) setAssets(items); }).catch(() => undefined).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  return <div className="space-y-5"><MediaUploader onUploaded={(items) => setAssets((current) => [...items, ...current])}/><MediaManager assets={assets} loading={loading} onAssetsChange={setAssets}/></div>;
}
