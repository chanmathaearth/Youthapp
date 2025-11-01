/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    Users,
    Award,
    Activity,
    Target,
    Search,
    Eye,
    CheckCircle,
    UserCheck,
    Calendar,
    AlertTriangle,
} from "lucide-react";
import {
    useDashboardOverview,
    useDashboardRoomOverview,
} from "../../hooks/useDashboard";
import { useRoomsDashboard } from "../../hooks/useRoom";
import { evaluateGrowth } from "../../utils/evaluateGrowth";
import { calculateAgeInMonths } from "../../utils/ageCalculated";

export default function DashboardPage() {
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const locale = i18n.language === "th" ? "th-TH" : "en-US";
    const formattedDate = new Date().toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const { data: roomEvaluations = [] } = useRoomsDashboard();
    const { data: roomData = [] } = useDashboardRoomOverview();

    const selectedRoomData = roomEvaluations.find(
        (room: any) => room.id === selectedRoom
    );

    const filteredChildren =
        selectedRoomData?.children.filter((child: any) =>
            [child.first_name, child.last_name, child.nickname]
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        ) || [];

    const { data: HeaderData } = useDashboardOverview();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
            {selectedRoomData && (
                <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
                    <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6">
                        <div className="bg-white rounded-2xl shadow w-full max-w-5xl max-h-[85dvh] overflow-y-auto p-6 sm:p-8">
                            {/* ===== Header ===== */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">🏫</span>
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            ห้อง {selectedRoomData.name}
                                        </h2>
                                        <p className="text-md text-gray-500">
                                            {selectedRoomData.teachers?.length >
                                            0
                                                ? selectedRoomData.teachers
                                                      .map((t) => t.staff)
                                                      .join(", ")
                                                : "ไม่ระบุครู"}{" "}
                                            • อายุ {selectedRoomData.min_age}–
                                            {selectedRoomData.max_age} เดือน
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedRoom(null)}
                                    className="text-gray-500 hover:text-gray-700 text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* ===== Search ===== */}
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    placeholder="ค้นหาชื่อเด็ก..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 rounded-xl border border-gray-300 w-full py-2"
                                />
                            </div>

                            {/* ===== Children List ===== */}
                            <div className="space-y-3 mb-6">
                                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                                    <UserCheck className="w-5 h-5" />
                                    <span>
                                        รายชื่อเด็กที่ประเมินสำเร็จ (
                                        {
                                            filteredChildren.filter(
                                                (child: any) =>
                                                    child.current_evaluation_status ===
                                                    "success"
                                            ).length
                                        }{" "}
                                        คน)
                                    </span>
                                </h4>

                                {filteredChildren
                                    .filter(
                                        (child: any) =>
                                            child.current_evaluation_status ===
                                            "success"
                                    )
                                    .map((child: any) => {
                                        const name = `${child.first_name} ${child.last_name}`;
                                        const gender = child.gender;
                                        const ageMonth = calculateAgeInMonths(
                                            child.birth
                                        );

                                        const status =
                                            child.latest_assessment_status?.toLowerCase() ||
                                            "ยังไม่ประเมิน";
                                        const scoreText =
                                            child.latest_assessment_score ||
                                            "0/5";
                                        const [scoreGot, scoreTotal] = scoreText
                                            .split("/")
                                            .map(Number);
                                        const score =
                                            scoreGot && scoreTotal
                                                ? (scoreGot / scoreTotal) * 100
                                                : 0;

                                        const weight = parseFloat(
                                            child.latest_health_record
                                                ?.weight_kg || "0"
                                        );
                                        const height = parseFloat(
                                            child.latest_health_record
                                                ?.height_cm || "0"
                                        );

                                        const {
                                            weightResult,
                                            heightResult,
                                            weightHeightResult,
                                        } = evaluateGrowth({
                                            gender,
                                            ageMonth,
                                            weight,
                                            height,
                                        });

                                        const questionResult =
                                            child.latest_assessment_score;

                                        return (
                                            <div
                                                key={child.id}
                                                className="flex flex-col md:flex-row items-stretch justify-between gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                                            >
                                                {/* ===== Left: Profile ===== */}
                                                <div className="flex items-center space-x-4 md:w-1/3">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-md font-bold">
                                                            {child.first_name.charAt(
                                                                0
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {name}
                                                        </p>
                                                        <p className="text-md text-gray-500">
                                                            สถานะ:{" "}
                                                            <span
                                                                className={`${
                                                                    status ===
                                                                    "pass"
                                                                        ? "text-green-600 font-semibold"
                                                                        : "text-red-600"
                                                                }`}
                                                            >
                                                                {child.latest_assessment_status ||
                                                                    "ยังไม่ประเมิน"}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center justify-center text-center flex-1 md:w-1/3">
                                                    <div className="text-sm font-medium text-gray-700 mb-1">
                                                        การประเมินพัฒนาการ
                                                    </div>

                                                    <div className="relative w-16 h-16">
                                                        <div className="absolute inset-0 rounded-full bg-gray-200" />
                                                        <div
                                                            className="absolute inset-0 rounded-full"
                                                            style={{
                                                                background: `conic-gradient(${
                                                                    score >= 80
                                                                        ? "#22c55e"
                                                                        : "#f87171"
                                                                } ${score}%, #e5e7eb ${score}%)`,
                                                            }}
                                                        />
                                                        <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center m-2">
                                                            <span
                                                                className={`text-sm font-bold ${
                                                                    status ===
                                                                    "pass"
                                                                        ? "text-green-600"
                                                                        : "text-red-600"
                                                                }`}
                                                            >
                                                                {status ===
                                                                "pass"
                                                                    ? "ผ่าน"
                                                                    : "ไม่ผ่าน"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="hidden sm:block mt-2">
                                                        <p className="text-xs text-gray-500">
                                                            ตอบถูก
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {questionResult} ข้อ
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center justify-center text-center flex-1 md:w-1/3">
                                                    <div className="text-sm font-medium text-gray-700 mb-1">
                                                        การประเมินการเจริญเติบโต
                                                    </div>
                                                    <div className="flex flex-col space-y-1 text-sm w-full">
                                                        <div className="flex items-center w-full px-3 py-2 rounded-xl bg-blue-50 text-blue-700">
                                                            <span className="text-left">
                                                                น้ำหนักตามอายุ:
                                                            </span>
                                                            <span className="text-right font-medium ml-6">
                                                                {weightResult}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center w-full px-3 py-2 rounded-xl bg-purple-50 text-purple-700">
                                                            <span className="text-left">
                                                                ส่วนสูงตามอายุ:
                                                            </span>
                                                            <span className="text-right font-medium ml-6">
                                                                {heightResult}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center w-full px-3 py-2 rounded-xl bg-green-50 text-green-700">
                                                            <span className="text-left">
                                                                น้ำหนักตามส่วนสูง:
                                                            </span>
                                                            <span className="text-right font-medium ml-2">
                                                                {
                                                                    weightHeightResult
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="container mx-auto px-4 sm:px-6 py-8">
                {/* Stats divs */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 border border-gray-100 rounded-3xl p-8 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                    {t("dashboard.title")}
                                </h2>
                                <p className="text-gray-600 text-lg mb-4">
                                    {t("dashboard.subtitle")}
                                    <span className="font-semibold text-blue-600">
                                        YOUTHAPP
                                    </span>
                                </p>
                                <div className="flex items-center space-x-8 mt-6">
                                    <div className="flex items-center space-x-3 bg-white/60 rounded-full px-4 py-2 border border-gray-100">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">
                                            {t("dashboard.date", {
                                                date: formattedDate,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-white/60 rounded-full px-4 py-2 border border-gray-100">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700">
                                            {t("dashboard.childrenInSystem", {
                                                count: HeaderData?.total_children,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-white/60 rounded-full px-4 py-2 border border-gray-100">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-emerald-600">
                                            {t("dashboard.status.ready")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-md font-medium">
                                        เด็กทั้งหมด
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {HeaderData.total_children}
                                    </p>
                                    <p className="text-blue-100 text-xs mt-1">
                                        คน
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Users className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-md font-medium">
                                        คะแนนเฉลี่ย
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {HeaderData.average_score}
                                    </p>
                                    <p className="text-purple-100 text-xs mt-1">
                                        %
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Award className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-md font-medium">
                                        ประเมินแล้ว
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {HeaderData.assessed_children_count}
                                    </p>
                                    <p className="text-green-100 text-xs mt-1">
                                        รายการ
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-md font-medium">
                                        ยังไม่ได้ประเมิน
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {HeaderData.pending_assessment_count}
                                    </p>
                                    <p className="text-orange-100 text-xs mt-1">
                                        รายการ
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6" />{" "}
                                    {/* ⚠️ icon lucide-react */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-row-1 gap-8">
                    {/* Left Column */}
                    <div className=" space-y-8 ">
                        {/* Room Statistics */}
                        <div className="border-0 shadow-lg rounded-3xl bg-white p-6">
                            <div className="border-b border-gray-100 pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-xl flex items-center space-x-3">
                                        <Target className="w-6 h-6 text-blue-500" />
                                        <span>สถิติตามห้อง</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                {roomData?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {roomData.map((room: any) => {
                                            const totalChildren =
                                                room.total_children || 0;
                                            const assessedChildren =
                                                room.assessed_children_count ||
                                                0;

                                            const progress =
                                                totalChildren > 0
                                                    ? Math.round(
                                                          (assessedChildren /
                                                              totalChildren) *
                                                              100
                                                      )
                                                    : 0;
                                            return (
                                                <div
                                                    key={room.id}
                                                    onClick={() =>
                                                        setSelectedRoom(room.id)
                                                    }
                                                    className={`border- shadow-lg rounded-3xl bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
                                                >
                                                    <div className="p-6">
                                                        {/* ===== Header ===== */}
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div>
                                                                    <h4 className="text-lg font-bold">
                                                                        {
                                                                            room.name
                                                                        }
                                                                    </h4>
                                                                    {room.teachers &&
                                                                    room
                                                                        .teachers
                                                                        .length >
                                                                        0
                                                                        ? room.teachers.join(
                                                                              ", "
                                                                          )
                                                                        : "ไม่ระบุครู"}
                                                                </div>
                                                            </div>
                                                            <Eye className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                                        </div>

                                                        {/* ===== Stats Grid ===== */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="bg-gray-50 p-3 rounded-xl">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <Users className="w-4 h-4 text-blue-500" />
                                                                    <span className="text-xs text-gray-700">
                                                                        ประเมินแล้ว
                                                                    </span>
                                                                </div>
                                                                <span className="text-lg font-bold text-blue-600">
                                                                    {
                                                                        room.assessed_children_count
                                                                    }
                                                                    /
                                                                    {
                                                                        room.total_children
                                                                    }
                                                                </span>
                                                            </div>

                                                            <div className="bg-gray-50 p-3 rounded-xl">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <Award className="w-4 h-4 text-yellow-500" />
                                                                    <span className="text-xs text-gray-700">
                                                                        คะแนนเฉลี่ย
                                                                    </span>
                                                                </div>
                                                                <span className="text-lg font-bold text-yellow-600">
                                                                    {
                                                                        room.average_score
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>

                                                            <div className="bg-gray-50 p-3 rounded-xl col-span-2">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <Activity className="w-4 h-4 text-green-500" />
                                                                    <span className="text-xs text-gray-700">
                                                                        ความคืบหน้า
                                                                    </span>
                                                                </div>
                                                                <span className="text-lg font-bold text-green-600">
                                                                    {progress}%
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* ===== Progress Bar ===== */}
                                                        <div className="mt-4">
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-700"
                                                                    style={{
                                                                        width: `${progress}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        ไม่พบข้อมูลห้องเรียน
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl mt-8 bottom-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 p-8">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full h-20 bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center justify-center space-y-2 rounded-2xl"
                        >
                            <Users className="w-6 h-6" />
                            <span>{t("dashboard.button.evaluate")}</span>
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full h-20 bg-green-500 hover:bg-green-600 text-white flex flex-col items-center justify-center space-y-2 rounded-2xl"
                        >
                            <CheckCircle className="w-6 h-6" />
                            <span>{t("dashboard.button.add")}</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
