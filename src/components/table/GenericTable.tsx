import { useEffect, useState } from "react";

interface GenericTableProps<T> {
  fetchData: () => Promise<{ success: boolean; [key: string]: unknown }>;
  extractData: (response: unknown) => T[];
  TableComponent: React.ComponentType<{ data: T[] }>;
  loadingMessage?: string;
}

export function GenericTable<T>({
  fetchData,
  extractData,
  TableComponent,
  loadingMessage = "Loading...",
}: GenericTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await fetchData();
        if (response && response.success) {
          setData(extractData(response));
        } else {
          setData([]);
        }
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData, extractData]);

  if (loading) return <div>{loadingMessage}</div>;
  return <TableComponent data={data} />;
}
