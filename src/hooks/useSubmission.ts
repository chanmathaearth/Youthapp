import { useQuery } from "@tanstack/react-query";
import { getAll, getById, postBody } from "../helpers";

import type { AxiosError } from "axios";
import { showError } from "../utils/alert";
import type { Submission } from "../interface/submission.types";

type DjangoError = {
  detail?: string;
  [key: string]: unknown;
};

export const useSubmissionsByChild = (childId?: number) => {
  const query = useQuery<Submission[], AxiosError<DjangoError>>({
    queryKey: ["submissions", childId],
    queryFn: async () => {
      try {
        return await getAll(
          `development/api/v1/submissions/?children=${childId}`
        );
      } catch (err) {
        const error = err as AxiosError<DjangoError>;
        const data = error.response?.data;
        let message = "เกิดข้อผิดพลาดจากระบบ";

        if (data?.detail) {
          message = data.detail;
        } else if (typeof data === "object") {
          message = Object.entries(data)
            .map(
              ([field, msgs]) =>
                `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
            )
            .join("\n");
        }

        showError("ไม่สามารถโหลดผลการประเมินได้", message);
        throw error; // ให้ React Query จัดการสถานะ error ด้วย
      }
    },
    enabled: !!childId,
  });

  return query;
};

export const useSubmissionDetail = (id?: number) => {
  const query = useQuery<Submission, AxiosError<DjangoError>>({
    queryKey: ["submission-detail", id],
    queryFn: async () => {
      try {
        return await getById(
          `development/api/v1/submissions`,
          id!
        );
      } catch (err) {
        const error = err as AxiosError<DjangoError>;
        const data = error.response?.data;
        let message = "เกิดข้อผิดพลาดจากระบบ";

        if (data?.detail) {
          message = data.detail;
        } else if (typeof data === "object") {
          message = Object.entries(data)
            .map(
              ([field, msgs]) =>
                `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
            )
            .join("\n");
        }

        showError("โหลดรายละเอียดผลการประเมินไม่สำเร็จ", message);
        throw error; // ให้ React Query จัดการต่อ
      }
    },
    enabled: !!id,
  });

  return query;
};

export const useSubmissionsByLineId = (lineUserId: string | null, childId?: number) => {
    return useQuery<Submission[]>({
        queryKey: ["submissions-line", lineUserId, childId],
        queryFn: async () => {
            const res = await postBody("line-bot/api/v1/get-submissions", { line_user_id: lineUserId, child_id: childId });
            return res.status === "success" ? res.data : [];
        },
        enabled: !!lineUserId && !!childId,
    });
};

