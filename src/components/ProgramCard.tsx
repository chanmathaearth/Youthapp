import React from "react";
import { Clock, GraduationCap, Users } from "lucide-react";
import Button from "./Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { TFunction } from "i18next";


interface Teacher {
  id: number;
  staff: string;
  is_homeroom: boolean;
  room_name: string;
  assigned_at: string;
  unassigned_at: string | null;
}

interface CardProps {
  id: number;              
  name: string;            
  teachers: Teacher[];    
  minAge: number;          
  maxAge: number;          
  childrenCount: number;  
  image?: string;         
}


const Card: React.FC<CardProps> = ({
    id,
    name,
    minAge,
    maxAge,
    childrenCount,
    // image,
    teachers,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleChoose = (room: string) => {
        navigate(`/rooms/${room}/evaluations`);
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

    const ageRangeText = formatAgeRange(minAge, maxAge, t);

    return (
        <div className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 overflow-hidden p-6 rounded-2xl overflow-y-auto">
            <div className="flex justify-center ">
                <div className="aspect-video overflow-hidden relative w-full">
                    <img
                        className="rounded-2xl object-cover w-full h-full group-hover:scale-110 transition-all duration-300"
                        src="https://plus.unsplash.com/premium_photo-1663106423058-c5242333348c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJlc2Nob29sfGVufDB8fDB8fHww"
                        alt={name}
                    />
                </div>
            </div>

            <div className="pb-2 pt-4 pl-4">
                <div className="flex items-center gap-2 pb-1">
                    {/* <School className="w-4 h-4 text-blue-500" /> */}
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                        {t("programs.room", { name })}
                    </h3>
                </div>
                <div className="flex items-center space-x-1">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">
                        {t("programs.teacher")}:{" "}
                        {teachers.length > 0 ? teachers.map(t => t.staff).join(", ") : "-"}
                    </span>
                </div>
            </div>

            <div className="pl-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex md:block items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span> {t("programs.age_range", { range: ageRangeText, })} </span>
                        </div>
                        <div className="flex items-center space-x-1 md:mt-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span>
                                {t("programs.participants", { count: childrenCount })}
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => handleChoose(String(id))}
                    className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                    {t("programs.evaluate")}
                </Button>
            </div>
        </div>
    );
};

export default Card;
