export const faNumber = new Intl.NumberFormat("fa-IR");

export function formatBytes(bytes: number) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} گیگابایت`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} مگابایت`;
  return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString("fa-IR")} کیلوبایت`;
}

export function formatMediaDate(date: string) {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));
}

export function fileExtension(name: string) {
  return name.split(".").pop()?.toUpperCase() || "FILE";
}

