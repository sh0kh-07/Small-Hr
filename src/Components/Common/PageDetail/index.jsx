import { useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

export default function PageDetail() {
    const [showPhone, setShowPhone] = useState(false);

    // Restoran ma'lumotlari
    const restaurant = {
        id: 1,
        name: "Dilxush",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        images: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1579684947550-22e945225d9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        description: "Grand Restaurant - bu O'zbekistonning eng yirik restoranlaridan biri. Bu yerda siz milliy taomlar, Yevropa oshxonasi va boshqa ko'plab taomlarni tatib ko'rishingiz mumkin.",
        fullDescription: "Restoran 2010-yildan beri faoliyat yuritadi. 500 kishiga mo'ljallangan zal, alohida VIP xonalar, yozgi terassa mavjud. Eng muhimi, professional oshpazlar tomonidan tayyorlangan mazali taomlar. Bizda har hafta jonli musiqa kechalari tashkil etiladi.",
        phone: "+998 90 123 45 67",
        phone2: "+998 91 123 45 67",
        address: "Toshkent sh., Yunusobod tumani, Amir Temur ko'chasi, 15-uy",
        workingHours: "09:00 - 23:00 (har kuni)",
        rating: 4.8,
        reviews: 234,
        website: "www.grandrestaurant.uz",
        email: "info@grandrestaurant.uz",
        features: [
            "Wi-Fi",
            "Parkovka",
            "Bolalar uchun joy",
            "VIP xonalar",
            "Biznes lunch",
            "Banketlar"
        ]
    };

    const handleShowPhone = () => {
        setShowPhone(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">

                {/* Asosiy rasm va galereya */}
                <div className="mb-8">
                    <Card className="overflow-hidden border-0 shadow-xl">
                        <div className="relative h-[400px] md:h-[500px]">
                            <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Restoran nomi va reyting */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                <Typography variant="h1" className="font-bold text-3xl md:text-5xl mb-2">
                                    {restaurant.name}
                                </Typography>

                            </div>
                        </div>
                    </Card>
                </div>


                {/* Asosiy ma'lumotlar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chap qism - Asosiy ma'lumotlar */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardBody className="p-6">
                                <Typography variant="h4" className="font-bold text-gray-800 mb-4">
                                    Restoran haqida
                                </Typography>
                                <Typography className="text-gray-600 mb-4">
                                    {restaurant.description}
                                </Typography>
                                <Typography className="text-gray-600">
                                    {restaurant.fullDescription}
                                </Typography>
                            </CardBody>
                        </Card>

                        {/* Manzil va xarita */}
                        <Card className="border-0 shadow-lg">
                            <CardBody className="p-6">
                                <Typography variant="h4" className="font-bold text-gray-800 mb-4">
                                    Manzil
                                </Typography>
                                <div className="flex items-start gap-3 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <Typography className="text-gray-600">
                                        {restaurant.address}
                                    </Typography>
                                </div>
                                {/* Xarita placeholder */}
                                <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">
                                    Xarita integratsiyasi uchun joy
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* O'ng qism - Kontakt ma'lumotlari */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg sticky top-24">
                            <CardBody className="p-6">
                                <Typography variant="h4" className="font-bold text-gray-800 mb-4">
                                    Kontaktlar
                                </Typography>



                                {/* Telefon 2 */}
                                <div className="mb-6">
                                    <Typography className="text-sm text-gray-500 mb-1">
                                        Telefon 1
                                    </Typography>
                                    <Button
                                        onClick={() => window.location.href = `tel:${restaurant.phone2}`}
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        Qo'ng'iroq qilish
                                    </Button>
                                </div>
                                <div className="mb-6">
                                    <Typography className="text-sm text-gray-500 mb-1">
                                        Telefon 2
                                    </Typography>
                                    <Button
                                        onClick={() => window.location.href = `tel:${restaurant.phone2}`}
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        Qo'ng'iroq qilish
                                    </Button>
                                </div>

                                {/* Qo'shimcha ma'lumotlar */}
                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                                        </svg>
                                        <Typography className="text-gray-600">
                                            {restaurant.email}
                                        </Typography>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.148.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                                        </svg>
                                        <Typography className="text-gray-600">
                                            {restaurant.website}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Yo'nalish olish tugmasi */}
                                <Button
                                    className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    Yo'nalish olish
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}