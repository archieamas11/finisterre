export interface nicheData {
  row: number;
  col: number;
  lot_id: string;
  niche_number: number;
  customer_id?: string;
  niche_status: "available" | "occupied" | "reserved";
  owner?: {
    customer_id: string;
    phone: string;
    email: string;
    name: string;
  };
  deceased?: {
    dateOfInterment: string;
    deceased_id: string;
    dateOfBirth: string;
    dateOfDeath: string;
    name: string;
  };
}
