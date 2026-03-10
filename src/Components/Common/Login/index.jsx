import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { setAuth } from "../../../store/slices/auth.slice";
import { useLoginMutation } from "../../../store/services/auth.api";
import { Alert } from "../../Other/UI/Alert/Alert";
import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Login() {
    const [phone, setPhone] = useState("+998");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ phone, password }).unwrap();

            const { newUser, tokens } = response;

            dispatch(setAuth({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                user: newUser
            }));

            Alert("Tizimga muvaffaqiyatli kirdingiz", "success");
            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
            Alert(err.data?.message || "Login yoki parol xato", "error");
        }
    };
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 font-sans">
            <Card className="w-full max-w-md p-8 sm:p-10 shadow-xl border border-gray-100 bg-white rounded-2xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <Typography
                        variant="h4"
                        className="font-bold text-gray-800 mb-2"
                    >
                        Tizimga kirish
                    </Typography>
                    <Typography className="text-sm text-gray-500">
                        Hisobingizga kirish uchun ma'lumotlarni kiriting
                    </Typography>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Phone */}
                    <div className="flex flex-col gap-2">

                        <Input
                            size="lg"
                            label="Telefon raqami"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2 relative" >
                        <Input
                            type={showPassword ? "text" : "password"}
                            size="lg"
                            label="Parol"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div
                            className="absolute right-4 top-3 cursor-pointer text-gray-400 hover:text-black transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </div>
                    </div>

                    {/* Button */}
                    <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        className="rounded-xl bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 py-3 text-sm font-semibold tracking-wide flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Kirish"
                        )}
                    </Button>
                </form>

            </Card>
        </div>
    );
}
