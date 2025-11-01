/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { ArrowLeft, Save, CheckCircle2, Circle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useStudentById } from "../../hooks/useStudent";
import { dobFormat } from "../../utils/dobFormat";
import { useSubmitQuestionnaire } from "../../hooks/useSubmitQuestionnaire";

type QuestionnaireItem = {
  id: number;
  title: string;
  type?: {
    name?: string;
    description?: string;
  };
  equipment?: string;
};
export default function EvaluationFormPage() {
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
    const { childId, roomId } = useParams<{ roomId: string; childId: string }>();
    const {
        data: childInfo,
        isLoading,
        isError,
    } = useStudentById(Number(childId));
    const { mutate: submitQuestionnaire } = useSubmitQuestionnaire();

    const navigate = useNavigate();

    if (isLoading)
        return <p className="text-center mt-10">กำลังโหลดข้อมูล...</p>;
    if (isError || !childInfo)
        return (
            <p className="text-center mt-10 text-red-500">
                ไม่สามารถโหลดข้อมูลได้
            </p>
        );

    const items = (childInfo.questionnaire?.items ?? []).map((item: QuestionnaireItem) => ({
  id: item.id,
  question: item.title,
  category: item.type?.description ?? "ไม่ระบุหมวด",
  short: item.type?.name ?? "",
  equipment: item.equipment ?? "",
}));

    const grouped: Record<string, (typeof items)[number][]> = items.reduce(
        (acc: { [x: string]: any[]; }, item: { category: string | number; }, idx: any) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push({ ...item, idx });
            return acc;
        },
        {} as Record<string, (typeof items)[number][]>
    );

    const toggleItem = (index: number) => {
        setCheckedItems((prev) => {
            const newChecked = new Set(prev);
            if (newChecked.has(index)) newChecked.delete(index);
            else newChecked.add(index);
            return newChecked;
        });
    };
    
    const handleSave = () => {
        if (!childInfo?.questionnaire || !childInfo?.id) {
            alert("ไม่พบข้อมูลแบบประเมินหรือข้อมูลเด็ก");
            return;
        }

        const payload = {
            children: childInfo.id,
            questionnaire: childInfo.questionnaire.id,
            answers: childInfo.questionnaire.items.map(
                (item: any, idx: number) => ({
                    questionnaire_item: item.id,
                    answer: checkedItems.has(idx),
                })
            ),
        };
          submitQuestionnaire(payload, {
    onSuccess: () => {
      navigate(`/rooms/${roomId}/evaluations`);
    },
  });
    };

    const selectAll = () => setCheckedItems(new Set(items.map((_: any, i: any) => i)));
    const clearAll = () => setCheckedItems(new Set());

    // --- UI ---
    return (
        <Box className="min-h-screen bg-gradient-to-r from-blue-50 via-sky-50 to bg-cyan-50 font-poppins">
            {/* Header */}
            <Box className="shadow-sm p-4 sticky top-0 z-10 bg-white/80 border-b border-slate-200">
                <Box className="flex items-center justify-between max-w-4xl mx-auto ">
                    <Box className="flex items-center space-x-4">
                        <button
                            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-black rounded hover:bg-gray-100 transition"
                            onClick={() => navigate(-1)}
                            type="button"
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
                        <Box className="text-right hidden md:block">
                            <Box className="text-2xl font-bold text-green-600">
                                {checkedItems.size}/{items.length}
                            </Box>
                            <Box className="text-xs text-gray-500">ข้อ</Box>
                        </Box>
                        <button
                            onClick={handleSave}
                            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow transition"
                            type="button"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            บันทึก
                        </button>
                    </Box>
                </Box>
            </Box>

            {/* Content Section */}
            <Box className="p-4 max-w-4xl mx-auto">
                {/* ปุ่มลัด */}
                <Box className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={selectAll}
                        className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition"
                        type="button"
                    >
                        ✓ เลือกทั้งหมด
                    </button>
                    <button
                        onClick={clearAll}
                        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition"
                        type="button"
                    >
                        ✗ ล้างทั้งหมด
                    </button>
                </Box>

                {/* ✅ ถ้าไม่มี questionnaire */}
                {!childInfo.questionnaire || items.length === 0 ? (
                    <Box className="flex flex-col items-center justify-center text-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <p className="text-gray-500 text-2xl font-medium mb-2">
                            ไม่พบแบบประเมิน
                        </p>
                        <p className="text-gray-400 text-lg">
                            เด็กคนนี้ยังไม่มีแบบประเมินพัฒนาการที่สอดคล้องกับช่วงอายุ
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition"
                        >
                            กลับไปหน้าหลัก
                        </button>
                    </Box>
                ) : (
                    <>
                        {/* แสดงรายการคำถาม */}
                        <Box className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 ">
                            {Object.entries(grouped).map(
                                ([category, group]) => (
                                    <Box key={category} className="mb-5">
                                        {/* Header */}
                                        <Box className="px-4 py-2 rounded-t-lg bg-gradient-to-r from-sky-500 to-sky-300 text-white shadow">
                                            {category} {group[0]?.short}
                                        </Box>

                                        {group.map(({ question, idx }, j) => {
                                            const isLast =
                                                j === group.length - 1;
                                            const rounded = isLast
                                                ? "rounded-b-lg"
                                                : "";

                                            return (
                                                <Box
                                                    key={idx}
                                                    onClick={() =>
                                                        toggleItem(idx)
                                                    }
                                                    className={`
                          p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-all
                          ${
                              checkedItems.has(idx)
                                  ? "bg-green-100 border-l-4 border-green-400"
                                  : "bg-white"
                          }
                          ${rounded}
                        `}
                                                >
                                                    <Box className="flex items-start gap-4">
                                                        {checkedItems.has(
                                                            idx
                                                        ) ? (
                                                            <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
                                                        ) : (
                                                            <Circle className="w-6 h-6 text-gray-400 mt-1" />
                                                        )}
                                                        <Box>
                                                            <p
                                                                className={`font-medium ${
                                                                    checkedItems.has(
                                                                        idx
                                                                    )
                                                                        ? "text-green-700"
                                                                        : "text-gray-800"
                                                                }`}
                                                            >
                                                                {question}
                                                            </p>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                )
                            )}
                        </Box>

                        {/* สรุปผล */}
                        <Box className="mt-8 text-center">
                            <Box className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-2xl p-6 mb-6">
                                <h3 className="text-xl font-bold mb-2">
                                    ผลการประเมิน
                                </h3>
                                <Box className="text-4xl font-bold mb-2">
                                    {checkedItems.size === items.length
                                        ? "ผ่าน"
                                        : "ไม่ผ่าน"}
                                </Box>
                                <p className="text-blue-100">
                                    ทำได้ {checkedItems.size} จาก {items.length}{" "}
                                    ข้อ (
                                    {Math.round(
                                        (checkedItems.size / items.length) * 100
                                    )}
                                    %)
                                </p>
                            </Box>
                            <Box className="flex justify-center">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-lg transition"
                                    type="button"
                                >
                                    <Save className="w-6 h-6 mr-3" />
                                    บันทึกการประเมิน
                                </button>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}
