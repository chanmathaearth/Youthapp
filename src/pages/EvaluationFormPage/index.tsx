import { useState } from "react";
import { ArrowLeft, Save, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Item = {
  question: string;
  category: string;
  short: string;
};
type ItemWithIdx = Item & { idx: number };

export default function EvaluationFormPage() {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const childInfo = {
    name: "น้องแอม",
    age: "2 ปี 6 เดือน",
    evaluationRound: 4,
  };

  const items: Item[] = [
    {
      question: "หันหัวไปซ้ายขวาได้",
      category: "ด้านการเคลื่อนไหว Gross Motor (GM)",
      short: "GM",
    },
    {
        question: "mock question",
        category: "ด้านการเคลื่อนไหว Gross Motor (GM)",
        short: "GM",
      },
    {
      question: "หยิบของชิ้นเล็กๆ ได้ด้วยนิ้วโป้งและนิ้วชี้",
      category: "ด้านการใช้กล้ามเนื้อมัดเล็กและสติปัญญา Fine Motor (FM)",
      short: "FM",
    },
    {
      question: "หันไปหาผู้พูดเมื่อเรียกชื่อ",
      category: "ด้านการเข้าใจภาษา Receptive Language (RL)",
      short: "RL",
    },
    {
      question: "ส่งเสียงอื่นๆ ได้",
      category: "ด้านการใช้ภาษา Expressive Language (EL)",
      short: "EL",
    },
    {
      question: "มองจ้องหน้าได้ 1-2 วินาที",
      category: "ด้านการช่วยเหลือตัวเองและสังคม Personal and Social (PS)",
      short: "PS",
    },
  ];

  // --- Grouped by short ---
  const grouped: Record<string, ItemWithIdx[]> = items.reduce((acc, item, idx) => {
    if (!acc[item.short]) acc[item.short] = [];
    acc[item.short].push({ ...item, idx });
    return acc;
  }, {} as Record<string, ItemWithIdx[]>);

  // --- Handlers ---
  const toggleItem = (index: number) => {
    setCheckedItems(prev => {
      const newChecked = new Set(prev);
      if (newChecked.has(index)) newChecked.delete(index);
      else newChecked.add(index);
      return newChecked;
    });
  };

  const handleSave = () => {
    alert(`บันทึกแล้ว! ประเมิน ${checkedItems.size}/${items.length} ข้อ`);
  };

  const selectAll = () => setCheckedItems(new Set(items.map((_, i) => i)));
  const clearAll = () => setCheckedItems(new Set());

  const navigate = useNavigate();

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-sky-50 to bg-cyan-50 font-poppins">
      {/* Header */}
      <div className="shadow-sm p-4 sticky top-0 z-10 bg-white/80 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-4xl mx-auto ">
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-black rounded hover:bg-gray-100 transition"
              onClick={() => navigate(-1)}
              type="button"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              กลับ
            </button>
            <div>
              <h1 className="text-xl font-bold">{childInfo.name}</h1>
              <p className="text-sm text-gray-500">อายุ {childInfo.age}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <div className="text-2xl font-bold text-green-600">
                {checkedItems.size}/{items.length}
              </div>
              <div className="text-xs text-gray-500">ข้อ</div>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow transition"
              type="button"
            >
              <Save className="w-4 h-4 mr-2" />
              บันทึก
            </button>
          </div>
        </div>
      </div>

      {/* ปุ่มลัด */}
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-center space-x-4 mb-6">
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
        </div>

        {/* Sectioned List */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 ">
          {Object.entries(grouped).map(([short, group]) => (
            <div key={short} className="mb-5">
              {/* Section Header with gradient */}
              <div className={`
                flex items-center gap-2
                px-4 py-1 rounded-t-lg w-full border-gray-200
                shadow
                ${short === "GM" ? "bg-gradient-to-r from-sky-500 to-sky-200" :
                  short === "FM" ? "bg-gradient-to-r from-sky-500 to-sky-200" :
                  short === "RL" ? "bg-gradient-to-r from-sky-500 to-sky-200" :
                  short === "EL" ? "bg-gradient-to-r from-sky-500 to-sky-200" :
                  short === "PS" ? "bg-gradient-to-r from-sky-500 to-sky-200" :
                  "bg-gradient-to-r from-sky-500 to-sky-200"}
              `}>
                <span className="text-white text-lg font-medium drop-shadow">{group[0].category}</span>
              </div>
              {/* รายการในหมวด */}
<div className="grid">
  {group.map(({ question, idx }, j) => {
    const isLast = j === group.length - 1;
    const onlyOne = group.length === 1;
    
    const rounded =
      onlyOne
        ? "rounded-b-lg"
        : isLast
        ? "rounded-b-lg"
        : "";

    return (
      <div
        key={idx}
        onClick={() => toggleItem(idx)}
        className={`
          flex items-center space-x-4 p-5 cursor-pointer transition-all hover:shadow-md
          ${checkedItems.has(idx)
            ? "bg-green-100 border-2 border-green-300"
            : "bg-white border-2 border-gray-200 hover:border-gray-300"
          }
          ${rounded}
        `}
      >
        <div className="flex-shrink-0">
          {checkedItems.has(idx)
            ? <CheckCircle2 className="w-8 h-8 text-green-600" />
            : <Circle className="w-8 h-8 text-gray-400" />
          }
        </div>
        <div className="flex-1 items-center">
          <div className={`text-lg ${checkedItems.has(idx) ? "font-semibold text-green-700" : "text-gray-700"}`}>
            {question}
          </div>
        </div>
      </div>
    );
  })}
</div>

            </div>
          ))}
        </div>

        {/* สรุปผล */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-2">ผลการประเมิน</h3>
            <div className="text-4xl font-bold mb-2">
              {checkedItems.size} / {items.length}
            </div>
            <p className="text-blue-100">
              ข้อที่ทำได้ ({Math.round((checkedItems.size / items.length) * 100)}%)
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-lg transition"
              type="button"
            >
              <Save className="w-6 h-6 mr-3" />
              บันทึกการประเมิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
