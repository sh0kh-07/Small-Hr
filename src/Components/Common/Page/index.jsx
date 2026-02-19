import { Card, CardBody, Typography } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

export default function Page() {

    const categories = [
        {
            id: 1,
            name: "Dilxush",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            id: 2,
            name: "Mingchinior ",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            id: 3,
            name: "Bek",
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Kategoriyalar grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                    {categories.map((category) => (
                        <NavLink to={`/page/detail`} key={category.id}>
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
                                <CardBody className="relative z-10 text-left p-4 sm:p-8 min-h-[150px] xs:min-h-[180px] sm:min-h-[240px] md:min-h-[280px] flex flex-col items-start justify-end">
                                    <Typography
                                        variant="h3"
                                        className="font-bold !text-white relative z-[1000] mb-2 text-shadow-lg text-[20px] xs:text-lg sm:text-xl lg:text-2xl"
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
    )
}