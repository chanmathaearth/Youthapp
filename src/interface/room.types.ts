import type { Teacher } from "./teacher.types";

export interface Room {
  id: number;
  name: string;
  teachers: Teacher[];
  min_age: number;
  max_age: number;
  children_count: number;
  image_url?: string;
  rating?: number;
}

export interface AssignStaffDto {
  staff_id: number;
  room_id: number;
}

export interface CreateRoomDto {
  name: string;
  minAge: number;
  maxAge: number;
  teacher: number[];
  imageUrl?: string;
}