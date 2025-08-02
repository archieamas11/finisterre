// 🏛️ Columbarium and Niche-related types for future API integration

export interface NicheData {
  id: string;
  row: number;
  col: number;
  columbarium_id: string;
  status: "available" | "occupied" | "reserved";
  price?: number;
  owner?: NicheOwner;
  deceased?: DeceasedInfo;
  created_at?: string;
  updated_at?: string;
}

export interface NicheOwner {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  purchase_date?: string;
  payment_status?: "paid" | "partial" | "pending";
}

export interface DeceasedInfo {
  id?: string;
  name: string;
  dateOfBirth: string;
  dateOfDeath: string;
  dateOfInterment: string;
  placeOfBirth?: string;
  causeOfDeath?: string;
  next_of_kin?: string;
}

export interface ColumbariumNicheResponse {
  success: boolean;
  message?: string;
  niches: NicheData[];
}

// 🎯 API endpoints for niche management (future implementation)
export interface NicheApiEndpoints {
  getNichesByColumbariumId: (
    columbariumId: string
  ) => Promise<ColumbariumNicheResponse>;
  reserveNiche: (
    nicheId: string,
    ownerData: NicheOwner
  ) => Promise<{ success: boolean; message: string }>;
  occupyNiche: (
    nicheId: string,
    deceasedData: DeceasedInfo
  ) => Promise<{ success: boolean; message: string }>;
  updateNicheStatus: (
    nicheId: string,
    status: NicheData["status"]
  ) => Promise<{ success: boolean; message: string }>;
  getNicheDetails: (
    nicheId: string
  ) => Promise<{ success: boolean; niche: NicheData }>;
}

// 🔍 Search and filter types
export interface NicheSearchFilter {
  columbariumId?: string;
  status?: NicheData["status"][];
  priceRange?: { min: number; max: number };
  availableOnly?: boolean;
}
