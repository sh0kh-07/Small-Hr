import {
    Navbar,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";

export default function NavBar() {
    const [openNav, setOpenNav] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false)
        );
    }, []);

    const goBack = () => {
        navigate(-1);
    };

    const goForward = () => {
        navigate(1);
    };

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto max-w-7xl px-2">
            <Navbar className="sticky top-4 z-10 h-max max-w-full rounded-2xl border-2 border-white/20 bg-white/80 backdrop-blur-xl backdrop-saturate-200 py-2 px-4 shadow-lg">
                <div className="flex items-center justify-between text-blue-gray-900">
                    {/* Chap tomonda - Orqaga */}
                    <IconButton
                        variant="text"
                        onClick={goBack}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </IconButton>

                    {/* Markazda - Bosh sahifa */}
                    <IconButton
                        variant="text"
                        size="lg"
                        onClick={goHome}
                        className="rounded-full bg-blue-500/10 hover:bg-blue-500/20"
                    >
                        <Home className="h-5 w-5" />
                    </IconButton>

                    {/* O'ng tomonda - Oldinga */}
                    <IconButton
                        variant="text"
                        onClick={goForward}
                        className="rounded-full"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </IconButton>
                </div>
            </Navbar>
        </div>
    );
}