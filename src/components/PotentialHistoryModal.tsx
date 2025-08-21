import React from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Evaluation {
    round: number;
    date: string; // ควรเป็น ISO string เช่น '2024-06-15'
    score: number;
    length: number;
    age: number;
}

interface Props {
    onClose: () => void;
    evaluations: Evaluation[];
}

const DevelopmentLogModal: React.FC<Props> = ({ onClose, evaluations }) => {
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
                    maxHeight: "80vh", // จำกัดความสูง
                    overflowY: "auto", // scroll เนื้อหา
                    borderRadius: 2,
                    p: 3,
                    position: "relative", // สำหรับปุ่มปิด
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

                {evaluations.map((item, index) => {
                    return (
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
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    sx={{
                                        fontFamily: "Kanit, Poppins",
                                    }}
                                >
                                    ครั้งที่ {item.round}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "Kanit, Poppins",
                                    }}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {item.date}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "Kanit, Poppins",
                                    }}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    อายุ {item.age} เดือน
                                </Typography>
                            </Box>
                            <Box className="flex-col" display="flex" alignItems="center" gap={1}>
                                {(() => {
                                    const passedItems = item.score; 
                                    const totalItems = item.length; 

                                    let label = "ไม่ผ่าน"; 
                                    let bg = "#ef4444"; 
                                    let color = "white";

                                    // ถ้าทำได้ครบหรือมากกว่าครึ่ง
                                    if (passedItems === totalItems) {
                                        label = "ผ่าน";
                                        bg = "#22c55e"; 
                                        color = "white";
                                    }

                                    return (
                                        <>
                                            <Typography
                                                fontSize={14}
                                                color={bg}
                                                sx={{
                                                    fontFamily:
                                                        "Kanit, Poppins",
                                                }}
                                            >
                                                ทำได้ {passedItems}/{totalItems}{" "}
                                                ข้อ
                                            </Typography>
                                            <Chip
                                                label={label}
                                                sx={{
                                                    bgcolor: bg,
                                                    color: color,
                                                    fontWeight: "bold",
                                                    fontSize: "0.8rem",
                                                    fontFamily:
                                                        "Kanit, Poppins",
                                                }}
                                            />
                                        </>
                                    );
                                })()}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default DevelopmentLogModal;
