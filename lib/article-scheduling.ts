const localDateTimePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const tehranTimeZone = "Asia/Tehran";

function tehranParts(timestamp: number) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: tehranTimeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date(timestamp));
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute"), second: get("second") };
}

export function tehranDateTimeToIso(value?: string | null) {
  if (!value) return null;
  if (/Z$|[+-]\d{2}:\d{2}$/.test(value)) {
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
  }
  const match = localDateTimePattern.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match.map(Number);
  const desiredWallClock = Date.UTC(year, month - 1, day, hour, minute);
  let timestamp = desiredWallClock;
  for (let pass = 0; pass < 2; pass += 1) {
    const actual = tehranParts(timestamp);
    const actualWallClock = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, actual.second);
    timestamp += desiredWallClock - actualWallClock;
  }
  const parsed = new Date(timestamp);
  return formatTehranDateTimeInput(parsed.toISOString()) === value ? parsed.toISOString() : null;
}

export function formatTehranDateTimeInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: tehranTimeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function isFutureTehranDateTime(value?: string | null, now = Date.now()) {
  const iso = tehranDateTimeToIso(value);
  return Boolean(iso && Date.parse(iso) > now);
}
