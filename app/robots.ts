import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard", "/posts", "/analytics", "/comments", "/media", "/settings", "/search", "/authors/new", "/authors/*/edit", "/categories/new", "/categories/*/edit", "/tags/new", "/tags/*/edit"],
    },
    sitemap: "https://technama.ir/sitemap.xml",
  };
}
