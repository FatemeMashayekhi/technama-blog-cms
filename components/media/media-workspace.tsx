"use client";

import { useEffect, useState } from "react";
import type { MediaAsset } from "@/lib/media-data";
import { mediaService } from "@/lib/media-service";
import { MediaManager } from "./media-manager";
import { MediaUploader } from "./media-uploader";
import { useToast } from "@/components/ui/toast-provider";

export function MediaWorkspace() {
  const [assets, setAssets] = useState<MediaAsset[]>([]); const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  useEffect(() => { let active = true; mediaService.list().then((items) => { if (active) setAssets(items); }).catch((cause) => { if (active) toast({ tone: "error", message: cause instanceof Error ? cause.message : "دریافت رسانه‌ها انجام نشد." }); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [toast]);
  return <div className="space-y-5"><MediaUploader onUploaded={(items) => setAssets((current) => [...items, ...current])}/><MediaManager assets={assets} loading={loading} onAssetsChange={setAssets}/></div>;
}
