import { useState } from "react";
import { ArrowLeft, Save, Scale, Ruler, TrendingUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentById } from "../../hooks/useStudent";
import { dobFormat } from "../../utils/dobFormat";
import { Box } from "@mui/material";
import { useCreateHealthRecord, useHealthRecordsByChild } from "../../hooks/useHeath";

const WeightHeightForm = () => {
    const navigate = useNavigate();
    const { childId, roomId } = useParams<{ roomId: string; childId: string }>();

    // ✅ State สำหรับเก็บค่าจาก input
    const [weight, setWeight] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [remarks, setRemarks] = useState<string>("");

    const { data: childInfo } = useStudentById(Number(childId));
    const { data: healthRecords } = useHealthRecordsByChild(Number(childId));
    const latestRecord = healthRecords && healthRecords.length > 0 ? healthRecords[0] : null;

    const { mutate: createRecord, isPending } = useCreateHealthRecord();
    console.log(healthRecords)

    const handleSave = () => {
        if (!childId) return;

        // ตรวจสอบข้อมูลก่อนบันทึก
        if (!weight || !height) {
            alert("กรุณากรอกน้ำหนักและส่วนสูงก่อนบันทึก");
            return;
        }

        const payload = {
            child: Number(childId),
            weight_kg: Number(weight),
            height_cm: Number(height),
            remarks: remarks || "",
        };

        createRecord(payload, {
            onSuccess: () => {
                // ✅ ไปหน้า result หลังบันทึกสำเร็จ
                navigate(`/rooms/${roomId}/evaluations/${childId}/result`);
            },
        });
    };

    return (
        <Box className="min-h-screen bg-gradient-to-r from-blue-50 via-sky-50 to bg-cyan-50 font-poppins">
            {/* Header */}
            <Box className="shadow-sm p-4 sticky top-0 z-10 bg-white/80 border-b border-slate-200">
                <Box className="flex items-center justify-between max-w-4xl mx-auto ">
                    <Box className="flex items-center space-x-4">
                        <button
                            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-black rounded hover:bg-gray-100 transition"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            กลับ
                        </button>
                        <Box>
                            <h1 className="text-lg font-medium">
                                {childInfo?.nickname}
                            </h1>
                            <p className="text-sm text-gray-500">
                                อายุ {dobFormat(childInfo?.birth)}
                            </p>
                        </Box>
                    </Box>

                    <Box className="flex items-center space-x-4">
                        <button
                            onClick={handleSave}
                            disabled={isPending}
                            className={`flex items-center px-6 py-2 rounded-lg text-sm font-medium shadow transition
                                ${isPending ? "bg-gray-300" : "bg-green-500 hover:bg-green-600 text-white"}
                            `}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isPending ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                    </Box>
                </Box>
            </Box>

            <main className="p-4 max-w-4xl mx-auto">
                {/* แสดงข้อมูลสุขภาพล่าสุด */}
                {latestRecord != null && (
                    <Box className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                        <Box className="flex gap-2">
                            <TrendingUp className="w-5 h-6 text-gray-600" />
                            <span className="text-md mb-6">
                                ข้อมูลครั้งล่าสุด {new Date(latestRecord?.created_at ?? "").toLocaleDateString("th-TH")}
                            </span>
                        </Box>
                        <Box className="grid grid-cols-2 gap-4">
                            <Box className="text-center p-4 bg-white rounded-lg">
                                <Scale className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                                <Box className="text-2xl font-bold text-gray-900">
                                    {latestRecord?.weight_kg}
                                </Box>
                                <Box className="text-sm text-gray-500">
                                    กิโลกรัม
                                </Box>
                            </Box>
                            <Box className="text-center p-4 bg-white rounded-lg">
                                <Ruler className="w-6 h-6 mx-auto mb-2 text-green-500" />
                                <Box className="text-2xl font-bold text-gray-900">
                                    {latestRecord?.height_cm}
                                </Box>
                                <Box className="text-sm text-gray-500">
                                    เซนติเมตร
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )}

                {/* ฟอร์มกรอกข้อมูลสุขภาพใหม่ */}
                <Box className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">
                        บันทึกการวัดครั้งใหม่
                    </h2>

                    {/* น้ำหนัก */}
                    <Box className="space-y-3">
                        <label
                            htmlFor="weight"
                            className="text-lg font-medium text-gray-700 flex items-center space-x-2"
                        >
                            <Scale className="w-5 h-5 text-blue-500" />
                            <span>น้ำหนัก</span>
                        </label>
                        <Box className="relative">
                            <input
                                id="weight"
                                type="number"
                                step="0.1"
                                value={weight}
                                onChange={(e) =>
                                    setWeight(
                                        e.target.value
                                            ? parseFloat(e.target.value)
                                            : ""
                                    )
                                }
                                placeholder="เช่น 13.2"
                                className="text-md h-16 pl-5 pr-20 border-2 border-blue-200 focus:border-blue-400 rounded-xl w-full"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                กก.
                            </span>
                        </Box>
                    </Box>

                    {/* ส่วนสูง */}
                    <Box className="space-y-3 mt-2">
                        <label
                            htmlFor="height"
                            className="text-lg font-medium text-gray-700 flex items-center space-x-2"
                        >
                            <Ruler className="w-5 h-5 text-green-500" />
                            <span>ส่วนสูง</span>
                        </label>
                        <Box className="relative">
                            <input
                                id="height"
                                type="number"
                                step="0.1"
                                value={height}
                                onChange={(e) =>
                                    setHeight(
                                        e.target.value
                                            ? parseFloat(e.target.value)
                                            : ""
                                    )
                                }
                                placeholder="เช่น 87.5"
                                className="text-md h-16 pl-5 pr-20 border-2 border-blue-200 focus:border-blue-400 rounded-xl w-full"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                ซม.
                            </span>
                        </Box>
                    </Box>

                    {/* หมายเหตุ */}
                    <Box className="space-y-3 mt-2">
                        <label
                            htmlFor="notes"
                            className="text-lg font-medium text-gray-700"
                        >
                            หมายเหตุ
                        </label>
                        <textarea
                            id="notes"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="บันทึกข้อสังเกตเพิ่มเติม..."
                            className="w-full h-24 p-4 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none"
                        />
                    </Box>

                    {/* ปุ่มบันทึก */}
                    <Box className="flex justify-center mt-8">
                        <button
                            onClick={handleSave}
                            disabled={isPending}
                            className={`bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold shadow-lg rounded-2xl p-4 flex
                                ${isPending && "opacity-70 cursor-not-allowed"}
                            `}
                        >
                            <Save className="w-6 h-6 mr-3" />
                            {isPending ? "กำลังบันทึก..." : "บันทึกการวัด"}
                        </button>
                    </Box>
                </Box>
            </main>
        </Box>
    );
};

export default WeightHeightForm;
