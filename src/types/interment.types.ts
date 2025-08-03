export type Customer = {
  select: boolean;
  customer_id: string;
  user_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  nickname: string;
  address: string;
  contact_number: string;
  birth_date: string;
  gender: string;
  religion: string;
  citizenship: string;
  status?: string;
  occupation: string;
  created_at: string;
  updated_at: string;
};

export type LotOwners = {
  select: boolean;
  lot_id: string;
  customer_id: string;
  type: string;
  payment_type: string;
  payment_frequency: string;
  start_date: string;
  last_payment_date: string;
  next_due_date: string;
  lot_status?: string;
  created_at: string;
  updated_at: string;
  // Join fields
  customer_name?: string;

  // Location data
  plot_id: string;
  block?: string;
  category: string;
  niche_id?: string;
  niche_number?: string;
};

export type DeceasedRecords = {
  deceased_id: string;
  dead_fullname: string;
  dead_gender: string;
  dead_citizenship: string;
  dead_civil_status: string;
  dead_relationship: string;
  dead_message?: string | null;
  dead_bio?: string | null;
  dead_profile_link?: string | null;
  dead_interment: string;
  dead_birth_date: string;
  dead_date_death: string;
  created_at: string;
  updated_at: string;

  // Join fields
  lot_id: string;
  type: string;
  block: string;
  plot_id: string;
  full_name?: string;
};
