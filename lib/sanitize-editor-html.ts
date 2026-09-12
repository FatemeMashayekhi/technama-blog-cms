const allowedTags = new Set([
  "P", "H2", "H3", "H4", "STRONG", "B", "EM", "I", "U", "S", "DEL", "CODE", "PRE",
  "BLOCKQUOTE", "UL", "OL", "LI", "HR", "BR", "A", "IMG",
]);

const removableTags = new Set([
  "SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "SVG", "MATH", "FORM", "INPUT", "BUTTON", "VIDEO", "AUDIO",
]);

function safeUrl(value: string, image = false) {
  const url = value.trim();
  if (!url) return false;
  if (url.startsWith("/") || (!image && url.startsWith("#"))) return true;
  try {
    const parsed = new URL(url);
    return image ? ["http:", "https:"].includes(parsed.protocol) : ["http:", "https:", "mailto:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/** Sanitizes editor HTML in the browser with a strict element and attribute allow-list. */
export function sanitizeEditorHtml(html: string) {
  if (typeof DOMParser === "undefined") return "";
  const document = new DOMParser().parseFromString(html, "text/html");

  for (const element of Array.from(document.body.querySelectorAll("*"))) {
    if (removableTags.has(element.tagName)) {
      element.remove();
      continue;
    }
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      continue;
    }

    const allowedAttributes = element.tagName === "A"
      ? new Set(["href", "title"])
      : element.tagName === "IMG"
        ? new Set(["src", "alt", "title", "width", "height"])
        : new Set<string>();

    for (const attribute of Array.from(element.attributes)) {
      if (!allowedAttributes.has(attribute.name.toLowerCase())) element.removeAttribute(attribute.name);
    }

    if (element instanceof HTMLAnchorElement) {
      if (!safeUrl(element.getAttribute("href") || "")) element.removeAttribute("href");
      else {
        element.target = "_blank";
        element.rel = "noopener noreferrer nofollow";
      }
    }
    if (element instanceof HTMLImageElement && !safeUrl(element.getAttribute("src") || "", true)) element.remove();
  }

  return document.body.innerHTML;
}
