import type { CommentStatus, MagazineComment } from "@/lib/comments-data";

const wait = (duration = 300) => new Promise((resolve) => setTimeout(resolve, duration));

export const commentsService = {
  async updateStatus(comment: MagazineComment, status: CommentStatus): Promise<MagazineComment> { await wait(); return { ...comment, status, updatedAt: new Date().toISOString() }; },
  async updateMany(comments: MagazineComment[], ids: Set<string>, status: CommentStatus): Promise<MagazineComment[]> { await wait(); return comments.map((comment) => ids.has(comment.id) ? { ...comment, status, updatedAt: new Date().toISOString() } : comment); },
  async remove(comments: MagazineComment[], ids: Set<string>): Promise<MagazineComment[]> { await wait(); return comments.filter((comment) => !ids.has(comment.id)); },
};
