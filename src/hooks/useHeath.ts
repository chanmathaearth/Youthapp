import type { AxiosError } from "axios";
import type { HealthRecord } from "../interface/healthRecord.types";

import { useMutation, useQuery, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { getAll, postBody, updateById } from "../helpers";
import { showError, showSuccess } from "../utils/alert";

type DjangoError = {
    detail?: string;
    [key: string]: string[] | string | undefined;
};

type UpdateHealthRecord = {
  id: number;
  data: Partial<Pick<HealthRecord, "weight_kg" | "height_cm" | "remarks">>;
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

export const useUpdateHealthRecord = () => {
  const queryClient = useQueryClient();

  const options: UseMutationOptions<
    HealthRecord,                   // response
    AxiosError<DjangoError>,        // error
    UpdateHealthRecord     // variables
  > = {
    mutationFn: async ({ id, data }) =>
      await updateById(
        "development/api/v1/health-record",
        id,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-records"] });
      showSuccess(
      "บันทึกข้อมูลสำเร็จ",
      "ระบบได้อัปเดตข้อมูลสุขภาพเรียบร้อยแล้ว"
      );
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

      showError("อัปเดตข้อมูลสุขภาพไม่สำเร็จ", message);
    },
  };

  return useMutation(options);
};