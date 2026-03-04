import { LinearProgress } from "@mui/material";
import { ArrowLeft, Scale, Brain, BarChart3, TrendingUp } from "lucide-react";
import HeightWeightModal from "../../components/HeightWeightModal";
import GrowthHistoryModal from "../../components/GrowthHistoryModal";
import PotentialHistoryModal from "../../components/PotentialHistoryModal";
import { useState } from "react";
import { useStudentById } from "../../hooks/useStudent";
import { dobFormat } from "../../utils/dobFormat";
import { useSubmissionsByChild } from "../../hooks/useSubmission";
import { useHealthRecordsByChild } from "../../hooks/useHeath";
import { evaluateGrowth } from "../../utils/evaluateGrowth";
import { calculateAgeInMonths } from "../../utils/ageCalculated";
import Potential from "../../components/Potential";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Tab = "overview" | "growth" | "development";

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
const ResultForParentPage = ({
    childId,
    onBack,
}: {
    childId: number;
    onBack: () => void;
}) => {
    const [tab, setTab] = useState<Tab>("overview");

    const [openHeightWeightModal, setOpenHeightWeightModal] = useState(false);
    const [openPotentialModal, setOpenPotentialModal] = useState(true);
    const [openPotentialHistory, setOpenPotentialHistory] = useState(false);
    const handlePHOpen = () => setOpenPotentialHistory(true);
    const handleHWOpen = () => setOpenHeightWeightModal(true);

    const handleGrowthHOpen = () => setOpenHGrowth(true);
    const [openGrowthH, setOpenHGrowth] = useState(false);

    const handleHWClose = () => {
        setOpenHeightWeightModal(false);
    };

    const handlePClose = () => {
        setOpenPotentialHistory(false);
    };

    const handlePMClose = () => {
        setOpenPotentialModal(false);
    };

    const { data: childInfo } = useStudentById(Number(childId));
    const { data: healthRecords } = useHealthRecordsByChild(Number(childId));
    const { data: submissions = [] } = useSubmissionsByChild(Number(childId));
    const latest = submissions?.at(0);
    const latestHealthRecord = Array.isArray(healthRecords)
        ? [...healthRecords]
              .filter(
                  (r): r is typeof r & { created_at: string } =>
                      typeof r.created_at === "string",
              )
              .sort(
                  (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
              )[0]
        : null;

    const growthSummary =
        latestHealthRecord && childInfo
            ? {
                  recorded_at: new Date(
                      latestHealthRecord.created_at ?? "",
                  ).toLocaleDateString("th-TH"),
                  round: latestHealthRecord.round,
                  ageMonth: calculateAgeInMonths(childInfo?.birth),
                  gender: childInfo?.gender,
                  growthResult: evaluateGrowth({
                      gender: childInfo?.gender,
                      ageMonth: calculateAgeInMonths(childInfo?.birth),
                      weight: latestHealthRecord.weight_kg ?? 0,
                      height: latestHealthRecord.height_cm ?? 0,
                  }),
                  weight: latestHealthRecord.weight_kg,
                  height: latestHealthRecord.height_cm,
              }
            : null;

    const growthResults = healthRecords?.map((record) => ({
        round: record.round,
        date: new Date(record.created_at ?? "").toLocaleDateString("th-TH"),
        weight: record.weight_kg,
        height: record.height_cm,
        remarks: record.remarks,
        updatedby:
            record.create_by_detail?.first_name +
            " " +
            record.create_by_detail?.last_name,
        growthResult: evaluateGrowth({
            gender: childInfo?.gender,
            ageMonth: calculateAgeInMonths(childInfo?.birth),
            weight: record.weight_kg ?? 0,
            height: record.height_cm ?? 0,
        }),
    }));

    const heightChartData =
  growthResults?.map((item) => ({
    round: `ครั้งที่ ${item.round}`,
    height: item.height,
    date: item.date,
    weight: item.weight
  })) ?? [];


    const isBoy = childInfo?.gender === "male";

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-sky-50 to bg-cyan-50 font-poppins">
            {openHeightWeightModal && (
                <HeightWeightModal
                    message="กราฟการเจริญเติบโต"
                    name={childInfo?.nickname}
                    ageInMonths={growthSummary?.ageMonth ?? 0}
                    height={growthSummary?.height ?? 0}
                    weight={growthSummary?.weight ?? 0}
                    gender={growthSummary?.gender}
                    onClose={handleHWClose}
                />
            )}
            {openPotentialHistory && (
                <PotentialHistoryModal
                    submissions={submissions}
                    childInfo={childInfo}
                    onClose={handlePClose}
                />
            )}
            {openGrowthH && (
                <GrowthHistoryModal
                    onClose={() => setOpenHGrowth(false)}
                    records={(healthRecords ?? []).map((r) => ({
                        ...r,
                        ageMonth: calculateAgeInMonths(childInfo?.birth),
                        birth: childInfo?.birth,
                        gender: childInfo?.gender,
                        updatedby:
                            r.create_by_detail?.first_name +
                            " " +
                            r.create_by_detail?.last_name,
                        growthResult: evaluateGrowth({
                            gender: childInfo?.gender,
                            ageMonth: calculateAgeInMonths(childInfo?.birth),
                            weight: r.weight_kg ?? 0,
                            height: r.height_cm ?? 0,
                        }),
                    }))}
                />
            )}
<div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
    
    {/* Header */}
    <div className="shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
                <button
                    className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-600 rounded hover:bg-gray-100 transition"
                    onClick={onBack}
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    กลับ
                </button>

                <div>
                    <h1 className="text-lg">ผลการประเมิน</h1>
                    <p className="text-sm text-gray-500">
                        น้อง{childInfo?.nickname}
                    </p>
                </div>
            </div>
        </div>
    </div>

    {/* Tabs */}
    <nav className="border-t border-slate-200">
        <div className="mx-auto flex max-w-lg">
            {[
                { id: "overview" as Tab, label: "ภาพรวม" },
                { id: "growth" as Tab, label: "การเจริญเติบโต" },
                { id: "development" as Tab, label: "พัฒนาการ" },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                        tab === item.id
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    </nav>
</div>

            {/* Main Content */}
            <main className="p-4 max-w-4xl mx-auto mt-6 pt-[140px]">
                {tab === "overview" && (
                    <div>
                        <div className="mb-6 border-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl">
                            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                                {/* Gradient Header */}
                                <div
                                    className={`px-5 py-5 ${
                                        isBoy
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                            : "bg-gradient-to-r from-pink-400 to-pink-500"
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl text-white">
                                            {childInfo?.nickname?.charAt(0) ??
                                                "?"}
                                        </div>

                                        <div className="min-w-0 text-white">
                                            <h2 className="truncate text-lg">
                                                {childInfo?.first_name}{" "}
                                                {childInfo?.last_name}
                                            </h2>

                                            <p className="text-sm text-white/80">
                                                ({childInfo?.nickname})
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-px bg-gray-200">
                                    <InfoCell
                                        label="เพศ"
                                        value={
                                            childInfo?.gender === "male"
                                                ? "ชาย"
                                                : "หญิง"
                                        }
                                    />

                                    <InfoCell
                                        label="อายุ"
                                        value={dobFormat(childInfo?.birth)}
                                    />

                                    <InfoCell
                                        label="วันเกิด"
                                        value={
                                            childInfo?.birth
                                                ? new Date(
                                                      childInfo.birth,
                                                  ).toLocaleDateString("th-TH")
                                                : "-"
                                        }
                                    />

                                    <InfoCell
                                        label="ห้องเรียน"
                                        value={childInfo?.room_name ?? "-"}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 mb-8">
                            <div className="border-0 shadow-sm rounded-2xl bg-white">
                                <div className="text-md flex items-center space-x-2 p-3">
                                    <Scale className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-600">
                                        ผลการเจริญเติบโตล่าสุด
                                    </span>
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
                                                        growthSummary
                                                            ?.growthResult
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
                                                        growthSummary
                                                            ?.growthResult
                                                            .heightResult
                                                    }
                                                </div>
                                            </div>

                                            {/* น้ำหนักตามส่วนสูง */}
                                            <div className="mt-5">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {
                                                        growthSummary
                                                            ?.growthResult
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
                            <div className="border-0 shadow-sm rounded-2xl bg-white">
                                <div className="text-md flex items-center space-x-2 p-4">
                                    <Brain className="w-5 h-5 text-purple-500" />
                                    <span className="text-gray-600">
                                        ผลการพัฒนาการล่าสุด
                                    </span>
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
                                                          latest.created_at,
                                                      ).toLocaleDateString(
                                                          "th-TH",
                                                      )
                                                    : "-"}
                                            </span>
                                        </div>

                                        {/* สถานะผ่าน / ไม่ผ่าน */}
                                        <div className="text-center">
                                            <div
                                                className={`text-3xl ${getScoreColor(
                                                    latest?.status_display,
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
                                                latest?.passed_items !==
                                                    undefined
                                                    ? ((latest.passed_items ??
                                                          0) /
                                                          (latest.total_items ??
                                                              1)) *
                                                      100
                                                    : 0
                                            }
                                            className="rounded h-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === "growth" && (
                    <div>
                                                <div className="border-0 shadow-sm rounded-2xl bg-white mb-6">
                            <div className="text-md flex items-center space-x-2 p-4">
                                <Brain className="w-5 h-5 text-purple-500" />
                                <span className="text-gray-600">
                                    ผลการพัฒนาการล่าสุด
                                </span>
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
                                        <div className="mt-5">
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
                                                 <div className="border-0 shadow-sm rounded-2xl bg-white mb-6">
    
    <div className="text-md flex items-center space-x-2 p-4">
      <BarChart3 className="w-5 h-5 text-blue-500" />
      <span className="text-gray-600">
        กราฟส่วนสูง (ซม.)
      </span>
    </div>

    <div className="px-4 pb-6">
      <div style={{ width: "100%", height: 260, paddingRight: 30 }}>
        <ResponsiveContainer>
          <LineChart data={heightChartData}>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis                                style={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                    }} dataKey="round" />

            <YAxis                             tick={({ x, y, payload }) => (
                                <text
                                    x={x - 35}
                                    y={y}
                                    dy={4}
                                    className="whitespace-nowrap"
                                    textAnchor="start"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                    }}
                                >
                                    {payload.value}
                                </text>
                            )}domain={["dataMin - 5", "dataMax + 5"]} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="height"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 7 }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

  </div>
                                                   <div className="border-0 shadow-sm rounded-2xl bg-white mb-6">
    
    <div className="text-md flex items-center space-x-2 p-4">
    <Scale className="w-5 h-5 text-green-500" />
      <span className="text-gray-600">
        กราฟน้ำหนัก (กก.)
      </span>
    </div>

    <div className="px-4 pb-6">
      <div style={{ width: "100%", height: 260, paddingRight: 30 }}>
        <ResponsiveContainer>
          <LineChart data={heightChartData}>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis                                style={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                    }} dataKey="round" />

            <YAxis                             tick={({ x, y, payload }) => (
                                <text
                                    x={x - 35}
                                    y={y}
                                    dy={4}
                                    className="whitespace-nowrap"
                                    textAnchor="start"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                    }}
                                >
                                    {payload.value}
                                </text>
                            )}domain={["dataMin - 5", "dataMax + 5"]} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 7 }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

  </div>
                        <div className="border-0 shadow-sm rounded-2xl bg-white mb-8">
                            <div className="text-lg flex items-center justify-between space-x-2 p-4">
                                <div className="flex gap-2 ml-2">
                                    <BarChart3 className="w-5 h-5 text-blue-500" />
                                    <span>ประวัติการเจริญเติบโต</span>
                                </div>
                                <div className="flex whitespace-nowrap">
                                    <button
                                        onClick={() => handleGrowthHOpen()}
                                        className="px-4 py-1 bg-blue-500 text-md text-white rounded-xl mr-2"
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
                                    {(growthResults ?? [])
                                        .slice()
                                        .sort(
                                            (a, b) =>
                                                new Date(a.date).getTime() -
                                                new Date(b.date).getTime(),
                                        )
                                        .slice(0, 3)
                                        .map((result, index) => (
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
                                                    {result.updatedby.trim() && (
                                                        <div className="text-sm text-gray-500">
                                                            ประเมินโดยคุณ{" "}
                                                            {result.updatedby}
                                                        </div>
                                                    )}
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
                                                                result
                                                                    .growthResult
                                                                    .weightHeightResult ===
                                                                "สมส่วน"
                                                                    ? "text-green-600 font-semibold"
                                                                    : result.growthResult.weightHeightResult.includes(
                                                                            "ผอม",
                                                                        )
                                                                      ? "text-yellow-600 font-semibold"
                                                                      : "text-red-600 font-semibold"
                                                            }
                                                        >
                                                            {
                                                                result
                                                                    .growthResult
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
                )}

                {tab === "development" && (
                    <div>
                        <div className="grid grid-cols-1 gap-6 mb-8">
                            <div className="border-0 shadow-sm rounded-2xl bg-white">
                                {openPotentialModal && (
                                    <Potential
                                        name={childInfo?.nickname}
                                        message="ผลการประเมินพัฒนาการ"
                                        ageInMonths={
                                            growthSummary?.ageMonth ?? 0
                                        }
                                        gender={growthSummary?.gender}
                                        summary={latest?.summary_by_type ?? []}
                                        date={latest?.created_at ?? ""}
                                        onClose={handlePMClose}
                                    />
                                )}
                            </div>
                            <div className="border-0 shadow-sm rounded-2xl bg-white">
                                <div className="text-lg flex items-center space-x-2 p-4 justify-between">
                                    <div className="flex gap-2">
                                        <TrendingUp className="w-5 h-5 text-purple-500" />
                                        <span className="text-gray-600">
                                            ประวัติการประเมินพัฒนาการ
                                        </span>
                                    </div>
                                    <div className="flex whitespace-nowrap">
                                        <button
                                            onClick={() => handlePHOpen()}
                                            className="px-4 py-1 bg-blue-500 text-md text-white rounded-xl whitespace-nowrap mr-2"
                                        >
                                            ดูประวัติ
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {submissions
                                            .slice()
                                            .sort(
                                                (a, b) =>
                                                    new Date(
                                                        a.created_at,
                                                    ).getTime() -
                                                    new Date(
                                                        b.created_at,
                                                    ).getTime(),
                                            )
                                            .slice(0, 3)
                                            .map((result) => {
                                                return (
                                                    <div
                                                        key={result.id}
                                                        className="flex items-center justify-between p-3 py-4 bg-gray-50 rounded-lg"
                                                    >
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                ครั้งที่{" "}
                                                                {result.round}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(
                                                                    result.created_at,
                                                                ).toLocaleDateString(
                                                                    "th-TH",
                                                                )}
                                                            </div>

                                                            {result
                                                                .submitted_by_detail
                                                                ?.first_name && (
                                                                <div className="text-sm text-gray-500">
                                                                    ประเมินโดยคุณ{" "}
                                                                    {
                                                                        result
                                                                            .submitted_by_detail
                                                                            .first_name
                                                                    }{" "}
                                                                    {
                                                                        result
                                                                            .submitted_by_detail
                                                                            .last_name
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col justify-center text-right">
                                                            <div
                                                                className={`text-sm font-bold ${getScoreColor(
                                                                    result.status_display,
                                                                )}`}
                                                            >
                                                                ทำได้{" "}
                                                                {
                                                                    result.passed_items
                                                                }
                                                                /
                                                                {
                                                                    result.total_items
                                                                }{" "}
                                                                ข้อ
                                                            </div>
                                                            <div className="text-xs mx-auto">
                                                                {getStatusBadge(
                                                                    result.status_display as
                                                                        | "ผ่าน"
                                                                        | "ไม่ผ่าน",
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
function InfoCell({ label, value }: { label: string; value?: string }) {
    return (
        <div className="bg-white px-4 py-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-0.5 text-sm text-gray-900">{value ?? "-"}</p>
        </div>
    );
}

export default ResultForParentPage;
