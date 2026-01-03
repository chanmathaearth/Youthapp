// components/ChildTable.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Typography,
    Box,
    Button,
    Card,
    CardHeader,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import React from "react";
import { Brain, Scale, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🔹 ประเภทข้อมูลเด็ก
export type ChildData = {
    id: number;
    name: string;
    age: string;
    status: string;
    round: number;
    date: string;
    room: string;
    roomId: number;
};

type Props = {
    childrenList: ChildData[];
    page: number;
    total: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
    onPageChange: (page: number) => void;
    search: string;
    onSearchChange: (value: string) => void;
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "success":
            return <CheckCircleIcon color="success" fontSize="small" />;
        case "hold":
            return <WarningIcon color="warning" fontSize="small" />;
        default:
            return null;
    }
};

const getStatusBadge = (status: string) => {
    const labels: { [key: string]: string } = {
        success: "สำเร็จ",
        hold: "รอประเมิน",
        default: "ยังไม่ได้ประเมิน",
    };

    const colors: { [key: string]: "success" | "warning" | "default" } = {
        success: "success",
        hold: "warning",
        default: "default",
    };

    return (
        <Chip
            sx={{
                fontFamily: "Poppins, Kanit",
                fontSize: "1rem",
                fontWeight: 600,
                px: 2,
                py: 1,
                minWidth: 120, // หรือกำหนดตามต้องการ
                whiteSpace: "nowrap",
            }}
            label={labels[status] || labels.default}
            color={colors[status] || colors.default}
            size="medium"
        />
    );
};

const Table_: React.FC<Props> = ({
    childrenList,
    page,
    total,
    limit,
    hasNext,
    hasPrev,
    onPageChange,
    search,
    onSearchChange,
}) => {
    const navigate = useNavigate();

    return (
        <Card sx={{ bgcolor: "white", borderRadius: 4, boxShadow: 2, p: 2 }}>
            <CardHeader
                sx={{ borderBottom: "1px solid #e5e7eb", pb: 3 }}
                title={
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            fontSize="1.25rem"
                            fontFamily="Poppins, Kanit"
                            whiteSpace={"nowrap"}
                        >
                            รายชื่อเด็กในห้อง
                        </Typography>
                        <Box position="relative" width={250}>
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hidden md:block"
                                size={18}
                            />
                            <input
                                className="fonts-poppins border border-gray-200 p-2 rounded-xl pl-10 w-[100%] text-sm font-light hidden md:block"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </Box>
                    </Box>
                }
            />
            <Box sx={{ overflowX: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {[
                                "ชื่อเด็ก",
                                "อายุ",
                                "สถานะ",
                                "ครั้งที่ประเมิน",
                                "การดำเนินการ",
                            ].map((label, index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        fontFamily: "Poppins, Kanit",
                                        fontSize: "1.15rem",
                                        whiteSpace: "nowrap",
                                    }}
                                    align={
                                        label === "การดำเนินการ" ||
                                        label === "สถานะ" ||
                                        label === "ครั้งที่ประเมิน"
                                            ? "center"
                                            : "left"
                                    }
                                >
                                    {label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {childrenList.map((child) => (
                            <TableRow key={child.id}>
                                <TableCell>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        {getStatusIcon(child.status)}
                                        <Typography
                                            sx={{
                                                fontFamily: "Poppins, Kanit",
                                                fontSize: "1.1rem",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {child.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontFamily: "Poppins, Kanit",
                                        fontSize: "1.1rem",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {child.age}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        {getStatusBadge(child.status)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            fontFamily: "Poppins, Kanit",
                                            fontSize: "1.1rem",
                                            justifyContent: "center",
                                        }}
                                    >
                                        ครั้งที่ {child.round}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Box
                                        display="flex"
                                        gap={1}
                                        justifyContent="center"
                                    >
                                        <div className="flex flex-col gap-2 mr-2">
                                            <Button
                                                onClick={() =>
                                                    navigate(
                                                        `/rooms/${child.roomId}/evaluations/${child.id}/assessment`
                                                    )
                                                }
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                sx={{
                                                    fontFamily:
                                                        "Poppins, Kanit",
                                                    fontSize: "1.1rem",
                                                    borderRadius: 3,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <Brain className="mr-2 w-5" />
                                                ประเมินพัฒนาการ
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    navigate(
                                                        `/rooms/${child.roomId}/evaluations/${child.id}/growth`
                                                    )
                                                }
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    fontFamily:
                                                        "Poppins, Kanit",
                                                    fontSize: "1.1rem",
                                                    borderRadius: 3,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <Scale className="mr-2 w-5" />
                                                วัดน้ำหนัก-ส่วนสูง
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                navigate(
                                                    `/rooms/${child.room.toLowerCase()}/evaluations/${
                                                        child.id
                                                    }/result`
                                                )
                                            }
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                fontFamily: "Poppins, Kanit",
                                                fontSize: "1.1rem",
                                                borderRadius: 3,
                                                whiteSpace: "nowrap",
                                                display:
                                                    child.status !== "success"
                                                        ? "none"
                                                        : "inline-block",
                                            }}
                                        >
                                            ดูผล
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box className="flex justify-between items-center mt-4 mb-1">
                    <button
                        disabled={!hasPrev}
                        onClick={() => onPageChange(page - 1)}
                        className="
      px-5 py-2 rounded-xl border
      border-blue-300 text-blue-600
      hover:bg-blue-50
      disabled:border-gray-200
      disabled:text-gray-400
      disabled:bg-gray-50
      disabled:cursor-not-allowed
    "
                    >
                        ก่อนหน้า
                    </button>

                    <span className="text-sm text-gray-600">
                        หน้า <b>{page}</b> / {Math.ceil(total / limit)}
                    </span>

                    <button
                        disabled={!hasNext}
                        onClick={() => onPageChange(page + 1)}
                        className="
      px-5 py-2 rounded-xl border
      border-blue-300 text-blue-600
      hover:bg-blue-50
      disabled:border-gray-200
      disabled:text-gray-400
      disabled:bg-gray-50
      disabled:cursor-not-allowed
    "
                    >
                        ถัดไป
                    </button>
                </Box>
            </Box>
        </Card>
    );
};

export default Table_;
