export interface DeceasedRecords {
  block: string;
  lot_id: string;
  plot_id: string;
  category: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  deceased_id: string;
  dead_gender: string;
  dead_fullname: string;
  niche_number?: string;
  dead_interment: string;
  dead_birth_date: string;
  dead_date_death: string;

  dead_citizenship: string;
  dead_bio?: string | null;
  dead_civil_status: string;
  dead_relationship: string;
  dead_message?: string | null;
  dead_profile_link?: string | null;
}

export interface LotOwners {
  lot_id: string;
  block?: string;
  plot_id: string;
  category: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  lot_status?: string;
  niche_status?: string;
  niche_number?: string;
  customer_name?: string;
}

export interface Customer {
  email: string;
  gender: string;
  select: boolean;
  user_id: string;
  address: string;
  status?: string;
  nickname: string;
  religion: string;
  last_name: string;
  first_name: string;
  birth_date: string;
  occupation: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  middle_name: string;
  citizenship: string;
  contact_number: string;
}
