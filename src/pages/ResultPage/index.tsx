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
import { useNavigate, useParams } from "react-router-dom";
import HeightWeightModal from "../../components/HeightWeightModal";
import GrowthHistoryModal from "../../components/GrowthHistoryModal";
import PotentialModal from "../../components/PotentialHistoryModal";
import { useState } from "react";
import { exportToExcel } from "../../utils/exportExcel";
import { useStudentById } from "../../hooks/useStudent";
import { dobFormat } from "../../utils/dobFormat";
import { useSubmissionsByChild } from "../../hooks/useSubmission";
import { useHealthRecordsByChild } from "../../hooks/useHeath";
import { evaluateGrowth } from "../../utils/evaluateGrowth";
import { calculateAgeInMonths } from "../../utils/ageCalculated";

const getScoreColor = (status?: string) => {
    switch (status) {
        case "ผ่าน":
            return "text-green-600";
        case "ไม่ผ่าน":
            return "text-red-600";
        default:
            return "text-gray-600";
    }
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

    const { childId } = useParams<{ roomId: string; childId: string }>();

    const { data: childInfo } = useStudentById(Number(childId));
    const { data: healthRecords } = useHealthRecordsByChild(Number(childId));
    console.log(healthRecords)

    const { data: submissions = [] } = useSubmissionsByChild(Number(childId));
    const latest = (submissions ?? [])[(submissions?.length ?? 1) - 1];

    const latestHealthRecord = Array.isArray(healthRecords)
        ? [...healthRecords].sort(
              (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
          )[0]
        : null;

    const growthSummary =
        latestHealthRecord && childInfo
            ? {
                  recorded_at: new Date(
                      latestHealthRecord.created_at ?? ""
                  ).toLocaleDateString("th-TH"),
                  round: latestHealthRecord.round,
                  ageMonth: calculateAgeInMonths(childInfo.birth),
                  gender: childInfo.gender,
                  growthResult: evaluateGrowth({
                      gender: childInfo.gender,
                      ageMonth: calculateAgeInMonths(childInfo.birth),
                      weight: parseFloat(latestHealthRecord.weight_kg),
                      height: parseFloat(latestHealthRecord.height_cm),
                  }),
                  weight: latestHealthRecord.weight_kg,
                  height: latestHealthRecord.height_cm,
              }
            : null;

    const growthResults =
        healthRecords?.map((record) => ({
            round: record.round,
            date: new Date(record.created_at).toLocaleDateString("th-TH"),
            weight: parseFloat(record.weight_kg),
            height: parseFloat(record.height_cm),
            remarks: record.remarks,
            growthResult: evaluateGrowth({
                gender: childInfo.gender,
                ageMonth: calculateAgeInMonths(childInfo.birth),
                weight: parseFloat(record.weight_kg),
                height: parseFloat(record.height_cm),
            }),
        })) || [];

        const exportData =
        (healthRecords ?? []).map((record) => {
            const ageMonth = calculateAgeInMonths(childInfo.birth);
            const ageText = dobFormat(childInfo.birth);
            const growth = evaluateGrowth({
            gender: childInfo.gender,
            ageMonth,
            weight: parseFloat(record.weight_kg),
            height: parseFloat(record.height_cm),
            });

            // หาผลการประเมินจาก submission (ถ้ามี)
            const matchedSubmission = submissions?.find((s) => {
            const date1 = new Date(s.created_at).toLocaleDateString("th-TH");
            const date2 = new Date(record.created_at).toLocaleDateString("th-TH");
            return date1 === date2;
            });
            const assessmentResult = matchedSubmission
            ? matchedSubmission.status === "pass"
                ? "ผ่าน"
                : "ไม่ผ่าน"
            : "-";

            return {
            วันที่ประเมิน: new Date(record.created_at).toLocaleDateString("th-TH"),
            อายุ: ageText,
            ผลการประเมิน: assessmentResult,
            น้ำหนัก: `${parseFloat(record.weight_kg)} กก.`,
            ส่วนสูง: `${parseFloat(record.height_cm)} ซม.`,
            เกณฑ์น้ำหนัก: growth.weightResult,
            เกณฑ์ส่วนสูง: growth.heightResult,
            เกณฑ์น้ำหนักตามส่วนสูง: growth.weightHeightResult,
            };
        }) || [];

  console.log(exportData)

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-sky-50 to bg-cyan-50 font-poppins">
            {openHW && (
                <HeightWeightModal
                    message="กราฟการเจริญเติบโต"
                    name={childInfo.nickname}
                    ageInMonths={growthSummary?.ageMonth}
                    height={growthSummary?.height}
                    weight={growthSummary?.weight}
                    gender={growthSummary?.gender}
                    onClose={handleHWClose}
                />
            )}
            {openP && <PotentialModal onClose={handlePClose} />}
            {openGrowthH && (
                <GrowthHistoryModal
                    onClose={() => setOpenHGrowth(false)}
                    records={
                        healthRecords.map((r) => ({
                            ...r,
                            ageMonth: calculateAgeInMonths(childInfo.birth),
                            birth: childInfo.birth,
                            gender: childInfo.gender,
                            growthResult: evaluateGrowth({
                                gender: childInfo.gender,
                                ageMonth: calculateAgeInMonths(childInfo.birth),
                                weight: parseFloat(r.weight_kg),
                                height: parseFloat(r.height_cm),
                            }),
                        })) || []
                    }
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
                            <p className="text-sm text-gray-500">
                                น้อง{childInfo?.nickname}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() =>
                                exportToExcel(exportData, "growth-data.xlsx")
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
                                <h2 className="text-xl sm:text-2xl">
                                    {childInfo?.first_name}{" "}
                                    {childInfo?.last_name}{" "}
                                    <span className="text-lg">
                                        ({childInfo?.nickname})
                                    </span>
                                </h2>
                                <div className="flex flex-col sm:flex-row sm:space-x-6 text-blue-100 text-sm">
                                    <span>
                                        อายุ: {dobFormat(childInfo?.birth)}
                                    </span>
                                    <span>เกิด: {new Date(childInfo?.birth).toLocaleDateString("th-TH")}</span>
                                    <span>
                                        อัพเดทล่าสุด:{" "}
                                        {new Date(
                                            childInfo?.updated_at
                                        ).toLocaleDateString("th-TH")}
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
                                {/* ครั้งที่และวันที่ */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                        ครั้งที่ {latest?.round ?? "-"}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {latest?.created_at
                                            ? new Date(
                                                  latest.created_at
                                              ).toLocaleDateString("th-TH")
                                            : "-"}
                                    </span>
                                </div>

                                {/* สถานะผ่าน / ไม่ผ่าน */}
                                <div className="text-center">
                                    <div
                                        className={`text-4xl ${getScoreColor(
                                            latest?.status_display
                                        )} mb-2`}
                                    >
                                        {latest?.status_display ?? "-"}
                                    </div>
                                </div>

                                {/* คะแนน */}
                                <div className="text-center text-sm text-gray-600">
                                    ทำได้ {latest?.passed_items ?? 0}/
                                    {latest?.total_items ?? 0} ข้อ
                                </div>

                                {/* Progress bar */}
                                <LinearProgress
                                    variant="determinate"
                                    value={
                                        latest?.total_items &&
                                        latest?.passed_items !== undefined
                                            ? ((latest.passed_items ?? 0) /
                                                  (latest.total_items ?? 1)) *
                                              100
                                            : 0
                                    }
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
                                        ครั้งที่ {growthSummary?.round}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {growthSummary?.recorded_at}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    {/* น้ำหนัก */}
                                    <div className="mt-6">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {growthSummary?.weight}
                                        </div>
                                        <div className="text-md text-gray-500">
                                            กิโลกรัม
                                        </div>
                                        <div className="text-md text-green-600">
                                            {
                                                growthSummary?.growthResult
                                                    .weightResult
                                            }
                                        </div>
                                    </div>

                                    {/* ส่วนสูง */}
                                    <div className="mt-6">
                                        <div className="text-2xl font-bold text-green-600">
                                            {growthSummary?.height}
                                        </div>
                                        <div className="text-md text-gray-500">
                                            เซนติเมตร
                                        </div>
                                        <div className="text-md text-green-600">
                                            {
                                                growthSummary?.growthResult
                                                    .heightResult
                                            }
                                        </div>
                                    </div>

                                    {/* น้ำหนักตามส่วนสูง */}
                                    <div className="mt-8">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {
                                                growthSummary?.growthResult
                                                    .weightHeightResult
                                            }
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
                                {submissions.slice(0, 3).map((result, index) => {
                                    const round = index + 1;

                                    return (
                                        <div
                                            key={result.id}
                                            className="flex items-center justify-between p-3 py-4 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    ครั้งที่ {round}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(
                                                        result.created_at
                                                    ).toLocaleDateString(
                                                        "th-TH"
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-center text-right">
                                                <div
                                                    className={`text-sm font-bold ${getScoreColor(
                                                        result.status_display
                                                    )}`}
                                                >
                                                    ทำได้ {result.passed_items}/
                                                    {result.total_items} ข้อ
                                                </div>
                                                <div className="text-xs mx-auto">
                                                    {getStatusBadge(
                                                        result.status_display as
                                                            | "ผ่าน"
                                                            | "ไม่ผ่าน"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
                                {growthResults.slice(0, 3).map((result, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg py-4"
                                    >
                                        {/* รอบและวันที่ */}
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                ครั้งที่ {result.round}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {result.date}
                                            </div>
                                        </div>

                                        {/* ค่าต่าง ๆ */}
                                        <div className="text-right">
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

                                                {/* ✅ สถานะน้ำหนักตามส่วนสูง */}
                                                <span
                                                    className={
                                                        result.growthResult
                                                            .weightHeightResult ===
                                                        "สมส่วน"
                                                            ? "text-green-600 font-semibold"
                                                            : result.growthResult.weightHeightResult.includes(
                                                                  "ผอม"
                                                              )
                                                            ? "text-yellow-600 font-semibold"
                                                            : "text-red-600 font-semibold"
                                                    }
                                                >
                                                    {
                                                        result.growthResult
                                                            .weightHeightResult
                                                    }
                                                </span>
                                            </div>

                                            {/* ✅ แสดงสถานะน้ำหนักและส่วนสูงเพิ่มเติม */}
                                            <div className="text-xs text-gray-500">
                                                {
                                                    result.growthResult
                                                        .weightResult
                                                }{" "}
                                                |{" "}
                                                {
                                                    result.growthResult
                                                        .heightResult
                                                }
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
