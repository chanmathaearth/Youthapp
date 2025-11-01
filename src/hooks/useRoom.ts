import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, getById, deleteById, updateById, postBody } from "../helpers/index";
import type { Room } from "../interface/room";
import type { AxiosError } from "axios";
import { showSuccess, showError } from "../utils/alert";

type DjangoError = {
    detail?: string;
    [key: string]: string[] | string | undefined;
};

export const useRooms = () => {
    return useQuery<Room[]>({
        queryKey: ["rooms"],
        queryFn: () => getAll("room/api/v1/room"),
        initialData: [],
    });
};

export const useRoomsDashboard = () => {
  const { data: rooms} = useRooms();

  return useQuery({
    queryKey: ["rooms-with-children"],
    enabled: !!rooms && rooms.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        rooms.map(async (room) => {
          const children = await getAll(
            `children/api/v1/children?room=${room.id}`
          );
          return { ...room, children };
        })
      );
      return results;
    },
  });
};
export const useRoomById = (id?: number) => {
    return useQuery({
        queryKey: ["room", id],
        queryFn: () => getById("room/api/v1/room", id!),
        enabled: !!id,
    });
};

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteById("room/api/v1/room", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            showSuccess("สำเร็จ", "ลบห้องเรียนเรียบร้อยแล้ว");
        },
        onError: (err: AxiosError<DjangoError>) => {
            const msg = err.response?.data?.detail || "ไม่สามารถลบห้องเรียนได้";
            showError("ผิดพลาด", msg);
        },
    });
};


export const useAddRoom = (onClose?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRoom: {
      name: string;
      minAge: number;
      maxAge: number;
      teacher: number[];
      imageUrl?: string;
    }) => {
      const payload = {
        name: newRoom.name,
        min_age: newRoom.minAge,
        max_age: newRoom.maxAge,
        is_active: true,
        staff_ids: newRoom.teacher,
      };
      return await postBody("room/api/v1/room", payload);
    },
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      onClose?.(); // ปิด modal
      showSuccess("เพิ่มห้องเรียนสำเร็จ", `ห้อง ${room.name} ถูกสร้างและกำหนดครูประจำแล้ว`);
    },
    onError: (err: AxiosError<DjangoError>) => {
      const data = err.response?.data;
      let message = "เกิดข้อผิดพลาดจากระบบ";

      if (data?.detail) {
        message = data.detail;
      } else if (typeof data === "object") {
        message = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
          .join("\n");
      }

      showError("เกิดข้อผิดพลาด", message);
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Room> & { staff_ids?: number[] } }) =>
      updateById("room/api/v1/room", id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      showSuccess("สำเร็จ", "ข้อมูลห้องถูกแก้ไขเรียบร้อยแล้ว");
    },
    onError: (err: AxiosError<DjangoError>) => {
      showError("ผิดพลาด", err.response?.data?.detail || "ไม่สามารถแก้ไขห้องได้");
    },
  });
};
