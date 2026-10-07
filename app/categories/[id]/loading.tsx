import { CategoryPageSkeleton } from "@/components/public/category/category-page-states";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export default function CategoryLoading() { return <div className="public-site min-h-screen"><PublicHeader/><CategoryPageSkeleton/><PublicFooter/></div>; }
