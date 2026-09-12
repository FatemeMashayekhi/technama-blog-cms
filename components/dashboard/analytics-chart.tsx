import { ChevronDown } from "lucide-react";
import { chartData } from "@/lib/dashboard-data";

function chartGeometry(values: number[]) {
  const width = 900,
    height = 220,
    padding = 8;
  const min = Math.min(...values),
    max = Math.max(...values);
  const points = values
    .map((value, index) => {
      const x = padding + (index / (values.length - 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        ((value - min) / (max - min)) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
  return {
    points,
    area: `${padding},${height} ${points} ${width - padding},${height}`,
  };
}

export function AnalyticsChart() {
  const { points, area } = chartGeometry(chartData);
  return (
    <section className="rounded-(--radius) border border-(--border) bg-white p-4 sm:p-6 lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-(--text-strong)">
            روند بازدید مقاله‌ها
          </h2>
          <p className="mt-1.5 text-[14px] text-(--muted)">
            مجموع بازدیدهای ۳۰ روز گذشته
          </p>
        </div>
        <button className="flex h-10 items-center gap-2 rounded-lg border border-(--border) px-3 text-[14px] font-bold text-(--text-secondary) hover:bg-(--surface-subtle)">
          ۳۰ روز گذشته <ChevronDown size={14} />
        </button>
      </div>
      <div className="mt-5 flex items-end gap-3">
        <strong className="text-[28px] tracking-[-.04em] text-(--text-strong)">
          ۲۸٬۶۴۰
        </strong>
        <span className="mb-1 rounded-md bg-(--accent-soft) px-2 py-1 text-[13px] font-bold text-(--accent)">
          ↑ ۱۸٫۴٪
        </span>
      </div>
      <div
        className="relative mt-6 h-57.5 w-full"
        aria-label="نمودار بازدید صعودی مقاله‌ها در ۳۰ روز گذشته"
        role="img"
      >
        <div
          className="absolute inset-0 flex flex-col justify-between"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="block border-t border-dashed border-(--border-subtle)"
            />
          ))}
        </div>
        <svg
          className="relative h-51.25 w-full overflow-visible"
          viewBox="0 0 900 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16877b" stopOpacity=".2" />
              <stop offset="100%" stopColor="#16877b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#area)" />
          <polyline
            points={points}
            fill="none"
            stroke="#13786f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="892"
            cy="8"
            r="5"
            fill="#fff"
            stroke="#13786f"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex justify-between text-[12px] text-(--text-muted)">
          <span>۲۰ مرداد</span>
          <span>۲۷ مرداد</span>
          <span>۳ شهریور</span>
          <span>۱۰ شهریور</span>
          <span>۱۸ شهریور</span>
        </div>
      </div>
    </section>
  );
}
