import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend,
    ResponsiveContainer,
} from "recharts";

import {
    Users,
    Award,
    Activity,
    Target,
    BookOpen,
    Heart,
    Zap,
    Smile,
    Brain,
    Search,
    Eye,
    CheckCircle,
    UserCheck,
    Calendar,
} from "lucide-react";

export default function DashboardPage() {
    type Room = {
        id: string;
        name: string;
        teacher?: string;
        ageRange?: string;
        evaluatedPercent?: number;
        averageScore?: number;
        progress?: number;
    };
    //mock Data
    const stats = {
        totalChildren: 24,
        totalEvaluations: 18,
        averageScore: 82,
        completionRate: 75,
    };
    const developmentQuestions = {
        totalQuestions: 5,
        categories: [
            {
                name: "ด้านร่างกาย",
                questions: 5,
                averageCorrect: 5,
                icon: Heart,
                color: "text-red-500",
                bg: "bg-red-50",
            },
            {
                name: "ด้านอารมณ์-จิตใจ",
                questions: 5,
                averageCorrect: 5,
                icon: Smile,
                color: "text-yellow-500",
                bg: "bg-yellow-50",
            },
            {
                name: "ด้านสังคม",
                questions: 9,
                averageCorrect: 7.1,
                icon: Users,
                color: "text-blue-500",
                bg: "bg-blue-50",
            },
            {
                name: "ด้านสติปัญญา",
                questions: 10,
                averageCorrect: 7.8,
                icon: Brain,
                color: "text-purple-500",
                bg: "bg-purple-50",
            },
            {
                name: "ด้านภาษา",
                questions: 6,
                averageCorrect: 4.9,
                icon: BookOpen,
                color: "text-green-500",
                bg: "bg-green-50",
            },
            {
                name: "ด้านการเคลื่อนไหว",
                questions: 5,
                averageCorrect: 4.3,
                icon: Zap,
                color: "text-orange-500",
                bg: "bg-orange-50",
            },
        ],
    };
    const roomEvaluations = [
        {
            id: 1,
            room: "ห้องการ์ตูน",
            totalEvaluated: 3,
            totalChildren: 3,
            averageScore: 78,
            averageQuestions: 32,
            color: "from-rose-500 to-pink-600",
            bgColor: "bg-white",
            borderColor: "border-rose-200",
            textColor: "text-gray-800",
            accentColor: "text-rose-600",
            icon: "🏠",
            iconBg: "bg-rose-100",
            teacher: "ครูสมหญิง",
            ageRange: "2-3 ปี",
            children: [
                {
                    id: 1,
                    name: "น้องมะลิ",
                    score: 100,
                    questionsCorrect: 5,
                    status: "completed",
                    lastEvaluated: "2024-01-10",
                    weight: "ปกติ",
                    height: "ปกติ",
                    weightforheight: "ปกติ",
                },
                {
                    id: 2,
                    name: "น้องกุหลาบ",
                    score: 100,
                    questionsCorrect: 5,
                    status: "completed",
                    lastEvaluated: "2024-01-09",
                    weight: "ปกติ",
                    height: "ปกติ",
                    weightforheight: "ผอม",
                },
                {
                    id: 3,
                    name: "น้องดาวเรือง",
                    score: 80,
                    questionsCorrect: 4,
                    status: "completed",
                    lastEvaluated: "2024-01-08",
                    weight: "ปกติ",
                    height: "เตี้ย",
                    weightforheight: "ปกติ",
                },
            ],
        },
        {
            id: 2,
            room: "ห้องม้าน้ำ",
            totalEvaluated: 4,
            totalChildren: 4,
            averageScore: 84,
            averageQuestions: 35,
            color: "from-amber-500 to-orange-600",
            bgColor: "bg-white",
            borderColor: "border-amber-200",
            textColor: "text-gray-800",
            accentColor: "text-amber-600",
            icon: "🏡",
            iconBg: "bg-amber-100",
            teacher: "ครูสมชาย",
            ageRange: "3-4 ปี",
            children: [
                {
                    id: 9,
                    name: "น้องอรุณ",
                    score: 100,
                    questionsCorrect: 5,
                    status: "completed",
                    lastEvaluated: "2024-01-10",
                    weight: "ปกติ",
                    height: "ปกติ",
                    weightforheight: "ปกติ",
                },
                {
                    id: 10,
                    name: "น้องพิมพ์ใจ",
                    score: 100,
                    questionsCorrect: 5,
                    status: "completed",
                    lastEvaluated: "2024-01-09",
                    weight: "ปกติ",
                    height: "ปกติ",
                    weightforheight: "ปกติ",
                },
                {
                    id: 11,
                    name: "น้องสายใส",
                    score: 100,
                    questionsCorrect: 5,
                    status: "completed",
                    lastEvaluated: "2024-01-08",
                    weight: "ปกติ",
                    height: "สูง",
                    weightforheight: "ปกติ",
                },
                {
                    id: 12,
                    name: "น้องดวงใจ",
                    score: 80,
                    questionsCorrect: 4,
                    status: "completed",
                    lastEvaluated: "2024-01-07",
                    weight: "น้ำหนักน้อย",
                    height: "ปกติ",
                    weightforheight: "ผอม",
                },
            ],
        },
        {
            id: 3,
            room: "ห้องโลมา",
            totalEvaluated: 3,
            totalChildren: 3,
            averageScore: 85,
            averageQuestions: 36,
            color: "from-emerald-500 to-green-600",
            bgColor: "bg-white",
            borderColor: "border-emerald-200",
            textColor: "text-gray-800",
            accentColor: "text-emerald-600",
            icon: "🏘️",
            iconBg: "bg-emerald-100",
            teacher: "ครูสมใจ",
            ageRange: "4-5 ปี",
            children: [
                {
                    id: 18,
                    name: "น้องวิมล",
                    score: 100,
                    questionsCorrect: 5,
                    status: "completed",
                    lastEvaluated: "2024-01-10",
                    weight: "ปกติ",
                    height: "ปกติ",
                    weightforheight: "ปกติ",
                },
                {
                    id: 19,
                    name: "น้องสุนิสา",
                    score: 80,
                    questionsCorrect: 4,
                    status: "completed",
                    lastEvaluated: "2024-01-09",
                    weight: "ปกติ",
                    height: "ปกติ",
                    weightforheight: "ปกติ",
                },
                {
                    id: 20,
                    name: "น้องพรรณี",
                    score: 100,
                    questionsCorrect: 5,
                    status: "completed",
                    lastEvaluated: "2024-01-08",
                    weight: "น้ำหนักเกิน",
                    height: "ปกติ",
                    weightforheight: "อ้วน",
                },
            ],
        },
    ];
    const roomSummary: Room[] = [
        {
            id: "r1",
            name: "ห้องการ์ตูน",
            teacher: "ครูสมหญิง",
            ageRange: "2–3 ปี",
            evaluatedPercent: 75,
            averageScore: 78,
            progress: 75,
        },
        {
            id: "r2",
            name: "ห้องบ้านน้ำ",
            teacher: "ครูสมชาย",
            ageRange: "3–4 ปี",
            evaluatedPercent: 77.78,
            averageScore: 84,
            progress: 78,
        },
        {
            id: "r3",
            name: "ห้องโลมา",
            teacher: "ครูสุนิจ",
            ageRange: "4–5 ปี",
            evaluatedPercent: 71.43,
            averageScore: 85,
            progress: 71,
        },
    ];

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
    const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
    const [compareSelectedRoomIds, setCompareSelectedRoomIds] = useState<
        string[]
    >([]);
    const [compareQuery] = useState("");

    const filteredRooms = roomSummary.filter((r) => {
        const q = compareQuery.trim().toLowerCase();
        if (!q) return true;
        return [r.name, r.teacher, r.ageRange].some((v) =>
            (v ?? "").toLowerCase().includes(q)
        );
    });

    const toggleCompareRoom = (id: string) => {
        setCompareSelectedRoomIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const selectAllFilteredRooms = () => {
        const allIds = filteredRooms.map((r) => r.id);
        const allSelected = allIds.every((id) =>
            compareSelectedRoomIds.includes(id)
        );
        setCompareSelectedRoomIds(allSelected ? [] : allIds);
    };

    const scoreRingColor = (s: number) => {
        if (s >= 100) return "#22c55e";
        return "#ef4444";
    };

    const getPhysicalStatusColor = (status: string) => {
        switch (status) {
            case "ปกติ":
                return "text-green-600 bg-green-100";
            case "น้ำหนักเกิน":
            case "อ้วน":
                return "text-red-600 bg-red-100";
            case "น้ำหนักน้อย":
            case "ผอม":
            case "เตี้ย":
                return "text-yellow-600 bg-yellow-100";
            case "สูง":
                return "text-blue-600 bg-blue-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const selectedRoomData = roomEvaluations.find(
        (room) => room.room === selectedRoom
    );
    const filteredChildren =
        selectedRoomData?.children.filter((child) =>
            child.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "ยังไม่ได้ประเมิน";
        return new Date(dateString).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };
    const COLORS = [
        "#E53935", // Red 600
        "#1E88E5", // Blue 600
        "#43A047", // Green 600
        "#FB8C00", // Orange 600
        "#8E24AA", // Purple 600
        "#00ACC1", // Cyan 600
    ];

    const getColor = (i: number) => COLORS[i % COLORS.length];

    const METRICS = [
        { key: "evaluatedPercent", label: "% ประเมินแล้ว" },
        { key: "averageScore", label: "คะแนนเฉลี่ย (%)" },
        { key: "progress", label: "ความคืบหน้า (%)" },
    ] as const;

    const selectedRooms = roomSummary.filter((r) =>
        compareSelectedRoomIds.includes(r.id)
    );

    const chartData = METRICS.map((m) => ({
        metric: m.label,
        ...Object.fromEntries(
            selectedRooms.map((r) => [r.name, Number(r[m.key] ?? 0)])
        ),
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
            {isCompareModalVisible && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 sm:p-6 md:p-8">
                    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-white rounded-2xl shadow-xl">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-black/20">
                                <h2 className="text-lg sm:text-xl font-semibold">
                                    เลือกห้องเพื่อเปรียบเทียบ
                                </h2>
                                <button
                                    onClick={() =>
                                        setIsCompareModalVisible(false)
                                    }
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="close-compare-modal"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center gap-2 justify-center">
                                    <button
                                        onClick={selectAllFilteredRooms}
                                        className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50"
                                    >
                                        {filteredRooms.every((r) =>
                                            compareSelectedRoomIds.includes(
                                                r.id
                                            )
                                        ) && filteredRooms.length > 0
                                            ? "ล้างเลือก"
                                            : "เลือกทั้งหมด"}
                                    </button>
                                </div>

                                <div className="mt-3 max-h-[55dvh] overflow-y-auto space-y-2 pr-1">
                                    {filteredRooms.map((r) => (
                                        <label
                                            key={r.id}
                                            className={`flex items-center justify-between rounded-xl border p-3 sm:p-4 cursor-pointer hover:bg-gray-50 ${
                                                compareSelectedRoomIds.includes(
                                                    r.id
                                                )
                                                    ? "border-blue-500 bg-blue-50/40"
                                                    : "border-gray-200"
                                            }`}
                                            onClick={() =>
                                                toggleCompareRoom(r.id)
                                            }
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="size-4"
                                                    checked={compareSelectedRoomIds.includes(
                                                        r.id
                                                    )}
                                                    onChange={() => {}}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                />
                                                <div>
                                                    <div className="font-medium">
                                                        {r.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {r.teacher} •{" "}
                                                        {r.ageRange}
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {/* Radar Chart Preview */}
                                {compareSelectedRoomIds.length >= 2 ? (
                                    <div className="mt-4 border rounded-xl p-3 sm:p-4">
                                        <div className="mb-2 font-medium">
                                            กราฟเปรียบเทียบ
                                        </div>
                                        <div className="h-[340px]">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <RadarChart data={chartData}>
                                                    <PolarGrid />
                                                    <PolarAngleAxis dataKey="metric" />
                                                    <PolarRadiusAxis
                                                        domain={[0, 100]}
                                                    />
                                                    {compareSelectedRoomIds.map(
                                                        (id, idx) => {
                                                            const r =
                                                                roomSummary.find(
                                                                    (x) =>
                                                                        x.id ===
                                                                        id
                                                                )!;
                                                            const color =
                                                                getColor(idx);
                                                            return (
                                                                <Radar
                                                                    key={id}
                                                                    name={
                                                                        r.name
                                                                    }
                                                                    dataKey={
                                                                        r.name
                                                                    } // คอลัมน์ใน chartData
                                                                    stroke={
                                                                        color
                                                                    }
                                                                    fill={color}
                                                                    fillOpacity={
                                                                        0.3
                                                                    }
                                                                />
                                                            );
                                                        }
                                                    )}
                                                    <Legend />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 text-sm text-gray-500 text-center">
                                        เลือกอย่างน้อย 2 ห้อง
                                        เพื่อดูกราฟเปรียบเทียบ
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {selectedRoomData && (
                <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
                    <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6">
                        <div className="bg-white rounded-2xl shadow w-full max-w-4xl max-h-[85dvh] overflow-y-auto p-6 sm:p-8">
                            {" "}
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">
                                        {selectedRoomData?.icon}
                                    </span>
                                    <div>
                                        <h2 className="text-2xl">
                                            รายละเอียด {selectedRoom}
                                        </h2>
                                        <p className="text-md text-gray-500">
                                            {selectedRoomData?.teacher} •{" "}
                                            {selectedRoomData?.ageRange}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedRoom(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span className="text-md text-blue-800">
                                            เด็กทั้งหมด
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {selectedRoomData.totalChildren}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-md text-green-800">
                                            ประเมินแล้ว
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-900">
                                        {selectedRoomData.totalEvaluated}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl">
                                    <div className="flex items-center space-x-2">
                                        <Award className="w-5 h-5 text-purple-600" />
                                        <span className="text-md text-purple-800">
                                            คะแนนเฉลี่ย
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {selectedRoomData.averageScore}%
                                    </p>
                                </div>
                            </div>
                            {/* Search */}
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
                            {/* Children List */}
                            <div className="space-y-3 mb-6">
                                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                                    <UserCheck className="w-5 h-5" />
                                    <span>
                                        รายชื่อเด็ก ({filteredChildren.length}{" "}
                                        คน)
                                    </span>
                                </h4>
                                {filteredChildren
                                    .filter(
                                        (child) => child.status === "completed"
                                    )
                                    .map((child) => (
                                        <div
                                            key={child.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-md font-bold">
                                                        {child.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {child.name}
                                                    </p>
                                                    <p className="text-md text-gray-500">
                                                        {formatDate(
                                                            child.lastEvaluated
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center md:min-w-[140px] gap-2 text-center">
                                                {/* หัวข้ออยู่ด้านบน */}
                                                <div className="text-sm font-medium text-gray-700">
                                                    การประเมินพัฒนาการ
                                                </div>

                                                {/* วงแหวนคะแนน */}
                                                <div className="relative w-16 h-16">
                                                    {/* แทร็คสีจาง */}
                                                    <div className="absolute inset-0 rounded-full bg-gray-200" />

                                                    {/* วงแหวนเปอร์เซ็นต์ */}
                                                    <div
                                                        className="absolute inset-0 rounded-full"
                                                        style={{
                                                            background: `conic-gradient(${scoreRingColor(
                                                                child.score
                                                            )}`,
                                                        }}
                                                        aria-label={`คะแนน ${child.score} เปอร์เซ็นต์`}
                                                    />

                                                    {/* ตรงกลาง */}
                                                    <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center m-2">
                                                        <span
                                                            className={`text-sm font-bold ${
                                                                child.score >=
                                                                100
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }`}
                                                        >
                                                            {child.score >= 100
                                                                ? "ผ่าน"
                                                                : "ไม่ผ่าน"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* ข้อมูลจำนวนข้อถูก */}
                                                <div className="hidden sm:block">
                                                    <p className="text-xs text-gray-500">
                                                        ตอบถูก
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {child.questionsCorrect}
                                                        /
                                                        {
                                                            developmentQuestions.totalQuestions
                                                        }{" "}
                                                        ข้อ
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center space-x-3">
                                                <div className="text-sm font-medium text-gray-700 mb-5">
                                                    การประเมินการเจริญเติบโต
                                                </div>

                                                {/* Physical Status */}
                                                <div className="flex flex-col space-y-1">
                                                    <span
                                                        className={`flex text-sm px-2 py-1 rounded-xl ${getPhysicalStatusColor(
                                                            child.weight
                                                        )}`}
                                                    >
                                                        น้ำหนัก: {child.weight}
                                                    </span>
                                                    <span
                                                        className={`text-sm px-2 py-1 rounded-xl ${getPhysicalStatusColor(
                                                            child.height
                                                        )}`}
                                                    >
                                                        ส่วนสูง: {child.height}
                                                    </span>
                                                    <span
                                                        className={`text-sm px-2 py-1 rounded-xl ${getPhysicalStatusColor(
                                                            child.weightforheight
                                                        )}`}
                                                    >
                                                        น้ำหนักตามส่วนสูง:{" "}
                                                        {child.weightforheight}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                                count: stats.totalChildren,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-white/60 rounded-full px-4 py-2 border border-gray-100">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-emerald-600">
                                            {t("dashboard.status.ready")}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() =>
                                            setIsCompareModalVisible(true)
                                        }
                                        className="flex items-center gap-3 p-2 bg-white/60 px-4 text-blue-500 rounded-2xl"
                                    >
                                        <svg
                                            className="w-4 h-4 text-blue-500"
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
                                                d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
                                            />
                                            <path
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
                                            />
                                        </svg>
                                        เปรียบเทียบ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-md font-medium">
                                        เด็กทั้งหมด
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.totalChildren}
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
                                        {stats.averageScore}
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
                                        {stats.totalEvaluations}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {roomEvaluations.map((room) => (
                                        <div
                                            key={room.id}
                                            onClick={() =>
                                                setSelectedRoom(room.room)
                                            }
                                            className={`border-2 ${room.borderColor} shadow-lg rounded-3xl ${room.bgColor} hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
                                        >
                                            <div className="p-6">
                                                {/* Header */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className={`w-10 h-10 ${room.iconBg} rounded-xl flex items-center justify-center`}
                                                        >
                                                            <span className="text-lg">
                                                                {room.icon}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h4
                                                                className={`text-lg font-bold ${room.textColor}`}
                                                            >
                                                                {room.room}
                                                            </h4>
                                                            <p className="text-md text-gray-500">
                                                                {room.teacher} •{" "}
                                                                {room.ageRange}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Eye className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                                </div>

                                                {/* Stats Grid */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-gray-50 p-3 rounded-xl">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <Users
                                                                className={`w-4 h-4 ${room.accentColor}`}
                                                            />
                                                            <span className="text-xs text-gray-700">
                                                                ประเมินแล้ว
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={`text-lg font-bold ${room.accentColor}`}
                                                        >
                                                            {
                                                                room.totalEvaluated
                                                            }
                                                            /
                                                            {room.totalChildren}
                                                        </span>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 rounded-xl">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <Award
                                                                className={`w-4 h-4 ${room.accentColor}`}
                                                            />
                                                            <span className="text-xs text-gray-700">
                                                                คะแนนเฉลี่ย
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={`text-lg font-bold ${room.accentColor}`}
                                                        >
                                                            {room.averageScore}%
                                                        </span>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 rounded-xl">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <Activity
                                                                className={`w-4 h-4 ${room.accentColor}`}
                                                            />
                                                            <span className="text-xs text-gray-700">
                                                                ความคืบหน้า
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={`text-lg font-bold ${room.accentColor}`}
                                                        >
                                                            {Math.round(
                                                                (room.totalEvaluated /
                                                                    room.totalChildren) *
                                                                    100
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-4">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`bg-gradient-to-r ${room.color} h-2 rounded-full transition-all duration-700`}
                                                            style={{
                                                                width: `${
                                                                    (room.totalEvaluated /
                                                                        room.totalChildren) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
