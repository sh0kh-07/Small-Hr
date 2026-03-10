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
import { Plus, Trash2, UserPlus, MapPin, Phone, PhoneOff, PhoneMissed, Minus, Edit2, AlertCircle, RefreshCw, CheckCircle, XCircle, WifiOff, Smartphone, PhoneCall, BarChart3, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

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

    // Состояние для типа графика
    const [chartType, setChartType] = useState('bar'); // 'bar' или 'pie'

    // Сохранение при каждом изменении workers
    useEffect(() => {
        localStorage.setItem("callWorkersReport", JSON.stringify(workers));
    }, [workers]);

    // Функция для подсчета общей статистики по всем категориям
    const getTotalStats = () => {
        let totals = {
            ishlaypti: 0,
            ishlamaydi: 0,
            kotarmadi: 0,
            raqamOzgartirdi: 0,
            raqamIshlamapti: 0
        };

        workers.forEach(worker => {
            worker.regions.forEach(region => {
                totals.ishlaypti += region.ishlaypti || 0;
                totals.ishlamaydi += region.ishlamaydi || 0;
                totals.kotarmadi += region.kotarmadi || 0;
                totals.raqamOzgartirdi += region.raqamOzgartirdi || 0;
                totals.raqamIshlamapti += region.raqamIshlamapti || 0;
            });
        });

        return totals;
    };

    // Подготовка данных для графика
    const getChartData = () => {
        const totals = getTotalStats();
        return [
            { name: 'Ishlaypti', value: totals.ishlaypti, color: '#22c55e' },
            { name: 'Ishlamaydi', value: totals.ishlamaydi, color: '#ef4444' },
            { name: "Ko'tarmadi", value: totals.kotarmadi, color: '#f97316' },
            { name: "Raqam o'zgartirdi", value: totals.raqamOzgartirdi, color: '#3b82f6' },
            { name: 'Raqam ishlamapti', value: totals.raqamIshlamapti, color: '#a855f7' }
        ];
    };

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
                            ishlaypti: 0,        // Ishlaypti
                            ishlamaydi: 0,        // ISHLAMAYDI
                            kotarmadi: 0,         // KO'TARMADI
                            raqamOzgartirdi: 0,   // RAQAM O'ZGARTIRDI
                            raqamIshlamapti: 0    // Raqam ishlamapti
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

    const updateStat = (workerId, regionId, field, value) => {
        const numValue = parseInt(value) || 0;
        setWorkers(workers.map(w => {
            if (w.id === workerId) {
                return {
                    ...w,
                    regions: w.regions.map(r => {
                        if (r.id === regionId) {
                            return {
                                ...r,
                                [field]: Math.max(0, numValue) // Не даем уйти в минус
                            };
                        }
                        return r;
                    })
                };
            }
            return w;
        }));
    };

    const totals = getTotalStats();
    const chartData = getChartData();
    const totalCalls = Object.values(totals).reduce((a, b) => a + b, 0);

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

            {/* Блок с общей статистикой и графиком */}
            {workers.length > 0 && workers.some(w => w.regions.length > 0) && (
                <Card className="w-full shadow-lg border border-blue-gray-50 bg-white">
                    <CardHeader color="transparent" shadow={false} className="m-0 p-4 border-b border-gray-100 flex justify-between items-center rounded-none bg-blue-gray-50/50">
                        <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                            Umumiy statistika va diagramma
                        </Typography>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={chartType === 'bar' ? 'gradient' : 'outlined'}
                                color="blue"
                                onClick={() => setChartType('bar')}
                                className="flex items-center gap-1"
                            >
                                <BarChart3 className="h-4 w-4" /> Bar
                            </Button>
                            <Button
                                size="sm"
                                variant={chartType === 'pie' ? 'gradient' : 'outlined'}
                                color="blue"
                                onClick={() => setChartType('pie')}
                                className="flex items-center gap-1"
                            >
                                <PieChart className="h-4 w-4" /> Pirog
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody className="p-6">
                        {/* Карточки с общей статистикой */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <Typography className="text-green-700 text-sm font-bold">Ishlaypti</Typography>
                                <Typography className="text-2xl font-bold text-green-600">{totals.ishlaypti}</Typography>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                                <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                <Typography className="text-red-700 text-sm font-bold">Ishlamaydi</Typography>
                                <Typography className="text-2xl font-bold text-red-600">{totals.ishlamaydi}</Typography>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                                <PhoneMissed className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                                <Typography className="text-orange-700 text-sm font-bold">Ko'tarmadi</Typography>
                                <Typography className="text-2xl font-bold text-orange-600">{totals.kotarmadi}</Typography>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                                <Typography className="text-blue-700 text-sm font-bold">Raqam o'zgartirdi</Typography>
                                <Typography className="text-2xl font-bold text-blue-600">{totals.raqamOzgartirdi}</Typography>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                                <WifiOff className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                                <Typography className="text-purple-700 text-sm font-bold">Raqam ishlamapti</Typography>
                                <Typography className="text-2xl font-bold text-purple-600">{totals.raqamIshlamapti}</Typography>
                            </div>
                        </div>

                        {/* График */}
                        <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'bar' ? (
                                    <BarChart
                                        data={chartData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#8884d8">
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                ) : (
                                    <RePieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={true}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={130}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RePieChart>
                                )}
                            </ResponsiveContainer>
                        </div>

                        {/* Общее количество звонков */}
                        <div className="mt-6 text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <Typography className="text-blue-700 text-sm font-bold">
                                Jami qo'ng'iroqlar soni
                            </Typography>
                            <Typography className="text-3xl font-bold text-blue-600">
                                {totalCalls}
                            </Typography>
                        </div>
                    </CardBody>
                </Card>
            )}

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

            <div className="flex items-center gap-6 flex-col">
                {workers.length === 0 ? (
                    <Typography className="text-center text-gray-400 py-12 italic border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        Hozircha operatorlar qo'shilmagan.
                    </Typography>
                ) : (
                    workers.map(worker => (
                        <Card key={worker.id} className="w-full shadow-lg border border-blue-gray-50 bg-white ">
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
                                    <div className="flex flex-col gap-4 mt-2 max-h-[1200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
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
                                                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">

                                                    {/* Ishlaypti */}
                                                    <div className="flex flex-col items-center p-3 rounded-lg bg-green-50/50 border border-green-100">
                                                        <Typography className="text-green-700 text-xs font-bold mb-3 flex items-center gap-1">
                                                            <CheckCircle className="h-4 w-4" /> ISHLAYPTI
                                                        </Typography>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={region.ishlaypti}
                                                            onChange={(e) => updateStat(worker.id, region.id, 'ishlaypti', e.target.value)}
                                                            className="w-full text-center"
                                                            label="Soni"
                                                            containerProps={{
                                                                className: "min-w-0",
                                                            }}
                                                        />
                                                    </div>

                                                    {/* ISHLAMAYDI */}
                                                    <div className="flex flex-col items-center p-3 rounded-lg bg-red-50/50 border border-red-100">
                                                        <Typography className="text-red-700 text-xs font-bold mb-3 flex items-center gap-1">
                                                            <XCircle className="h-4 w-4" /> ISHLAMAYDI
                                                        </Typography>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={region.ishlamaydi}
                                                            onChange={(e) => updateStat(worker.id, region.id, 'ishlamaydi', e.target.value)}
                                                            className="w-full text-center"
                                                            label="Soni"
                                                            containerProps={{
                                                                className: "min-w-0",
                                                            }}
                                                        />
                                                    </div>

                                                    {/* KO'TARMADI */}
                                                    <div className="flex flex-col items-center p-3 rounded-lg bg-orange-50/50 border border-orange-100">
                                                        <Typography className="text-orange-700 text-xs font-bold mb-3 flex items-center gap-1">
                                                            <PhoneMissed className="h-4 w-4" /> KO'TARMADI
                                                        </Typography>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={region.kotarmadi}
                                                            onChange={(e) => updateStat(worker.id, region.id, 'kotarmadi', e.target.value)}
                                                            className="w-full text-center"
                                                            label="Soni"
                                                            containerProps={{
                                                                className: "min-w-0",
                                                            }}
                                                        />
                                                    </div>

                                                    {/* RAQAM O'ZGARTIRDI */}
                                                    <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                                                        <Typography className="text-blue-700 text-xs font-bold mb-3 flex items-center gap-1">
                                                            <RefreshCw className="h-4 w-4" /> RAQAM O'ZGARTIRDI
                                                        </Typography>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={region.raqamOzgartirdi || 0}
                                                            onChange={(e) => updateStat(worker.id, region.id, 'raqamOzgartirdi', e.target.value)}
                                                            className="w-full text-center"
                                                            label="Soni"
                                                            containerProps={{
                                                                className: "min-w-0",
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Raqam ishlamapti */}
                                                    <div className="flex flex-col items-center p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                                                        <Typography className="text-purple-700 text-xs font-bold mb-3 flex items-center gap-1">
                                                            <WifiOff className="h-4 w-4" /> RAQAM ISHLAMAPTI
                                                        </Typography>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={region.raqamIshlamapti || 0}
                                                            onChange={(e) => updateStat(worker.id, region.id, 'raqamIshlamapti', e.target.value)}
                                                            className="w-full text-center"
                                                            label="Soni"
                                                            containerProps={{
                                                                className: "min-w-0",
                                                            }}
                                                        />
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