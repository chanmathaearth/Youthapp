import React from "react";
import { Clock, GraduationCap, School, Users } from "lucide-react";
import Button from "./Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface CardProps {
    room: string;
    teacher: string;
    minAgeInMonths: number;
    maxAgeInMonths: number;
    participants: string;
    image: string;
    rating: number;
}

const Card: React.FC<CardProps> = ({
    room,
    minAgeInMonths,
    maxAgeInMonths,
    participants,
    image,
    teacher,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleChoose = (room: string) => {
        navigate(`/evaluation/${room}`);
    };

    const formatAgeRange = (min: number, max: number, t: TFunction): string => {
        const format = (months: number): string => {
            if (months < 12) return t("age.months_only", { count: months });

            const year = Math.floor(months / 12);
            const month = months % 12;

            if (month === 0) return t("age.years_only", { count: year });

            return t("age.years_months", { y: year, m: month });
        };

        return `${format(min)} ${t("age.to")} ${format(max)}`;
    };

    const ageRangeText = formatAgeRange(minAgeInMonths, maxAgeInMonths, t);

    return (
        <div className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 overflow-hidden p-6 rounded-2xl overflow-y-auto">
            <div className="flex justify-center ">
                <div className="aspect-video overflow-hidden relative w-full">
                    <img
                        className="rounded-2xl object-cover w-full h-full group-hover:scale-110 transition-all duration-300"
                        src={image || "/placeholder.svg"}
                        alt={room}
                    />
                </div>
            </div>

            <div className="pb-2 pt-4 pl-4">
                <div className="flex items-center gap-2 pb-1">
                    {/* <School className="w-4 h-4 text-blue-500" /> */}
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                        {t("programs.room", { room })}
                    </h3>
                </div>
                <div className="flex items-center space-x-1">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">
                        {t("programs.teacher")}
                        {teacher}
                    </span>
                </div>
            </div>

            <div className="pl-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex md:block items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>
                                {t("programs.age_range", {
                                    range: ageRangeText,
                                })}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1 md:mt-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span>
                                {t("programs.participants", { participants })}
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => handleChoose(room)}
                    className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                    {t("programs.evaluate")}
                </Button>
            </div>
        </div>
    );
};

export default Card;
