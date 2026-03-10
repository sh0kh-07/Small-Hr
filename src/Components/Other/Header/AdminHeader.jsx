import React, { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown, Menu, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

export default function AdminHeader({ active, sidebarOpen, ...props }) {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // Закрытие меню при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className="fixed top-[10px] z-30 flex justify-between items-center px-6 py-2 rounded-2xl border border-gray-100 shadow-sm bg-white/80 backdrop-blur-md transition-all duration-500"
            style={{
                width: sidebarOpen ? "calc(100% - 250px)" : "calc(100% - 100px)",
                left: sidebarOpen ? "245px" : "105px",
            }}
        >
            {/* Левая часть - кнопка меню и назад */}
            <div className="flex items-center gap-[12px]">
                <button
                    onClick={active}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all duration-300"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="h-4 w-px bg-gray-200"></div>
                {/* <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all duration-300 flex items-center gap-2 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Orqaga</span>
                </button> */}
            </div>

            {/* Правая часть - профиль */}
            <div className="flex items-center gap-4">
                <div className="relative flex items-center gap-4" ref={menuRef}>
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-all duration-300 text-sm font-medium text-gray-700"
                    >
                        <div className="p-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
                            <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="hidden sm:block"></span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openMenu ? "rotate-180" : ""}`} />
                    </button>

                    {/* Выпадающее меню */}
                    {openMenu && (
                        <div className="absolute right-0 top-14 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                            {/* <button
                                onClick={() => navigate("/admin/profile")}
                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                <span>Profil</span>
                            </button> */}
                            <div className="h-px my-1 bg-gray-100"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 transition-all duration-200 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Chiqish</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}