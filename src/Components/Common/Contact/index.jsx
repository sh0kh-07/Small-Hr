import { useState } from "react";
import { Card, CardBody, Typography, Button, Input, Textarea } from "@material-tailwind/react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: ""
    });

    const [showPhone, setShowPhone] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Formani yuborish logikasi
        console.log("Form yuborildi:", formData);
        alert("Xabaringiz uchun rahmat! Tez orada siz bilan bog'lanamiz.");
        // Formani tozalash
        setFormData({
            name: "",
            phone: "",
            message: ""
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header qismi */}
                <div className="text-center mb-2">
                    <Typography
                        variant="h1"
                        className="font-bold text-gray-800 text-4xl md:text-5xl mb-4"
                    >
                        Biz bilan bog'lanish
                    </Typography>
                    <Typography
                        variant="lead"
                        className="text-gray-600 max-w-2xl mx-auto"
                    >
                        Savollaringiz bormi? Quyidagi formani to'ldiring va yuboring.
                    </Typography>
                </div>

                {/* Asosiy kontakt form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <Card className="border-0 shadow-lg col-span-2">
                        <CardBody className="p-4">
                            <Typography variant="h3" className="font-bold text-gray-800 mb-6">
                                Xabar yuborish
                            </Typography>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        label="Ismingiz"
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        label="Telefon raqamingiz"
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        label="Xabaringiz"
                                        className="w-full min-h-[150px]"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                                >
                                    Xabarni yuborish
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}