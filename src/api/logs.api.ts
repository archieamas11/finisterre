import { api } from "./axiosInstance";

export type LogAction = "ADD" | "UPDATE" | "DELETE" | "LOGIN" | string;

export interface ActivityLog {
  log_id: number;
  user_id: number;
  username: string | null;
  action: LogAction;
  target: string;
  details: string | null;
  created_at: string;
}

export interface GetLogsParams {
  limit?: number;
  userId?: number | string;
  action?: LogAction;
  search?: string;
}

export async function getLogs(params: GetLogsParams = {}) {
  try {
    const res = await api.post("logs/get_logs.php", params);
    return res.data as { success: boolean; message: string; logs: ActivityLog[] };
  } catch (error) {
    throw error;
  }
}
