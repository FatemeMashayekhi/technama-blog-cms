import { Flame } from "lucide-react";
import Link from "next/link";
import type { Tag } from "@/lib/taxonomy-data";

export function TrendingTopics({ tags }: { tags: Tag[] }) {
  return <section aria-label="موضوعات داغ" className="border-b border-(--border) bg-white">
    <div className="mx-auto flex max-w-360 items-center gap-4 overflow-x-auto px-4 py-4 md:px-7">
      <strong className="flex shrink-0 items-center gap-1.5 text-[13px] font-black text-(--editorial-coral)"><Flame size={15}/> داغ این هفته</strong>
      <span aria-hidden="true" className="h-5 w-px shrink-0 bg-(--border-strong)"/>
      {tags.slice(0, 7).map((tag) => <Link key={tag.id} href={`/tags/${tag.slug}`} className="shrink-0 rounded-full border border-(--border) bg-(--public-paper) px-3 py-1.5 text-[13px] font-bold text-(--text-secondary) transition hover:border-(--editorial-coral) hover:text-(--editorial-coral)">#{tag.name}</Link>)}
    </div>
  </section>;
}
