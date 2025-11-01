import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Modal
import AddChildModal from "../../components/AddChildModal";

//Component
import Select from "react-select";
import { Box, Container, Tabs, Tab, IconButton } from "@mui/material";

//svg
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
    ChevronDown,
} from "lucide-react";

//date
import {
    format,
    parseISO,
    isAfter,
    differenceInYears,
    differenceInMonths,
} from "date-fns";
import { th } from "date-fns/locale";

//Hooks
import {
    useUsers,
    useUserById,
    useDeleteUser,
    useUpdateUser,
    useUpdateUserStatus,
    useAddUser,
} from "../../hooks/useUser";
import {
    useRooms,
    useRoomById,
    useDeleteRoom,
    useUpdateRoom,
    useAddRoom,
} from "../../hooks/useRoom";
import {
    useStudents,
    useStudentById,
    useAddStudent,
    useDeleteStudent,
    useUpdateStudent,
} from "../../hooks/useStudent";

//utils
import { confirmDelete } from "../../utils/confirmDelete";
import { validateForm } from "../../utils/validate";

//interface
import type { User } from "../../interface/user";
import type { Teacher } from "../../interface/teacher";
import type { Student } from "../../interface/student";
import { getRole } from "../../utils/authen";

type Role = "admin" | "teacher";

type Room = {
    id: number;
    name: string;
    min_age: number;
    max_age: number;
    teachers: Teacher[];
    children_count: number;
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
    mobile: string;
    password: string;
    role: Role;
};

type NewRoomInput = {
    name: string;
    minAge: number;
    maxAge: number;
    teacher: number[];
    imageUrl: string;
};

type TeacherAssignment = {
    id: number;
    staff_id: number;
    staff: string;
    is_homeroom: boolean;
    assigned_at: string;
    unassigned_at: string | null;
    room_name: string;
};

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

