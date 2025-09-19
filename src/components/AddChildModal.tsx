import React, { useState } from "react";

type ModalProps = {
  message: string;
  onClick: () => void;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ message, onClick, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [nickname, setNickname]   = useState("");
  const [parentName, setParentName] = useState("");
  const [dob, setDob]             = useState("");
  const [room, setRoom]           = useState("");

  // สมมติว่ามีรายการห้อง
  const roomOptions = [
    { value: "", label: "เลือกห้อง" },
    { value: "room1", label: "ห้อง 1" },
    { value: "room2", label: "ห้อง 2" },
    { value: "room3", label: "ห้อง 3" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{message}</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อ"
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกนามสกุล"
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเล่น</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อเล่น"
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ปกครอง</label>
            <input
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อผู้ปกครอง"
              type="text"
            />
          </div>

          {/* เลือกห้อง */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ห้อง</label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {roomOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วันเกิด</label>
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
            onClick={onClick}
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
