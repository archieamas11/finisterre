import { api } from "./axiosInstance";

export interface MapStatsResponse {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
}

function normalizeStatsPayload(data: unknown): MapStatsResponse {
  const payload = (data ?? {}) as Record<string, unknown>;
  const total = Number(payload.total ?? payload.totalPlots ?? 0);
  const occupied = Number(payload.occupied ?? 0);
  const reserved = Number(payload.reserved ?? 0);
  // If API already provides available, trust it; otherwise derive
  const available = Number(payload.available ?? total - occupied - reserved);
  return { total, available, occupied, reserved };
}

export async function getChambersStats(): Promise<MapStatsResponse> {
  const res = await api.post("map-stats/get_chambers.php");
  const payload = res?.data?.data ?? res?.data; // allow either { data: {...} } or direct fields
  const normalized = normalizeStatsPayload(payload);
  if (Number.isNaN(normalized.total)) {
    throw new Error("Invalid chambers stats response");
  }
  return normalized;
}

export async function getSerenityStats(): Promise<MapStatsResponse> {
  const res = await api.post("map-stats/get_serenity.php");
  const payload = res?.data?.data ?? res?.data;
  const normalized = normalizeStatsPayload(payload);
  if (Number.isNaN(normalized.total)) {
    throw new Error("Invalid serenity stats response");
  }
  return normalized;
}
