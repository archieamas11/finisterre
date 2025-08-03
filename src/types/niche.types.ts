export type nicheData = {
  id: string;
  niche_number: number;
  row: number;
  col: number;
  niche_status: "available" | "occupied" | "reserved";
  owner?: {
    customer_id: string;
    name: string;
    phone: string;
    email: string;
  };
  deceased?: {
    deceased_id: string;
    name: string;
    dateOfBirth: string;
    dateOfDeath: string;
    dateOfInterment: string;
  };
};
