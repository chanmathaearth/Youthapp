import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import { dobFormat } from "../utils/dobFormat";

interface GrowthRecord {
  round: number;
  created_at: string;
  weight_kg: string;
  height_cm: string;
  remarks?: string;
  ageMonth: number;
  birth: string;
  gender: "male" | "female";
  growthResult: {
    weightResult: string;
    heightResult: string;
    weightHeightResult: string;
  };
}

interface Props {
  onClose: () => void;
  records: GrowthRecord[];
}

const GrowthHistoryModal: React.FC<Props> = ({ onClose, records }) => {
  const getStatusColor = (status: string) => {
    if (status.includes("สมส่วน")) return "success.main";
    if (status.includes("ผอม")) return "warning.main";
    if (status.includes("อ้วน")) return "error.main";
    return "text.primary";
  };

  return (
    <Box
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
        p: 2,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: "white",
          width: { xs: "92%", sm: "72%", md: "54%" },
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: 2,
          p: 3,
          position: "relative",
        }}
      >
        {/* Header */}
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontFamily: "Kanit, Poppins",
            mb: 2,
            fontWeight: 600,
          }}
        >
          ประวัติการเจริญเติบโต
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12, color: "error.main" }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        {/* รายการ */}
        {records?.length ? (
          records.map((rec, index) => (
            <Box
              key={`${rec.round}-${rec.created_at}-${index}`}
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
                <Typography sx={{ fontFamily: "Kanit, Poppins" }}>
                  ครั้งที่ {rec.round ?? index + 1}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: "Kanit, Poppins" }}
                >
                  {format(new Date(rec.created_at), "dd/MM/yyyy")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: "Kanit, Poppins" }}
                >
                  อายุ {dobFormat(rec.birth)}
                </Typography>
              </Box>

              {/* ฝั่งขวา */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  textAlign: "right",
                }}
              >
                {/* น้ำหนัก | ส่วนสูง | ผลน้ำหนักตามส่วนสูง */}
                <Box
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography sx={{ color: "primary.main", fontFamily: "Kanit, Poppins" }}>
                    {rec.weight_kg} กก.
                  </Typography>
                  <Typography sx={{ mx: 1, color: "#9ca3af" }}>|</Typography>
                  <Typography sx={{ color: "success.main", fontFamily: "Kanit, Poppins" }}>
                    {rec.height_cm} ซม.
                  </Typography>
                  <Typography sx={{ mx: 1, color: "#9ca3af" }}>|</Typography>
                  <Typography
                    sx={{
                      color: getStatusColor(rec.growthResult.weightHeightResult),
                      fontFamily: "Kanit, Poppins",
                    }}
                  >
                    {rec.growthResult.weightHeightResult}
                  </Typography>
                </Box>

                {/* สถานะย่อย */}
                <Typography
                  fontSize={14}
                  color="text.secondary"
                  sx={{ fontFamily: "Kanit, Poppins" }}
                >
                  {rec.growthResult.weightResult} | {rec.growthResult.heightResult}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography
            sx={{
              textAlign: "center",
              mt: 4,
              color: "text.secondary",
              fontFamily: "Kanit, Poppins",
            }}
          >
            ยังไม่มีข้อมูลการบันทึกการเจริญเติบโต
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default GrowthHistoryModal;
