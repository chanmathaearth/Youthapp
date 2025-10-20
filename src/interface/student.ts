import type { Room } from "./room";

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  current_evaluation_status: string;
  nickname?: string;
  birth: string;
  room: Room | number;
  room_name?: string;
  create_by: number;
  update_by: number;
  created_at: string;
  updated_at: string;
  gender: string;
}
