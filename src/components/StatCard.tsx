import { Box, Typography } from "@mui/material";
import React from "react";

type StatCardProps = {
  value: string | number;
  label: string;
  icon: string;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, color }) => {
  return (
    <Box
      sx={{
        backgroundColor: color,
        color: "#fff",
        borderRadius: 4,
        padding: 2,
        flex: "1 1 120px", // responsive
        maxWidth: 220,
        minWidth: 220,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.2,
      }}
    >
      <img src={icon} alt="icon" style={{ width: 52, height: 52 }} />
      <Typography
        fontWeight={700}
        sx={{
          fontFamily: "Poppins, Kanit",
          fontSize: "1.25rem",
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: "Poppins, Kanit",
          fontSize: "0.95rem",
          fontWeight: 300,
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default StatCard;
