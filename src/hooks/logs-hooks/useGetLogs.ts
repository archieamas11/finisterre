import { useQuery } from "@tanstack/react-query";
import { getLogs, type GetLogsParams, type ActivityLog } from "@/api/logs.api";

export function useGetLogs(params: GetLogsParams = {}) {
  return useQuery<{ success: boolean; message: string; logs: ActivityLog[] }>({
    queryKey: ["logs", params],
    queryFn: async () => {
      const r = await getLogs(params);
      return r;
    },
  });
}
