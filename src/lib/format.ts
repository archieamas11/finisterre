export function formatDate(date: Date | string | number | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    return "";
  }
}

// 📏 Distance: prefer km for long distances
export function formatDistance(meters?: number): string {
  if (!Number.isFinite(meters)) return "-";
  if ((meters ?? 0) >= 1000) return `${(meters! / 1000).toFixed(1)} km`;
  return `${Math.round(meters!)} m`;
}

// ⏱️ Duration: human readable h m
export function formatDuration(seconds?: number): string {
  if (!Number.isFinite(seconds)) return "-";
  const s = Math.round(seconds!);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function ucwords(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
