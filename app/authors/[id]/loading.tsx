import { AuthorPageSkeleton } from "@/components/public/author/author-page-skeleton";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export default function AuthorLoading() { return <div className="public-site min-h-screen"><PublicHeader/><AuthorPageSkeleton/><PublicFooter/></div>; }
