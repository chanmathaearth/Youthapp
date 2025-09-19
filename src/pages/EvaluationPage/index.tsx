import { useState } from "react";
import { useTranslation } from "react-i18next";
import calendar from "../../assets/calendar.svg";
import user from "../../assets/user.svg";
import Table_ from "../../components/Table";
import Modal from "../../components/AddChildModal";
import StatCard from "../../components/StatCard";
import circlecheck from "../../assets/circlecheck.svg";
import alert from "../../assets/alert.svg";

const rows = [
    {
        id: 1,
        room: "ห้องการ์ตูน",
        name: "น้องแอม",
        age: "2 ปี 6 เดือน",
        status: "success",
        round: 1,
        date: "15/12/2024",
        next: 2,
    },
    {
        id: 2,
        room: "ห้องม้าน้ำ",
        name: "น้องบอล",
        age: "2 ปี 6 เดือน",
        status: "hold",
        round: 1,
        date: "15/12/2024",
        next: 2,
    },
    {
        id: 3,
        room: "ห้องโลมา",
        name: "น้องบีม",
        age: "2 ปี 6 เดือน",
        status: "hold",
        round: 1,
        date: "15/12/2024",
        next: 2,
    },
];

const EvaluationPage = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleClick = () => {
        handleClose();
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-r from-blue-50 via-sky-50 to bg-cyan-50 font-poppins">
            {open && (
                <Modal
                    message="ฟอร์มเพิ่มรายชื่อ"
                    onClick={handleClick}
                    onClose={handleClose}
                />
            )}

            <div className="relative z-10 flex items-center justify-center h-auto w-full px-4">
                <main className="relative z-10 container mx-auto px-4 py-12 overflow-y-auto h-[100vh]">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-8">
                            <button
                                onClick={() => handleOpen()}
                                className="bg-gradient-to-r from-blue-500 to-sky-500  text-white px-5 py-3 transition delay-150 duration-300 rounded-xl hover:scale-105 text-xl"
                            >
                                เพิ่มรายชื่อ
                            </button>
                        </div>
                        <h2 className="text-xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {t("evaluation.select_name")}
                            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                                {t("evaluation.evaluation_prompt")}
                            </span>
                        </h2>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-600 text-lg font-medium">
                            <div className="flex items-center gap-2">
                                <img src={calendar} className="w-6 h-6"></img>
                                <span>วันที่อัปเดต : 21/12/2024</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src={user} className="w-6 h-6"></img>

                                <span>จำนวนเด็ก: 6 คน</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row mb-10 justify-center gap-12 md:ml-40 md:mr-40 items-center ">
                        <StatCard
                            value={3}
                            label="เสร็จสิ้น"
                            icon={circlecheck}
                            color="#22c55e"
                        />
                        <StatCard
                            value={2}
                            label="รอประเมิน"
                            icon={alert}
                            color="#f97316"
                        />
                    </div>
                    <div>
                        <Table_ childrenList={rows} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EvaluationPage;
