import { SearchPageSkeleton } from "@/components/public/search/search-page-states";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export default function SearchLoading() {
  return <div className="public-site min-h-screen"><PublicHeader/><SearchPageSkeleton/><PublicFooter/></div>;
}
