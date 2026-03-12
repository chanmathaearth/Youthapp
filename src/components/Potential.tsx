import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Cell,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { Box } from "@mui/material";

/* 🔥 payload จาก backend */
interface SummaryItem {
    type_name: string;
    total: number;
    passed: number;
    is_passed: boolean;
    status_display: string;
}

interface PotentialModalProps {
    name: string;
    message: string;
    date: string;
    ageInMonths: number;
    onClose: () => void;
    summary: SummaryItem[];
    gender: "male" | "female";
    overallStatus?: string;
}

const colors = ["#06b6d4", "#3b82f6", "#ec4899", "#f97316", "#84cc16"];

const PotentialModal: React.FC<PotentialModalProps> = ({ summary, date, overallStatus }) => {
    const chartData =
        summary?.map((item) => ({
            name: item.type_name.match(/\((.*?)\)/)?.[1] ?? item.type_name,
            fullName: item.type_name,
            value: item.is_passed ? 1 : 0,
            status: item.status_display,
        })) ?? [];

    const passCount = chartData.filter((d) => d.value === 1).length;
    const allPassed = passCount == chartData.length;

    return (
        <Box
            sx={{
                background: "white",
                pl: 4,
                pr: 4,
                pb: 4,
                borderRadius: 4,
                position: "relative",
            }}
        >
            {/* Info */}
            <Box className="flex flex-wrap justify-between gap-2 my-4 font-medium">
                <Box className="flex gap-2">
                <span>ผลการประเมินพัฒนาการล่าสุด</span>
                </Box>

                <span className="text-sm">
                    {date ? new Date(date).toLocaleDateString("th-TH") : "-"}
                </span>
            </Box>

            {overallStatus === "ไม่ผ่าน" ? (
                <div className="mb-4 rounded-xl p-8 text-center bg-gray-50 border border-gray-200">
                    <p className="text-2xl font-bold text-gray-500">
                        รอการประเมิน
                    </p>
                </div>
            ) : (
                <>
                    <div
                        className={`mb-4 rounded-xl p-4 text-center ${allPassed ? "bg-emerald-50" : "bg-amber-50"}`}
                    >
                        <p
                            className={`text-3xl font-bold ${allPassed ? "text-emerald-600" : "text-amber-600"}`}
                        >
                            {passCount}/{chartData.length}
                        </p>
                        <p
                            className={`mt-1 text-sm font-medium ${allPassed ? "text-emerald-700" : "text-amber-700"}`}
                        >
                            {allPassed ? "ผ่านครบทุกด้าน" : "ต้องติดตามเพิ่มเติม"}
                        </p>
                    </div>
                    
                    <Box sx={{ width: "100%", height: 360 }}>
                        <ResponsiveContainer>
                            <BarChart layout="vertical" data={chartData}>
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    horizontal={false}
                                />

                                <XAxis
                                    type="number"
                                    domain={[0, 1]}
                                    ticks={[0, 1]}
                                    tickFormatter={(v) =>
                                        v === 1 ? "ผ่าน" : "ไม่ผ่าน"
                                    }
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={40}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={({ x, y, payload }) => (
                                        <text
                                            x={x - 12}
                                            y={y}
                                            dy={4}
                                            textAnchor="end"
                                            className="whitespace-nowrap"
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {payload.value}
                                        </text>
                                    )}
                                />

                                <Tooltip
                                    labelFormatter={(label, payload) =>
                                        payload?.[0]?.payload?.fullName ?? label
                                    }
                                    formatter={(value: number) =>
                                        value === 1 ? "ผ่าน" : "ไม่ผ่าน"
                                    }
                                />

                                <Bar dataKey="value" radius={[30, 30, 30, 30]}>
                                    {chartData.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default PotentialModal;
