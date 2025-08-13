import { api } from "./axiosInstance";

export interface MapStatsResponse {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
}

function normalizeStatsPayload(data: any): MapStatsResponse {
  const total = Number(data?.total ?? data?.totalPlots ?? 0);
  const occupied = Number(data?.occupied ?? 0);
  const reserved = Number(data?.reserved ?? 0);
  // If API already provides available, trust it; otherwise derive
  const available = Number(data?.available ?? total - occupied - reserved);
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
