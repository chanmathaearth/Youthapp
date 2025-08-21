import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface GrowthRecord {
  round: number;
  date: string;
  weight: number;                // กก.
  height: number;                // ซม.
  weightStatus: string;          // สถานะน้ำหนักตามอายุ
  heightStatus: string;          // สถานะส่วนสูงตามอายุ
  weightForHeightStatus: string; // สถานะน้ำหนักตามส่วนสูง (ผอม/สมส่วน/เกิน/อ้วน)
  /** ถ้าต้องการเก็บค่าจริงของน้ำหนักตามส่วนสูงให้ใส่เพิ่มได้ */
  weightForHeight?: number;
  age: number;                   // เดือน
}

interface Props {
  onClose: () => void;
  records: GrowthRecord[];
}

const GrowthHistoryModal: React.FC<Props> = ({ onClose, records }) => {
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
        <Typography
          variant="h6"
          sx={{ textAlign: "center", fontFamily: "Kanit, Poppins", mb: 2 }}
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

        {records.map((rec, index) => (
          <Box
            key={`${rec.round}-${rec.date}-${index}`}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
              bgcolor: index % 2 === 0 ? "#f9fafb" : "white",
            }}
          >
            {/* ซ้าย: รอบ/วันที่/อายุ */}
            <Box>
              <Typography sx={{ fontFamily: "Kanit, Poppins" }}>
                ครั้งที่ {rec.round}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "Kanit, Poppins" }}
              >
                {rec.date}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "Kanit, Poppins" }}
              >
                อายุ {rec.age} เดือน
              </Typography>
            </Box>

            {/* ขวา: ค่าหลัก + สถานะ */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
              {/* บรรทัดบน: น้ำหนัก | ส่วนสูง | น้ำหนักตามส่วนสูง(สถานะ) */}
              <Box sx={{ fontWeight: 600, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                <Typography sx={{ color: "primary.main", fontFamily: "Kanit, Poppins" }}>
                  {rec.weight} กก.
                </Typography>
                <Typography sx={{ mx: 1, color: "#9ca3af" }}>|</Typography>
                <Typography sx={{ color: "success.main", fontFamily: "Kanit, Poppins" }}>
                  {rec.height} ซม.
                </Typography>
                <Typography sx={{ mx: 1, color: "#9ca3af" }}>|</Typography>
                <Typography sx={{ color: "#7c3aed", fontFamily: "Kanit, Poppins" }}>
                  {rec.weightForHeightStatus}
                </Typography>
              </Box>

              {/* บรรทัดล่าง: สถานะ น้ำหนัก | ส่วนสูง (สีเทา) */}
              <Typography
                fontSize={14}
                color="text.secondary"
                sx={{ fontFamily: "Kanit, Poppins" }}
              >
                {rec.weightStatus} | {rec.heightStatus}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GrowthHistoryModal;
