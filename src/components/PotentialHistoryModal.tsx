import React, { useState } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PotentialModal from "./PotentialModal";
import type { Submission } from "../interface/submission.types";
import type { Student } from "../interface/student.types";

interface Props {
    onClose: () => void;
    submissions: Submission[];
    childInfo: Student;
}

const DevelopmentLogModal: React.FC<Props> = ({ onClose, submissions, childInfo }) => {
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [openPotentialModal, setOpenPotentialModal] = useState(false);
    const handlePMClose = () => {
        setOpenPotentialModal(false);
    };
    const calculateAgeAtDate = (birth: string, recordDate: string) => {
        const birthDate = new Date(birth);
        const targetDate = new Date(recordDate);

        let months =
            (targetDate.getFullYear() - birthDate.getFullYear()) * 12 +
            (targetDate.getMonth() - birthDate.getMonth());
        if (targetDate.getDate() < birthDate.getDate()) {
            months -= 1;
        }

        return months;
    };

    const handlePMOpen = (item: Submission) => {
  setSelectedSubmission(item);
  setOpenPotentialModal(true);
};


    const formatAge = (months: number) => {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        return `${years} ปี ${remainingMonths} เดือน`;
    };


    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
{openPotentialModal && selectedSubmission && (
  <PotentialModal
    name={childInfo?.nickname ?? ""}
    message="ผลการประเมินพัฒนาการ"
    ageInMonths={
      childInfo?.birth
        ? calculateAgeAtDate(
            childInfo.birth,
            selectedSubmission.created_at
          )
        : 0
    }
    gender={(childInfo?.gender as "male" | "female") ?? "male"}
    summary={selectedSubmission.summary_by_type ?? []}
    onClose={handlePMClose}
  />
)}

            <Box
                sx={{
                    backgroundColor: "white",
                    width: { xs: "90%", sm: "70%", md: "50%" },
                    maxHeight: "80vh",
                    overflowY: "auto",
                    borderRadius: 2,
                    p: 3,
                    position: "relative",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: "center",
                        fontFamily: "Kanit, Poppins",
                        mb: 2,
                    }}
                >
                    ประวัติการประเมินพัฒนาการ
                </Typography>

                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        color: "red",
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* ✅ map ข้อมูลจริงจาก backend */}
                {submissions
                    .sort(
                        (a, b) =>
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                    )
                    .map((item, index) => {
                        const passed = item.passed_items ?? 0;
                        const total = item.total_items ?? 0;
                        const label = item.status_display || "-";
                        const bg = label === "ผ่าน" ? "#22c55e" : "#ef4444";

                        return (
                            <Box
                                key={item.id}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor:
                                        index % 2 === 0 ? "#f9fafb" : "white",
                                }}
                            >
                                {/* ฝั่งซ้าย */}
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        sx={{ fontFamily: "Kanit, Poppins" }}
                                    >
                                        ครั้งที่ {item.round}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontFamily: "Kanit, Poppins" }}
                                    >
                                        {new Date(
                                            item.created_at
                                        ).toLocaleDateString("th-TH")}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontFamily: "Kanit, Poppins" }}
                                    >
                                        อายุ{" "}
                                        {formatAge(
                                            calculateAgeAtDate(
                                                childInfo.birth,
                                                item.created_at ?? ""
                                            )
                                        )}{" "}
                                    </Typography>
                                    {( item.submitted_by_detail?.first_name.trim() && <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontFamily: "Kanit, Poppins" }}
                                    >
                                        ประเมินโดยคุณ{" "}
                                        {item.submitted_by_detail.first_name}{" "}{item.submitted_by_detail.last_name}
                                    </Typography>)}
                                    
                                </Box>

                                {/* ฝั่งขวา */}
                                <Box
                                    className="flex-col"
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                >

                                    <Typography
                                        fontSize={15}
                                        color={bg}
                                        sx={{ fontFamily: "Kanit, Poppins" }}
                                    >
                                        ทำได้ {passed}/{total} ข้อ
                                    </Typography>
                                    <Chip
                                        label={label}
                                        sx={{
                                            bgcolor: bg,
                                            color: "white",
                                            fontWeight: "bold",
                                            fontSize: "0.8rem",
                                            fontFamily: "Kanit, Poppins",
                                            width: "5rem"
                                        }}
                                    />
                                                                                                                                          <button
                                    onClick={() => handlePMOpen(item)}
                                    className="px-4 py-1 bg-blue-500 text-md text-white rounded-2xl"
                                >
                                    ดูกราฟ
                                </button>
                                </Box>
                            </Box>
                        );
                    })}
            </Box>
        </Box>
    );
};

export default DevelopmentLogModal;
