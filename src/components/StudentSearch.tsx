"use client";

import { Button, TextField, Box, Typography} from "@mui/material";
import { useState } from "react";

interface StudentSearchProps {
    onSearch: (studentId: string) => void;
    isLoading: boolean;
    error: string | null;
}

export function StudentSearch({
    onSearch,
    isLoading,
    error,
}: StudentSearchProps) {
    const [studentId, setStudentId] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (studentId.trim()) {
            onSearch(studentId.trim());
        }
    };

    return (
        <Box
            sx={{
                fontFamily: "Poppins, sans-serif",
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                bgcolor: "#f6f7f9",
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 400 }}>
                {/* Logo */}
                <Box textAlign="center" mb={5}>
                    <Box
                        className="animate-pulse
"
                        sx={{
                            mx: "auto",
                            mb: 4,
                            height: 80,
                            width: 80,
                            borderRadius: 4,
                            bgcolor: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                        }}
                    >
                        <svg
                            width="40"
                            height="40"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 
                3.75 3.75 0 0 1 7.5 0ZM4.501 
                20.118a7.5 7.5 0 0 1 14.998 
                0A17.933 17.933 0 0 1 12 
                21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                        </svg>
                    </Box>

                    <Typography
                        sx={{ fontFamily: "Kanit, Poppins" }}
                        variant="h5"
                        fontWeight={700}
                    >
                        ระบบติดตามผลพัฒนาการเด็ก
                    </Typography>

                    <Typography
                        sx={{ fontFamily: "Kanit, Poppins" }}
                        variant="body2"
                        color="text.secondary"
                        mt={1}
                    >
                        กรอกเลขประจำตัวนักเรียน เพื่อดูข้อมูลพัฒนาการ
                    </Typography>
                </Box>

                {/* Form */}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        placeholder="เลขประจำตัว เช่น 67001"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        inputProps={{
                            inputMode: "numeric",
                            style: {
                                textAlign: "center",
                                fontSize: "20px",
                                fontWeight: 600,
                            },
                        }}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 4,
                                height: 56,
                                fontFamily: "Kanit, Poppins",
                            },
                        }}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={!studentId.trim() || isLoading}
                        sx={{
                            fontFamily: "Kanit, Poppins",
                            height: 56,
                            borderRadius: 4,
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            textTransform: "none",

                            "&.Mui-disabled": {
                                backgroundColor: "#84BEF0", // สีฟ้าอ่อน
                                color: "#ffffff",
                            },
                        }}
                    >
                        {isLoading ? "กำลังค้นหา..." : "ค้นหาข้อมูล"}
                    </Button>
                </form>

                {error && (
                    <Box
                        sx={{
                            mt: 2,
                            p: 1.5,
                            borderRadius: 4,
                            bgcolor: "#fef2f2",
                            border: "1px solid #fecaca",
                            textAlign: "center",
                            color: "#b91c1c",
                            fontSize: 14,
                        }}
                    >
                        {error}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
