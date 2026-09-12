import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "تک‌نما؛ مجله فناوری و نوآوری",
    short_name: "تک‌نما",
    description: "تحلیل عمیق فناوری، محصول و نوآوری",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f9f8",
    theme_color: "#17384f",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    lang: "fa",
    dir: "rtl",
  };
}
