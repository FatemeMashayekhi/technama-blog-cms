import { Files, HardDrive, ImageIcon, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { mediaStats } from "@/lib/media-data";
import { faNumber, formatBytes } from "./media-utils";

export function MediaStats() {
  return <section aria-label="خلاصه رسانه‌ها" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="تعداد فایل‌ها" value={faNumber.format(mediaStats.total)} trend="۱۲٪" icon={Files} accent /><StatCard label="فضای استفاده‌شده" value={formatBytes(mediaStats.usedBytes)} trend="۸٪" icon={HardDrive} /><StatCard label="تصاویر" value={faNumber.format(mediaStats.images)} trend="۱۰٪" icon={ImageIcon} /><StatCard label="فایل‌های این ماه" value={`+${faNumber.format(mediaStats.thisMonth)}`} trend="۱۸٪" icon={TrendingUp} /></section>;
}

