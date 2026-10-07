import "server-only";

import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "del", "code", "pre",
  "blockquote", "ul", "ol", "li", "hr", "br", "a", "img",
];

export function sanitizeStoredArticleHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    enforceHtmlBoundary: true,
    nestingLimit: 20,
    transformTags: {
      a: (_tagName, attributes) => ({
        tagName: "a",
        attribs: { ...attributes, target: "_blank", rel: "noopener noreferrer nofollow" },
      }),
    },
  }).trim();
}

