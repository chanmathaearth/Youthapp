import type { Teacher } from "./teacher";

export interface Room {
  id: number;
  name: string;
  teachers: Teacher[];
  min_age: number;         // เดือน
  max_age: number;         // เดือน
  children_count: number;  // จำนวนนักเรียน
  image?: string;
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
  teacher: number[];   // ส่ง id ของ staff
  imageUrl?: string;
}