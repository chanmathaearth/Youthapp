import { ArrowLeft, Save, Scale, Ruler, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WeightHeightForm = () => {
    const childInfo = {
        name: "น้องแอม",
        age: "2 ปี 6 เดือน",
        evaluationRound: 9,
        lastWeight: "12.5",
        lastHeight: "85",
        lastDate: "20/11/2024",
    };

    const handleSave = () => {
        alert(`บันทึกแล้ว! ประเมิน ข้อ`);
    };

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-sky-50 to bg-cyan-50 font-poppins">
            {/* Header */}
            <div className="shawdow-sm p-4 sticky top-0 z-10 bg-white/80 border-b border-slate-200">
                <div className="flex items-center justify-between max-w-4xl mx-auto ">
                    <div className="flex items-center space-x-4">
                        <button
                            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-black rounded hover:bg-gray-100 transition"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            กลับ
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">
                                {childInfo.name}
                            </h1>
                            <p className="text-sm text-gray-500">
                                อายุ {childInfo.age}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleSave}
                            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow transition"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>

            <main className="p-4 max-w-4xl mx-auto">
                {/* latest info */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex gap-2">
                        <TrendingUp className="w-5 h-6 text-gray-600" />
                        <span className="text-md font-bold mb-6">
                            ข้อมูลครั้งล่าสุด ({childInfo.lastDate})
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg">
                            <Scale className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                            <div className="text-2xl font-bold text-gray-900">
                                {childInfo.lastWeight}
                            </div>
                            <div className="text-sm text-gray-500">
                                กิโลกรัม
                            </div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                            <Ruler className="w-6 h-6 mx-auto mb-2 text-green-500" />
                            <div className="text-2xl font-bold text-gray-900">
                                {childInfo.lastHeight}
                            </div>
                            <div className="text-sm text-gray-500">
                                เซนติเมตร
                            </div>
                        </div>
                    </div>
                </div>
                {/* Measurement Form */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">
                        บันทึกการวัดครั้งใหม่
                    </h2>

                    {/* น้ำหนัก */}
                    <div className="space-y-3">
                        <label
                            htmlFor="weight"
                            className="text-lg font-medium text-gray-700 flex items-center space-x-2"
                        >
                            <Scale className="w-5 h-5 text-blue-500" />

                            <span>น้ำหนัก</span>
                        </label>
                        <div className="relative">
                            <input
                                id="weight"
                                type="number"
                                step="0.1"
                                placeholder="เช่น 13.2"
                                className="text-md h-16 pl-5 pr-20 border-2 border-blue-200 focus:border-blue-400 rounded-xl w-full"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                กก.
                            </span>
                        </div>
                    </div>

                    {/* ส่วนสูง */}
                    <div className="space-y-3 mt-2">
                        <label
                            htmlFor="height"
                            className="text-lg font-medium text-gray-700 flex items-center space-x-2"
                        >
                            <Ruler className="w-5 h-5 text-green-500" />

                            <span>ส่วนสูง</span>
                        </label>
                        <div className="relative">
                            <input
                                id="height"
                                type="number"
                                step="0.1"
                                placeholder="เช่น 87.5"
                                className="text-md h-16 pl-5 pr-20 border-2 border-blue-200 focus:border-blue-400 rounded-xl w-full"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                ซม.
                            </span>
                        </div>
                    </div>

                    {/* หมายเหตุ */}
                    <div className="space-y-3 mt-2">
                        <label
                            htmlFor="notes"
                            className="text-lg font-medium text-gray-700"
                        >
                            หมายเหตุ
                        </label>
                        <textarea
                            id="notes"
                            placeholder="บันทึกข้อสังเกตเพิ่มเติม..."
                            className="w-full h-24 p-4 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold shadow-lg rounded-2xl p-4 flex"
                        >
                            <Save className="w-6 h-6 mr-3" />
                            บันทึกการวัด
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WeightHeightForm;
