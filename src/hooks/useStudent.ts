import type { Student } from "../interface/student";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, getById, postBody, deleteById, updateById } from "../helpers/index";
import type { AxiosError } from "axios";
import { showSuccess, showError } from "../utils/alert";

type DjangoError = {
  detail?: string;
  [key: string]: string[] | string | undefined;
};

export const useStudents = (roomId?: number) => {
  return useQuery<Student[]>({
    queryKey: ["children", roomId],
    queryFn: () => {
      const url = roomId
        ? `children/api/v1/children?room=${roomId}`
        : "children/api/v1/children";
      return getAll(url);
    },
    enabled: true,
  });
};

export const useStudentById = (id?: number) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getById("children/api/v1/children", id!),
    enabled: !!id,
  });
};
export const useStudentsByRoom = (roomId?: number) => {
  return useQuery<Student[]>({
    queryKey: ["children", "room", roomId],
    queryFn: async () => {
      return await getAll(`children/api/v1/children/?room=${roomId}`);
    },
    enabled: !!roomId,
  });
};


export const useAddStudent = (onClose?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newChild: {
      firstName: string;
      lastName: string;
      nickname: string;
      dob: string; // YYYY-MM-DD
      room: string | number;
      gender: string;
    }) => {
      const payload = {
        first_name: newChild.firstName,
        last_name: newChild.lastName,
        nickname: newChild.nickname,
        birth: newChild.dob,
        gender: newChild.gender,
        room: parseInt(newChild.room as string),
        create_by: 1,
        update_by: 1,
      };
      return await postBody("children/api/v1/children", payload);
    },
    onSuccess: (student: Student) => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      onClose?.();
      showSuccess(
        "เพิ่มข้อมูลเด็กสำเร็จ",
        `เพิ่ม ${student.first_name} ${student.last_name} เรียบร้อยแล้ว`
      );
    },
    onError: (err: AxiosError<DjangoError>) => {
      const data = err.response?.data;
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
      showError("เกิดข้อผิดพลาด", message);
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Student> }) =>
      updateById("children/api/v1/children", id, data),
    onSuccess: (res: Student) => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      showSuccess("แก้ไขข้อมูลสำเร็จ", `${res.first_name} ${res.last_name} ถูกอัปเดตเรียบร้อยแล้ว`);
    },
    onError: (err: AxiosError<DjangoError>) => {
      showError("ผิดพลาด", err.response?.data?.detail || "ไม่สามารถแก้ไขข้อมูลได้");
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteById("children/api/v1/children", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      showSuccess("สำเร็จ", "ลบข้อมูลเด็กเรียบร้อยแล้ว");
    },
    onError: (err: AxiosError<DjangoError>) => {
      const data = err.response?.data;
      const message = data?.detail || "ไม่สามารถลบข้อมูลเด็กได้";
      showError("ผิดพลาด", message);
    },
  });
};
