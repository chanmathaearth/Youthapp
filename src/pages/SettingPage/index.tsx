import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/AddChildModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import {
    getAll,
    postBody,
    deleteById,
    updateById,
    getById,
} from "../../helpers";
import { Box, Container, Tabs, Tab, IconButton } from "@mui/material";
import {
    Users,
    School,
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Mail,
    Phone,
    Calendar,
    UserCheck,
    UserX,
    Save,
    X,
    Baby,
} from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

/* ========================================
 * Types
 * ======================================*/
type Role = "admin" | "teacher";

export type User = {
    id: number;
    username: string;
    email: string;
    mobile: string;
    first_name: string;
    last_name: string;
    role: "admin" | "teacher";
    is_active: boolean;
    is_staff: boolean;
    active_at: string | null;
};

type Teacher = {
    id: number;
    staff: string;
    is_homeroom: boolean;
    assigned_at: string;
    unassigned_at: string | null;
};

type Room = {
    id: number;
    name: string;
    min_age: number;
    max_age: number;
    teachers: Teacher[];
};

type EditRoom = {
    id: number;
    name: string;
    is_active: boolean;
    min_age: number;
    max_age: number;
    staff_ids: number[];
    assignment_ids: number;
};

type NewUserInput = {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
};

type NewRoomInput = {
    name: string;
    minAge: number;
    maxAge: number;
    teacher: number;
    imageUrl: string;
};


/* ========================================
 * Helper functions
 * ======================================*/
