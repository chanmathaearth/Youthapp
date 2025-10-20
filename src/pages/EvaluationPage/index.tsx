import { useState } from "react";
import { useTranslation } from "react-i18next";
import calendar from "../../assets/calendar.svg";
import user from "../../assets/user.svg";
import Table_ from "../../components/Table";
import StatCard from "../../components/StatCard";
import circlecheck from "../../assets/circlecheck.svg";
import alert from "../../assets/alert.svg";
import AddChildModal from "../../components/AddChildModal";
import { useAddStudent, useStudentsByRoom } from "../../hooks/useStudent";
import type { ChildData } from "../../components/Table";
import { useParams } from "react-router-dom";
import { useRoomById } from "../../hooks/useRoom";
import { Home } from "lucide-react";
import type { Student } from "../../interface/student";
import { dobFormat } from "../../utils/dobFormat";

const EvaluationPage = () => {
    const { t } = useTranslation();

    const { roomId } = useParams<{ roomId: string }>();

    const [openChildDialog, setOpenChildDialog] = useState(false);
    const handleStudentModalClose = () => setOpenChildDialog(false);

    const { data: students = [], isLoading, isError } = useStudentsByRoom(Number(roomId));
    const { mutate: addStudent } = useAddStudent(handleStudentModalClose);

    const { data: RoomData } = useRoomById(Number(roomId));

    console.log(students)
    const childList: ChildData[] = students.map((s: Student) => {
        return {
            id: s.id,
            name: `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim(),
            nickname: s.nickname ?? "—",
            age: dobFormat(s.birth),
            status: s.current_evaluation_status,
            round: 1,
            date: s.updated_at
                ? new Date(s.updated_at).toLocaleDateString("th-TH")
                : "—",
            room: s.room_name ?? "ไม่ระบุห้อง",
        };
    });

    console.log("Test test",childList)

    const successCount = childList.filter((s) => s.status === "success").length;
    const holdCount = childList.filter((s) => s.status === "hold").length;

    return (
        <div className="w-full min-h-screen bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 font-poppins">
            <main className="relative z-10 container mx-auto px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={() => setOpenChildDialog(true)}
                            className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-5 py-3 transition delay-150 duration-300 rounded-xl hover:scale-105 text-xl"
                        >
                            เพิ่มรายชื่อ
                        </button>
                    </div>

                    <h2 className="text-xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {t("evaluation.select_name")}
                        <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                            {t("evaluation.evaluation_prompt")}
                        </span>
                    </h2>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-600 text-lg font-medium">
                        <div className="flex items-center gap-2">
                            <Home className="w-6 h-6 text-black" />
                            <span>
                                ห้อง:{" "}
                                <span className=" text-black">
                                    {RoomData?.name ?? "ไม่ทราบชื่อห้อง"}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src={calendar} className="w-6 h-6" />
                            <span>
                                วันที่อัปเดต :{" "}
                                {new Date(
                                    RoomData?.updated_at
                                ).toLocaleDateString("th-TH")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src={user} className="w-6 h-6" />
                            <span>
                                จำนวนเด็ก: {RoomData?.children_count} คน
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="flex flex-col md:flex-row mb-10 justify-center gap-12 md:ml-40 md:mr-40 items-center">
                    <StatCard
                        value={successCount}
                        label="เสร็จสิ้น"
                        icon={circlecheck}
                        color="#22c55e"
                    />
                    <StatCard
                        value={holdCount}
                        label="รอประเมิน"
                        icon={alert}
                        color="#f97316"
                    />
                </div>

                {/* Table */}
                <div>
                    {isLoading && (
                        <div className="fixed inset-0 flex justify-center items-center bg-white/70 z-50">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {isError && (
                        <p className="text-center text-red-500">
                            โหลดข้อมูลไม่สำเร็จ
                        </p>
                    )}
                    {!isLoading && !isError && (
                        <Table_ childrenList={childList} />
                    )}
                </div>
            </main>

            {/* Modal */}
            {openChildDialog && (
                <AddChildModal
                    message="ฟอร์มเพิ่มเด็ก"
                    onClick={(payload) => addStudent(payload)}
                    onClose={handleStudentModalClose}
                />
            )}
        </div>
    );
};

export default EvaluationPage;
