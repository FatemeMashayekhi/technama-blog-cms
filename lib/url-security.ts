const allowedProtocols = new Set(["http:", "https:"]);

export function normalizeWebUrl(value: string, options: { allowRelative?: boolean } = {}) {
  const candidate = value.trim();
  if (!candidate || candidate.length > 2_000 || /[\u0000-\u001f\u007f]/.test(candidate)) return null;
  if (candidate.startsWith("//") || candidate.startsWith("\\")) return null;
  if (options.allowRelative && candidate.startsWith("/")) return candidate;
  try {
    const parsed = new URL(candidate);
    if (!allowedProtocols.has(parsed.protocol) || parsed.username || parsed.password) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

