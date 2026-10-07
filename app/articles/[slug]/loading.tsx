import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { ArticleDetailSkeleton } from "@/components/skeletons/article-detail-skeleton";

export default function Loading() { return <div className="public-site min-h-screen"><PublicHeader/><ArticleDetailSkeleton/><PublicFooter/></div>; }

