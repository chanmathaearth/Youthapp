export interface UserDetail {
  id: number;
  first_name: string;
  last_name: string;
}

export interface HealthRecord {
  id: number;
  child: number;
  weight_kg: number | null;
  height_cm: number | null;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
  round?: number;
  create_by_detail?: UserDetail;
  update_by_detail?: UserDetail | null;
}

