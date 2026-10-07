import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { PublicDirectorySkeleton } from "@/components/skeletons/public-directory-skeleton";

export default function AuthorsLoading() { return <div className="public-site min-h-screen"><PublicHeader/><PublicDirectorySkeleton variant="authors"/><PublicFooter/></div>; }

