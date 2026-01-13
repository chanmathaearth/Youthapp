import { useState } from "react";
import { ArrowLeft, Save, Scale, Ruler, TrendingUp, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentById } from "../../hooks/useStudent";
import { dobFormat } from "../../utils/dobFormat";
import { Box } from "@mui/material";
import {
    useCreateHealthRecord,
    useHealthRecordsByChild,
    useUpdateHealthRecord,
} from "../../hooks/useHeath";
import Swal from "sweetalert2";
import { showConfirm, showError, showSuccessAuto } from "../../utils/alert";

const WeightHeightForm = () => {
    const navigate = useNavigate();
    const { childId, roomId } = useParams<{
        roomId: string;
        childId: string;
    }>();

    // ✅ State สำหรับเก็บค่าจาก input
    const [weight, setWeight] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [remarks, setRemarks] = useState<string>("");

    const { data: childInfo } = useStudentById(Number(childId));
    const { data: healthRecords } = useHealthRecordsByChild(Number(childId));
    const latestRecord = healthRecords?.at(-1) ?? null;
    const updateHealthRecord = useUpdateHealthRecord();

    const { mutate: createRecord, isPending } = useCreateHealthRecord();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState<{
        id: number,
        weight_kg: number | null;
        height_cm: number | null;
        remarks: string;
    } | null>(null);

    const handleEditOpen = () => {
        if (!latestRecord) return;

        setEditData({
            id: latestRecord.id,
            weight_kg: Number(latestRecord.weight_kg),
            height_cm: Number(latestRecord.height_cm),
            remarks: latestRecord.remarks ?? "",
        });

        setIsEditOpen(true);
    };


    const handleSave = async () => {
        if (!childId) return;

        if (!weight || !height) {
            showError("ข้อมูลไม่ครบ", "กรุณากรอกน้ำหนักและส่วนสูงก่อนบันทึก");
            return;
        }

        const payload = {
            child: Number(childId),
            weight_kg: Number(weight),
            height_cm: Number(height),
            remarks: remarks || "-",
        };

        // 🔍 แสดงข้อมูลให้ตรวจสอบก่อน
        const result = await Swal.fire({
            title: "ยืนยันการบันทึกข้อมูล",
            icon: "question",
            iconColor: "#3b82f6",
            html: `
      <div class="text-left text-md space-y-2">
        <div><b>น้ำหนัก:</b> ${payload.weight_kg} กก.</div>
        <div><b>ส่วนสูง:</b> ${payload.height_cm} ซม.</div>
        <div><b>หมายเหตุ:</b> ${payload.remarks}</div>
      </div>
    `,
            showCancelButton: true,
            confirmButtonText: "ยืนยันบันทึก",
            cancelButtonText: "ตรวจสอบอีกครั้ง",
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#9ca3af",
            reverseButtons: true,
            customClass: {
                popup: "rounded-xl",
                title: "text-lg font-semibold",
            },
        });

        // ❌ ถ้ายังไม่ยืนยัน
        if (!result.isConfirmed) return;

        // ✅ บันทึกจริง
        createRecord(payload, {
            onSuccess: () => {
                showSuccessAuto("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
                navigate(`/rooms/${roomId}/evaluations/${childId}/result`);
            },
            onError: () => {
                showError("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
            },
        });
    };

    return (
        <Box className="min-h-screen bg-gradient-to-r from-blue-50 via-sky-50 to bg-cyan-50 font-poppins">
            {isEditOpen && editData && (
                <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
                    <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6">
                        <div className="bg-white rounded-2xl shadow w-full max-w-xl p-6 sm:p-8">
                            {/* ===== Header ===== */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl">
                                        แก้ไขข้อมูล น้ำหนัก-ส่วนสูง
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        ข้อมูลวันที่ {new Date(
                                        latestRecord?.created_at ?? ""
                                    ).toLocaleDateString("th-TH")}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* ===== Body ===== */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex gap-2">
                                        <Scale className="w-5 h-5 text-blue-500" />
                                        <label className="block mb-1 font-medium">
                                            น้ำหนัก (กก.)
                                        </label>
                                    </div>

                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={editData.weight_kg ?? ""}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                weight_kg: Number(e.target.value),
                                            })
                                        }
                                        className="no-spinner text-md h-16 pl-5 pr-20 border-2 border-blue-200 focus:border-blue-400 rounded-xl w-full focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <div className="flex gap-2">
                                        <Ruler className="w-5 h-5 text-blue-500" />
                                        <label className="block mb-1 font-medium">
                                            ส่วนสูง (ซม.)
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={editData.height_cm ?? ""}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                height_cm: Number(e.target.value),
                                            })
                                        }
                                        className="no-spinner text-md h-16 pl-5 pr-20 border-2 border-blue-200 focus:border-blue-400 rounded-xl w-full focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        หมายเหตุ
                                    </label>
                                    <textarea
                                        value={editData.remarks}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                remarks: e.target.value,
                                            })
                                        }
                                        className="no-spinner w-full h-24 p-4 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* ===== Footer ===== */}
                            <div className="flex justify-end gap-3 mt-8">
