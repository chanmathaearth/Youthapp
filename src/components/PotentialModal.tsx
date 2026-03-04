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
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
    ageInMonths: number;
    onClose: () => void;
    summary: SummaryItem[];
    gender: "male" | "female";
}

const colors = ["#06b6d4", "#3b82f6", "#ec4899", "#f97316", "#84cc16"];

const PotentialModal: React.FC<PotentialModalProps> = ({
    name,
    summary,
    ageInMonths,
    gender,
    message,
    onClose,
}) => {
    /* 🔥 แปลง payload → chart */
    const chartData =
        summary?.map((item) => ({
            name: item.type_name,
            value: item.is_passed ? 1 : 0,
            status: item.status_display,
        })) ?? [];

    const passCount = chartData.filter((d) => d.value === 1).length;

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.55)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    background: "white",
                    p: 4,
                    borderRadius: 4,
                    width: { xs: "95%", sm: "80%", md: "60%" },
                    position: "relative",
                }}
            >
                {/* Header */}
                <Typography
                    fontFamily="Kanit, Poppins"
                    sx={{ fontWeight: 700, fontSize: 20, textAlign: "center" }}
                >
                    {message}
                </Typography>

                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 10, top: 10 }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Info */}
                <Box className="flex flex-wrap justify-center gap-2 my-4 font-medium">
                    <span className="text-blue-700">ชื่อ:</span>
                    <span>น้อง{name}</span>
                    <span className="text-gray-400">|</span>

                    <span className="text-pink-600">เพศ:</span>
                    <span>{gender === "male" ? "ชาย" : "หญิง"}</span>

                    <span className="text-gray-400">|</span>

                    <span className="text-emerald-600">อายุ:</span>
                    <span>{ageInMonths} เดือน</span>
                </Box>

                {/* Summary */}

                <Typography
                    fontFamily="Kanit, Poppins"
                    sx={{
                        fontWeight: 700,
                        fontSize: 16,
                        textAlign: "center",
                        mb: 2,
                        color: "#22c55e",
                    }}
                >
                    ผ่าน {passCount} / {chartData.length} ด้าน
                </Typography>

                {/* 🔥 Horizontal modern bar */}
                <Box sx={{ width: "100%", height: 360 }}>
                    <ResponsiveContainer>
                        <BarChart layout="vertical" data={chartData}>
                            <CartesianGrid
                                strokeDasharray="4 4"
                                horizontal={false}
                            />

                            {/* ผ่าน / ไม่ผ่าน */}
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

                            {/* 🔥 nowrap label */}
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={190}
                                axisLine={false}
                                tickLine={false}
                                tick={({ x, y, payload }) => (
                                    <text
                                        x={x}
                                        y={y}
                                        dy={4}
                                        textAnchor="end"
                                        className="whitespace-nowrap"
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {payload.value}
                                    </text>
                                )}
                            />

                            <Tooltip
                                formatter={(value: number) =>
                                    value === 1 ? "ผ่าน" : "ไม่ผ่าน"
                                }
                            />

                            <Bar dataKey="value" radius={[0, 12, 12, 0]}>
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
            </Box>
        </Box>
    );
};

export default PotentialModal;
