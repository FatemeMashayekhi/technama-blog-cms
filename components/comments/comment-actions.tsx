"use client";
import Link from "next/link";
import { Ban, CheckCircle2, Eye, ExternalLink, MoreHorizontal, Trash2, XCircle } from "lucide-react";
import { useRef } from "react";
import type { CommentStatus, MagazineComment } from "@/lib/comments-data";

export function CommentActions({ comment, onPreview, onStatus, onDelete }: { comment: MagazineComment; onPreview: () => void; onStatus: (status: CommentStatus) => void; onDelete: () => void }) {
  const ref = useRef<HTMLDetailsElement>(null); const close = () => ref.current?.removeAttribute("open");
  return <details ref={ref} className="relative"><summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg text-(--text-muted) hover:bg-(--surface-muted) [&::-webkit-details-marker]:hidden" aria-label={`عملیات دیدگاه ${comment.commenter.name}`}><MoreHorizontal size={18}/></summary><div className="absolute left-0 top-9 z-30 w-44 rounded-(--radius) border border-(--border) bg-white p-1.5 text-right shadow-[0_12px_30px_rgba(23,38,48,.13)]"><button type="button" onClick={() => { onPreview(); close(); }} className={itemClass}><Eye size={14}/> مشاهده دیدگاه</button><Link href={`/admin/posts/${comment.article.id}/edit`} onClick={close} className={itemClass}><ExternalLink size={14}/> مشاهده مقاله</Link>{comment.status !== "approved" && <button type="button" onClick={() => { onStatus("approved"); close(); }} className={itemClass}><CheckCircle2 size={14}/> تأیید</button>}{comment.status !== "rejected" && <button type="button" onClick={() => { onStatus("rejected"); close(); }} className={itemClass}><XCircle size={14}/> رد کردن</button>}{comment.status !== "spam" && <button type="button" onClick={() => { onStatus("spam"); close(); }} className={itemClass}><Ban size={14}/> علامت‌گذاری اسپم</button>}<div className="my-1 border-t border-(--border-subtle)"/><button type="button" onClick={() => { onDelete(); close(); }} className={`${itemClass} font-bold text-(--danger) hover:bg-(--danger-soft)`}><Trash2 size={14}/> حذف</button></div></details>;
}
const itemClass = "flex h-10 w-full items-center gap-2 rounded-md px-2.5 text-[13px] text-(--text-secondary) hover:bg-(--surface-muted)";

