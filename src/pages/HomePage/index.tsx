import Card from "../../components/Card";
import { useTranslation } from "react-i18next";

const HomePage = () => {
    const { t } = useTranslation();

    const programs = [
        {
            id: 1,
            room: "การ์ตูน",
            teacher: "วราพร",
            minAgeInMonths: 3,
            maxAgeInMonths: 18,
            participants: 25,
            rating: 4.8,
            image: "https://research.eef.or.th/wp-content/uploads/2022/07/kids-f-1024x683.jpg",
        },
        {
            id: 2,
            room: "ม้าน้ำ",
            teacher: "วรรณา",
            minAgeInMonths: 19,
            maxAgeInMonths: 30,
            participants: 25,
            rating: 4.9,
            image: "https://research.eef.or.th/wp-content/uploads/2022/07/kids-f-1024x683.jpg",
        },
        {
            id: 3,
            room: "โลมา",
            teacher: "วลีวัล",
            minAgeInMonths: 31,
            maxAgeInMonths: 48,
            participants: 25,
            rating: 4.7,
            image: "https://research.eef.or.th/wp-content/uploads/2022/07/kids-f-1024x683.jpg",
        },
    ];

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50">
            <div className="relative z-10 flex items-center justify-center h-auto w-full px-4">
                <main className="relative z-10 container mx-auto px-4 py-12 overflow-y-auto h-[100vh]">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                            {t("home.tracking_system")}
                        </div>
                        <h2 className="text-xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {t("home.select_classroom")}
                            <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                                {t("home.evaluation_prompt")}
                            </span>
                        </h2>
                        <p className="hidden md:block md:text-xl text-gray-600 max-w-2xl mx-auto whitespace-pre-line pr-20 pl-20">
                            {t("home.development_potential")}
                        </p>
                    </div>

                    {/* Programs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map((program) => (
                            <Card
                                key={program.id}
                                room={program.room}
                                teacher={program.teacher}
                                minAgeInMonths={program.minAgeInMonths}
                                maxAgeInMonths={program.maxAgeInMonths}
                                participants={program.participants.toString()}
                                rating={program.rating}
                                image={program.image}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
