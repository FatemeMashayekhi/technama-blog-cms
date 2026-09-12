import { commentStatusMeta, type CommentStatus } from "@/lib/comments-data";
export function CommentStatusBadge({ status }: { status: CommentStatus }) { const meta = commentStatusMeta[status]; return <span className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[14px] font-bold ${meta.className}`}>{meta.label}</span>; }

