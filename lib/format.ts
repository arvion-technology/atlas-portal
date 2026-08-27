/**
 * Display formatting. Kept separate from selectors so tests can check that
 * money and dates read correctly without a rendering layer in the way.
 */

export function formatMoney(minor: number, currency = "USD"): string {
  if (!Number.isInteger(minor)) throw new TypeError("money must be an integer count of minor units");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}

export function formatMoneyCompact(minor: number, currency = "USD"): string {
  const major = minor / 100;
  if (Math.abs(major) >= 1_000_000) return `$${(major / 1_000_000).toFixed(1)}M`;
  if (Math.abs(major) >= 10_000) return `$${Math.round(major / 1_000)}k`;
  return formatMoney(minor, currency);
}

export function formatDateKey(key: string): string {
  const date = new Date(`${key}T00:00:00Z`);
  if (Number.isNaN(+date)) throw new TypeError(`invalid date key: ${key}`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatShortDateKey(key: string): string {
  const date = new Date(`${key}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(+date)) throw new TypeError(`invalid timestamp: ${iso}`);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: false,
  });
}

export function daysBetween(fromKey: string, toKey: string): number {
  const from = Date.parse(`${fromKey}T00:00:00Z`);
  const to = Date.parse(`${toKey}T00:00:00Z`);
  return Math.round((to - from) / 86_400_000);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function percent(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
