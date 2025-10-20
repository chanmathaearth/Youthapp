export interface Teacher {
  id: number;
  staff: string;
  is_homeroom: boolean;
  room_name: string;
  assigned_at: string;
  unassigned_at: string | null;
}
