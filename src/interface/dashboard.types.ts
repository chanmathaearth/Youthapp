export interface DashboardOverview {
    total_children: number;
    average_score: number;
    assessed_children_count: number;
    pending_assessment_count: number;
    total_eligible_for_assessment: number;
}

export interface RoomDashboardOverview {
  id: number;
  name: string;
  total_children: number;
  assessed_children_count: number;
  pending_assessment_count: number;
  average_score: number;
  teachers: string[];
}