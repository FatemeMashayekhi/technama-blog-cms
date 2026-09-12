import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = ["app", "components"];
const fontSizeMap = { "7": "11", "8": "11", "9": "12", "10": "13", "11": "14" };
const tokenReplacements = new Map([
  ["bg-[#17384f]", "bg-(--brand-navy)"],
  ["hover:bg-[#102f44]", "hover:bg-(--brand-navy-hover)"],
  ["text-[#176f66]", "text-(--brand-teal)"],
  ["text-[#0f756b]", "text-(--brand-teal-hover)"],
  ["hover:text-[#0f756b]", "hover:text-(--brand-teal-hover)"],
  ["border-[#edf0f2]", "border-(--border-subtle)"],
  ["bg-[#fafbfc]", "bg-(--surface-subtle)"],
  ["text-[#ad3e3e]", "text-(--danger)"],
  ["bg-[#ad3e3e]", "bg-(--danger)"],
  ["focus:border-[#8caaa6]", "focus:border-(--focus-border)"],
  ["text-[#172630]", "text-(--text-strong)"],
  ["text-[#53616b]", "text-(--text-secondary)"],
]);

function parseHex(value) {
  const source = value.slice(1);
  const hex = source.length === 3 ? source.split("").map((part) => part + part).join("") : source.slice(0, 6);
  const number = Number.parseInt(hex, 16);
  return { r: (number >> 16) & 255, g: (number >> 8) & 255, b: number & 255 };
}

function colorProfile(hex) {
  const { r, g, b } = parseHex(hex);
  const [red, green, blue] = [r, g, b].map((value) => value / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;
  if (delta) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }
  if (hue < 0) hue += 360;
  return { lightness, saturation, hue };
}

function semanticToken(kind, hex) {
  const { lightness, saturation, hue } = colorProfile(hex);
  const colorful = saturation > 0.34;
  const red = colorful && (hue < 18 || hue > 342);
  const warning = colorful && hue >= 18 && hue < 70;
  const positive = colorful && hue >= 70 && hue < 190;
  const info = colorful && hue >= 190 && hue <= 342;

  if (kind === "text" || kind === "fill" || kind === "stroke") {
    if (lightness > 0.9) return "--text-on-dark";
    if (lightness > 0.72) return "--text-on-dark-muted";
    if (red) return "--danger";
    if (warning) return "--warning";
    if (positive) return "--brand-teal";
    if (info && lightness > 0.25) return "--info";
    if (lightness < 0.28) return "--text-strong";
    if (lightness < 0.48) return "--text-secondary";
    if (lightness < 0.62) return "--text-muted";
    return "--text-faint";
  }

  if (kind === "bg") {
    if (red) return lightness > 0.7 ? "--danger-soft" : "--danger";
    if (warning) return lightness > 0.7 ? "--warning-soft" : "--warning";
    if (positive) return lightness > 0.7 ? "--accent-soft" : "--brand-teal";
    if (info) return lightness > 0.7 ? "--surface-info" : "--brand-navy";
    if (lightness < 0.3) return "--brand-navy";
    if (lightness > 0.965) return "--surface-subtle";
    if (lightness > 0.86) return "--surface-muted";
    return "--border-strong";
  }

  if (red) return lightness > 0.65 ? "--danger-border" : "--danger";
  if (warning) return "--warning-border";
  if (positive || info) return lightness > 0.7 ? "--focus-border" : "--brand-teal";
  if (lightness < 0.4) return "--on-dark-border";
  return lightness > 0.9 ? "--border-subtle" : "--border-strong";
}

function normalizeArbitraryColors(source) {
  return source.replace(/(text|bg|border|ring|outline|fill|stroke)-\[(#[0-9a-fA-F]{3,8})\](\/\d+)?/g, (_, kind, hex, opacity = "") => {
    return `${kind}-(--${semanticToken(kind, hex).slice(2)})${opacity}`;
  });
}

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await visit(path);
    else if ([".tsx", ".ts"].includes(extname(entry.name))) {
      const original = await readFile(path, "utf8");
      let updated = original.replace(/text-\[(7|8|9|10|11)px\]/g, (_, size) => `text-[${fontSizeMap[size]}px]`);
      updated = updated.replace(/\b(?:size|h)-(8|9)\b/g, (token) => token.startsWith("size-") ? "size-10" : "h-10");
      updated = updated.replace(/<button\b[^>]*>/gs, (tag) => tag.replace(/\b(size|h)-(?:6|7|8|9)\b/g, "$1-10"));
      updated = updated
        .replace(/rounded-\[(?:7|8|9)px\]/g, "rounded-(--radius-sm)")
        .replace(/rounded-\[(?:10|11|12|13)px\]/g, "rounded-(--radius)")
        .replace(/rounded-\[(?:14|16)px\]/g, "rounded-(--radius-lg)");
      for (const [from, to] of tokenReplacements) updated = updated.replaceAll(from, to);
      updated = normalizeArbitraryColors(updated);
      if (updated !== original) await writeFile(path, updated, "utf8");
    }
  }
}

for (const root of roots) await visit(root);
