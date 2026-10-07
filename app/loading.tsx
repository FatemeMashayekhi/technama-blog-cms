import { HomePageSkeleton } from "@/components/skeletons/home-page-skeleton";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export default function HomeLoading() {
  return <div className="public-site min-h-screen"><PublicHeader/><HomePageSkeleton/><PublicFooter/></div>;
}
