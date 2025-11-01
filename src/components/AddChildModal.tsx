import React, { useEffect, useMemo, useState } from "react";
import { getAll } from "../helpers";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

type ModalProps = {
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (payload: any) => void; // ✅ รับ payload
    onClose: () => void;
};

type Room = {
    id: number;
    name: string;
};

const Modal: React.FC<ModalProps> = ({ message, onClick, onClose }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [nickname, setNickname] = useState("");
    const [dob, setDob] = useState("");
    const [room, setRoom] = useState("");
    const [gender, setGender] = useState("");

    const { data: roomOptions } = useQuery<Room[]>({
        queryKey: ["rooms"],
        queryFn: () => getAll("room/api/v1/room"),
    });

    const options = useMemo(() => {
        return (
        roomOptions?.map((room) => ({
            value: room.id,
            label: room.name,
        })) ?? []
        );
    }, [roomOptions]);

    useEffect(() => {
        if (!room && options.length > 0) {
        setRoom(String(options[0].value));
        }
    }, [options, room]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 sm:p-6 md:p-8"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {message}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 rounded-lg p-1"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ชื่อ
                        </label>
                        <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="กรอกชื่อ"
                            type="text"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            นามสกุล
                        </label>
                        <input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="กรอกนามสกุล"
                            type="text"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ชื่อเล่น
                        </label>
                        <input
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="กรอกชื่อเล่น"
                            type="text"
                        />
                    </div>
                    {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ปกครอง</label>
            <input
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อผู้ปกครอง"
              type="text"
            />
          </div> */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            เพศ
                        </label>
                        <div className="relative">
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="appearance-none w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">เลือกเพศ</option>
                                <option value="male">ชาย</option>
                                <option value="female">หญิง</option>
                            </select>

                            {/* 🔽 Custom icon */}
                            <ChevronDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                size={18}
                            />
                        </div>
                    </div>

                    {/* เลือกห้อง */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ห้อง
                        </label>
                        <div className="relative">
                            <select
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                className="appearance-none w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                {options.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                size={18}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            วันเกิด
                        </label>
                        <input
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            type="date"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 p-4 sm:p-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={() =>
                            onClick({
                                firstName,
                                lastName,
                                nickname,
                                dob,
                                room,
                                gender
                            })
                        }
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        คลิกเพื่อทำการ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
