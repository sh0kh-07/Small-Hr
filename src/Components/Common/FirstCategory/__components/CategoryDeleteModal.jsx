import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import { useDeleteCategoryMutation } from "../../../../store/services/category.api";
import { Alert } from "../../../Other/UI/Alert/Alert";

export function CategoryDeleteModal({ open, handleOpen, categoryId }) {
    const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

    const handleDelete = async () => {
        try {
            await deleteCategory(categoryId).unwrap();
            Alert("Kategoriya o'chirildi", "success");
            handleOpen();
        } catch (err) {
            Alert(err.data?.message || "Xatolik yuz berdi", "error");
        }
    };

    return (
        <Dialog open={open} handler={handleOpen} size="sm" className="rounded-2xl">
            <DialogHeader>O'chirishni tasdiqlash</DialogHeader>
            <DialogBody>
                <Typography color="gray" className="font-normal">
                    Haqiqatan ham ushbu kategoriyani o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
                </Typography>
            </DialogBody>
            <DialogFooter className="gap-2">
                <Button variant="text" color="blue-gray" onClick={handleOpen} disabled={isLoading}>
                    Bekor qilish
                </Button>
                <Button variant="gradient" color="red" onClick={handleDelete} loading={isLoading}>
                    O'chirish
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
