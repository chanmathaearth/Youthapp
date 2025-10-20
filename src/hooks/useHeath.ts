import { useMutation, useQuery, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { getAll, postBody } from "../helpers";
import type { AxiosError } from "axios";
import { showError, showSuccess } from "../utils/alert";

export interface HealthRecord {
  id: number;
  child: number;
  weight_kg: number | null;
  height_cm: number | null;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
}

type DjangoError = {
    detail?: string;
    [key: string]: string[] | string | undefined;
};

export const useHealthRecordsByChild = (childId?: number) => {
  const query = useQuery<HealthRecord[]>({
    queryKey: ["health-records", childId],
    queryFn: async () =>
      await getAll(`development/api/v1/health-record/?child=${childId}`),
    enabled: !!childId,
    retry: false,
  });

  if (query.error) {
    const err = query.error as AxiosError<DjangoError>;
    const data = err.response?.data;
    let message = "เกิดข้อผิดพลาดจากระบบ";

    if (data?.detail) {
      message = data.detail;
    } else if (typeof data === "object") {
      message = Object.entries(data)
        .map(([field, msgs]) =>
          `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
        )
        .join("\n");
    }

    showError("โหลดข้อมูลสุขภาพไม่สำเร็จ", message);
  }

  return query;
};

export const useCreateHealthRecord = () => {
  const queryClient = useQueryClient();

  // ✅ ใช้ UseMutationOptions เพื่อหลีกเลี่ยง overload error
  const options: UseMutationOptions<
    HealthRecord,                      // TData (response)
    AxiosError<DjangoError>,           // TError
    Omit<HealthRecord, "id" | "created_at" | "updated_at"> // TVariables
  > = {
    mutationFn: async (newRecord) =>
      await postBody("development/api/v1/health-record", newRecord),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["health-records"] });
      showSuccess("บันทึกข้อมูลสุขภาพสำเร็จ", `เพิ่มข้อมูลสุขภาพของเด็ก ID: ${data.child}`);
    },

    onError: (err) => {
      const data = err.response?.data;
      let message = "เกิดข้อผิดพลาดจากระบบ";

      if (data?.detail) {
        message = data.detail;
      } else if (typeof data === "object") {
        message = Object.entries(data)
          .map(([field, msgs]) =>
            `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
          )
          .join("\n");
      }

      showError("บันทึกข้อมูลสุขภาพไม่สำเร็จ", message);
    },
  };

  return useMutation(options);
};