const getRoleColor = (role: Role) => {
    switch (role) {
        case "admin":
            return "bg-red-100 text-red-600";
        case "teacher":
            return "bg-blue-100 text-blue-600";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

const getRoleText = (role: Role) => {
    switch (role) {
        case "admin":
            return "ผู้ดูแลระบบ";
        case "teacher":
            return "ครู";
        default:
            return role;
    }
};

/* ========================================
 * Component
 * ======================================*/
const SettingsPage = () => {
    const navigate = useNavigate();

    // ---------- UI State ----------
    const [activeTab, setActiveTab] = useState<number>(0);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [openUserDialog, setOpenUserDialog] = useState<boolean>(false);
    const [openChildDialog, setOpenChildDialog] = useState<boolean>(false);
    const [openRoomDialog, setOpenRoomDialog] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const [newRoom, setNewRoom] = useState<NewRoomInput>({
        name: "",
        minAge: 1,
        maxAge: 1,
        teacher: 1,
        imageUrl: "",
    });

    const [newUser, setNewUser] = useState<NewUserInput>({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "teacher",
    });

    const [editUserOpen, setEditUserOpen] = useState<boolean>(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<{
        first_name: string;
        last_name: string;
        email: string;
        mobile: string;
        role: Role;
        is_active: boolean;
    }>({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        role: "teacher",
        is_active: true,
    });

    const [searchName, setSearchName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [editRoom, setEditRoom] = useState<EditRoom | null>(null);
    const [editRoomOpen, setEditRoomOpen] = useState(false);

    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(
        null
    );

    const handleChildDialogClose = () => setOpenChildDialog(false);
    const handleChildDialog = () => {
        handleChildDialogClose();
    };

    function formatAgeRange(minMonths: number, maxMonths: number): string {
        const format = (months: number) => {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;

            if (years > 0 && remainingMonths > 0) {
                return `${years} ปี ${remainingMonths} เดือน`;
            } else if (years > 0) {
                return `${years} ปี`;
            } else {
                return `${remainingMonths} เดือน`;
            }
        };

        return `${format(minMonths)} - ${format(maxMonths)}`;
    }

    // const onPickEditImage = (file?: File) => {
    //     if (!file) return;
    //     setEditImageFile(file);
    //     const url = URL.createObjectURL(file);
    //     setEditImagePreview(url);
    // };

    const clearPickedEditImage = () => {
        if (editImagePreview) URL.revokeObjectURL(editImagePreview);
        setEditImageFile(null);
        setEditImagePreview(null);
    };

    const handleDeleteStudent = (id: number) => {};
    const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
    const [editStudent, setEditStudent] = useState<any>(null);
    const openStudentEdit = (student: any) => {
        setEditStudent(student);
        setIsEditStudentOpen(true);
    };
    const closeEditStudentModal = () => {
        setIsEditStudentOpen(false);
        setEditStudent(null);
    };
    const handleEditStudentSave = () => {
        // TODO: axios.put(`/api/students/${editStudent.id}`, editStudent)
        console.log("Saving", editStudent);
        closeEditStudentModal();
    };

    const saveEdit = () => {
        console.log(editForm);
        updateUser();
    };

    const openEdit = (u: User) => {
        setEditUser(u);
        setEditUserOpen(true);
    };

    const closeEdit = () => {
        setEditUserOpen(false);
        setEditUser(null);
    };

    //เชื่อมกับหลังบ้าน

    const { mutate: updateUserStatus } = useMutation({
        mutationFn: ({
            id,
            currentStatus,
        }: {
            id: number;
            currentStatus: boolean;
        }) =>
            updateById("authen/api/v1/users", id, {
                is_active: !currentStatus,
            }),
        onSuccess: () => {
            Swal.fire("สำเร็จ", "อัพเดทสถานะผู้ใช้เรียบร้อยแล้ว", "success");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            Swal.fire("ผิดพลาด", "ไม่สามารถอัพเดทสถานะผู้ใช้ได้", "error");
        },
    });

    const { mutate: deleteUser, isPending: isDeleting } = useMutation({
        mutationFn: (id: number) => deleteById("authen/api/v1/users", id),
        onSuccess: () => {
            Swal.fire("สำเร็จ", "ลบผู้ใช้เรียบร้อยแล้ว", "success");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            Swal.fire("ผิดพลาด", "ไม่สามารถลบผู้ใช้ได้", "error");
        },
    });

    const handleDeleteUser = (id: number) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่, ลบเลย",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(id);
            }
        });
    };
    const { data: users = [] } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: () => getAll("authen/api/v1/users"),
    });

    const handleAddUser = () => {
        if (
            !newUser.username ||
            !newUser.password ||
            !newUser.email ||
            !newUser.phone ||
            !newUser.firstname ||
            !newUser.lastname
        ) {
            return;
        }
        addUser();
    };

    const { mutate: addUser, isPending: isAddUserPending } = useMutation({
        mutationFn: async () => {
            return await postBody("authen/api/v1/users", {
                username: newUser.username,
                password: newUser.password,
                email: newUser.email,
                mobile: newUser.phone,
                first_name: newUser.firstname,
                last_name: newUser.lastname,
                is_active: true, // default เปิดใช้งาน
                is_staff: true, // ให้สิทธิ staff
                role: newUser.role,
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });

            setNewUser({
                username: "",
                password: "",
                email: "",
                phone: "",
                firstname: "",
                lastname: "",
                role: "teacher",
            });
            setOpenUserDialog(false);

            Swal.fire({
                icon: "success",
                title: "เพิ่มผู้ใช้สำเร็จ",
                text: `ผู้ใช้ ${data.username} ถูกสร้างแล้ว`,
                confirmButtonColor: "#10b981",
            });
        },
        onError: (err: any) => {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: err?.response?.data?.detail || "ไม่สามารถเพิ่มผู้ใช้ได้",
                confirmButtonColor: "#ef4444",
            });
        },
    });

    const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
        mutationFn: () =>
            updateById("authen/api/v1/users", editUser!.id, editForm),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setEditUserOpen(false);
            Swal.fire("สำเร็จ", "แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว", "success");
        },
        onError: (error: any) => {
            // ถ้าใช้ axios → error.response.data จะมีข้อความจาก backend
            const message =
                error?.response?.data?.detail ||
                JSON.stringify(error?.response?.data) ||
                "ไม่สามารถแก้ไขผู้ใช้ได้";

            Swal.fire("ผิดพลาด", message);
        },
    });

    const { data: editUserData } = useQuery({
        queryKey: ["user", editUser?.id], // ใช้ id เป็น key
        queryFn: async () => {
            if (!editUser) return null; // กัน null
            return await getById("authen/api/v1/users", editUser.id);
        },
        enabled: !!editUser, // ให้ query ทำงานเฉพาะตอนมี editUser
    });

    useEffect(() => {
        if (editUserData) {
            setEditForm({
                first_name: editUserData.first_name,
                last_name: editUserData.last_name,
                email: editUserData.email,
                mobile: editUserData.mobile,
                role: editUserData.role,
                is_active: editUserData.is_active,
            });
        }
    }, [editUserData]);

    const { data: rooms = [] } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => getAll("room/api/v1/room"), // backend endpoint
        initialData: [],
    });

    const { mutate: addRoom, isPending } = useMutation({
        mutationFn: async () => {
            try {
                const room = await postBody("room/api/v1/room", {
                    name: newRoom.name,
                    min_age: newRoom.minAge,
                    max_age: newRoom.maxAge,
                    is_active: true,
                });

                try {
                    await postBody("room/api/v1/staff-assign", {
                        room_id: room.id,
                        staff_id: Number(newRoom.teacher),
                    });
                } catch (err) {
                    // ถ้า assign fail → ลบ room
                    await deleteById("room/api/v1/room", room.id);
                    throw err; // ส่ง error กลับไป
                }

                return room;
            } catch (err) {
                console.error("Failed to create room with staff:", err);
                throw err;
            }
        },
        onSuccess: (room) => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            setOpenRoomDialog(false);
            setNewRoom({
                name: "",
                minAge: 0,
                maxAge: 0,
                teacher: 0,
                imageUrl: "",
            });

            Swal.fire({
                icon: "success",
                title: "เพิ่มห้องเรียนสำเร็จ",
                text: `ห้อง ${room.name} ถูกสร้างและกำหนดครูประจำแล้ว`,
                confirmButtonColor: "#10b981",
            });
        },
        onError: (err: any) => {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text:
                    err?.response?.data?.detail || "ไม่สามารถเพิ่มห้องเรียนได้",
                confirmButtonColor: "#ef4444",
            });
        },
    });

    const { mutate: deleteRoom } = useMutation({
        mutationFn: (id: number) => deleteById("room/api/v1/room", id),
        onSuccess: () => {
            Swal.fire("สำเร็จ", "ลบห้องเรียบร้อยแล้ว", "success");
            queryClient.invalidateQueries({ queryKey: ["rooms"] }); // refresh ข้อมูล
        },
        onError: () => {
            Swal.fire("ผิดพลาด", "ไม่สามารถลบห้องได้", "error");
        },
    });

    const handleDeleteRoom = (id: number) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณแน่ใจหรือไม่ว่าต้องการลบห้องนี้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่, ลบเลย",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRoom(id); // call API
            }
        });
    };

    const [editRoomId, setEditRoomId] = useState<number | null>(null);

    const openEditRoom = (roomId: number) => {
        setEditRoomOpen(true);
        setEditRoomId(roomId);
    };

    const { data: editRoomData } = useQuery({
        queryKey: [editRoomId],
        queryFn: async () => {
            const res = getById("room/api/v1/room", editRoomId!);
            return res;
        },
        enabled: !!editRoomId,
    });

