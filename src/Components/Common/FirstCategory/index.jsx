import React, { useState, useEffect } from "react";
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
} from "@material-tailwind/react";
import { Plus, Trash2, UserPlus, MapPin, Phone, PhoneOff, PhoneMissed, Minus, Edit2, AlertCircle, RefreshCw } from "lucide-react";

export default function FirstCategory() {
    // Инициализация из LocalStorage или пустой массив
    const [workers, setWorkers] = useState(() => {
        try {
            const saved = localStorage.getItem("callWorkersReport");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // Состояния для модальных окон
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Состояния данных
    const [newWorkerName, setNewWorkerName] = useState("");
    const [currentWorker, setCurrentWorker] = useState(null);
    const [editWorkerName, setEditWorkerName] = useState("");
    const [newRegionNames, setNewRegionNames] = useState({});

    // Сохранение при каждом изменении workers
    useEffect(() => {
        localStorage.setItem("callWorkersReport", JSON.stringify(workers));
    }, [workers]);

    // Обработчики для Добавления оператора
    const handleOpenAdd = () => setOpenAddModal(!openAddModal);
    const addWorker = () => {
        if (!newWorkerName.trim()) return;
        const newWorker = {
            id: Date.now().toString(),
            name: newWorkerName.trim(),
            regions: []
        };
        setWorkers([...workers, newWorker]);
        setNewWorkerName("");
        handleOpenAdd();
    };

    // Обработчики для Редактирования оператора
    const handleOpenEdit = (worker) => {
        if (worker) {
            setCurrentWorker(worker);
            setEditWorkerName(worker.name);
        }
        setOpenEditModal(!openEditModal);
    };
    const editWorker = () => {
        if (!editWorkerName.trim() || !currentWorker) return;
        setWorkers(workers.map(w => {
            if (w.id === currentWorker.id) {
                return { ...w, name: editWorkerName.trim() };
            }
            return w;
        }));
        setOpenEditModal(false);
        setCurrentWorker(null);
    };

    // Обработчики для Удаления оператора
    const handleOpenDelete = (worker) => {
        if (worker) setCurrentWorker(worker);
        setOpenDeleteModal(!openDeleteModal);
    };
    const deleteWorker = () => {
        if (!currentWorker) return;
        setWorkers(workers.filter(w => w.id !== currentWorker.id));
        setOpenDeleteModal(false);
        setCurrentWorker(null);
    };

    const addRegion = (workerId) => {
        const regionName = newRegionNames[workerId];
        if (!regionName || !regionName.trim()) return;

        setWorkers(workers.map(w => {
            if (w.id === workerId) {
                return {
                    ...w,
                    regions: [
                        ...w.regions,
                        {
                            id: Date.now().toString(),
                            name: regionName.trim(),
                            answered: 0,
                            notAnswered: 0,
                            notWorking: 0,
                            changedNumber: 0 // 4-й критерий
                        }
                    ]
                };
            }
            return w;
        }));
        setNewRegionNames({ ...newRegionNames, [workerId]: "" });
    };

    const deleteRegion = (workerId, regionId) => {
        setWorkers(workers.map(w => {
            if (w.id === workerId) {
                return {
                    ...w,
                    regions: w.regions.filter(r => r.id !== regionId)
                };
            }
            return w;
        }));
    };

    const updateStat = (workerId, regionId, field, amount) => {
        setWorkers(workers.map(w => {
            if (w.id === workerId) {
                return {
                    ...w,
                    regions: w.regions.map(r => {
                        if (r.id === regionId) {
                            return {
                                ...r,
                                [field]: Math.max(0, (r[field] || 0) + amount) // Не даем уйти в минус
                            };
                        }
                        return r;
                    })
                };
            }
            return w;
        }));
    };

    return (
        <div className="mx-auto flex flex-col gap-8">
            <div className="flex justify-between items-center mt-1 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <Typography variant="h5" color="blue-gray" className="font-bold">
                    Call-Markaz Hisoboti
                </Typography>
                <Button onClick={handleOpenAdd} color="blue" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" /> Operator Qo'shish
                </Button>
            </div>

            {/* Модалка Добавления оператора */}
            <Dialog open={openAddModal} handler={handleOpenAdd} size="xs">
                <DialogHeader>Yangi operator qo'shish</DialogHeader>
                <DialogBody>
                    <Input
                        label="Operatorning ismini kiriting"
                        value={newWorkerName}
                        onChange={(e) => setNewWorkerName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addWorker()}
                        icon={<UserPlus className="h-4 w-4" />}
                        className="w-full"
                    />
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleOpenAdd} className="mr-1">
                        Bekor qilish
                    </Button>
                    <Button variant="gradient" color="blue" onClick={addWorker} disabled={!newWorkerName.trim()}>
                        Qo'shish
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Модалка Редактирования оператора */}
            <Dialog open={openEditModal} handler={() => setOpenEditModal(false)} size="xs">
                <DialogHeader>Operatorni tahrirlash</DialogHeader>
                <DialogBody>
                    <Input
                        label="Operator ismini o'zgartirish"
                        value={editWorkerName}
                        onChange={(e) => setEditWorkerName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && editWorker()}
                        icon={<Edit2 className="h-4 w-4" />}
                        className="w-full"
                    />
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setOpenEditModal(false)} className="mr-1">
                        Bekor qilish
                    </Button>
                    <Button variant="gradient" color="blue" onClick={editWorker} disabled={!editWorkerName.trim()}>
                        Saqlash
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Модалка Удаления оператора (Подтверждение) */}
            <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(false)} size="xs">
                <DialogHeader className="text-red-500 gap-2">
                    <AlertCircle className="h-6 w-6" /> O'chirishni tasdiqlang
                </DialogHeader>
                <DialogBody>
                    Siz chindan ham <span className="font-bold text-black">"{currentWorker?.name}"</span> operatorini va uning barcha viloyatlar ma'lumotlarini o'chirib tashlamoqchimisiz?
                    Bu harakatni qaytarib bo'lmaydi.
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="blue-gray" onClick={() => setOpenDeleteModal(false)} className="mr-1">
                        Yo'q, bekor qilish
                    </Button>
                    <Button variant="gradient" color="red" onClick={deleteWorker}>
                        Ha, o'chirish
                    </Button>
                </DialogFooter>
            </Dialog>

            <div className="grid grid-cols-1 gap-6">
                {workers.length === 0 ? (
                    <Typography className="text-center text-gray-400 py-12 italic border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        Hozircha operatorlar qo'shilmagan.
                    </Typography>
                ) : (
                    workers.map(worker => (
                        <Card key={worker.id} className="w-full shadow-lg border border-blue-gray-50 bg-white">
                            <CardHeader color="transparent" shadow={false} className="m-0 p-4 border-b border-gray-100 flex justify-between items-center rounded-none bg-blue-gray-50/50">
                                <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                                    <UserPlus className="h-5 w-5 text-blue-500" />
                                    {worker.name}
                                </Typography>
                                <div className="flex items-center gap-2">
                                    <IconButton variant="text" color="blue" onClick={() => handleOpenEdit(worker)} size="sm">
                                        <Edit2 className="h-4 w-4" />
                                    </IconButton>
                                    <IconButton variant="text" color="red" onClick={() => handleOpenDelete(worker)} size="sm">
                                        <Trash2 className="h-5 w-5" />
                                    </IconButton>
                                </div>
                            </CardHeader>

                            <CardBody className="flex flex-col gap-4 p-4">
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <div className="w-full">
                                        <Input
                                            label="Yangi viloyat nomini kiriting"
                                            value={newRegionNames[worker.id] || ""}
                                            onChange={(e) => setNewRegionNames({ ...newRegionNames, [worker.id]: e.target.value })}
                                            onKeyPress={(e) => e.key === 'Enter' && addRegion(worker.id)}
                                            size="md"
                                            icon={<MapPin className="h-4 w-4" />}
                                        />
                                    </div>
                                    <Button size="md" onClick={() => addRegion(worker.id)} color="green" variant="gradient" className="w-full sm:w-auto sm:min-w-[120px]">
                                        Qo'shish
                                    </Button>
                                </div>

                                {worker.regions.length === 0 ? (
                                    <Typography className="text-center text-gray-400 py-6 italic text-sm">
                                        Viloyatlar yo'q. Ushbu operator uchun birinchi viloyatni qo'shing.
                                    </Typography>
                                ) : (
                                    <div className="flex flex-col gap-4 mt-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                        {worker.regions.map(region => (
                                            <Card key={region.id} className="border border-gray-200 shadow-sm overflow-hidden bg-white">
                                                <div className="bg-gray-50/80 p-3 flex justify-between items-center border-b border-gray-200">
                                                    <Typography variant="small" className="font-bold text-gray-800 flex items-center gap-2 uppercase">
                                                        <MapPin className="h-4 w-4 text-green-500" />
                                                        {region.name}
                                                    </Typography>
                                                    <IconButton size="sm" variant="text" color="red" onClick={() => deleteRegion(worker.id, region.id)} className="h-6 w-6">
                                                        <Trash2 className="h-4 w-4" />
                                                    </IconButton>
                                                </div>
                                                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                                                    {/* Подняли */}
                                                    <div className="flex flex-col items-center justify-between p-2 rounded-lg bg-green-50/50 border border-green-100">
                                                        <Typography className="text-green-700 text-[10px] sm:text-xs font-bold mb-2 flex flex-col items-center gap-1 text-center">
                                                            <Phone className="h-3 w-3" /> KO'TARDI
                                                        </Typography>
                                                        <div className="flex items-center gap-2 w-full justify-between sm:justify-center">
                                                            <IconButton size="sm" variant="outlined" color="green" onClick={() => updateStat(worker.id, region.id, 'answered', -1)} className="rounded-full h-7 w-7">
                                                                <Minus className="h-3 w-3" />
                                                            </IconButton>
                                                            <Typography variant="h6" color="green" className="w-6 text-center">{region.answered}</Typography>
                                                            <IconButton size="sm" variant="gradient" color="green" onClick={() => updateStat(worker.id, region.id, 'answered', 1)} className="rounded-full h-7 w-7 shadow-none">
                                                                <Plus className="h-3 w-3" />
                                                            </IconButton>
                                                        </div>
                                                    </div>

                                                    {/* Не подняли */}
                                                    <div className="flex flex-col items-center justify-between p-2 rounded-lg bg-orange-50/50 border border-orange-100">
                                                        <Typography className="text-orange-700 text-[10px] sm:text-xs font-bold mb-2 flex flex-col items-center gap-1 text-center">
                                                            <PhoneMissed className="h-3 w-3" /> KO'TARMADI
                                                        </Typography>
                                                        <div className="flex items-center gap-2 w-full justify-between sm:justify-center">
                                                            <IconButton size="sm" variant="outlined" color="orange" onClick={() => updateStat(worker.id, region.id, 'notAnswered', -1)} className="rounded-full h-7 w-7">
                                                                <Minus className="h-3 w-3" />
                                                            </IconButton>
                                                            <Typography variant="h6" color="orange" className="w-6 text-center">{region.notAnswered}</Typography>
                                                            <IconButton size="sm" variant="gradient" color="orange" onClick={() => updateStat(worker.id, region.id, 'notAnswered', 1)} className="rounded-full h-7 w-7 shadow-none">
                                                                <Plus className="h-3 w-3" />
                                                            </IconButton>
                                                        </div>
                                                    </div>

                                                    {/* Не работает */}
                                                    <div className="flex flex-col items-center justify-between p-2 rounded-lg bg-red-50/50 border border-red-100">
                                                        <Typography className="text-red-700 text-[10px] sm:text-xs font-bold mb-2 flex flex-col items-center gap-1 text-center">
                                                            <PhoneOff className="h-3 w-3" /> ISHLAMAYDI
                                                        </Typography>
                                                        <div className="flex items-center gap-2 w-full justify-between sm:justify-center">
                                                            <IconButton size="sm" variant="outlined" color="red" onClick={() => updateStat(worker.id, region.id, 'notWorking', -1)} className="rounded-full h-7 w-7">
                                                                <Minus className="h-3 w-3" />
                                                            </IconButton>
                                                            <Typography variant="h6" color="red" className="w-6 text-center">{region.notWorking}</Typography>
                                                            <IconButton size="sm" variant="gradient" color="red" onClick={() => updateStat(worker.id, region.id, 'notWorking', 1)} className="rounded-full h-7 w-7 shadow-none">
                                                                <Plus className="h-3 w-3" />
                                                            </IconButton>
                                                        </div>
                                                    </div>

                                                    {/* Измененный номер */}
                                                    <div className="flex flex-col items-center justify-between p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                                                        <Typography className="text-blue-700 text-[10px] sm:text-xs font-bold mb-2 flex flex-col items-center gap-1 text-center">
                                                            <RefreshCw className="h-3 w-3" /> RAQAM O'ZGARTIRDI
                                                        </Typography>
                                                        <div className="flex items-center gap-2 w-full justify-between sm:justify-center">
                                                            <IconButton size="sm" variant="outlined" color="blue" onClick={() => updateStat(worker.id, region.id, 'changedNumber', -1)} className="rounded-full h-7 w-7">
                                                                <Minus className="h-3 w-3" />
                                                            </IconButton>
                                                            <Typography variant="h6" color="blue" className="w-6 text-center">{region.changedNumber || 0}</Typography>
                                                            <IconButton size="sm" variant="gradient" color="blue" onClick={() => updateStat(worker.id, region.id, 'changedNumber', 1)} className="rounded-full h-7 w-7 shadow-none">
                                                                <Plus className="h-3 w-3" />
                                                            </IconButton>
                                                        </div>
                                                    </div>

                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
