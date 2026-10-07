import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { PublicDirectorySkeleton } from "@/components/skeletons/public-directory-skeleton";

export default function ArticlesLoading() { return <div className="public-site min-h-screen"><PublicHeader/><PublicDirectorySkeleton variant="articles"/><PublicFooter/></div>; }
