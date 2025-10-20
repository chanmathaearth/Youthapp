import { useState } from "react";
import LanguageToggle from "./languageSwitcher";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getRole } from "../utils/authen";

const Topbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const onToggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const role = getRole();

    const handleLogout = () => {
        Swal.fire({
            icon: "success",
            title: "Logged out",
            text: "You have been logged out successfully.",
            showConfirmButton: false,
            timer: 1500,
        });

        // clear token
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
   
        // redirect
        setTimeout(() => navigate("/login"), 1600);

        console.log("logout clicked");
    };

    return (
        <header className="sticky top-0 bg-white/80 bg-gradient-to-r backdrop-blur-md shadow-sm font-poppins z-50 p-2 md:p-0">
            <nav className="flex justify-between items-center w-[90%] mx-auto  relative">
                {/* Logo */}
                <div className="font-medium text-2xl">
                    <button onClick={() => navigate("/")}>YOUTHAPP</button>
                </div>
                {/* Nav links */}
                <div
                    className={`${
                        isOpen ? "flex" : "hidden"
                    } md:flex flex-col md:flex-row fixed md:static top-full left-0 w-full h-[25vh] md:p-6 md:gap-4 md:w-auto md:h-auto bg-white md:bg-transparent z-40 items-center justify-center px-5 py-5 transition-all duration-300 ease-in-out`}
                >
                    <ul className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-gray-700 text-center w-full">
                        <li className="hover:text-blue-500 transition-all">
                            <button
                                className="font-medium text-xl"
                                onClick={() => navigate("/")}
                            >
                                {t("topbar.homepage")}
                            </button>
                        </li>
                        { role == "admin" && (<li className="hover:text-blue-500 transition-all">
                            <button
                                className="font-medium text-xl"
                                onClick={() => navigate("/admin/dashboard")}
                            >
                                {t("topbar.dashboard")}
                            </button>
                        </li>)}
                        
                        {/* Mobile only logout */}
                        <li className="md:hidden">
                            <button
                                onClick={handleLogout}
                                className="bg-[#393939] text-white px-5 py-3 rounded-full whitespace-nowrap"
                            >
                                {t("topbar.signout")}
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="flex items-center gap-6">
                    {/* Desktop only logout */}
                    <button
                        onClick={handleLogout}
                        className="bg-[#393939] hover:bg-blue-500 text-white px-5 py-3 rounded-full hidden md:block"
                    >
                        {t("topbar.signout")}
                    </button>
                    <LanguageToggle />
                    { role === "admin" && (
                        <button onClick={() => navigate("/admin/settings")}>
                        <svg
                            className="w-8 h-8 text-gray-800 hover:text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"
                            />
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                            />
                        </svg>
                    </button>
                ) 
                }
                    

                    {/* Hamburger menu */}
                    <div
                        onClick={onToggleMenu}
                        className="text-xl cursor-pointer md:hidden z-50 w-full"
                    >
                        {isOpen ? (
                            <svg
                                className="w-7 h-7 text-red-300"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-8 h-8 text-gray-800"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Topbar;
