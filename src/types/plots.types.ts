export interface plots {
  plot_id: string | number;
  block: string | null;
  category: "Diamond" | "Platinum" | "Gold" | "Silver" | "Bronze" | "Columbarium" | "Chambers";
  length: string | null;
  width: string | null;
  area: string | null;
  rows: string | null;
  columns: string | null;
  status: "available" | "reserved" | "occupied" | null;
  label: string | null;
  coordinates: [number, number];
}
