import { useQuery } from "@tanstack/react-query";
import { getAll } from "../helpers";

export interface DashboardOverview {
    total_children: number;
    average_score: number;
    assessed_children_count: number;
    pending_assessment_count: number;
    total_eligible_for_assessment: number;
}

/**
 * ดึงข้อมูลสรุป Dashboard ทั้งหมด
 */
export const useDashboardOverview = () => {
    return useQuery<DashboardOverview>({
        queryKey: ["dashboard-overview"],
        queryFn: () =>
            getAll("children/api/v1/dashboard/overview"),
        initialData: {
            total_children: 0,
            average_score: 0,
            assessed_children_count: 0,
            pending_assessment_count: 0,
            total_eligible_for_assessment: 0,
        },
    });
};

export const useDashboardRoomOverview = () => {
    return useQuery<any>({
        queryKey: ["dashboard-room-overview"],
        queryFn: () =>
            getAll("room/api/v1/dashboard/rooms-overview/"),
        initialData: {
            total_children: 0,
            average_score: 0,
            assessed_children_count: 0,
            pending_assessment_count: 0,
        },
    });
};
