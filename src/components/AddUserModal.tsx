import { Plus, X, Save, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface User {
    name: string;
    email: string;
    phone: string;
    role: "teacher" | "staff" | "admin" | "";
    password: string;
}

interface AddUserModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
    open,
    onClose,
    onSave,
}) => {
    const [newUser, setNewUser] = useState<User>({
        name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    if (!open) return null;

    const handleSave = () => {
        if (!newUser.name || !newUser.email || !newUser.role) {
            alert("กรอกข้อมูลให้ครบก่อน");
            return;
        }
        onSave(newUser);
        setNewUser({ name: "", email: "", phone: "", role: "", password: "" }); // reset form
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Plus size={22} className="text-blue-500" />
                        <p className="text-lg font-semibold">เพิ่มผู้ใช้ใหม่</p>
                    </div>
                    <button
                        onClick={onClose}
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
                                setNewUser({ ...newUser, name: e.target.value })
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
                                    role: e.target.value as User["role"],
                                })
                            }
                            className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                        >
                            <option value="">สิทธิ์การใช้งาน</option>
                            <option value="teacher">ครู</option>
                            <option value="staff">เจ้าหน้าที่</option>
                            <option value="admin">ผู้ดูแลระบบ</option>
                        </select>
                        <div className="col-span-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                                value={newUser.password}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        password: e.target.value,
                                    })
                                }
                                className="border border-gray-300 rounded-xl px-3 py-2 w-full pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
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
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <X size={16} /> ยกเลิก
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                    >
                        <Save size={16} /> เพิ่มผู้ใช้
                    </button>
                </div>
            </div>
        </div>
    );
};
