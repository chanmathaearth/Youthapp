import React from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { useSubmissionsByChild } from "../hooks/useSubmission";

interface Props {
  onClose: () => void;
}

const DevelopmentLogModal: React.FC<Props> = ({ onClose }) => {
  const { childId } = useParams<{ childId: string }>();
  const { data: submissions = [], isLoading } = useSubmissionsByChild(Number(childId));

  if (isLoading) {
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
        <Typography color="white" fontFamily="Kanit, Poppins">
          กำลังโหลดข้อมูล...
        </Typography>
      </Box>
    );
  }

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
        {submissions.map((item, index) => {
          const round = index + 1;
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
                bgcolor: index % 2 === 0 ? "#f9fafb" : "white",
              }}
            >
              {/* ฝั่งซ้าย */}
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ fontFamily: "Kanit, Poppins" }}
                >
                  ครั้งที่ {round}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: "Kanit, Poppins" }}
                >
                  {new Date(item.created_at).toLocaleDateString("th-TH")}
                </Typography>
              </Box>

              {/* ฝั่งขวา */}
              <Box
                className="flex-col"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Typography
                  fontSize={14}
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
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default DevelopmentLogModal;
