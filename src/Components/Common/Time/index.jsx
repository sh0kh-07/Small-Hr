import React, { useState, useEffect, useMemo } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Typography,
    Input,
    IconButton,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Select,
    Option,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { Plus, Trash2, Clock, CheckCircle2, CalendarDays, Edit2, AlertCircle, Filter } from "lucide-react";

export default function Time() {
    // Malumotlarni LocalStorage dan olish
    const [tasks, setTasks] = useState(() => {
        try {
            const saved = localStorage.getItem("workTimeTasks");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // Filter uchun state
    const [filterType, setFilterType] = useState("today"); // "today", "week", "month", "all"
    const [customDate, setCustomDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    // Modallar uchun state
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Qo'shish uchun state
    const [taskName, setTaskName] = useState("");
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");

    // Tahrirlash va o'chirish uchun joriy vazifa
    const [currentTask, setCurrentTask] = useState(null);
    const [editTaskName, setEditTaskName] = useState("");
    const [editHours, setEditHours] = useState("");
    const [editMinutes, setEditMinutes] = useState("");

    // O'zgarishlarni LocalStorage ga saqlash
    useEffect(() => {
        localStorage.setItem("workTimeTasks", JSON.stringify(tasks));
    }, [tasks]);

    // Filterlangan vazifalar
    const filteredTasks = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

            switch (filterType) {
                case "today":
                    return taskDay.getTime() === today.getTime();

                case "week": {
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 7);
                    return taskDate >= weekAgo;
                }

                case "month": {
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(today.getMonth() - 1);
                    return taskDate >= monthAgo;
                }

                case "custom":
                    if (!customDate) return true;
                    const selectedDate = new Date(customDate);
                    const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                    return taskDay.getTime() === selectedDay.getTime();

                case "all":
                default:
                    return true;
            }
        });
    }, [tasks, filterType, customDate]);

    // Filterlangan vazifalarning umumiy vaqti
    const filteredTotalMinutes = filteredTasks.reduce((sum, task) => sum + (task.hours * 60) + task.minutes, 0);
    const filteredTotalH = Math.floor(filteredTotalMinutes / 60);
    const filteredTotalM = filteredTotalMinutes % 60;

    // Barcha vazifalarning umumiy vaqti
    const allTotalMinutes = tasks.reduce((sum, task) => sum + (task.hours * 60) + task.minutes, 0);
    const allTotalH = Math.floor(allTotalMinutes / 60);
    const allTotalM = allTotalMinutes % 60;

    // Oyna ochish yopish funksiyalari
    const handleOpenAdd = () => setOpenAddModal(!openAddModal);

    const handleOpenEdit = (task) => {
        if (task) {
            setCurrentTask(task);
            setEditTaskName(task.name);
            setEditHours(task.hours === 0 ? "" : task.hours.toString());
            setEditMinutes(task.minutes === 0 ? "" : task.minutes.toString());
        }
        setOpenEditModal(!openEditModal);
    };

    const handleOpenDelete = (task) => {
        if (task) setCurrentTask(task);
        setOpenDeleteModal(!openDeleteModal);
    };

    const addTask = () => {
        if (!taskName.trim()) return;

        const h = parseInt(hours) || 0;
        const m = parseInt(minutes) || 0;

        // Agar soat ham, daqiqa ham kiritilmagan bo'lsa
        if (h === 0 && m === 0) return;

        const newTask = {
            id: Date.now().toString(),
            name: taskName.trim(),
            hours: h,
            minutes: m,
            createdAt: new Date().toISOString()
        };

        // Yangi vazifani ro'yxatning boshiga qo'shish
        setTasks([newTask, ...tasks]);

        // Formani tozalash va modalni yopish
        setTaskName("");
        setHours("");
        setMinutes("");
        handleOpenAdd();
    };

    const editTask = () => {
        if (!editTaskName.trim() || !currentTask) return;

        const h = parseInt(editHours) || 0;
        const m = parseInt(editMinutes) || 0;

        if (h === 0 && m === 0) return;

        setTasks(tasks.map(t => {
            if (t.id === currentTask.id) {
                return {
                    ...t,
                    name: editTaskName.trim(),
                    hours: h,
                    minutes: m
                };
            }
            return t;
        }));
        setOpenEditModal(false);
        setCurrentTask(null);
    };

    const deleteTask = () => {
        if (!currentTask) return;
        setTasks(tasks.filter(t => t.id !== currentTask.id));
        setOpenDeleteModal(false);
        setCurrentTask(null);
    };

    const formatDate = (isoString) => {
        const d = new Date(isoString);
        return d.toLocaleDateString('uz-Latn-UZ') + " " + d.toLocaleTimeString('uz-Latn-UZ', { hour: '2-digit', minute: '2-digit' });
    };

    // Filter nomini olish
    const getFilterLabel = () => {
        switch (filterType) {
            case "today": return "Bugun";
            case "week": return "Oxirgi 7 kun";
            case "month": return "Oxirgi 30 kun";
            case "custom": return "Tanlangan sana";
            case "all": return "Barcha vaqt";
            default: return "Bugun";
        }
    };

    return (
        <div className="w-full mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-center mt-1 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <Typography variant="h5" color="blue-gray" className="font-bold">
                    Ish Vaqti Hisoboti
                </Typography>
                <Button onClick={handleOpenAdd} color="blue" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Vazifa Qo'shish
                </Button>
            </div>

            {/* Filter qismi */}
            <Card className="w-full shadow-sm border border-gray-200">
                <CardBody className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex items-center gap-2 min-w-[150px]">
                            <Filter className="h-5 w-5 text-blue-600" />
                            <Typography className="font-medium text-gray-700">
                                Filtr:
                            </Typography>
                        </div>

                        <div className="flex flex-wrap gap-2 flex-1">
                            <Button
                                size="sm"
                                variant={filterType === "today" ? "gradient" : "outlined"}
                                color="blue"
                                onClick={() => setFilterType("today")}
                                className="rounded-full"
                            >
                                Bugun
                            </Button>
                            <Button
                                size="sm"
                                variant={filterType === "week" ? "gradient" : "outlined"}
                                color="blue"
                                onClick={() => setFilterType("week")}
                                className="rounded-full"
                            >
                                Oxirgi 7 kun
                            </Button>
                            <Button
                                size="sm"
                                variant={filterType === "month" ? "gradient" : "outlined"}
                                color="blue"
                                onClick={() => setFilterType("month")}
                                className="rounded-full"
                            >
                                Oxirgi 30 kun
                            </Button>
                            <Button
                                size="sm"
                                variant={filterType === "all" ? "gradient" : "outlined"}
                                color="blue"
                                onClick={() => setFilterType("all")}
                                className="rounded-full"
                            >
                                Hammasi
                            </Button>

                            <div className="relative ml-auto">
                                <Input
                                    type="date"
                                    value={customDate}
                                    onChange={(e) => {
                                        setCustomDate(e.target.value);
                                        setFilterType("custom");
                                    }}
                                    className="w-full"
                                    label="Sana tanlash"
                                />
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Umumiy vaqt ma'lumoti */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="w-full shadow-md border border-blue-50">
                    <CardBody className="p-4 flex items-center gap-3 bg-blue-50/50 rounded-xl">
                        <Clock className="h-6 w-6 text-blue-600" />
                        <Typography className="font-medium text-blue-800 text-lg">
                            {getFilterLabel()} фильтри бўйича: <span className="font-bold text-blue-900">
                                {filteredTotalH} soat {filteredTotalM > 0 ? `${filteredTotalM} daqiqa` : ''}
                            </span>
                        </Typography>
                    </CardBody>
                </Card>

                {filterType !== "all" && (
                    <Card className="w-full shadow-md border border-gray-100">
                        <CardBody className="p-4 flex items-center gap-3 bg-gray-50 rounded-xl">
                            <Clock className="h-6 w-6 text-gray-600" />
                            <Typography className="font-medium text-gray-700 text-lg">
                                Умумий сарфланган вақт: <span className="font-bold text-gray-900">
                                    {allTotalH} soat {allTotalM > 0 ? `${allTotalM} daqiqa` : ''}
                                </span>
                            </Typography>
                        </CardBody>
                    </Card>
                )}
            </div>

            {/* Qo'shish Modali */}
            <Dialog open={openAddModal} handler={handleOpenAdd} size="sm">
                <DialogHeader>Yangi vazifa qo'shish</DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Nima ish qilindi?"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        icon={<CheckCircle2 className="h-4 w-4" />}
                    />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                            type="number"
                            label="Soat"
                            min="0"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            icon={<Clock className="h-4 w-4" />}
                            className="w-full"
                        />
                        <Input
                            type="number"
                            label="Daqiqa"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            icon={<Clock className="h-4 w-4" />}
                            onKeyPress={(e) => e.key === 'Enter' && addTask()}
                            className="w-full"
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleOpenAdd} className="mr-1">
                        Bekor qilish
                    </Button>
                    <Button
                        variant="gradient"
                        color="blue"
                        onClick={addTask}
                        disabled={!taskName.trim() || (!hours && !minutes)}
                    >
                        Qo'shish
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Tahrirlash Modali */}
            <Dialog open={openEditModal} handler={() => setOpenEditModal(false)} size="sm">
                <DialogHeader>Vazifani tahrirlash</DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Nima ish qilindi?"
                        value={editTaskName}
                        onChange={(e) => setEditTaskName(e.target.value)}
                        icon={<CheckCircle2 className="h-4 w-4" />}
                    />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                            type="number"
                            label="Soat"
                            min="0"
                            value={editHours}
                            onChange={(e) => setEditHours(e.target.value)}
                            icon={<Clock className="h-4 w-4" />}
                            className="w-full"
                        />
                        <Input
                            type="number"
                            label="Daqiqa"
                            min="0"
                            max="59"
                            value={editMinutes}
                            onChange={(e) => setEditMinutes(e.target.value)}
                            icon={<Clock className="h-4 w-4" />}
                            onKeyPress={(e) => e.key === 'Enter' && editTask()}
                            className="w-full"
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setOpenEditModal(false)} className="mr-1">
                        Bekor qilish
                    </Button>
                    <Button
                        variant="gradient"
                        color="blue"
                        onClick={editTask}
                        disabled={!editTaskName.trim() || (!editHours && !editMinutes)}
                    >
                        Saqlash
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* O'chirish Modali */}
            <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(false)} size="xs">
                <DialogHeader className="text-red-500 gap-2">
                    <AlertCircle className="h-6 w-6" /> O'chirishni tasdiqlang
                </DialogHeader>
                <DialogBody>
                    Siz chindan ham <span className="font-bold text-black">"{currentTask?.name}"</span> vazifasini o'chirib tashlamoqchimisiz?
                    Bu harakatni qaytarib bo'lmaydi.
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="blue-gray" onClick={() => setOpenDeleteModal(false)} className="mr-1">
                        Yo'q, bekor qilish
                    </Button>
                    <Button variant="gradient" color="red" onClick={deleteTask}>
                        Ha, o'chirish
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Bajarilgan ishlar ro'yxati */}
            <div className="flex flex-col gap-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <Typography className="text-gray-400 italic">
                            {filterType === "all"
                                ? "Hozircha vazifalar kiritilmagan."
                                : `${getFilterLabel()} kunida vazifalar mavjud emas.`}
                        </Typography>
                        <Button
                            onClick={handleOpenAdd}
                            color="blue"
                            variant="text"
                            className="mt-4 flex items-center gap-2 mx-auto"
                        >
                            <Plus className="h-4 w-4" /> Yangi vazifa qo'shish
                        </Button>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <Card key={task.id} className="border border-gray-200 shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
                            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex flex-col gap-1 w-full sm:w-auto flex-1 pr-4">
                                    <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="break-words leading-tight">{task.name}</span>
                                    </Typography>
                                    <Typography variant="small" className="text-gray-500 flex items-center gap-1.5 sm:ml-7 mt-1 sm:mt-0">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        {formatDate(task.createdAt)}
                                    </Typography>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto justify-between shrink-0 sm:pl-0 mt-2 sm:mt-0">
                                    <div className="bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 flex-shrink-0">
                                        <Typography className="text-sm font-bold text-blue-800 flex items-center gap-1.5 whitespace-nowrap">
                                            <Clock className="h-4 w-4" />
                                            {task.hours > 0 ? `${task.hours} soat ` : ''}
                                            {task.minutes > 0 ? `${task.minutes} daqiqa` : ''}
                                        </Typography>
                                    </div>
                                    <div className="flex gap-1 shrink-0 self-end sm:self-auto">
                                        <IconButton variant="text" color="blue" size="sm" onClick={() => handleOpenEdit(task)}>
                                            <Edit2 className="h-4 w-4" />
                                        </IconButton>
                                        <IconButton variant="text" color="red" size="sm" onClick={() => handleOpenDelete(task)}>
                                            <Trash2 className="h-5 w-5" />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}