useEffect(() => {
  if (editRoomData) {
    setEditRoom({
      id: editRoomData.id,
      name: editRoomData.name,
      is_active: editRoomData.is_active,
      min_age: editRoomData.min_age,
      max_age: editRoomData.max_age,
      staff_ids: editRoomData.teachers.map((t) => t.id), // ดึง id ครูทั้งหมด
      assignment_ids: editRoomData.teachers, // ถ้าต้องเก็บ assignment ด้วย
    });
  }
}, [editRoomData]);



    const closeEditRoom = () => {
        setEditRoomOpen(false);
        setEditRoom(null);
    };

    const editRoomMutation = useMutation({
        mutationFn: async (room: EditRoom) => {
            await updateById("room/api/v1/room", room.id, {
                name: room.name,
                is_active: room.is_active,
                min_age: room.min_age,
                max_age: room.max_age,
            });

            if (room.assignment_id) {
                return await updateById(
                    "room/api/v1/staff-assign",
                    room.assignment_id,
                    {
                        staff_id: room.staff_ids,
                        room_id: room.id,
                    }
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            closeEditRoom();
            Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                text: "ข้อมูลห้องถูกแก้ไขเรียบร้อยแล้ว",
                confirmButtonText: "ตกลง",
            });
        },
        onError: (err) => {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: err,
                confirmButtonText: "ปิด",
            });
        },
    });

    const saveEditRoom = () => {
        console.log(editRoom)
        if (editRoom) {
            editRoomMutation.mutate(editRoom);
        }
    };

    return (
        <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
            <Container maxWidth="xl" className="py-4">
                {/* Tabs Box */}
                <Box className="rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden bg-white mt-4">
                    <Box className="border-b border-gray-200">
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            className="min-h-[72px]"
                        >
                            <Tab
                                icon={<Users size={20} />}
                                iconPosition="start"
                                label="จัดการผู้ใช้"
                                className="normal-case text-[16px] font-semibold min-h-[72px] px-6 text-gray-700 gap-2 font-poppins"
                            />
                            <Tab
                                icon={<School size={20} />}
                                iconPosition="start"
                                label="จัดการห้องเรียน"
                                className="normal-case text-[16px] font-semibold min-h-[72px] px-6 text-gray-700 gap-2"
                            />
                            <Tab
                                icon={<Baby size={20} />}
                                label="จัดการเด็ก"
                                iconPosition="start"
                                className="normal-case text-[16px] font-semibold min-h-[72px] px-6 text-gray-700 gap-2 font-poppins"
                            />
                        </Tabs>
                    </Box>

                    {openChildDialog && (
                        <Modal
                            message="ฟอร์มเพิ่มเด็ก"
                            onClick={handleChildDialog}
                            onClose={handleChildDialogClose}
                        />
                    )}

                    {openRoomDialog && (
                        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                            <Box className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-3xl mx-4 sm:mx-6 overflow-hidden">
                                {/* Header */}
                                <Box className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                                    <Box className="flex items-center gap-3">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-6 h-6 text-emerald-500"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M4 19V7l8-4 8 4v12" />
                                            <path d="M4 19h16" />
                                            <path d="M9 22V12h6v10" />
                                        </svg>
                                        <p className="text-lg font-semibold">
                                            เพิ่มห้องเรียนใหม่
                                        </p>
                                    </Box>
                                    <button
                                        onClick={() => setOpenRoomDialog(false)}
                                        className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                                        aria-label="ปิดหน้าต่าง"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M6 6l12 12M6 18L18 6" />
                                        </svg>
                                    </button>
                                </Box>

                                {/* Body */}
                                <Box className="px-5 py-4">
                                    <Box className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
                                        <Box className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                ชื่อห้อง
                                            </label>
                                            <input
                                                type="text"
                                                value={newRoom.name}
                                                onChange={(e) =>
                                                    setNewRoom({
                                                        ...newRoom,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="เช่น ห้อง D"
                                                className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                                            />
                                        </Box>

                                        <Box className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                ครูประจำ
                                            </label>
                                            <select
                                                value={newRoom.teacher}
                                                onChange={(e) =>
                                                    setNewRoom({
                                                        ...newRoom,
                                                        teacher: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                className="border border-gray-300 rounded-xl px-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                                            >
                                                <option value="">
                                                    เลือกครูประจำ
                                                </option>
                                                {users
                                                    .filter(
                                                        (u) =>
                                                            u.role ===
                                                                "teacher" &&
                                                            u.is_active
                                                    )
                                                    .map((t) => (
                                                        <option
                                                            key={t.id}
                                                            value={t.id}
                                                        >
                                                            {t.first_name +
                                                                " " +
                                                                t.last_name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </Box>

                                        <Box className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                อายุต่ำสุด (เดือน)
                                            </label>
                                            <input
                                                type="number"
                                                value={newRoom.minAge}
                                                onChange={(e) =>
                                                    setNewRoom({
                                                        ...newRoom,
                                                        minAge: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                placeholder="2"
                                                className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                                            />
                                        </Box>

                                        <Box className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                อายุสูงสุด (เดือน)
                                            </label>
                                            <input
                                                type="number"
                                                value={newRoom.maxAge}
                                                onChange={(e) =>
                                                    setNewRoom({
                                                        ...newRoom,
                                                        maxAge: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                placeholder="3"
                                                className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                                            />
                                        </Box>

                                        <Box className="col-span-full flex items-center gap-4 pt-1">
                                            <span className="text-sm text-gray-600">
                                                รูปประจำห้อง:
                                            </span>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (file) {
                                                        const url =
                                                            URL.createObjectURL(
                                                                file
                                                            );
                                                        setNewRoom((prev) => ({
                                                            ...prev,
                                                            imageUrl: url,
                                                        }));
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
               file:rounded-xl file:border-0 file:text-sm file:font-semibold
               file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                                            />

                                            {newRoom.imageUrl && (
                                                <img
                                                    src={newRoom.imageUrl}
                                                    alt="Room preview"
                                                    className="w-12 h-12 rounded-xl border-2 border-gray-200 object-cover"
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Footer */}
                                <Box className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setOpenRoomDialog(false)}
                                        className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={() => addRoom()}
                                        disabled={isPending}
                                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                        {isPending
                                            ? "กำลังบันทึก..."
                                            : "เพิ่มห้องเรียน"}
                                    </button>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Add User*/}
                    {openUserDialog && (
                        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <Box className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-2xl overflow-hidden">
                                {/* Header */}
                                <Box className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                                    <Box className="flex items-center gap-3">
                                        <Plus
                                            size={22}
                                            className="text-blue-500"
                                        />
                                        <p className="text-lg font-semibold">
                                            เพิ่มผู้ใช้ใหม่
                                        </p>
                                    </Box>
                                    <button
                                        onClick={() => setOpenUserDialog(false)}
                                        className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                                    >
                                        <X size={18} />
                                    </button>
                                </Box>

                                {/* Body */}
                                <Box className="px-5 py-4">
                                    <Box className="grid [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] gap-4">
                                        <input
                                            type="text"
                                            placeholder="ชื่อ"
                                            value={newUser.firstname}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    firstname: e.target.value,
                                                })
                                            }
                                            className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                                        />
                                        <input
                                            type="text"
                                            placeholder="นามสกุล"
                                            value={newUser.lastname}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    lastname: e.target.value,
                                                })
                                            }
                                            className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                                        />
                                        <input
                                            type="text"
                                            placeholder="ชื่อบัญชี"
                                            value={newUser.username}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    username: e.target.value,
                                                })
                                            }
                                            className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                                        />
                                        <input
                                            type="email"
                                            placeholder="อีเมล"
                                            value={newUser.email}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                                        />
                                        <input
                                            type="text"
                                            placeholder="เบอร์โทรศัพท์"
                                            value={newUser.phone}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                                        />
                                        <select
                                            value={newUser.role}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    role: e.target
                                                        .value as User["role"],
                                                })
                                            }
                                            className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                                        >
                                            <option value="">
                                                สิทธิ์การใช้งาน
                                            </option>
                                            <option value="teacher">ครู</option>
                                            <option value="admin">
                                                ผู้ดูแลระบบ
                                            </option>
                                        </select>
                                        <Box className="col-span-full relative">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                                                value={newUser.password}
                                                onChange={(e) =>
                                                    setNewUser({
                                                        ...newUser,
                                                        password:
                                                            e.target.value,
                                                    })
                                                }
                                                className="border border-gray-300 rounded-xl px-3 py-2 w-full pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Footer */}
                                <Box className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setOpenUserDialog(false)}
                                        className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <X size={16} /> ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleAddUser}
                                        type="submit"
                                        disabled={isAddUserPending}
                                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isAddUserPending ? (
                                            // spinner แบบ tailwind
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                                ></path>
                                            </svg>
                                        ) : (
                                            <Save size={16} />
                                        )}
                                        {isAddUserPending
                                            ? "กำลังบันทึก..."
                                            : "เพิ่มผู้ใช้"}
                                    </button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                    {editRoomOpen && (
                        <Box className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 sm:p-6 md:p-8">
                            <Box className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                {" "}
                                <button
                                    onClick={closeEditRoom}
                                    className="absolute inset-0 bg-black/40"
                                />
                                <Box className="absolute inset-0 flex items-center justify-center p-4">
                                    <Box className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
                                        {/* header */}
                                        <Box className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                                            <Box className="flex items-center gap-2">
                                                <Edit
                                                    className="text-blue-500"
                                                    size={20}
                                                />
                                                <p className="font-semibold text-lg">
                                                    แก้ไขห้องเรียน
                                                </p>
                                            </Box>
                                            <button
                                                onClick={() => {
                                                    clearPickedEditImage();
                                                    closeEditRoom();
                                                }}
                                                className="p-2 rounded-lg hover:bg-gray-100"
                                                aria-label="Close"
                                            >
                                                <X size={18} />
                                            </button>
                                        </Box>

                                        {/* body */}
                                        <Box className="px-5 py-4">
                                            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* <Box className="sm:col-span-2">
                                                    <label className="block text-sm text-gray-600 mb-2">
                                                        รูปประจำห้อง
                                                    </label>

                                                    <Box className="aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 relative">
                                                        <img
                                                            src={
                                                                editImagePreview ||
                                                                (
                                                                    editRoom as any
                                                                ).imageUrl ||
                                                                "https://via.placeholder.com/800x450?text=No+Image"
                                                            }
                                                            alt="room"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <Box className="absolute bottom-3 right-3 flex items-center gap-2">
                                                            {editImagePreview && (
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        clearPickedEditImage
                                                                    }
                                                                    className="px-3 h-10 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                                                >
                                                                    ยกเลิกการเปลี่ยนรูป
                                                                </button>
                                                            )}
                                                            <label className="px-3 h-10 inline-flex items-center rounded-xl bg-blue-600 text-white cursor-pointer hover:bg-blue-700">
                                                                เลือกรูปใหม่
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        onPickEditImage(
                                                                            e
                                                                                .target
                                                                                .files?.[0] ||
                                                                                undefined
                                                                        )
                                                                    }
                                                                />
                                                            </label>
                                                        </Box>
                                                    </Box>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        รองรับ .jpg .png .webp
                                                    </p>
                                                </Box> */}

                                                <Box className="flex flex-col gap-1.5">
                                                    <label className="text-sm text-gray-600">
                                                        ชื่อห้อง
                                                    </label>
                                                    <input
                                                        className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-blue-500/50"
                                                        value={
                                                            editRoom?.name ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditRoom(
                                                                (prev) =>
                                                                    prev
                                                                        ? {
                                                                              ...prev,
                                                                              name: e
                                                                                  .target
                                                                                  .value,
                                                                          }
                                                                        : prev
                                                            )
                                                        }
                                                    />
                                                </Box>

                                                {/* Staff แก้ตรงนี้ */}
                                                <Box className="flex flex-col gap-1.5">
                                                    <label className="text-sm text-gray-600">
                                                        ครูประจำ
                                                    </label>

                                                    <Select
                                                        isMulti
                                                        placeholder="เลือกครู..."
                                                        className="rounded-xl"
                                                        classNamePrefix="select"
                                                        options={users
                                                            .filter(
                                                                (u) =>
                                                                    u.role ===
                                                                        "teacher" &&
                                                                    u.is_active
                                                            )
                                                            .map((t) => ({
                                                                value: t.id,
                                                                label: `${t.first_name} ${t.last_name}`,
                                                            }))}
                                                        value={users
  .filter((u) => editRoom?.staff_ids?.includes(u.id))
  .map((t) => ({
    value: t.id,
    label: `${t.first_name} ${t.last_name}`,
  }))}

                                                        onChange={(
                                                            selected
                                                        ) => {
                                                            const ids =
                                                                selected.map(
                                                                    (s) =>
                                                                        s.value
                                                                );
                                                            setEditRoom(
                                                                (prev) =>
                                                                    prev
                                                                        ? {
                                                                              ...prev,
                                                                              staff_ids:
                                                                                  ids,
                                                                          }
                                                                        : prev
                                                            );
                                                        }}
                                                    />
                                                </Box>

                                                <Box className="flex flex-col gap-1.5">
                                                    <label className="text-sm text-gray-600">
                                                        อายุต่ำสุด (เดือน)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-blue-500/50"
                                                        value={
                                                            editRoom?.min_age ??
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditRoom(
                                                                (prev) =>
                                                                    prev
                                                                        ? {
                                                                              ...prev,
                                                                              min_age:
                                                                                  Number(
                                                                                      e
                                                                                          .target
                                                                                          .value
                                                                                  ),
                                                                          }
                                                                        : prev
                                                            )
                                                        }
                                                    />
                                                </Box>

                                                <Box className="flex flex-col gap-1.5">
                                                    <label className="text-sm text-gray-600">
                                                        อายุสูงสุด (เดือน)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-blue-500/50"
                                                        value={
                                                            editRoom?.max_age ??
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditRoom(
                                                                (prev) =>
                                                                    prev
                                                                        ? {
                                                                              ...prev,
                                                                              max_age:
                                                                                  Number(
                                                                                      e
                                                                                          .target
                                                                                          .value
                                                                                  ),
                                                                          }
                                                                        : prev
                                                            )
                                                        }
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* footer */}
                                        <Box className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200">
                                            <button
                                                onClick={() => {
                                                    clearPickedEditImage();
                                                    closeEditRoom();
                                                }}
                                                className="px-4 h-11 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                                            >
                                                ยกเลิก
                                            </button>

                                            <button
                                                onClick={saveEditRoom}
                                                disabled={
                                                    editRoomMutation.isPending
                                                }
                                                className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {editRoomMutation.isPending
                                                    ? "กำลังบันทึก..."
                                                    : "บันทึก"}
                                            </button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {isEditStudentOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        แก้ไขข้อมูล
                                    </h2>
                                    <button onClick={closeEditStudentModal}>
                                        <X className="text-gray-500 hover:text-gray-700" />
                                    </button>
                                </div>

                                {/* ฟอร์มแก้ไข */}
                                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={editStudent?.fullname || ""}
                                        onChange={(e) =>
                                            setEditStudent({
                                                ...editStudent!,
                                                fullname: e.target.value,
                                            })
                                        }
                                        className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
                                        placeholder="ชื่อ-นามสกุล"
                                    />
                                    <input
                                        type="text"
                                        value={editStudent?.parentName || ""}
                                        onChange={(e) =>
                                            setEditStudent({
                                                ...editStudent!,
                                                parentName: e.target.value,
                                            })
                                        }
                                        className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
                                        placeholder="ชื่อผู้ปกครอง"
                                    />
                                    <input
                                        type="text"
                                        value={editStudent?.phone || ""}
                                        onChange={(e) =>
                                            setEditStudent({
                                                ...editStudent!,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
                                        placeholder="เบอร์โทร"
                                    />
                                </div>

                                {/* ปุ่ม */}
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={closeEditStudentModal}
                                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleEditStudentSave}
                                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        บันทึก
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit User */}
                    {editUserOpen && (
                        <Box
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            role="dialog"
                            aria-modal="true"
                        >
                            {/* backdrop */}
                            <Box
                                className="absolute inset-0 bg-black/40"
                                onClick={closeEdit}
                            />

                            {/* card */}
                            <Box className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                                <Box className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                                    <Box className="flex justify-center gap-3">
                                        <svg
                                            className="w-6 h-6 text-blue-500"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                            />
                                        </svg>

                                        <p className="text-lg font-semibold">
                                            แก้ไขผู้ใช้
                                        </p>
                                    </Box>
                                    <button
                                        onClick={closeEdit}
                                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                        aria-label="close"
                                    >
                                        <X size={18} />
                                    </button>
                                </Box>

                                <Box className="p-6">
                                    <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Box className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                ชื่อ
                                            </label>
                                            <input
                                                className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
                                                value={editForm.first_name}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        first_name:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="ชื่อ"
                                            />
                                        </Box>
                                        <Box className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                นามสกุล
                                            </label>
                                            <input
                                                className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
                                                value={editForm.last_name}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        last_name:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="นามสกุล"
                                            />
                                        </Box>

                                        <Box className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                อีเมล
                                            </label>
                                            <input
                                                type="email"
                                                className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
                                                value={editForm.email}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        email: e.target.value,
                                                    })
                                                }
                                                placeholder="somchai@youthcenter.th"
                                            />
                                        </Box>

                                        <Box className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                เบอร์โทรศัพท์
                                            </label>
                                            <input
                                                className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
                                                value={editForm.mobile}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        mobile: e.target.value,
                                                    })
                                                }
                                                placeholder="081-234-5678"
                                            />
                                        </Box>

                                        <Box className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                สิทธิ์การใช้งาน
                                            </label>
                                            <select
                                                className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
                                                value={editForm.role}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        role: e.target
                                                            .value as User["role"],
                                                    })
                                                }
                                            >
                                                <option value="teacher">
                                                    ครู
                                                </option>
                                                <option value="staff">
                                                    เจ้าหน้าที่
                                                </option>
                                                <option value="admin">
                                                    ผู้ดูแลระบบ
                                                </option>
                                            </select>
                                        </Box>
                                        <Box className="flex flex-col gap-1.5 sm:col-span-2">
                                            <label className="text-sm text-gray-600">
                                                สถานะ
                                            </label>
                                            <Box className="flex gap-2">
                                                {/* ปุ่มเปิดการใช้งาน */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditForm({
                                                            ...editForm,
                                                            is_active: true,
                                                        })
                                                    }
                                                    className={`h-10 rounded-xl px-4 text-sm font-medium border
        ${
            editForm.is_active
                ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
        }`}
                                                >
                                                    ใช้งานได้
                                                </button>

                                                {/* ปุ่มปิดการใช้งาน */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditForm({
                                                            ...editForm,
                                                            is_active: false,
                                                        })
                                                    }
                                                    className={`h-10 rounded-xl px-4 text-sm font-medium border
        ${
            editForm.is_active === false
                ? "border-red-500 text-red-600 bg-red-50"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
        }`}
                                                >
                                                    ปิดใช้งาน
                                                </button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200">
                                    <button
                                        onClick={closeEdit}
                                        className="h-11 rounded-xl border-2 border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={saveEdit}
                                        disabled={isUpdatingUser} // ปิดปุ่มชั่วคราวตอนกำลังบันทึก
                                        className={`h-11 rounded-xl px-4 text-sm font-semibold text-white flex items-center justify-center
    ${
        isUpdatingUser
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
    }
  `}
                                    >
                                        {isUpdatingUser ? (
                                            // วงกลมหมุน ๆ
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                ></path>
                                            </svg>
                                        ) : (
                                            "บันทึก"
                                        )}
                                    </button>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Users */}
                    {activeTab === 0 && (
                        <Box className="p-6">
                            {/* Header */}
                            <Box className="flex items-center justify-between mb-8">
                                <Box>
                                    <p className="font-bold text-[#111827] mb-1 text-2xl">
                                        จัดการผู้ใช้ในระบบ
                                    </p>
                                    <p className="text-[#6B7280] text-lg">
                                        เพิ่ม แก้ไข และจัดการสิทธิ์ผู้ใช้งาน
                                    </p>
                                </Box>
                                <button
                                    onClick={() => setOpenUserDialog(true)}
                                    className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-white rounded-xl font-semibold shadow-sm text-lg"
                                >
                                    เพิ่มผู้ใช้
                                </button>
                            </Box>

                            {/* Users List */}
                            <Box className="flex flex-col gap-4">
                                {users.map((user) => (
                                    <Box
                                        key={user.id}
                                        className="border-2 border-gray-200 p-3 rounded-2xl transition-all duration-300 hover:border-gray-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
                                    >
                                        <Box className="p-3 sm:p-4">
                                            {/* แถวบน: บนมือถือให้ซ้อนเป็นคอลัมน์ */}
                                            <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                {/* ซ้าย: รูป + ชื่อ + ชิป + รายละเอียดติดต่อ */}
                                                <Box className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                                    {/* รูป */}
                                                    <Box className="shrink-0">
                                                        <Box className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white font-bold text-base sm:text-lg grid place-content-center">
                                                            U
                                                        </Box>
                                                    </Box>

                                                    {/* เนื้อหา */}
                                                    <Box className="flex-1 min-w-0">
                                                        {/* ชื่อ + ชิป */}
                                                        <Box className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
                                                            {user.username ===
                                                            "admin" ? (
                                                                <p className="text-base sm:text-lg font-medium truncate max-w-full">
                                                                    ADMIN
                                                                </p>
                                                            ) : (
                                                                <p className="text-base sm:text-lg font-medium truncate max-w-full">
                                                                    {
                                                                        user.first_name
                                                                    }{" "}
                                                                    {
                                                                        user.last_name
                                                                    }
                                                                </p>
                                                            )}

                                                            {/* Role */}
                                                            <span
                                                                className={`rounded-full text-[10px] sm:text-xs font-semibold px-2.5 py-1 ${getRoleColor(
                                                                    user.role
                                                                )}`}
                                                            >
                                                                {getRoleText(
                                                                    user.role
                                                                )}
                                                            </span>

                                                            {/* Status */}
                                                            <span
                                                                className={`rounded-full text-[10px] sm:text-xs font-semibold px-2.5 py-1 ${
                                                                    user.is_active
                                                                        ? "bg-emerald-100 text-emerald-600"
                                                                        : "bg-red-100 text-red-600"
                                                                }`}
                                                            >
                                                                {user.is_active
                                                                    ? "ใช้งานได้"
                                                                    : "ปิดใช้งาน"}
                                                            </span>
                                                        </Box>

                                                        {/* รายละเอียดติดต่อ: 1 คอลัมน์บนมือถือ → 2 คอลัมน์ที่ sm → 3 คอลัมน์ที่ lg */}
                                                        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-2">
                                                            {user.email && (
                                                                <Box className="flex items-center gap-2 min-w-0">
                                                                    <Mail
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-blue-500 shrink-0"
                                                                    />
                                                                    <p className="truncate">
                                                                        {
                                                                            user.email
                                                                        }
                                                                    </p>
                                                                </Box>
                                                            )}
                                                            {user.mobile && (
                                                                <Box className="flex items-center gap-2 min-w-0">
                                                                    <Phone
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-emerald-500 shrink-0"
                                                                    />
                                                                    {/* ทำให้กดโทรได้ */}
                                                                    <p className="truncate hover:underline">
                                                                        {
                                                                            user.mobile
                                                                        }
                                                                    </p>
                                                                </Box>
                                                            )}

                                                            <Box className="flex items-center gap-2 min-w-0">
                                                                <Calendar
                                                                    size={16}
                                                                    className="text-purple-500 shrink-0"
                                                                />
                                                                <p className="truncate">
                                                                    เข้าใช้ล่าสุด:{" "}
                                                                    {user.active_at
                                                                        ? format(
                                                                              new Date(
                                                                                  user.active_at
                                                                              ),
                                                                              "dd/MM/yyyy HH:mm",
                                                                              {
                                                                                  locale: th,
                                                                              }
                                                                          )
                                                                        : "-"}
                                                                </p>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <Box className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                                                    <button
                                                        disabled={
                                                            user.role ===
                                                            "admin"
                                                        }
                                                        onClick={() =>
                                                            updateUserStatus({
                                                                id: user.id,
                                                                currentStatus:
                                                                    user.is_active,
                                                            })
                                                        }
                                                        className={`w-full sm:w-auto px-4 py-2 border-2 rounded-[10px] text-sm font-semibold transition-all duration-200 flex items-center justify-center
  ${
      user.is_active
          ? "border-red-600 text-red-600 hover:bg-red-100"
          : "border-emerald-500 text-emerald-600 hover:bg-emerald-100"
  }
  ${user.role === "admin" ? "cursor-not-allowed opacity-50" : ""}
`}
                                                    >
                                                        {user.is_active ? (
                                                            <>
                                                                <UserX
                                                                    size={16}
                                                                    className="mr-1"
                                                                />
                                                                ปิดใช้งาน
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck
                                                                    size={16}
                                                                    className="mr-1"
                                                                />
                                                                เปิดใช้งาน
                                                            </>
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            openEdit(user)
                                                        }
                                                        className={`w-full sm:w-auto px-3 py-2 border-2 border-blue-600 text-blue-600 rounded-[10px] hover:bg-blue-50 flex items-center justify-center
                                                        ${
                                                            user.role ===
                                                            "admin"
                                                                ? "cursor-not-allowed opacity-50"
                                                                : ""
                                                        }`}
                                                    >
                                                        <Edit size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user.id
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting ||
                                                            user.role ===
                                                                "admin"
                                                        }
                                                        className={`w-full sm:w-auto px-3 py-2 border-2 rounded-[10px] flex items-center justify-center
    ${
        user.role === "admin"
            ? "opacity-50 cursor-not-allowed border-red-600 text-red-600"
            : "border-red-600 text-red-600 hover:bg-red-50"
    }`}
                                                    >
                                                        {isDeleting ? (
                                                            <span className="animate-spin border-2 border-red-600 border-t-transparent rounded-full w-4 h-4"></span>
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                    </button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            {/* Stats */}
                            <Box className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-8">
                                <Box className="bg-blue-50 border border-blue-200 rounded-2xl">
                                    <Box className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-blue-600">
                                            {users.length}
                                        </p>
                                        <p className="text-blue-700 text-sm">
                                            ผู้ใช้ทั้งหมด
                                        </p>
                                    </Box>
                                </Box>
                                <Box className="bg-emerald-50 border border-emerald-200 rounded-2xl">
                                    <Box className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-emerald-600">
                                            {
                                                users.filter((u) => u.is_active)
                                                    .length
                                            }
                                        </p>
                                        <p className="text-emerald-700 text-sm">
                                            ใช้งานได้
                                        </p>
                                    </Box>
                                </Box>
                                <Box className="bg-purple-50 border border-purple-200 rounded-2xl">
                                    <Box className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-purple-600">
                                            {
                                                users.filter(
                                                    (u) => u.role === "teacher"
                                                ).length
                                            }
                                        </p>
                                        <p className="text-purple-700 text-sm">
                                            ครู
                                        </p>
                                    </Box>
                                </Box>
                                <Box className="bg-red-50 border border-red-200 rounded-2xl">
                                    <Box className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-red-600">
                                            {
                                                users.filter(
                                                    (u) => u.role === "admin"
                                                ).length
                                            }
                                        </p>
                                        <p className="text-red-700 text-sm">
                                            ผู้ดูแลระบบ
                                        </p>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Rooms */}
                    {activeTab === 1 && (
                        <Box className="p-6">
                            <Box className="flex items-center justify-between mb-8">
                                <Box>
                                    <p className="font-bold text-[#111827] mb-1 text-2xl">
                                        จัดการห้องเรียน
                                    </p>
                                    <p className="text-[#6B7280] text-lg">
                                        เพิ่ม แก้ไข และจัดการห้องเรียนในระบบ
                                    </p>
                                </Box>
                                <button
                                    onClick={() => setOpenRoomDialog(true)}
                                    className="!bg-emerald-500 hover:!bg-emerald-600 px-5 py-2 text-white rounded-xl font-semibold shadow-sm text-lg"
                                >
                                    เพิ่มห้องเรียน
                                </button>
                            </Box>

                            <Box className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
                                {rooms.map((room: Room) => (
                                    <Box
                                        key={room.id}
                                        className="border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:border-gray-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] overflow-hidden"
                                    >
                                        {/* รูปประจำห้อง */}
                                        {/* หัวรูปของการ์ด */}
                                        <Box className="aspect-video relative w-full p-4 bg-white">
                                            <img
                                                src={
                                                    "https://plus.unsplash.com/premium_photo-1663106423058-c5242333348c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJlc2Nob29sfGVufDB8fDB8fHww"
                                                }
                                                alt={room.name}
                                                className="object-cover w-full h-full rounded-t-xl"
                                            />
                                        </Box>

                                        <Box className="p-4">
                                            <Box className="flex items-center justify-between mb-5">
                                                <Box className="flex items-center gap-3">
                                                    <p className="font-semibold">
                                                        {room.name}
                                                    </p>
                                                </Box>
                                                <Box className="flex gap-2">
                                                    <IconButton
                                                        onClick={() =>
                                                            openEditRoom(
                                                                room.id
                                                            )
                                                        }
                                                        className="border-2 border-blue-600 text-blue-600 rounded-[10px] hover:bg-blue-50"
                                                    >
                                                        <Edit size={16} />
                                                    </IconButton>

                                                    <IconButton
                                                        onClick={() =>
                                                            handleDeleteRoom(
                                                                room.id
                                                            )
                                                        }
                                                        className="border-2 border-red-600 text-red-600 rounded-[10px] hover:bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            <Box className="flex flex-col gap-3">
                                                <Box className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <Box className="flex items-center gap-2">
                                                        <Users
                                                            size={16}
                                                            className="text-blue-500"
                                                        />
                                                        <p className="text-gray-600">
                                                            จำนวนเด็ก
                                                        </p>
                                                    </Box>
                                                    <p className="font-semibold">
                                                        {/* {room.capacity} คน */}
                                                    </p>
                                                </Box>

                                                <Box className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <Box className="flex items-center gap-2">
                                                        <Calendar
                                                            size={16}
                                                            className="text-emerald-500"
                                                        />
                                                        <p className="text-gray-600">
                                                            ช่วงอายุ
                                                        </p>
                                                    </Box>
                                                    <p className="font-semibold">
                                                        {formatAgeRange(
                                                            room.min_age,
                                                            room.max_age
                                                        )}
                                                    </p>
                                                </Box>

                                                <Box className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <Box className="flex items-center gap-2">
                                                        <Users
                                                            size={16}
                                                            className="text-purple-500"
                                                        />
                                                        <p className="text-gray-600">
                                                            ครูประจำ
                                                        </p>
                                                    </Box>
                                                    <p className="font-semibold">
                                                        {room.teachers
                                                            .map((t) => t.staff)
                                                            .join(", ")}
                                                    </p>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            {/* Stats */}
                            <Box className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-8">
                                <Box className="bg-emerald-50 border border-emerald-200 rounded-2xl">
                                    <Box className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-emerald-600">
                                            {rooms.length}
                                        </p>
                                        <p className="text-emerald-700 text-sm">
                                            ห้องเรียนทั้งหมด
                                        </p>
                                    </Box>
                                </Box>
                                <Box className="bg-blue-50 border border-blue-200 rounded-2xl">
                                    <Box className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-blue-600">
                                            {rooms.reduce(
                                                (sum, r) =>
                                                    sum + (r.capacity ?? 0),
                                                0
                                            )}
                                        </p>
                                        <p className="text-blue-700 text-sm">
                                            เด็กทั้งหมด
                                        </p>
                                    </Box>
                                </Box>
                                {/* Average */}
                                <Box className="bg-purple-50 border border-purple-200 rounded-2xl">
                                    <Box className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-purple-600">
                                            {Math.round(
                                                rooms.reduce(
                                                    (s, r) =>
                                                        s + (r.capacity ?? 0),
                                                    0
                                                ) / rooms.length
                                            ) || 0}
                                        </p>
                                        <p className="text-purple-700 text-sm">
                                            เฉลี่ยต่อห้อง
                                        </p>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}
                    {activeTab === 2 && (
                        <Box className="p-6">
                            {/* Header */}
                            <Box className="flex items-center justify-between mb-8">
                                <Box>
                                    <p className="font-bold text-[#111827] mb-1 text-2xl">
                                        จัดการเด็กในระบบ
                                    </p>
                                    <p className="text-[#6B7280] text-lg">
                                        เพิ่ม และ แก้ไข
                                    </p>
                                </Box>
                                <button
                                    onClick={() => setOpenChildDialog(true)}
                                    className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-white rounded-xl font-semibold shadow-sm text-lg"
                                >
                                    เพิ่มเด็กใหม่
                                </button>
                            </Box>
                            <Box className="flex items-center gap-4 mb-6 w-full">
                                {/* ช่องค้นหาชื่อ */}
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อเด็ก..."
                                    value={searchName}
                                    onChange={(e) =>
                                        setSearchName(e.target.value)
                                    }
                                    className="border border-gray-300 rounded-xl px-4 py-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                />

                                {/* เลือกห้อง */}
                                <select
                                    value={selectedRoom}
                                    onChange={(e) =>
                                        setSelectedRoom(e.target.value)
                                    }
                                    className="border border-gray-300 rounded-xl px-4 py-4  w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                >
                                    <option value="">ทุกห้อง</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.name}>
                                            ห้อง {room.name}
                                        </option>
                                    ))}
                                </select>
                            </Box>

                            {/* Users List */}
                            <Box className="flex flex-col gap-4">
                                {filteredChildren.map((student) => (
                                    <Box
                                        key={student.id}
                                        className="border-2 border-gray-200 p-3 rounded-2xl transition-all duration-300 hover:border-gray-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
                                    >
                                        <Box className="p-3 sm:p-4">
                                            {/* แถวบน: บนมือถือให้ซ้อนเป็นคอลัมน์ */}
                                            <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                {/* ซ้าย: รูป + ชื่อ + ชิป + รายละเอียดติดต่อ */}
                                                <Box className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                                    {/* รูป */}
                                                    <Box className="shrink-0">
                                                        <Box className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white font-bold text-base sm:text-lg grid place-content-center">
                                                            {student.avatar}
                                                        </Box>
                                                    </Box>

                                                    {/* เนื้อหา */}
                                                    <Box className="flex-1 min-w-0">
                                                        {/* ชื่อ + ชิป */}
                                                        <Box className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
                                                            <p className="text-base sm:text-lg font-medium truncate max-w-full">
                                                                {
                                                                    student.fullname
                                                                }
                                                            </p>
                                                            <span className="rounded-full text-[10px] sm:text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600">
                                                                {student.name}
                                                            </span>
                                                            <span className="rounded-full text-[10px] sm:text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-600">
                                                                ห้อง{" "}
                                                                {student.room}
                                                            </span>
                                                        </Box>

                                                        {/* รายละเอียดติดต่อ: 1 คอลัมน์บนมือถือ → 2 คอลัมน์ที่ sm → 3 คอลัมน์ที่ lg */}
                                                        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-2">
                                                            <Box className="flex items-center gap-2 min-w-0">
                                                                <Calendar
                                                                    size={16}
                                                                    className="text-blue-500 shrink-0"
                                                                />
                                                                <p className="truncate">
                                                                    อายุ{" "}
                                                                    {
                                                                        student.age
                                                                    }{" "}
                                                                    ปี
                                                                </p>
                                                            </Box>

                                                            <Box className="flex items-center gap-2 min-w-0">
                                                                <Users
                                                                    size={16}
                                                                    color="#10B981"
                                                                />

                                                                {/* ทำให้กดโทรได้ */}
                                                                <p className="truncate">
                                                                    {
                                                                        student.parentName
                                                                    }
                                                                </p>
                                                            </Box>
                                                            <Box className="flex items-center gap-2 min-w-0">
                                                                <Phone
                                                                    size={16}
                                                                    className="text-emerald-500 shrink-0"
                                                                />
                                                                {/* ทำให้กดโทรได้ */}
                                                                <a
                                                                    href={`tel:${student.phone.replace(
                                                                        /[^\d+]/g,
                                                                        ""
                                                                    )}`}
                                                                    className="truncate hover:underline"
                                                                >
                                                                    {
                                                                        student.phone
                                                                    }
                                                                </a>
                                                            </Box>

                                                            <Box className="flex items-center gap-2 min-w-0">
                                                                <Calendar
                                                                    size={16}
                                                                    className="text-purple-500 shrink-0"
                                                                />
                                                                <p className="truncate">
                                                                    ประเมินล่าสุด:{" "}
                                                                    {
                                                                        student.lastEvaluationDate
                                                                    }
                                                                </p>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {/* ขวา: ปุ่ม → เรียงลง (full width) บนมือถือ */}
                                                <Box className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/evaluation/ห้องการ์ตูน/result/${student.id}`
                                                            )
                                                        }
                                                        className="w-full sm:w-auto px-3 py-1 border-2 border-green-600 text-green-600 rounded-[10px] hover:bg-blue-50 flex items-center justify-center"
                                                    >
                                                        ดูผลการประเมิน
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openStudentEdit(
                                                                student.id
                                                            )
                                                        }
                                                        className="w-full sm:w-auto px-3 py-2 border-2 border-blue-600 text-blue-600 rounded-[10px] hover:bg-blue-50 flex items-center justify-center"
                                                    >
                                                        <Edit size={16} />
                                                    </button>

                                                    <button
                                                        onClick={
                                                            () =>
                                                                handleDeleteStudent(
                                                                    student.id
                                                                ) // handleDelete สำหรับการลบข้อมูลของ student
                                                        }
                                                        className="w-full sm:w-auto px-3 py-2 border-2 rounded-[10px] flex items-center justify-center border-red-600 text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default SettingsPage;
