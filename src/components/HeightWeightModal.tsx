/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceDot,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    ReferenceLine,
} from "recharts";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import growthReference from "../data/growthReference.json";

interface GrowthChartProps {
    ageInMonths: number;
    height: number;
    name: string;
    weight: number;
    message: string;
    onClose: () => void;
    gender: "male" | "female";
}

const HeightWeightModal: React.FC<GrowthChartProps> = ({
    ageInMonths,
    height,
    weight,
    name,
    gender,
    message,
    onClose,
}) => {
    const [showBasicGraph, setShowBasicGraph] = useState(false);

    const ageKey = String(Math.round(ageInMonths));

    const hfaAtAge = growthReference[gender]?.HFA?.[ageKey]; // ส่วนสูงตามอายุ
    const wfaAtAge = growthReference[gender]?.WFA?.[ageKey]; // น้ำหนักตามอายุ
    const wfhByHeight = growthReference[gender]?.WFH; // น้ำหนักตามส่วนสูง (key เป็นส่วนสูง)

    const normalizeRanges = (ranges?: Record<string, [number, number]>) => {
        if (!ranges) return undefined;
        const out: Record<string, [number, number]> = {};
        for (const [k, [min, max]] of Object.entries(ranges)) {
            const hi = Number.isFinite(max as number)
                ? (max as number)
                : Number.POSITIVE_INFINITY;
            out[k] = [min ?? 0, hi];
        }
        return out;
    };

    const hfaRanges = normalizeRanges(hfaAtAge); // height categories by age
    const wfaRanges = normalizeRanges(wfaAtAge);

    const hKey = Number(height || 0).toFixed(1);
    const wfhRanges = normalizeRanges(wfhByHeight?.[hKey]);
    useEffect(() => {
        if (!hfaRanges || !wfaRanges) {
            Swal.fire({
                title: "ไม่พบข้อมูลเกณฑ์อายุ",
                text: `สำหรับเด็กอายุ ${ageInMonths} เดือน`,
                icon: "error",
                confirmButtonText: "ปิด",
            }).then(() => onClose());
        }
    }, [hfaRanges, wfaRanges, ageInMonths, onClose]);

    if (!hfaRanges || !wfaRanges) return null;

    const getRangeCategory = (
        value: number,
        ranges: Record<string, [number, number]>
    ) => {
        for (const [label, [min, max]] of Object.entries(ranges)) {
            if (value >= min && value <= max) return label;
        }
        return "ไม่ทราบ";
    };

    // สร้างข้อมูลสำหรับกราฟ (เอาค่ากลางช่วงเป็น reference)
    const chartDataFromRanges = (
        ranges: Record<string, [number, number]>,
        value: number,
        matchedCategory: string
    ) =>
        Object.entries(ranges).map(([label, [min, max]]) => ({
            category: label,
            reference:
                (min + (Number.isFinite(max) ? max : min)) /
                (Number.isFinite(max) ? 2 : 1),
            actual: label === matchedCategory ? value : 0,
        }));

    // เลือกหมวดหมู่
    const weightCategory = getRangeCategory(weight, wfaRanges);
    const heightCategory = getRangeCategory(height, hfaRanges);
    const weightForHeightCategory = getRangeCategory(weight, wfhRanges);

    // ข้อมูลกราฟ
    const chartDataWeight = chartDataFromRanges(
        wfaRanges,
        weight,
        weightCategory
    );
    const chartDataHeight = chartDataFromRanges(
        hfaRanges,
        height,
        heightCategory
    );
    const chartDataWeightForHeight = wfhRanges
        ? chartDataFromRanges(wfhRanges, weight, weightForHeightCategory)
        : [];

    const convertWeightData = (ref: any, gender: "male" | "female") => {
        const data: Array<{
            age: number;
            low: number;
            lowMid: number;
            normal: number;
            highMid: number;
            high: number;
        }> = [];

        const WFA = ref[gender]?.WFA || {};
        for (const age of Object.keys(WFA)
            .map(Number)
            .sort((a, b) => a - b)) {
            const w: Record<string, [number, number]> = WFA[String(age)];
            data.push({
                age,
                low: w["น้ำหนักน้อย"][1],
                lowMid: w["น้ำหนักค่อนข้างน้อย"][1],
                normal: w["น้ำหนักตามเกณฑ์"][1],
                highMid: w["น้ำหนักค่อนข้างมาก"][1],
                high: w["น้ำหนักมาก"][1],
            });
        }
        return data;
    };

    // ส่วนสูงตามอายุ
    const convertHeightData = (ref: any, gender: "male" | "female") => {
        const data: Array<{
            age: number;
            low: number;
            lowMid: number;
            normal: number;
            highMid: number;
            high: number;
        }> = [];

        const HFA = ref[gender]?.HFA || {};
        for (const age of Object.keys(HFA)
            .map(Number)
            .sort((a, b) => a - b)) {
            const h: Record<string, [number, number]> = HFA[String(age)];
            data.push({
                age,
                low: h["เตี้ย"][1],
                lowMid: h["ค่อนข้างเตี้ย"][1],
                normal: h["สูงตามเกณฑ์"][1],
                highMid: h["ค่อนข้างสูง"][1],
                high: h["สูง"][1],
            });
        }
        return data;
    };

    const convertWeightForHeightData = (
        ref: any,
        gender: "male" | "female",
        minH = 65,
        maxH = 120,
        step = 0.5 // ✅ ใช้ 0.5 เพราะ key ใน JSON มีทุกครึ่งเซน
    ) => {
        const WFH = ref[gender]?.WFH || {}; // ✅ ตรงกับโครงสร้างที่คุณใช้

        const top = (
            r: Record<string, [number, number]> | undefined,
            label: string
        ) => r?.[label]?.[1];

        const data: Array<{
            height: number;
            low: number; // ผอม
            lowMid: number; // ค่อนข้างผอม
            normal: number; // สมส่วน
            highMid: number; // ท้วม
            preObese: number; // เริ่มอ้วน
            obese: number; // อ้วน
        }> = [];

        for (let h = minH; h <= maxH; h += step) {
            const key = h.toFixed(1); // ✅ ตรงกับ JSON key
            const r = WFH[key];
            if (!r) continue;

            const low = top(r, "ผอม") ?? 0;
            const lowMid = top(r, "ค่อนข้างผอม") ?? low;
            const normal = top(r, "สมส่วน") ?? lowMid;
            const highMid = top(r, "ท้วม") ?? normal;
            const preObese = top(r, "เริ่มอ้วน") ?? highMid;
            const obeseTop = top(r, "อ้วน") ?? preObese + 1;

            data.push({
                height: parseFloat(key),
                low,
                lowMid,
                normal,
                highMid,
                preObese,
                obese: obeseTop,
            });
        }

        return data;
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    backgroundColor: "white",
                    p: 3,
                    borderRadius: 2,
                    width: { xs: "95%", sm: "85%", md: "90%", lg: "85%" },
                    maxHeight: "90vh",
                    overflow: "auto",
                    position: "relative",
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: "Kanit, Poppins",
                            textAlign: "center",
                            width: "100%",
                            fontWeight: "bold",
                            color: "#1f2937",
                        }}
                    >
                        {message}
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            color: "red",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography
                    variant="subtitle1"
                    sx={{
                        fontFamily: "Kanit, Poppins",
                        textAlign: "center",
                        mb: 3,
                        color: "#6b7280",
                        fontSize: "1.1rem",
                    }}
                >
                    <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-gray-700 text-lg font-medium">
                        <span className="font-semibold text-blue-700">
                            ชื่อ:
                        </span>
                        <span className="text-black">น้อง{name}</span>

                        <span className="mx-2 text-gray-400">|</span>

                        <span className="font-semibold text-pink-600">
                            เพศ:
                        </span>
                        <span className="text-black">
                            {gender === "male" ? "ชาย" : "หญิง"}
                        </span>

                        <span className="mx-2 text-gray-400">|</span>

                        <span className="font-semibold text-emerald-600">
                            อายุ:
                        </span>
                        <span className="text-black">{ageInMonths}</span>
                        <span className="text-gray-600">เดือน</span>
                    </div>
                </Typography>

                {/* ปุ่มสลับกราฟ */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setShowBasicGraph(!showBasicGraph)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-3 text-white rounded-xl font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                        {showBasicGraph
                            ? "แสดงกราฟน้ำหนักและส่วนสูง"
                            : "แสดงกราฟมาตรฐาน"}
                    </button>
                </div>

                <div className="flex flex-col justify-center gap-6">
                    {/* กราฟมาตรฐานทางการแพทย์ */}
                    {showBasicGraph ? (
                        <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    กราฟมาตรฐานการเจริญเติบโต
                                </h3>
                                <div className="flex justify-center space-x-8 text-sm">
                                    <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                                        <span className="text-blue-700 font-medium">
                                            ส่วนสูง: {height} ซม. (
                                            {heightCategory})
                                        </span>
                                    </div>
                                    <div className="bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                                        <span className="text-purple-700 font-medium">
                                            น้ำหนัก: {weight} กก. (
                                            {weightCategory})
                                        </span>
                                    </div>
                                      <div className="bg-pink-50 px-4 py-2 rounded-full border border-pink-200">
    <span className="text-pink-700 font-medium">
      น้ำหนักตามส่วนสูง: {weight} กก. ({weightForHeightCategory})
    </span>
  </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* กราฟส่วนสูง */}
                                <div className="w-full">
                                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-4 border border-blue-100">
                                        <h4 className="text-center text-lg font-bold text-gray-800 mb-2">
                                            📏 ส่วนสูงตามอายุ
                                        </h4>
                                        <p className="text-center text-sm text-gray-600">
                                            ปัจจุบัน:{" "}
                                            <span className="font-bold text-purple-600">
                                                {height} ซม. ({heightCategory})
                                            </span>
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
                                        <ResponsiveContainer
                                            width="100%"
                                            height={350}
                                        >
                                            <AreaChart
                                                data={convertHeightData(
                                                    growthReference,
                                                    gender
                                                )}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 60,
                                                }}
                                            >
                                                <defs>
                                                    <pattern
                                                        id="heightGrid"
                                                        width="10"
                                                        height="10"
                                                        patternUnits="userSpaceOnUse"
                                                    >
                                                        <path
                                                            d="M 10 0 L 0 0 0 10"
                                                            fill="none"
                                                            stroke="#e5e7eb"
                                                            strokeWidth="0.5"
                                                        />
                                                    </pattern>
                                                </defs>

                                                <XAxis
                                                    dataKey="age"
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: "#374151",
                                                    }}
                                                    tickLine={{
                                                        stroke: "#6b7280",
                                                    }}
                                                    axisLine={{
                                                        stroke: "#6b7280",
                                                        strokeWidth: 2,
                                                    }}
                                                    label={{
                                                        value: "อายุ (เดือน)",
                                                        position:
                                                            "insideBottom",
                                                        offset: -10,
                                                        style: {
                                                            textAnchor:
                                                                "middle",
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                        },
                                                    }}
                                                />

                                                <YAxis
                                                    domain={[40, 130]}
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: "#374151",
                                                    }}
                                                    tickLine={{
                                                        stroke: "#6b7280",
                                                    }}
                                                    axisLine={{
                                                        stroke: "#6b7280",
                                                        strokeWidth: 2,
                                                    }}
                                                    label={{
                                                        value: "ส่วนสูง (ซม.)",
                                                        angle: -90,
                                                        position: "insideLeft",
                                                        style: {
                                                            textAnchor:
                                                                "middle",
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                        },
                                                    }}
                                                />

                                                <CartesianGrid
                                                    strokeDasharray="none"
                                                    stroke="url(#heightGrid)"
                                                    strokeWidth={1}
                                                />

                                                <Area
                                                    type="linear"
                                                    dataKey="high"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#FFFFFF"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="highMid"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#61B846"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="normal"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#9EE683"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="lowMid"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#D7F2CE"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="low"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#F7A039"
                                                    fillOpacity={0.9}
                                                />

                                                {/* เส้นแบ่งโซน */}
                                                <ReferenceLine
                                                    y={75}
                                                    stroke="#059669"
                                                    strokeWidth={2}
                                                    strokeDasharray="2 2"
                                                />
                                                <ReferenceLine
                                                    y={90}
                                                    stroke="#059669"
                                                    strokeWidth={2}
                                                    strokeDasharray="2 2"
                                                />

                                                {/* จุดเด็ก */}
                                                <ReferenceDot
                                                    x={ageInMonths}
                                                    y={height}
                                                    r={7}
                                                    fill="#dc2626"
                                                    stroke="#ffffff"
                                                    strokeWidth={1}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* กราฟน้ำหนัก */}
                                <div className="w-full">
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-4 border border-purple-100">
                                        <h4 className="text-center text-lg font-bold text-gray-800 mb-2">
                                            ⚖️ น้ำหนักตามอายุ
                                        </h4>
                                        <p className="text-center text-sm text-gray-600">
                                            ปัจจุบัน:{" "}
                                            <span className="font-bold text-purple-600">
                                                {weight} กก. ({weightCategory})
                                            </span>
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
                                        <ResponsiveContainer
                                            width="100%"
                                            height={350}
                                        >
                                            <AreaChart
                                                data={convertWeightData(
                                                    growthReference,
                                                    gender
                                                )}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 60,
                                                }}
                                            >
                                                <defs>
                                                    <pattern
                                                        id="weightGrid"
                                                        width="10"
                                                        height="10"
                                                        patternUnits="userSpaceOnUse"
                                                    >
                                                        <path
                                                            d="M 10 0 L 0 0 0 10"
                                                            fill="none"
                                                            stroke="#e5e7eb"
                                                            strokeWidth="0.5"
                                                        />
                                                    </pattern>
                                                </defs>

                                                <XAxis
                                                    dataKey="age"
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: "#374151",
                                                    }}
                                                    tickLine={{
                                                        stroke: "#6b7280",
                                                    }}
                                                    axisLine={{
                                                        stroke: "#6b7280",
                                                        strokeWidth: 2,
                                                    }}
                                                    label={{
                                                        value: "อายุ (เดือน)",
                                                        position:
                                                            "insideBottom",
                                                        offset: -10,
                                                        style: {
                                                            textAnchor:
                                                                "middle",
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                        },
                                                    }}
                                                />

                                                <YAxis
                                                    domain={[0, 30]}
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: "#374151",
                                                    }}
                                                    tickLine={{
                                                        stroke: "#6b7280",
                                                    }}
                                                    axisLine={{
                                                        stroke: "#6b7280",
                                                        strokeWidth: 2,
                                                    }}
                                                    label={{
                                                        value: "น้ำหนัก (กก.)",
                                                        angle: -90,
                                                        position: "insideLeft",
                                                        style: {
                                                            textAnchor:
                                                                "middle",
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                        },
                                                    }}
                                                />

                                                <CartesianGrid
                                                    strokeDasharray="none"
                                                    stroke="url(#weightGrid)"
                                                    strokeWidth={1}
                                                />

                                                {/* โซนสี */}
                                                <Area
                                                    type="linear"
                                                    dataKey="high"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#FFFFFF"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="highMid"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#61B846"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="normal"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#9EE683"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="lowMid"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#D7F2CE"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="low"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#F7A039"
                                                    fillOpacity={0.9}
                                                />

                                                {/* เส้นแบ่งโซน */}
                                                <ReferenceLine
                                                    y={12}
                                                    stroke="#059669"
                                                    strokeWidth={2}
                                                    strokeDasharray="2 2"
                                                />
                                                <ReferenceLine
                                                    y={17}
                                                    stroke="#059669"
                                                    strokeWidth={2}
                                                    strokeDasharray="2 2"
                                                />

                                                {/* จุดเด็ก */}
                                                <ReferenceDot
                                                    x={ageInMonths}
                                                    y={weight}
                                                    r={7}
                                                    fill="#dc2626"
                                                    stroke="#ffffff"
                                                    strokeWidth={1}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-4 border border-purple-100">
                                        <h4 className="text-center text-lg font-bold text-gray-800 mb-2">
                                            ⚖️ น้ำหนักตามส่วนสูง
                                        </h4>
                                        <p className="text-center text-sm text-gray-600">
                                            ปัจจุบัน:{" "}
                                            <span className="font-bold text-purple-600">
                                                {weight} กก. (
                                                {weightForHeightCategory})
                                            </span>
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
                                        <ResponsiveContainer
                                            width="100%"
                                            height={350}
                                        >
                                            <AreaChart
                                                data={convertWeightForHeightData(
                                                    growthReference,
                                                    gender
                                                )}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 60,
                                                }}
                                            >
                                                <defs>
                                                    <pattern
                                                        id="weightGrid"
                                                        width="10"
                                                        height="10"
                                                        patternUnits="userSpaceOnUse"
                                                    >
                                                        <path
                                                            d="M 10 0 L 0 0 0 10"
                                                            fill="none"
                                                            stroke="#e5e7eb"
                                                            strokeWidth="0.5"
                                                        />
                                                    </pattern>
                                                </defs>

                                                <XAxis
                                                    dataKey="height"
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: "#374151",
                                                    }}
                                                    tickLine={{
                                                        stroke: "#6b7280",
                                                    }}
                                                    axisLine={{
                                                        stroke: "#6b7280",
                                                        strokeWidth: 2,
                                                    }}
                                                    label={{
                                                        value: "ส่วนสูง (ซม)",
                                                        position:
                                                            "insideBottom",
                                                        offset: -10,
                                                        style: {
                                                            textAnchor:
                                                                "middle",
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                        },
                                                    }}
                                                />

                                                <YAxis
                                                    domain={[0, 30]}
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: "#374151",
                                                    }}
                                                    tickLine={{
                                                        stroke: "#6b7280",
                                                    }}
                                                    axisLine={{
                                                        stroke: "#6b7280",
                                                        strokeWidth: 2,
                                                    }}
                                                    label={{
                                                        value: "น้ำหนัก (กก.)",
                                                        angle: -90,
                                                        position: "insideLeft",
                                                        style: {
                                                            textAnchor:
                                                                "middle",
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                        },
                                                    }}
                                                />

                                                <CartesianGrid
                                                    strokeDasharray="none"
                                                    stroke="url(#weightGrid)"
                                                    strokeWidth={1}
                                                />

                                                {/* โซนสี */}
                                                <Area
                                                    type="linear"
                                                    dataKey="obese"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#D4A6DE"
                                                    fillOpacity={1}
                                                />

                                                <Area
                                                    type="linear"
                                                    dataKey="preObese"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#FCD9FF"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="highMid"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#61B846"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="normal"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#9EE683"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="lowMid"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#D7F2CE"
                                                    fillOpacity={1}
                                                />
                                                <Area
                                                    type="linear"
                                                    dataKey="low"
                                                    stroke="#000000"
                                                    strokeWidth={0.6}
                                                    fill="#F7A039"
                                                    fillOpacity={0.9}
                                                />

                                                {/* เส้นแบ่งโซน */}
                                                <ReferenceLine
                                                    y={12}
                                                    stroke="#059669"
                                                    strokeWidth={2}
                                                    strokeDasharray="2 2"
                                                />
                                                <ReferenceLine
                                                    y={17}
                                                    stroke="#059669"
                                                    strokeWidth={2}
                                                    strokeDasharray="2 2"
                                                />

                                                {/* จุดเด็ก */}
                                                <ReferenceDot
                                                    x={Math.round(height)}
                                                    y={weight}
                                                    r={7}
                                                    fill="#dc2626"
                                                    stroke="#ffffff"
                                                    strokeWidth={1}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h5 className="text-center font-bold text-gray-800 mb-3">
                                    🔍 คำอธิบายสัญลักษณ์
                                </h5>
                                <div className="grid grid-cols-4 gap-y-2 text-sm w-full max-w-4xl mx-auto">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-[#F7A039] rounded shadow-sm"></div>
                                        <span className="font-medium">
                                            เตี้ย/น้ำหนักน้อย/ผอม
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-[#D7F2CE] rounded shadow-sm"></div>
                                        <span className="font-medium">
                                            ค่อนข้างเตี้ย/น้ำหนักค่อนข้างน้อย/ค่อนข้างผอม
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-[#9EE683] rounded shadow-sm"></div>
                                        <span className="font-medium">
                                            ปกติ/สมส่วน
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-[#61B846] rounded shadow-sm"></div>
                                        <span className="font-medium">
                                            ค่อนข้างสูง/น้ำหนักค่อนข้างมาก/ท้วม
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-[#FCD9FF] rounded shadow-sm"></div>
                                        <span className="font-medium">
                                            เริ่มอ้วน
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-[#D4A6DE] rounded shadow-sm"></div>
                                        <span className="font-medium">
                                            อ้วน
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-white rounded shadow-sm"></div>
                                        <span className="font-medium">
                                            สูง/น้ำหนักมาก
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-red-600 rounded-full border border-white shadow-sm"></div>
                                        <span className="font-medium">
                                            ตำแหน่งเด็ก
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // กราฟ Radar เดิม
                        <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mx-auto justify-center">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    กราฟมาตรฐานการเจริญเติบโต
                                </h3>
                                <div className="flex justify-center space-x-8 text-sm">
                                    <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                                        <span className="text-blue-700 font-medium">
                                            ส่วนสูง: {height} ซม. (
                                            {heightCategory})
                                        </span>
                                    </div>
                                    <div className="bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                                        <span className="text-purple-700 font-medium">
                                            น้ำหนัก: {weight} กก. (
                                            {weightCategory})
                                        </span>
                                    </div>
                                      <div className="bg-pink-50 px-4 py-2 rounded-full border border-pink-200">
    <span className="text-pink-700 font-medium">
      น้ำหนักตามส่วนสูง: {weight} กก. ({weightForHeightCategory})
    </span>
  </div>
                                </div>
                            </div>{" "}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* กราฟส่วนสูง */}
                                <div className="w-full">
                                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-4 border border-blue-100">
                                        <h4 className="text-center text-lg font-bold text-gray-800 mb-2">
                                            📏 ส่วนสูงตามอายุ
                                        </h4>
                                        <p className="text-center text-sm text-gray-600">
                                            ปัจจุบัน:{" "}
                                            <span className="font-bold text-purple-600">
                                                {height} ซม.
                                            </span>{" "}
                                            ({heightCategory})
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
<ResponsiveContainer width="100%" height={300}>
        <RadarChart outerRadius="75%" data={chartDataHeight}>
          <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "#374151" }} />
          <PolarRadiusAxis domain={[0, 150]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 12,
            }}
          />
          <Radar
            name="ค่ากลางมาตรฐาน"
            dataKey="reference"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="#60A5FA"
            fillOpacity={0.25}
          />
          <Radar
            name={`ส่วนสูง (${height} ซม.)`}
            dataKey="actual"
            stroke="#1E3A8A"
            strokeWidth={3}
            fill="#1E3A8A"
            fillOpacity={0.3}
            dot={{ fill: "#2563EB", r: 4 }}
          />
          <Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-4 border border-purple-100">
                                        <h4 className="text-center text-lg font-bold text-gray-800 mb-2">
                                            ⚖️ น้ำหนักตามอายุ
                                        </h4>
                                        <p className="text-center text-sm text-gray-600">
                                            ปัจจุบัน:{" "}
                                            <span className="font-bold text-purple-600">
                                                {weight} กก.
                                            </span>{" "}
                                            ({weightCategory})
                                        </p>
                                    </div>
<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart outerRadius="75%" data={chartDataWeight}>
          <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "#374151" }} />
          <PolarRadiusAxis domain={[0, 30]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 12,
            }}
          />
          <Radar
            name="ค่ากลางมาตรฐาน"
            dataKey="reference"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="#A78BFA"
            fillOpacity={0.25}
          />
          <Radar
            name={`น้ำหนัก (${weight} กก.)`}
            dataKey="actual"
            stroke="#7E22CE"
            strokeWidth={3}
            fill="#7E22CE"
            fillOpacity={0.3}
            dot={{ fill: "#9333EA", r: 4 }}
          />
          <Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
</div>

                                </div>

                                <div className="w-full">
                                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-4 border border-blue-100">
                                        <h4 className="text-center text-lg font-bold text-gray-800 mb-2">
                                            ⚖️ น้ำหนักตามส่วนสูง
                                        </h4>
                                        <p className="text-center text-sm text-gray-600">
                                            ปัจจุบัน:{" "}
                                            <span className="font-bold text-purple-600">
                                                {weight} กก.
                                            </span>{" "}
                                            ({weightForHeightCategory})
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart outerRadius="75%" data={chartDataWeightForHeight}>
          <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "#374151" }} />
          <PolarRadiusAxis domain={[0, 35]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 12,
            }}
          />
          <Radar
            name="ค่ากลางมาตรฐาน"
            dataKey="reference"
            stroke="#22C55E"
            strokeWidth={2}
            fill="#4ADE80"
            fillOpacity={0.25}
          />
          <Radar
            name={`น้ำหนัก (${weight} กก.)`}
            dataKey="actual"
            stroke="#166534"
            strokeWidth={3}
            fill="#15803D"
            fillOpacity={0.3}
            dot={{ fill: "#22C55E", r: 4 }}
          />
          <Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Box>
        </Box>
    );
};

export default HeightWeightModal;
