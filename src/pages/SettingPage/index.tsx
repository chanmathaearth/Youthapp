"use client";

import { useState } from "react";
import {
    Box,
    Container,
    Tabs,
    Tab,
    IconButton,
    Snackbar,
    Alert,
} from "@mui/material";
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
} from "lucide-react";

type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "teacher" | "staff";
    status: "active" | "inactive";
    lastLogin: string;
    avatar: string;
};

type Room = {
    id: number;
    name: string;
    capacity: number;
    ageRange: string;
    teacher: string;
    imageUrl?: string; // สำหรับ preview
};

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openRoomDialog, setOpenRoomDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });
    // --- state สำหรับแก้ไขผู้ใช้ ---
    const [editOpen, setEditOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "teacher" as User["role"],
        status: "active" as User["status"],
    });
    // --- state สำหรับ modal แก้ไขห้อง ---
    const [editRoomOpen, setEditRoomOpen] = useState(false);
    const [editRoom, setEditRoom] = useState<null | Room>(null);

    // เปิด modal พร้อมข้อมูลห้อง
    const openEditRoom = (room: Room) => {
        setEditRoom({ ...room });
        setEditRoomOpen(true);
    };

    // ปิด modal
    const closeEditRoom = () => {
        setEditRoomOpen(false);
        setEditRoom(null);
    };

    // เปลี่ยนค่าในฟอร์ม
    const onEditChange = (field: keyof Room, value: string) => {
        if (!editRoom) return;
        setEditRoom({
            ...editRoom,
            [field]: field === "capacity" ? Number(value) : (value as any),
        });
    };

    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(
        null
    );

    const onPickEditImage = (file?: File) => {
        if (!file) return;
        setEditImageFile(file);
        const url = URL.createObjectURL(file);
        setEditImagePreview(url);
    };

    const clearPickedEditImage = () => {
        if (editImagePreview) URL.revokeObjectURL(editImagePreview);
        setEditImageFile(null);
        setEditImagePreview(null);
    };

    const saveEditRoom = async () => {
        if (!editRoom) return;

        let imageUrlToUse = editRoom.imageUrl || "";

        if (editImageFile) {
            imageUrlToUse = editImagePreview || imageUrlToUse;
        }

        const updated: Room = { ...editRoom, imageUrl: imageUrlToUse };
        setRooms((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
        );

        // เคลียร์สถานะไฟล์ + ปิด modal
        clearPickedEditImage();
        closeEditRoom();
    };

    // เปิดโมดัลพร้อมดึงข้อมูลเดิม
    const openEdit = (u: User) => {
        setEditUser(u);
        setEditForm({
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            status: u.status,
        });
        setEditOpen(true);
    };

    // ปิดโมดัล
    const closeEdit = () => {
        setEditOpen(false);
        setEditUser(null);
    };

    // บันทึกการแก้ไข
    const saveEdit = () => {
        if (!editUser) return;
        setUsers((prev) =>
            prev.map((u) => (u.id === editUser.id ? { ...u, ...editForm } : u))
        );
        setEditOpen(false);
    };

    // Users State
    const [users, setUsers] = useState<User[]>([
        {
            id: 1,
            name: "ดร.สมชาย ใจดี",
            email: "somchai@youthcenter.th",
            phone: "081-234-5678",
            role: "admin",
            status: "active",
            lastLogin: "21/12/2024 14:30",
            avatar: "SC",
        },
        {
            id: 2,
            name: "ครูสมหญิง รักเด็ก",
            email: "somying@youthcenter.th",
            phone: "082-345-6789",
            role: "teacher",
            status: "active",
            lastLogin: "21/12/2024 13:15",
            avatar: "SY",
        },
        {
            id: 3,
            name: "ครูสมใจ ใส่ใจ",
            email: "somjai@youthcenter.th",
            phone: "083-456-7890",
            role: "teacher",
            status: "active",
            lastLogin: "20/12/2024 16:45",
            avatar: "SJ",
        },
        {
            id: 4,
            name: "คุณสมศรี ช่วยงาน",
            email: "somsri@youthcenter.th",
            phone: "084-567-8901",
            role: "staff",
            status: "inactive",
            lastLogin: "18/12/2024 09:20",
            avatar: "SS",
        },
    ]);

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "teacher" as User["role"],
    });

    // Rooms State
    const [rooms, setRooms] = useState<Room[]>([
        {
            id: 1,
            name: "ห้อง A",
            capacity: 25,
            ageRange: "2-3 ปี",
            teacher: "ครูสมหญิง",
            imageUrl:
                "https://www.daynurseries.co.uk/wp-content/uploads/sites/3/2023/06/Nursery-school-children1.jpg",
        },
        {
            id: 2,
            name: "ห้อง B",
            capacity: 30,
            ageRange: "3-4 ปี",
            teacher: "ครูสมชาย",
            imageUrl:
                "https://www.daynurseries.co.uk/wp-content/uploads/sites/3/2023/06/Nursery-school-children1.jpg",
        },
        {
            id: 3,
            name: "ห้อง C",
            capacity: 20,
            ageRange: "4-5 ปี",
            teacher: "ครูสมใจ",
            imageUrl:
                "https://www.daynurseries.co.uk/wp-content/uploads/sites/3/2023/06/Nursery-school-children1.jpg",
        },
    ]);

    const [newRoom, setNewRoom] = useState({
        name: "",
        capacity: "",
        ageRange: "",
        teacher: "",
        imageUrl: "",
    });

    // Handlers
    const handleAddUser = () => {
        if (
            !newUser.name ||
            !newUser.email ||
            !newUser.phone ||
            !newUser.password
        ) {
            setSnackbar({
                open: true,
                message: "กรุณากรอกข้อมูลให้ครบถ้วน",
                severity: "error",
            });
            return;
        }
        const user: User = {
            id: users.length + 1,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            status: "active",
            lastLogin: "ยังไม่เคยเข้าใช้",
            avatar: newUser.name
                .split(" ")
                .map((s) => s[0])
                .join("")
                .toUpperCase()
                .slice(0, 2),
        };
        setUsers([...users, user]);
        setNewUser({
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "teacher",
        });
        setOpenUserDialog(false);
        setSnackbar({
            open: true,
            message: "เพิ่มผู้ใช้สำเร็จ",
            severity: "success",
        });
    };

    const handleDeleteUser = (id: number) => {
        setUsers(users.filter((u) => u.id !== id));
        setSnackbar({
            open: true,
            message: "ลบผู้ใช้สำเร็จ",
            severity: "success",
        });
    };

    const toggleUserStatus = (id: number) => {
        setUsers(
            users.map((u) =>
                u.id === id
                    ? {
                          ...u,
                          status: u.status === "active" ? "inactive" : "active",
                      }
                    : u
            )
        );
        setSnackbar({
            open: true,
            message: "เปลี่ยนสถานะผู้ใช้สำเร็จ",
            severity: "success",
        });
    };

    const handleAddRoom = () => {
        if (
            !newRoom.name ||
            !newRoom.capacity ||
            !newRoom.ageRange ||
            !newRoom.teacher
        ) {
            setSnackbar({
                open: true,
                message: "กรุณากรอกข้อมูลให้ครบถ้วน",
                severity: "error",
            });
            return;
        }
        const room: Room = {
            id: rooms.length + 1,
            name: newRoom.name,
            capacity: Number.parseInt(newRoom.capacity),
            ageRange: newRoom.ageRange,
            teacher: newRoom.teacher,
            imageUrl: newRoom.imageUrl,
        };
        setRooms([...rooms, room]);
        setNewRoom({
            name: "",
            capacity: "",
            ageRange: "",
            teacher: "",
            imageUrl: "",
        });
        setOpenRoomDialog(false);
        setSnackbar({
            open: true,
            message: "เพิ่มห้องเรียนสำเร็จ",
            severity: "success",
        });
    };

    const handleDeleteRoom = (id: number) => {
        setRooms(rooms.filter((r) => r.id !== id));
        setSnackbar({
            open: true,
            message: "ลบห้องเรียนสำเร็จ",
            severity: "success",
        });
    };

    const getRoleColor = (role: User["role"]) => {
        switch (role) {
            case "admin":
                return "bg-red-100 text-red-600";
            case "teacher":
                return "bg-blue-100 text-blue-600";
            case "staff":
                return "bg-emerald-100 text-emerald-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getRoleText = (role: User["role"]) => {
        switch (role) {
            case "admin":
                return "ผู้ดูแลระบบ";
            case "teacher":
                return "ครู";
            case "staff":
                return "เจ้าหน้าที่";
            default:
                return role;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
            <Container maxWidth="xl" className="py-4">
                {/* Tabs div */}
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
                        </Tabs>
                    </Box>
                    {/* Add Room */}
                    {openRoomDialog && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                            <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-3xl mx-4 sm:mx-6 overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
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
                                    </div>
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
                                </div>

                                {/* Body */}
                                <div className="px-5 py-4">
                                    <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
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
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                จำนวนเด็ก
                                            </label>
                                            <input
                                                type="number"
                                                value={newRoom.capacity}
                                                onChange={(e) =>
                                                    setNewRoom({
                                                        ...newRoom,
                                                        capacity:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="25"
                                                className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                ช่วงอายุ
                                            </label>
                                            <input
                                                type="text"
                                                value={newRoom.ageRange}
                                                onChange={(e) =>
                                                    setNewRoom({
                                                        ...newRoom,
                                                        ageRange:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="2-3 ปี"
                                                className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                ครูประจำ
                                            </label>
                                            <select
                                                value={newRoom.teacher}
                                                onChange={(e) =>
                                                    setNewRoom({
                                                        ...newRoom,
                                                        teacher: e.target.value,
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
                                                            u.status ===
                                                                "active"
                                                    )
                                                    .map((t) => (
                                                        <option
                                                            key={t.id}
                                                            value={t.name}
                                                        >
                                                            {t.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className="col-span-full flex items-center gap-4 pt-1">
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
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200">
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
                                        onClick={handleAddRoom}
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
                                        เพิ่มห้องเรียน
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add User*/}
                    {openUserDialog && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-2xl overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <Plus
                                            size={22}
                                            className="text-blue-500"
                                        />
                                        <p className="text-lg font-semibold">
                                            เพิ่มผู้ใช้ใหม่
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setOpenUserDialog(false)}
                                        className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="px-5 py-4">
                                    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] gap-4">
                                        <input
                                            type="text"
                                            placeholder="ชื่อ-นามสกุล"
                                            value={newUser.name}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    name: e.target.value,
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
                                            <option value="staff">
                                                เจ้าหน้าที่
                                            </option>
                                            <option value="admin">
                                                ผู้ดูแลระบบ
                                            </option>
                                        </select>
                                        <div className="col-span-full relative">
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
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setOpenUserDialog(false)}
                                        className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <X size={16} /> ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleAddUser}
                                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                                    >
                                        <Save size={16} /> เพิ่มผู้ใช้
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {editRoomOpen && editRoom && (
<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 sm:p-6 md:p-8">
  <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">                            <button
                                onClick={closeEditRoom}
                                className="absolute inset-0 bg-black/40"
                            />
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
                                    {/* header */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <Edit
                                                className="text-blue-500"
                                                size={20}
                                            />
                                            <p className="font-semibold text-lg">
                                                แก้ไขห้องเรียน
                                            </p>
                                        </div>
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
                                    </div>

                                    {/* body */}
                                    <div className="px-5 py-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* รูปภาพ (แก้เฉพาะเมื่อกดเปลี่ยนรูป) */}
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm text-gray-600 mb-2">
                                                    รูปประจำห้อง
                                                </label>

                                                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 relative">
                                                    <img
                                                        src={
                                                            editImagePreview ||
                                                            (editRoom as any)
                                                                .imageUrl ||
                                                            "https://via.placeholder.com/800x450?text=No+Image"
                                                        }
                                                        alt="room"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {/* ปุ่มเปลี่ยนรูป */}
                                                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
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
                                                                onChange={(e) =>
                                                                    onPickEditImage(
                                                                        e.target
                                                                            .files?.[0] ||
                                                                            undefined
                                                                    )
                                                                }
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    รองรับ .jpg .png .webp
                                                </p>
                                            </div>

                                            {/* ฟิลด์อื่น ๆ */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm text-gray-600">
                                                    ชื่อห้อง
                                                </label>
                                                <input
                                                    className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    value={editRoom.name}
                                                    onChange={(e) =>
                                                        onEditChange(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm text-gray-600">
                                                    จำนวนเด็ก
                                                </label>
                                                <input
                                                    type="number"
                                                    className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    value={editRoom.capacity}
                                                    onChange={(e) =>
                                                        onEditChange(
                                                            "capacity",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm text-gray-600">
                                                    ช่วงอายุ
                                                </label>
                                                <input
                                                    className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    value={editRoom.ageRange}
                                                    onChange={(e) =>
                                                        onEditChange(
                                                            "ageRange",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm text-gray-600">
                                                    ครูประจำ
                                                </label>
                                                <select
                                                    className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    value={editRoom.teacher}
                                                    onChange={(e) =>
                                                        onEditChange(
                                                            "teacher",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        เลือกครูประจำ
                                                    </option>
                                                    {users
                                                        .filter(
                                                            (u) =>
                                                                u.role ===
                                                                    "teacher" &&
                                                                u.status ===
                                                                    "active"
                                                        )
                                                        .map((t) => (
                                                            <option
                                                                key={t.id}
                                                                value={t.name}
                                                            >
                                                                {t.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* footer */}
                                    <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200">
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
                                            className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            บันทึก
                                        </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit */}
                    {editOpen && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            role="dialog"
                            aria-modal="true"
                        >
                            {/* backdrop */}
                            <div
                                className="absolute inset-0 bg-black/40"
                                onClick={closeEdit}
                            />

                            {/* card */}
                            <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                                    <div className="flex justify-center gap-3">
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
                                    </div>
                                    <button
                                        onClick={closeEdit}
                                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                        aria-label="close"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                ชื่อ-นามสกุล
                                            </label>
                                            <input
                                                className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
                                                value={editForm.name}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="เช่น ครูสมชาย ใจดี"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
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
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm text-gray-600">
                                                เบอร์โทรศัพท์
                                            </label>
                                            <input
                                                className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500"
                                                value={editForm.phone}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                placeholder="081-234-5678"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
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
                                        </div>

                                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                                            <label className="text-sm text-gray-600">
                                                สถานะ
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditForm({
                                                            ...editForm,
                                                            status: "active",
                                                        })
                                                    }
                                                    className={`h-10 rounded-xl px-4 text-sm font-medium border
                  ${
                      editForm.status === "active"
                          ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                                                >
                                                    ใช้งานได้
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditForm({
                                                            ...editForm,
                                                            status: "inactive",
                                                        })
                                                    }
                                                    className={`h-10 rounded-xl px-4 text-sm font-medium border
                  ${
                      editForm.status === "inactive"
                          ? "border-red-500 text-red-600 bg-red-50"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                                                >
                                                    ปิดใช้งาน
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200">
                                    <button
                                        onClick={closeEdit}
                                        className="h-11 rounded-xl border-2 border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={saveEdit}
                                        className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        บันทึก
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users */}
                    {activeTab === 0 && (
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="font-bold text-[#111827] mb-1 text-2xl">
                                        จัดการผู้ใช้ในระบบ
                                    </p>
                                    <p className="text-[#6B7280] text-lg">
                                        เพิ่ม แก้ไข และจัดการสิทธิ์ผู้ใช้งาน
                                    </p>
                                </div>
                                <button
                                    onClick={() => setOpenUserDialog(true)}
                                    className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-white rounded-xl font-semibold shadow-sm text-lg"
                                >
                                    เพิ่มผู้ใช้
                                </button>
                            </div>

                            {/* Users List */}
                            <div className="flex flex-col gap-4">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="border-2 border-gray-200 p-3 rounded-2xl transition-all duration-300 hover:border-gray-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
                                    >
                                        <div className="p-3 sm:p-4">
                                            {/* แถวบน: บนมือถือให้ซ้อนเป็นคอลัมน์ */}
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                {/* ซ้าย: รูป + ชื่อ + ชิป + รายละเอียดติดต่อ */}
                                                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                                    {/* รูป */}
                                                    <div className="shrink-0">
                                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white font-bold text-base sm:text-lg grid place-content-center">
                                                            {user.avatar}
                                                        </div>
                                                    </div>

                                                    {/* เนื้อหา */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* ชื่อ + ชิป */}
                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
                                                            <p className="text-base sm:text-lg font-medium truncate max-w-full">
                                                                {user.name}
                                                            </p>

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
                                                                    user.status ===
                                                                    "active"
                                                                        ? "bg-emerald-100 text-emerald-600"
                                                                        : "bg-red-100 text-red-600"
                                                                }`}
                                                            >
                                                                {user.status ===
                                                                "active"
                                                                    ? "ใช้งานได้"
                                                                    : "ปิดใช้งาน"}
                                                            </span>
                                                        </div>

                                                        {/* รายละเอียดติดต่อ: 1 คอลัมน์บนมือถือ → 2 คอลัมน์ที่ sm → 3 คอลัมน์ที่ lg */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-2">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <Mail
                                                                    size={16}
                                                                    className="text-blue-500 shrink-0"
                                                                />
                                                                <p className="truncate">
                                                                    {user.email}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <Phone
                                                                    size={16}
                                                                    className="text-emerald-500 shrink-0"
                                                                />
                                                                {/* ทำให้กดโทรได้ */}
                                                                <a
                                                                    href={`tel:${user.phone.replace(
                                                                        /[^\d+]/g,
                                                                        ""
                                                                    )}`}
                                                                    className="truncate hover:underline"
                                                                >
                                                                    {user.phone}
                                                                </a>
                                                            </div>

                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <Calendar
                                                                    size={16}
                                                                    className="text-purple-500 shrink-0"
                                                                />
                                                                <p className="truncate">
                                                                    เข้าใช้ล่าสุด:{" "}
                                                                    {
                                                                        user.lastLogin
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ขวา: ปุ่ม → เรียงลง (full width) บนมือถือ */}
                                                <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                                                    <button
                                                        onClick={() =>
                                                            toggleUserStatus(
                                                                user.id
                                                            )
                                                        }
                                                        className={`w-full sm:w-auto px-4 py-2 border-2 rounded-[10px] text-sm font-semibold transition-all duration-200 flex items-center justify-center
                ${
                    user.status === "active"
                        ? "border-red-600 text-red-600 hover:bg-red-100"
                        : "border-emerald-500 text-emerald-600 hover:bg-emerald-100"
                }`}
                                                    >
                                                        {user.status ===
                                                        "active" ? (
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
                                                        className="w-full sm:w-auto px-3 py-2 border-2 border-blue-600 text-blue-600 rounded-[10px] hover:bg-blue-50 flex items-center justify-center"
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
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-8">
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl">
                                    <div className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-blue-600">
                                            {users.length}
                                        </p>
                                        <p className="text-blue-700 text-sm">
                                            ผู้ใช้ทั้งหมด
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl">
                                    <div className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-emerald-600">
                                            {
                                                users.filter(
                                                    (u) => u.status === "active"
                                                ).length
                                            }
                                        </p>
                                        <p className="text-emerald-700 text-sm">
                                            ใช้งานได้
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-2xl">
                                    <div className="text-center p-6">
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
                                    </div>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-2xl">
                                    <div className="text-center p-6">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rooms */}
                    {activeTab === 1 && (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="font-bold text-[#111827] mb-1 text-2xl">
                                        จัดการห้องเรียน
                                    </p>
                                    <p className="text-[#6B7280] text-lg">
                                        เพิ่ม แก้ไข และจัดการห้องเรียนในระบบ
                                    </p>
                                </div>
                                <button
                                    onClick={() => setOpenRoomDialog(true)}
                                    className="!bg-emerald-500 hover:!bg-emerald-600 px-5 py-2 text-white rounded-xl font-semibold shadow-sm text-lg"
                                >
                                    เพิ่มห้องเรียน
                                </button>
                            </div>

                            <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:border-gray-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] overflow-hidden"
                                    >
                                        {/* รูปประจำห้อง */}
                                        {/* หัวรูปของการ์ด */}
                                        <div className="aspect-video relative w-full p-4 bg-white">
                                            <img
                                                src={
                                                    room.imageUrl ||
                                                    "https://via.placeholder.com/800x450?text=No+Image"
                                                }
                                                alt={room.name}
                                                className="object-cover w-full h-full rounded-t-xl"
                                            />
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-3">
                                                    <p className="font-semibold">
                                                        {room.name}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <IconButton
                                                        onClick={() =>
                                                            openEditRoom(room)
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
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <Users
                                                            size={16}
                                                            className="text-blue-500"
                                                        />
                                                        <p className="text-gray-600">
                                                            จำนวนเด็ก
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold">
                                                        {room.capacity} คน
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar
                                                            size={16}
                                                            className="text-emerald-500"
                                                        />
                                                        <p className="text-gray-600">
                                                            ช่วงอายุ
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold">
                                                        {room.ageRange}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <Users
                                                            size={16}
                                                            className="text-purple-500"
                                                        />
                                                        <p className="text-gray-600">
                                                            ครูประจำ
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold">
                                                        {room.teacher}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-8">
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl">
                                    <div className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-emerald-600">
                                            {rooms.length}
                                        </p>
                                        <p className="text-emerald-700 text-sm">
                                            ห้องเรียนทั้งหมด
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl">
                                    <div className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-blue-600">
                                            {rooms.reduce(
                                                (sum, r) => sum + r.capacity,
                                                0
                                            )}
                                        </p>
                                        <p className="text-blue-700 text-sm">
                                            เด็กทั้งหมด
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-2xl">
                                    <div className="text-center p-6">
                                        <p className="text-2xl font-extrabold text-purple-600">
                                            {Math.round(
                                                rooms.reduce(
                                                    (s, r) => s + r.capacity,
                                                    0
                                                ) / rooms.length
                                            ) || 0}
                                        </p>
                                        <p className="text-purple-700 text-sm">
                                            เฉลี่ยต่อห้อง
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Box>
            </Container>

            {/* Add Room Dialog */}
            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    className="rounded-xl font-semibold"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SettingsPage;
