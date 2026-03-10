import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
} from "@material-tailwind/react";
import { useUpdateCategoryMutation } from "../../../../store/services/category.api";
import { Alert } from "../../../Other/UI/Alert/Alert";

export function CategoryEditModal({ open, handleOpen, category }) {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

    useEffect(() => {
        if (category) {
            setTitle(category.title);
            setImage(null);
        }
    }, [category]);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        if (image) {
            formData.append("image", image);
        }

        try {
            await updateCategory({ id: category.id, formData }).unwrap();
            Alert("Kategoriya muvaffaqiyatli yangilandi", "success");
            handleOpen();
        } catch (err) {
            Alert(err.data?.message || "Xatolik yuz berdi", "error");
        }
    };

    return (
        <Dialog open={open} handler={handleOpen} size="sm" className="rounded-2xl">
            <form onSubmit={handleSubmit}>
                <DialogHeader className="flex flex-col items-start gap-1">
                    <Typography variant="h4" color="blue-gray">
                        Kategoriyani tahrirlash
                    </Typography>
                </DialogHeader>
                <DialogBody className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Kategoriya nomi
                        </Typography>
                        <Input
                            size="lg"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Kategoriya rasmi (tanlash ixtiyoriy)
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                        />
                    </div>
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button variant="text" color="red" onClick={handleOpen} disabled={isLoading}>
                        Bekor qilish
                    </Button>
                    <Button variant="gradient" color="blue" type="submit" loading={isLoading}>
                        Yangilash
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