const SettingsPage = () => {
    const navigate = useNavigate();

    //function
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

    function calculateAgeDetail(dob: string) {
        if (!dob) return "-";
        const birthDate = parseISO(dob);
        const today = new Date();

        // ถ้าวันเกิดยังไม่มาถึง
        if (isAfter(birthDate, today)) {
            return "ยังไม่เกิด";
        }

        const years = differenceInYears(today, birthDate);
        const months = differenceInMonths(today, birthDate) % 12;

        if (years === 0) {
            return `${months} เดือน`;
        }
        return `${years} ปี ${months} เดือน`;
    }

    // ---------- UI State ----------
    const [activeTab, setActiveTab] = useState<number>(0);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [openUserDialog, setOpenUserDialog] = useState<boolean>(false);
    const [openChildDialog, setOpenChildDialog] = useState<boolean>(false);
    const [addRoomModal, setAddRoomModal] = useState<boolean>(false);

    const [newRoom, setNewRoom] = useState<NewRoomInput>({
        name: "",
        minAge: 1,
        maxAge: 1,
        teacher: [],
        imageUrl: "",
    });

    const [newUser, setNewUser] = useState<NewUserInput>({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        mobile: "",
        password: "",
        role: "teacher",
    });
    const [editUserForm, setEditUserForm] = useState<{
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

    const [UpdateUser, setUpdateUser] = useState<User | null>(null);
    const [searchName, setSearchName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const role = getRole();
    

    // const [editImageFile, setEditImageFile] = useState<File | null>(null);
    // const [editImagePreview, setEditImagePreview] = useState<string | null>(
    //     null
    // );

    // const onPickEditImage = (file?: File) => {
    //     if (!file) return;
    //     setEditImageFile(file);
    //     const url = URL.createObjectURL(file);
    //     setEditImagePreview(url);
    // };

    // const clearPickedEditImage = () => {
    //     if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    //     setEditImageFile(null);
    //     setEditImagePreview(null);
    // };

    //Modal Section
    const [UpdateUserOpen, setUpdateUserOpen] = useState<boolean>(false);
    const [editRoom, setEditRoom] = useState<EditRoom | null>(null);
    const [editRoomOpen, setEditRoomOpen] = useState(false);
    const openUpdateUser = (u: User) => {
        setUpdateUser(u);
        setUpdateUserOpen(true);
    };
    const closeUpdateUser = () => {
        setUpdateUserOpen(false);
    };

    //เชื่อมกับหลังบ้าน

    const handleAddUser = () => {
        const isFill = validateForm(newUser, [
            "username",
            "password",
            "email",
            "mobile",
            "firstname",
            "lastname",
        ]);
        if (!isFill) return;

        addUser(newUser);
    };

    const handleAddRoom = () => {
        const isFill = validateForm(newRoom, [
            "name",
            "minAge",
            "maxAge",
            "teacher",
        ]);
        if (!isFill) return;

        addRoom(newRoom);
    };

    const [editRoomId, setEditRoomId] = useState<number | null>(null);

    const openEditRoom = (roomId: number) => {
        setEditRoomOpen(true);
        setEditRoomId(roomId);
    };

    const closeEditRoom = () => {
        setEditRoomOpen(false);
    };

    //Student
    const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [filteredChildren, setFilteredChildren] = useState<any[]>([]);
    const handleStudentModalClose = () => setOpenChildDialog(false);
    const handleUserModalClose = () => setOpenUserDialog(false);
    const handleRoomModalClose = () => setAddRoomModal(false);
    const [editStudentId, setEditStudentId] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editStudent, setEditStudent] = useState<any | null>(null);

    const openStudentEdit = (student: Student) => {
        setEditStudentId(student.id);
        setEditStudent(student);
        setIsEditStudentOpen(true);
    };

    const closeEditStudentModal = () => {
        setIsEditStudentOpen(false);
    };

    //Update Section
    const { mutate: updateStudent, isPending: isUpdatingStudent } =
        useUpdateStudent();
    const { mutate: updateRoom, isPending: isUpdatingRoom } = useUpdateRoom();
    const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();
    const { mutate: updateUserStatus } = useUpdateUserStatus();

    //handle Update Section
    const handleUpdateStudent = () => {
        if (!editStudentId || !editStudent) return;

        updateStudent({
            id: editStudentId,
            data: {
                first_name: editStudent.first_name,
                last_name: editStudent.last_name,
                nickname: editStudent.nickname,
                birth: editStudent.birth,
                room: editStudent.room,
                gender: editStudent.gender,
            },
        });

        closeEditStudentModal();
    };

    const handleUpdateRoom = () => {
        if (!editRoom) return;
        updateRoom({
            id: editRoom.id,
            data: {
                name: editRoom.name,
                min_age: editRoom.min_age,
                max_age: editRoom.max_age,
                staff_ids: editRoom.staff_ids,
            },
        });

        closeEditRoom();
    };

    const handleUpdateUser = () => {
        if (!UpdateUser) return; // ต้องมี id จาก user เดิม
        if (!editUserForm) return;

        updateUser({
            id: UpdateUser.id, // ใช้ id จาก object เดิม
            data: {
                first_name: editUserForm.first_name,
                last_name: editUserForm.last_name,
                email: editUserForm.email,
                mobile: editUserForm.mobile,
                role: editUserForm.role,
                is_active: editUserForm.is_active,
            },
        });

        closeUpdateUser();
    };

    //Add Section

    const { mutate: addStudent } = useAddStudent(handleStudentModalClose);
    const { mutate: addUser, isPending: isAddUserPending } =
        useAddUser(handleUserModalClose);
    const { mutate: addRoom, isPending: isAddRoomPending } =
        useAddRoom(handleRoomModalClose);
    //Delete Section

    const { mutate: deleteStudent } = useDeleteStudent();
    const { mutate: deleteRoom } = useDeleteRoom();
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

    //handle Delete Section
    const handleDeleteUser = async (id: number) => {
        if (await confirmDelete("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้")) {
            deleteUser(id);
        }
    };

    const handleDeleteStudent = async (id: number) => {
        if (await confirmDelete("เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลได้!")) {
            deleteStudent(id);
        }
    };

    const handleDeleteRoom = async (id: number) => {
        if (await confirmDelete("คุณแน่ใจหรือไม่ว่าต้องการลบห้องนี้")) {
            deleteRoom(id);
        }
    };

    //Query Section

    const { data: users = [] } = useUsers();
    const { data: editUserData } = useUserById(UpdateUser?.id);
    const { data: rooms = [] } = useRooms();
    const { data: editRoomData } = useRoomById(editRoomId ?? undefined);
    const { data: StudentData } = useStudents();
    console.log(StudentData)
    const { data: editStudentData } = useStudentById(
        editStudentId ?? undefined
    );


    //useEffect Section

    useEffect(() => {
        if (editUserData) {
            setEditUserForm({
                first_name: editUserData.first_name,
                last_name: editUserData.last_name,
                email: editUserData.email,
                mobile: editUserData.mobile,
                role: editUserData.role,
                is_active: editUserData.is_active,
            });
        }
    }, [editUserData]);

    useEffect(() => {
        if (editRoomData) {
            setEditRoom({
                id: editRoomData.id,
                name: editRoomData.name,
                is_active: editRoomData.is_active,
                min_age: editRoomData.min_age,
                max_age: editRoomData.max_age,
                staff_ids: editRoomData.teachers.map(
                    (t: TeacherAssignment) => t.staff_id
                ),
                assignment_ids: editRoomData.teachers,
            });
        }
    }, [editRoomData]);

    useEffect(() => {
        if (StudentData) {
            let filtered = StudentData;

            // ค้นหาจากชื่อ-นามสกุล หรือชื่อเล่น
            if (searchName) {
                filtered = filtered.filter((child: Student) => {
                    const fullName = `${child.first_name} ${child.last_name}`;
                    return (
                        fullName
                            .toLowerCase()
                            .includes(searchName.toLowerCase()) ||
                        child.nickname
                            ?.toLowerCase()
                            .includes(searchName.toLowerCase())
                    );
                });
            }

            if (selectedRoom) {
                filtered = filtered.filter(
                    (child: Student) =>
                        String(child.room) === String(selectedRoom)
                );
            }

            setFilteredChildren(filtered);
        }
    }, [StudentData, searchName, selectedRoom]);

    //Component Section
    const options =
        rooms?.map((room) => ({
            value: room.id, // ใช้ id เป็น key
            label: room.name, // ใช้ name เป็น label
        })) ?? [];

    const teacherOptions = users
        .filter((u) => u.role === "teacher" && u.is_active)
        .map((t) => ({
            value: t.id,
            label: `${t.first_name} ${t.last_name}`,
        }));

    const selectedTeachers = teacherOptions.filter((opt) =>
        editRoom?.staff_ids?.includes(opt.value)
    );
      useEffect(() => {
    if (role === "teacher") {
      setActiveTab(2);
    }
  }, [role]);

    return (
        <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
            <Container maxWidth="xl" className="py-4">
                {/* Tabs Box */}
                <Box className="rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden bg-white mt-4">
                    <Box className="border-b border-gray-200">
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            className="min-h-[72px]"
                        >
                            
                            <Tab
                                icon={<Users size={20} />}
                                  sx={{ display: role === "teacher" ? "none" : "flex" }}

                                iconPosition="start"
                                label="จัดการผู้ใช้"
                                className="normal-case text-[16px] font-semibold min-h-[72px] px-6 text-gray-700 gap-2 font-poppins"
                            />
                            <Tab
                                icon={<School size={20} />}
                                  sx={{ display: role === "teacher" ? "none" : "flex" }}

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
                        <AddChildModal
                            message="ฟอร์มเพิ่มเด็ก"
                            onClick={(payload) => addStudent(payload)}
                            onClose={handleStudentModalClose}
                        />
                    )}

                    {addRoomModal && (
                        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
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
                                        onClick={() => setAddRoomModal(false)}
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
                                            <Select
                                                isMulti
                                                placeholder="เลือกครู..."
                                                options={teacherOptions}
                                                value={teacherOptions.filter(
                                                    (opt) =>
                                                        newRoom.teacher.includes(
                                                            opt.value
                                                        )
                                                )}
                                                onChange={(selected) => {
                                                    const ids = (
                                                        selected as {
                                                            value: number;
                                                            label: string;
                                                        }[]
                                                    ).map((s) => s.value);
                                                    setNewRoom((prev) => ({
                                                        ...prev,
                                                        teacher: ids,
                                                    }));
                                                }}
                                            />
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

                                        {/* <Box className="col-span-full flex items-center gap-4 pt-1">
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
                                        </Box> */}
                                    </Box>
                                </Box>

                                {/* Footer */}
                                <Box className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setAddRoomModal(false)}
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
                                        {isAddRoomPending
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
                                            value={newUser.mobile}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    mobile: e.target.value,
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
                                                        options={teacherOptions}
                                                        value={selectedTeachers}
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
                                                    closeEditRoom();
                                                }}
                                                className="px-4 h-11 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                                            >
                                                ยกเลิก
                                            </button>

                                            <button
                                                onClick={handleUpdateRoom}
                                                disabled={isUpdatingRoom}
                                                className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {isUpdatingRoom
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
                        <Box className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                            <Box className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-2xl mx-4 sm:mx-6 overflow-hidden">
                                <Box className="p-6 flex justify-between items-center mb-4 border-b border-gray-200">
                                    <h2 className="text-xl">แก้ไขข้อมูลเด็ก</h2>
                                    <button onClick={closeEditStudentModal}>
                                        <X className="text-gray-500 hover:text-gray-700" />
                                    </button>
                                </Box>
                                {!editStudentData ? (
                                    <Box className="flex justify-center items-center py-10">
                                        <Box className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    </Box>
                                ) : (
                                    <>
                                        <Box className="p-4 grid grid-cols-1 sm:grid-cols-1 gap-4">
                                            {/* ชื่อ */}
                                            <Box>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    ชื่อ
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={
                                                        editStudentData?.first_name
                                                    }
                                                    onChange={(e) =>
                                                        setEditStudent({
                                                            ...editStudent,
                                                            first_name:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500 w-full"
                                                    placeholder="ชื่อ"
                                                />
                                            </Box>

                                            {/* นามสกุล */}
                                            <Box>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    นามสกุล
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={
                                                        editStudentData?.last_name
                                                    }
                                                    onChange={(e) =>
                                                        setEditStudent({
                                                            ...editStudent,
                                                            last_name:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500 w-full"
                                                    placeholder="นามสกุล"
                                                />
                                            </Box>

                                            {/* ชื่อเล่น */}
                                            <Box>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    ชื่อเล่น
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={
                                                        editStudentData?.nickname
                                                    }
                                                    onChange={(e) =>
                                                        setEditStudent({
                                                            ...editStudent,
                                                            nickname:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500 w-full"
                                                    placeholder="ชื่อเล่น"
                                                />
                                            </Box>

                                            <Box className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    เพศ
                                                </label>
                                                <Box className="relative">
                                                    <select
                                                        value={
                                                            editStudentData?.gender
                                                        }
                                                        onChange={(e) =>
                                                            setEditStudent({
                                                                ...editStudent,
                                                                gender: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="appearance-none w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                    >
                                                        <option value="">
                                                            เลือกเพศ
                                                        </option>
                                                        <option value="male">
                                                            ชาย
                                                        </option>
                                                        <option value="female">
                                                            หญิง
                                                        </option>
                                                    </select>

                                                    {/* 🔽 Custom icon */}
                                                    <ChevronDown
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                                        size={18}
                                                    />
                                                </Box>
                                            </Box>

                                            {/* วันเกิด */}
                                            <Box>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    วันเกิด
                                                </label>
                                                <input
                                                    type="date"
                                                    defaultValue={
                                                        editStudentData?.birth
                                                    }
                                                    onChange={(e) =>
                                                        setEditStudent({
                                                            ...editStudent,
                                                            birth: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500 w-full"
                                                />
                                            </Box>

                                            {/* ห้อง (id) */}
                                            <Box>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    ห้อง
                                                </label>
                                                <select
                                                    value={String(
                                                        editStudent?.room ?? ""
                                                    )}
                                                    onChange={(e) =>
                                                        setEditStudent({
                                                            ...editStudent,
                                                            room: Number(
                                                                e.target.value
                                                            ),
                                                        })
                                                    }
                                                    className="h-11 rounded-xl border border-gray-300 px-3 outline-none focus:border-blue-500 w-full"
                                                >
                                                    <option value="">
                                                        เลือกห้อง
                                                    </option>
                                                    {options.map((r) => (
                                                        <option
                                                            key={r.value}
                                                            value={r.value}
                                                        >
                                                            {r.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </Box>
                                        </Box>

                                        {/* ปุ่ม */}
                                        <Box className="flex justify-end gap-3 mt-4 p-6">
                                            <button
                                                onClick={closeEditStudentModal}
                                                className="px-4 h-11 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                                            >
                                                ยกเลิก
                                            </button>
                                            <button
                                                onClick={handleUpdateStudent}
                                                disabled={isUpdatingStudent}
                                                className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isUpdatingStudent && (
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
                                                )}
                                                {isUpdatingStudent
                                                    ? "กำลังบันทึก..."
                                                    : "บันทึก"}
                                            </button>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* Edit User */}
                    {UpdateUserOpen && (
                        <Box
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            role="dialog"
                            aria-modal="true"
                        >
                            {/* backdrop */}
                            <Box
                                className="absolute inset-0 bg-black/40"
                                onClick={closeUpdateUser}
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
                                        onClick={closeUpdateUser}
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
                                                value={editUserForm.first_name}
                                                onChange={(e) =>
                                                    setEditUserForm({
                                                        ...editUserForm,
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
                                                value={editUserForm.last_name}
                                                onChange={(e) =>
                                                    setEditUserForm({
                                                        ...editUserForm,
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
                                                value={editUserForm.email}
                                                onChange={(e) =>
                                                    setEditUserForm({
                                                        ...editUserForm,
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
                                                value={editUserForm.mobile}
                                                onChange={(e) =>
                                                    setEditUserForm({
                                                        ...editUserForm,
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
                                                value={editUserForm.role}
                                                onChange={(e) =>
                                                    setEditUserForm({
                                                        ...editUserForm,
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
                                                        setEditUserForm({
                                                            ...editUserForm,
                                                            is_active: true,
                                                        })
                                                    }
                                                    className={`h-10 rounded-xl px-4 text-sm font-medium border
        ${
            editUserForm.is_active
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
                                                        setEditUserForm({
                                                            ...editUserForm,
                                                            is_active: false,
                                                        })
                                                    }
                                                    className={`h-10 rounded-xl px-4 text-sm font-medium border
        ${
            editUserForm.is_active === false
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
                                        onClick={closeUpdateUser}
                                        className="h-11 rounded-xl border-2 border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleUpdateUser}
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
                    {activeTab === 0 && role !== "teacher" && (
                        <Box className="p-6">
                            {/* Header */}
                            <Box className="flex items-center justify-between mb-8">
                                <Box>
                                    <p className="font-bold text-[#111827] mb-1 text-2xl">
                                        จัดการผู้ใช้ในระบบ
                                    </p>
                                    <p className="text-[#6B7280] text-lg hidden md:block">
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
                                                            openUpdateUser(user)
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
                                                            <Trash2  size={16} />
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
                    {activeTab === 1 && role !== "teacher" && (
                        <Box className="p-6">
                            <Box className="flex items-center justify-between mb-8">
                                <Box>
                                    <p className="font-bold text-[#111827] mb-1 text-2xl">
                                        จัดการห้องเรียน
                                    </p>
                                    <p className="text-[#6B7280] text-lg hidden md:block">
                                        เพิ่ม แก้ไข และจัดการห้องเรียนในระบบ
                                    </p>
                                </Box>
                                <button
                                    onClick={() => setAddRoomModal(true)}
                                    className="!bg-emerald-500 hover:!bg-emerald-600 px-5 py-2 text-white rounded-xl font-semibold shadow-sm text-lg whitespace-nowrap"
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
                                                        {room.children_count}
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
                                                    sum +
                                                    (r.children_count ?? 0),
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
                                                        s +
                                                        (r.children_count ?? 0),
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
                                    <p className="text-[#6B7280] text-lg hidden md:block">
                                        เพิ่ม และ แก้ไข
                                    </p>
                                </Box>
                                <button
                                    onClick={() => setOpenChildDialog(true)}
                                    className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-white rounded-xl font-semibold shadow-sm text-lg whitespace-nowrap"
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
                                        <option key={room.id} value={room.id}>
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
                                                            S
                                                        </Box>
                                                    </Box>

                                                    {/* เนื้อหา */}
                                                    <Box className="flex-1 min-w-0">
                                                        {/* ชื่อ + ชิป */}
                                                        <Box className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
                                                            <p className="text-base sm:text-lg font-medium truncate max-w-full">
                                                                {
                                                                    student.first_name
                                                                }{" "}
                                                                {
                                                                    student.last_name
                                                                }
                                                            </p>
                                                            <span className="rounded-full text-[10px] sm:text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600">
                                                                {
                                                                    student.nickname
                                                                }
                                                            </span>
                                                            <span
                                                                className={`rounded-full text-[10px] sm:text-xs font-semibold px-2.5 py-1 
    ${
        student.gender === "male"
            ? "bg-blue-100 text-blue-600"
            : student.gender === "female"
            ? "bg-pink-100 text-pink-600"
            : "bg-gray-100 text-gray-500"
    }`}
                                                            >
                                                                {student.gender ===
                                                                "male"
                                                                    ? "ชาย"
                                                                    : student.gender ===
                                                                      "female"
                                                                    ? "หญิง"
                                                                    : "ไม่ระบุ"}
                                                            </span>

                                                            <span className="rounded-full text-[10px] sm:text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-600">
                                                                ห้อง{" "}
                                                                {
                                                                    student.room_name
                                                                }
                                                            </span>
                                                        </Box>

                                                        {/* รายละเอียดติดต่อ: 1 คอลัมน์บนมือถือ → 2 คอลัมน์ที่ sm → 3 คอลัมน์ที่ lg */}
                                                        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-2">
                                                            <Box className="flex items-center gap-2 min-w-0">
                                                                <Calendar
                                                                    size={16}
                                                                    className="text-blue-500 shrink-0"
                                                                />
                                                                <p>
                                                                    อายุ{" "}
                                                                    {calculateAgeDetail(
                                                                        student.birth
                                                                    )}
                                                                </p>
                                                            </Box>

                                                            <Box className="flex items-center gap-2 min-w-0">
                                                                <Users
                                                                    size={16}
                                                                    color="#10B981"
                                                                />

                                                                {/* ทำให้กดโทรได้ */}
                                                                <p className="truncate">
                                                                    wait for
                                                                    line section
                                                                </p>
                                                            </Box>

                                                            {/* <Box className="flex items-center gap-2 min-w-0">
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
                                                            </Box> */}
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {/* ขวา: ปุ่ม → เรียงลง (full width) บนมือถือ */}
                                                <Box className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                            `/rooms/${student.room}/evaluations/${student.id}/result`
                                                            )
                                                        }
                                                        className="w-full sm:w-auto px-3 py-1 border-2 border-green-600 text-green-600 rounded-[10px] hover:bg-blue-50 flex items-center justify-center"
                                                    >
                                                        ดูผลการประเมิน
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openStudentEdit(
                                                                student
                                                            )
                                                        }
                                                        className="w-full sm:w-auto px-3 py-2 border-2 border-blue-600 text-blue-600 rounded-[10px] hover:bg-blue-50 flex items-center justify-center"
                                                    >
                                                        <Edit size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDeleteStudent(
                                                                student.id
                                                            )
                                                        }
                                                        className={`w-full sm:w-auto px-3 py-2 border-2 rounded-[10px] flex items-center justify-center border-red-600 text-red-600 hover:bg-red-50 ${role === "teacher" ? "hidden" : "text-gray-700"}`}
                                                    >
                                                        <Trash2  size={16} />
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
