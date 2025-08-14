import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface GrowthRecord {
    round: number;
    date: string;
    weight: number;
    height: number;
    weightStatus: string;
    heightStatus: string;
    age: number;
}

interface Props {
    onClose: () => void;
    records: GrowthRecord[];
}

const GrowthHistoryModal: React.FC<Props> = ({ onClose, records }) => {
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
                    ประวัติการเจริญเติบโต
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

                {records.map((rec, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            borderRadius: 2,
                            bgcolor: index % 2 === 0 ? "#f9fafb" : "white",
                        }}
                    >
                        <div>
                            <span className="text-left">
                                ครั้งที่ {rec.round}
                            </span>
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
                        </div>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end", // <-- ชิดขวา
                                textAlign: "right",
                            }}
                        >
                            <Box display="flex" alignItems="center">
                                <Typography
                                    fontWeight={600}
                                    color="primary"
                                    mr={1}
                                    sx={{ fontFamily: "Kanit, Poppins" }}
                                >
                                    {rec.weight} กก.
                                </Typography>
                                <Typography
                                    fontWeight={600}
                                    color="green"
                                    mr={1}
                                    sx={{ fontFamily: "Kanit, Poppins" }}
                                >
                                    | {rec.height} ซม.
                                </Typography>
                            </Box>
                            <Typography
                                fontSize={14}
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
