import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, getById, deleteById, updateById, postBody } from "../helpers/index";
import type { User, newUser } from "../interface/user";
import type { AxiosError } from "axios";
import { showSuccess, showError } from "../utils/alert";

type DjangoError = {
  detail?: string;
  [key: string]: unknown;
};


export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getAll("authen/api/v1/users"),
  });
};

export const useUserById = (id?: number) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getById("authen/api/v1/users", id!),
    enabled: !!id,
  });
};

export const useAddUser = (onClose?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: newUser) => {
      const payload = {
        username: newUser.username,
        password: newUser.password,
        email: newUser.email,
        mobile: newUser.mobile,
        first_name: newUser.firstname,
        last_name: newUser.lastname,
        is_active: true, // default เปิดใช้งาน
        is_staff: true,  // ให้สิทธิ staff
        role: newUser.role,
      };
      return await postBody("authen/api/v1/users", payload);
    },
    onSuccess: (user: User) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose?.();
      showSuccess("เพิ่มผู้ใช้สำเร็จ", `ผู้ใช้ ${user.username} ถูกสร้างแล้ว`);
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

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteById("authen/api/v1/users", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess("สำเร็จ", "ลบผู้ใช้เรียบร้อยแล้ว");
    },
    onError: (err: AxiosError<DjangoError>) => {
      const msg = err.response?.data?.detail || "ไม่สามารถลบผู้ใช้ได้";
      showError("ผิดพลาด", msg);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      updateById("authen/api/v1/users", id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess("สำเร็จ", "แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว");
    },
    onError: (err: AxiosError<DjangoError>) => {
    const msg =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "ไม่สามารถแก้ไขผู้ใช้ได้";
    showError("ผิดพลาด", msg);
    },

  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: number; currentStatus: boolean }) =>
      updateById("authen/api/v1/users", id, { is_active: !currentStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess("สำเร็จ", "อัปเดทสถานะผู้ใช้เรียบร้อยแล้ว");
    },
    onError: () => {
      showError("ผิดพลาด", "ไม่สามารถอัปเดทสถานะผู้ใช้ได้");
    },
  });
};