<button
  onClick={async () => {
    if (
      !editData.weight_kg ||
      !editData.height_cm ||
      editData.weight_kg <= 0 ||
      editData.height_cm <= 0
    ) {
      showError("ข้อมูลไม่ถูกต้อง", "กรุณากรอกน้ำหนักและส่วนสูงให้ถูกต้อง");
      return;
    }

    const result = await showConfirm(
      "ตรวจสอบข้อมูลก่อนบันทึก",
      `
        <div class="text-left text-md space-y-2">
          <div><b>น้ำหนัก:</b> ${editData.weight_kg} กก.</div>
          <div><b>ส่วนสูง:</b> ${editData.height_cm} ซม.</div>
          <div><b>หมายเหตุ:</b> ${editData.remarks || "-"}</div>
        </div>
      `
    );

    if (!result.isConfirmed) return;

    // ✅ payload สำหรับ PATCH (ส่งเฉพาะที่แก้)
    updateHealthRecord.mutate(
      {
        id: Number(editData.id),
        data: {
          weight_kg: Number(editData.weight_kg),
          height_cm: Number(editData.height_cm),
          remarks: editData.remarks || "",
        },
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
      }
    );
  }}
  disabled={updateHealthRecord.isPending}
  className="px-6 py-2 rounded-lg bg-green-500 text-white disabled:opacity-50"
>
  {updateHealthRecord.isPending ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
</button>



                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                ${
                                    isPending
                                        ? "bg-gray-300"
                                        : "bg-green-500 hover:bg-green-600 text-white"
                                }
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
                        <Box className="flex justify-between">
                            <Box className="flex gap-2">
                                <TrendingUp className="w-5 h-6 text-gray-600" />
                                <span className="text-md mb-6">
                                    ข้อมูลครั้งล่าสุด{" "}
                                    {new Date(
                                        latestRecord?.created_at ?? ""
                                    ).toLocaleDateString("th-TH")}
                                </span>
                            </Box>
                            <Box className="flex gap-2">
                                <Edit
                                    onClick={handleEditOpen}
                                    className="
      w-6 h-8
      text-blue-600
      hover:text-blue-700
      cursor-pointer
    "
                                />{" "}
                            </Box>
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
                                min="0.1"
                                value={weight}
                                onChange={(e) =>
                                    setWeight(
                                        e.target.value
                                            ? parseFloat(e.target.value)
                                            : ""
                                    )
                                }
                                placeholder="เช่น 13.2"
                                className="no-spinner text-md h-16 pl-5 pr-20 border-2 border-blue-200 focus:border-blue-400 rounded-xl w-full focus:outline-none"
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
                            className="no-spinner text-lg font-medium text-gray-700 flex items-center space-x-2"
                        >
                            <Ruler className="w-5 h-5 text-green-500" />
                            <span>ส่วนสูง</span>
                        </label>
                        <Box className="relative">
                            <input
                                id="height"
                                type="number"
                                step="0.1"
                                min="0.1"
                                value={height}
                                onChange={(e) =>
                                    setHeight(
                                        e.target.value
                                            ? parseFloat(e.target.value)
                                            : ""
                                    )
                                }
                                placeholder="เช่น 87.5"
                                className="no-spinner text-md h-16 pl-5 pr-20 border-2 border-blue-200 focus:border-blue-400 rounded-xl w-full focus:outline-none"
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
                            className="w-full h-24 p-4 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none focus:outline-none"
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
