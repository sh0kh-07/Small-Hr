import { Card, CardBody, Typography } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

export default function FirstPage() {
    const categories = [
        {
            id: 1,
            name: "Maxsulotlar, xizmatlar",
            image: "https://cdn.xabardor.uz/media/photo/2022/10/20/news_photo-20221031-145815.webp",
        },
        {
            id: 2,
            name: "Tashkilot telefon raqamlari",
            image: "https://static.norma.uz/images/143805_f5156eca3559181dd4f4c0d08782.png",
        },
        {
            id: 3,
            name: "Reklama maydoni",
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            id: 5,
            name: "Ish bandligi",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR35OH5E5A3yMzKZanIkruRX5ZZ0PVnU_3gAQ&s",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Kategoriyalar grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {categories.map((category) => (
                        <NavLink to={`/home`} key={category.id}>
                            <Card
                                className="group relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-0"
                            >
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-[#2626267c] group-hover:opacity-90 group-hover:bg-[#0000000f] transition-opacity duration-500" />
                                </div>
                                {/* Content - с адаптивной высотой */}
                                <CardBody className="relative z-10 text-center p-4 sm:p-8 min-h-[150px] sm:min-h-[280px] flex flex-col items-center justify-center">
                                    <Typography
                                        variant="h2"
                                        className="font-bold !text-white relative z-[1000] mb-2 text-shadow-lg text-lg sm:text-2xl lg:text-4xl"
                                    >
                                        {category.name}
                                    </Typography>
                                </CardBody>
                            </Card>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}