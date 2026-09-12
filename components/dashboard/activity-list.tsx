import { activities } from "@/lib/dashboard-data";

export function ActivityList() {
  return (
    <section className="rounded-(--radius) border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold">آخرین فعالیت‌ها</h2>
          <p className="mt-1 text-[13px] text-(--muted)">
            همکاری اعضای تحریریه
          </p>
        </div>
        <span className="size-2 rounded-full bg-(--brand-teal) ring-4 ring-(--focus-border)" />
      </div>
      <div className="mt-5 space-y-5">
        {activities.map((item, index) => (
          <div key={item.id} className="relative flex gap-3">
            {index < activities.length - 1 && (
              <span className="absolute right-3.75 top-8 h-[calc(100%+12px)] w-px bg-(--surface-muted)" />
            )}
            <span
              className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-bold ${item.color}`}
            >
              {item.avatar}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[14px] leading-5 text-(--text-secondary)">
                <strong className="text-(--text-strong)">{item.name}</strong>{" "}
                {item.action}
              </p>
              <time className="mt-1 block text-[12px] text-(--text-muted)">
                {item.time}
              </time>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
