import { LinearProgress } from "@mui/material";
import {
    ArrowLeft,
    Scale,
    Download,
    Brain,
    BarChart3,
    TrendingUp,
    User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeightWeightModal from "../../components/HeightWeightModal";
import GrowthHistoryModal from "../../components/GrowthHistoryModal";
import PotentialModal from "../../components/PotentialHistoryModal";
import { useState } from "react";
import { exportToExcel } from "../../utils/exportExcel";

const developmentResults = [
    {
        date: "15/12/2024",
        round: 3,
        score: 85,
        totalItems: 5,
        passedItems: 4,
        status: "ไม่ผ่าน",
    },
    {
        date: "15/09/2024",
        round: 2,
        score: 100,
        totalItems: 5,
        passedItems: 5,
        status: "ผ่าน",
    },
    {
        date: "15/06/2024",
        round: 1,
        score: 100,
        totalItems: 5,
        passedItems: 5,
        status: "ผ่าน",
    },
];

const sampleEvaluations = [
    { round: 1, date: "11/12/2024", score: 5, length: 5, age: 20 },
    { round: 2, date: "12/09/2024", score: 5, length: 5, age: 20 },
    { round: 3, date: "13/06/2024", score: 5, length: 5, age: 20 },
    { round: 4, date: "15/12/2024", score: 4, length: 5, age: 20 },
];

// ข้อมูลการวัดน้ำหนักส่วนสูง
const growthResults = [
    {
        date: "20/12/2024",
        round: 1,
        weight: 12.8,
        height: 86,
        headCircumference: 48.5,
        weightPercentile: 75,
        heightPercentile: 80,
        weightForHeight: 15.2,
        weightForHeightPercentile: 65,
    },
    {
        date: "20/11/2024",
        round: 2,
        weight: 12.5,
        height: 85,
        headCircumference: 48.2,
        weightPercentile: 70,
        heightPercentile: 75,
        weightForHeight: 15.2,
        weightForHeightPercentile: 65,
    },
    {
        date: "20/10/2024",
        round: 3,
        weight: 12.2,
        height: 84,
        headCircumference: 48.0,
        weightPercentile: 68,
        heightPercentile: 72,
        weightForHeight: 15.2,
        weightForHeightPercentile: 65,
    },
];
const mockData = [
    {
        วันที่ประเมิน: "15/12/2024",
        อายุ: "2 ปี 6 เดือน",
        ผลการประเมิน: "ผ่าน",
        น้ำหนัก: "12.8 กก.",
        ส่วนสูง: "86 ซม.",
        เกณฑ์ส่วนสูง: "ค่อนข้างสูง",
        น้ำหนักตามส่วนสูง: "ค่อนข้างอ้วน",
    },
    {
        วันที่ประเมิน: "20/11/2024",
        อายุ: "2 ปี 5 เดือน",
        ผลการประเมิน: "ไม่ผ่าน",
        น้ำหนัก: "12.5 กก.",
        ส่วนสูง: "85 ซม.",
        เกณฑ์ส่วนสูง: "ค่อนข้างสูง",
        น้ำหนักตามส่วนสูง: "สมส่วน",
    },
    {
        วันที่ประเมิน: "20/10/2024",
        อายุ: "2 ปี 4 เดือน",
        ผลการประเมิน: "ผ่าน",
        น้ำหนัก: "12.2 กก.",
        ส่วนสูง: "84 ซม.",
        เกณฑ์ส่วนสูง: "ค่อนข้างสูง",
        น้ำหนักตามส่วนสูง: "สมส่วน",
    },
];

const getScoreColor = (score: number) => {
    if (score >= 100) return "text-green-600";
    return "text-red-600";
};

const getGrowthDescription = (
    percentile: number,
    type: "weight" | "height" | "weightForHeight"
) => {
    if (type === "weightForHeight") {
        // เกณฑ์น้ำหนักตามส่วนสูง (ตัวอย่างใช้ 5/85/95)
        if (percentile < 5) return "ผอม";
        if (percentile <= 85) return "สมส่วน";
        if (percentile <= 95) return "น้ำหนักเกิน";
        return "อ้วน";
    }

    if (percentile >= 90) return type === "weight" ? "อ้วน" : "สูงมาก";
    if (percentile >= 75)
        return type === "weight" ? "ค่อนข้างอ้วน" : "ค่อนข้างสูง";
    if (percentile >= 25) return "สมส่วน";
    if (percentile >= 10)
        return type === "weight" ? "ค่อนข้างผอม" : "ค่อนข้างเตี้ย";
    return type === "weight" ? "ผอมมาก" : "เตี้ยมาก";
};

const getStatusBadge = (status: "ผ่าน" | "ไม่ผ่าน") => {
    const colors = {
        ผ่าน: "bg-green-500",
        ไม่ผ่าน: "bg-red-500",
    };
    return (
        <div
            className={`${
                colors[status] || "bg-gray-500"
            } text-white rounded-full p-1 w-14 text-center`}
        >
            {status}
        </div>
    );
};
const ResultPage = () => {
    const [openHW, setOpenHW] = useState(false);
    const [openP, setOpenP] = useState(false);
    const handlePOpen = () => setOpenP(true);
    const handleHWOpen = () => setOpenHW(true);
    const handleGrowthHOpen = () => setOpenHGrowth(true);
    const [openGrowthH, setOpenHGrowth] = useState(false);

    const handleHWClose = () => {
        setOpenHW(false);
    };

    const handlePClose = () => {
        setOpenP(false);
    };

    const growthRecords = [
        {
            round: 1,
            date: "20/12/2024",
            age: 20,
            weight: 12.8,
            height: 86,
            weightStatus: "ค่อนข้างอ้วน",
            heightStatus: "ค่อนข้างสูง",
            weightForHeightStatus: "อ้วน",
        },
        {
            round: 2,
            date: "20/11/2024",
            age: 20,
            weight: 12.5,
            height: 85,
            weightStatus: "สมส่วน",
            heightStatus: "ค่อนข้างสูง",
            weightForHeightStatus: "สมส่วน",
        },
        {
            round: 3,
            date: "20/10/2024",
            age: 20,
            weight: 12.2,
            height: 84,
            weightStatus: "สมส่วน",
            heightStatus: "สมส่วน",
            weightForHeightStatus: "สมส่วน",
        },
    ];

    const childInfo = {
        name: "น้องแอม",
        age: "2 ปี 6 เดือน",
        birthDate: "15/06/2022",
    };

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-sky-50 to bg-cyan-50 font-poppins">
            {openHW && (
                <HeightWeightModal
                    message="กราฟการเจริญเติบโต"
                    name="มาวิน"
                    ageInMonths={25}
                    height={95}
                    weight={16}
                    gender="male"
                    onClose={handleHWClose}
                />
            )}
            {openP && (
                <PotentialModal
                    onClose={handlePClose}
                    evaluations={sampleEvaluations}
                />
            )}
            {openGrowthH && (
                <GrowthHistoryModal
                    onClose={() => setOpenHGrowth(false)}
                    records={growthRecords}
                />
            )}
            <div className="shadow-sm p-4 sticky top-0 z-10 bg-white/80 border-b border-slate-200">
                <div className="flex items-center justify-between max-w-4xl mx-auto ">
                    <div className="flex items-center space-x-4">
                        <button
                            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-black rounded hover:bg-gray-100 transition"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            กลับ
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">ผลการประเมิน</h1>
                            <p className="text-sm text-gray-500">น้องแอม</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() =>
                                exportToExcel(mockData, "growth-data.xlsx")
                            }
                            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow transition"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            ดาวน์โหลด
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-4 max-w-7xl mx-auto mt-6">
                <div className="mb-6 border-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl">
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center space-x-4">
                            <User className="w-12 h-12" />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold">
                                    {childInfo.name}
                                </h2>
                                <div className="flex flex-col sm:flex-row sm:space-x-6 text-blue-100 text-sm">
                                    <span>อายุ: {childInfo.age}</span>
                                    <span>เกิด: {childInfo.birthDate}</span>
                                    <span>
                                        อัพเดทล่าสุด:{" "}
                                        {new Date().toLocaleDateString("th-TH")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="border-0 shadow-sm rounded-2xl bg-white">
                        <div className="text-lg flex items-center space-x-2 p-4">
                            <Brain className="w-5 h-5 text-purple-500" />
                            <span className="text-black">พัฒนาการล่าสุด</span>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                        ครั้งที่ {developmentResults[0].round}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {developmentResults[0].date}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <div
                                        className={`text-4xl  ${getScoreColor(
                                            developmentResults[0].score
                                        )} mb-2`}
                                    >
                                        {developmentResults[0].status}
                                    </div>
                                </div>
                                <div className="text-center text-sm text-gray-600">
                                    ทำได้ {developmentResults[0].passedItems}/
                                    {developmentResults[0].totalItems} ข้อ
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={developmentResults[0].score}
                                    className="rounded h-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* การเจริญเติบโตล่าสุด */}
                    <div className="border-0 shadow-sm rounded-2xl bg-white">
                        <div className="text-lg flex items-center space-x-2 p-3">
                            <Scale className="w-5 h-5 text-blue-500" />
                            <span>การเจริญเติบโตล่าสุด</span>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                        ครั้งที่ {growthResults[0].round}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {growthResults[0].date}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    {/* น้ำหนัก */}
                                    <div className="mt-6">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {growthResults[0].weight}
                                        </div>
                                        <div className="text-md text-gray-500">
                                            กิโลกรัม
                                        </div>
                                        <div className="text-md text-green-600">
                                            {getGrowthDescription(
                                                growthResults[0]
                                                    .weightPercentile,
                                                "weight"
                                            )}
                                        </div>
                                    </div>

                                    {/* ส่วนสูง */}
                                    <div className="mt-6">
                                        <div className="text-2xl font-bold text-green-600">
                                            {growthResults[0].height}
                                        </div>
                                        <div className="text-md text-gray-500">
                                            เซนติเมตร
                                        </div>
                                        <div className="text-md text-green-600">
                                            {getGrowthDescription(
                                                growthResults[0]
                                                    .heightPercentile,
                                                "height"
                                            )}
                                        </div>
                                    </div>

                                    {/* น้ำหนักตามส่วนสูง */}
                                    <div className="mt-8">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {getGrowthDescription(
                                                growthResults[0]
                                                    .weightForHeightPercentile,
                                                "weightForHeight"
                                            )}
                                        </div>
                                        <div className="text-md text-gray-500">
                                            น้ำหนัก/ส่วนสูง
                                        </div>
                                        <div className="text-md text-green-600">
                                            {/* แสดงสถานะเท่านั้น */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-2">
                    <div className="border-0 shadow-sm rounded-2xl bg-white">
                        <div className="text-lg flex items-center space-x-2 p-4 justify-between">
                            <div className="flex gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-500" />
                                <span className="text-black">
                                    ประวัติการประเมินพัฒนาการ
                                </span>
                            </div>
                            <div>
                                <button
                                    onClick={() => handlePOpen()}
                                    className="px-4 py-1 bg-slate-300 text-md text-white rounded-xl whitespace-nowrap"
                                >
                                    ดูประวัติ
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {developmentResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 py-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                ครั้งที่ {result.round}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {result.date}
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center text-right">
                                            <div
                                                className={`text-sm font-bold ${getScoreColor(
                                                    result.score
                                                )}`}
                                            >
                                                ทำได้ {result.passedItems}/
                                                {result.totalItems} ข้อ
                                            </div>
                                            <div className="text-xs mx-auto">
{getStatusBadge(result.status as "ผ่าน" | "ไม่ผ่าน")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-0 shadow-sm rounded-2xl bg-white">
                        <div className="text-lg flex items-center justify-between space-x-2 p-4">
                            <div className="flex gap-2 ml-2">
                                <BarChart3 className="w-5 h-5 text-blue-500" />
                                <span>ประวัติการเจริญเติบโต</span>
                            </div>
                            <div className="flex whitespace-nowrap">
                                <button
                                    onClick={() => handleGrowthHOpen()}
                                    className="px-4 py-1 bg-slate-300 text-md text-white rounded-xl mr-2"
                                >
                                    ดูประวัติ
                                </button>
                                <button
                                    onClick={() => handleHWOpen()}
                                    className="px-4 py-1 bg-green-500 text-md text-white rounded-xl"
                                >
                                    ดูกราฟ
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {growthResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg py-4"
                                    >
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                ครั้งที่ {result.round}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {result.date}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            {/* ตัวเลขหลัก */}
                                            <div className="text-sm">
                                                <span className="text-blue-600 font-semibold">
                                                    {result.weight} กก.
                                                </span>
                                                <span className="text-gray-400 mx-1">
                                                    |
                                                </span>
                                                <span className="text-green-600 font-semibold">
                                                    {result.height} ซม.
                                                </span>
                                                <span className="text-gray-400 mx-1">
                                                    |
                                                </span>
                                                {/* แสดงค่าสถานะน้ำหนักตามส่วนสูง */}
                                                <span className="text-purple-600 font-semibold">
                                                    {getGrowthDescription(
                                                        result.weightForHeightPercentile,
                                                        "weightForHeight"
                                                    )}
                                                </span>
                                            </div>

                                            {/* สถานะ (optional: ถ้าต้องการบอกสถานะทั้งสามอย่าง) */}
                                            <div className="text-xs text-gray-500">
                                                {getGrowthDescription(
                                                    result.weightPercentile,
                                                    "weight"
                                                )}{" "}
                                                |{" "}
                                                {getGrowthDescription(
                                                    result.heightPercentile,
                                                    "height"
                                                )}{" "}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResultPage;
