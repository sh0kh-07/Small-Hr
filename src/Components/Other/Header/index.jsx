import {
    Navbar,
    Button,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import Logo from '../../../images/Logo.png'
import { NavLink } from "react-router-dom";

export default function Header() {
    const [openNav, setOpenNav] = useState(false);

    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false)
        );
    }, []);



    return (
        <div className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-7xl px-2">
            <Navbar className="sticky top-4 z-10 h-max max-w-full rounded-2xl border-2 border-white/20 bg-white/80 backdrop-blur-xl backdrop-saturate-200 py-1 px-2 shadow-lg">
                <div className="flex items-center justify-between text-blue-gray-900">
                    {/* Логотип слева */}
                    <NavLink to={'/'}>
                        <div className="flex items-center gap-2">
                            <img className="w-[120px]" src={Logo} alt="" />
                        </div>
                    </NavLink>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="text"
                            size="sm"
                            className=" lg:inline-flex items-center gap-2 rounded-lg text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Button>
                        <NavLink to={'/contact'}>
                            <Button
                                size="sm"
                                className=" lg:flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </Navbar>
        </div>
    );
}