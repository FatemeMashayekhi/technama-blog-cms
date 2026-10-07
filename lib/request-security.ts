import { createHash } from "node:crypto";

export class RequestSecurityError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "RequestSecurityError";
  }
}

type MutationRequestOptions = {
  maxBytes?: number;
  contentTypes?: string[];
  requireBody?: boolean;
};

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function configuredOrigin() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function assertMutationRequest(request: Request, options: MutationRequestOptions = {}) {
  if (!unsafeMethods.has(request.method.toUpperCase())) return;

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    throw new RequestSecurityError("مبدأ درخواست معتبر نیست.", 403, "CROSS_SITE_REQUEST");
  }

  const origin = request.headers.get("origin");
  if (origin) {
    const allowedOrigins = new Set([new URL(request.url).origin, configuredOrigin()].filter(Boolean));
    if (!allowedOrigins.has(origin)) {
      throw new RequestSecurityError("مبدأ درخواست معتبر نیست.", 403, "INVALID_ORIGIN");
    }
  }

  const maxBytes = options.maxBytes ?? 64 * 1024;
  const lengthHeader = request.headers.get("content-length");
  if (lengthHeader) {
    const length = Number(lengthHeader);
    if (!Number.isSafeInteger(length) || length < 0 || length > maxBytes) {
      throw new RequestSecurityError("حجم درخواست بیشتر از حد مجاز است.", 413, "REQUEST_TOO_LARGE");
    }
  }

  if (options.contentTypes?.length) {
    const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() ?? "";
    if (!options.contentTypes.includes(contentType)) {
      throw new RequestSecurityError("نوع محتوای درخواست پشتیبانی نمی‌شود.", 415, "UNSUPPORTED_MEDIA_TYPE");
    }
  } else if (options.requireBody && request.body === null) {
    throw new RequestSecurityError("بدنه درخواست الزامی است.", 400, "BODY_REQUIRED");
  }
}

export function safeAdminPath(value: unknown) {
  if (typeof value !== "string" || value.length > 300 || /[\\\u0000-\u001f]/.test(value)) return "/admin/dashboard";
  try {
    const parsed = new URL(value, "https://technama.invalid");
    const isInternal = parsed.origin === "https://technama.invalid";
    const isAdmin = parsed.pathname === "/admin" || parsed.pathname.startsWith("/admin/");
    return isInternal && isAdmin ? `${parsed.pathname}${parsed.search}${parsed.hash}` : "/admin/dashboard";
  } catch {
    return "/admin/dashboard";
  }
}

export function stableSecuritySubject(value: string) {
  return createHash("sha256").update(value.trim().toLocaleLowerCase("en-US")).digest("hex").slice(0, 32);
}

