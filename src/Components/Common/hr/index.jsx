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
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Select,
    Option,
    Badge,
} from "@material-tailwind/react";
import {
    Plus, Trash2, Clock, CheckCircle2, CalendarDays, Edit2, AlertCircle,
    Users, PhoneCall, DollarSign, Filter, Download, UserPlus, BarChart3,
    XCircle, Save, Search
} from "lucide-react";

export default function hr() {
    // LocalStorage dan ma'lumotlarni olish
    const [operators, setOperators] = useState(() => {
        try {
            const saved = localStorage.getItem("callCenterOperators");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [reports, setReports] = useState(() => {
        try {
            const saved = localStorage.getItem("callCenterReports");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // Filter state
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [selectedOperator, setSelectedOperator] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Modallar
    const [openOperatorModal, setOpenOperatorModal] = useState(false);
    const [openReportModal, setOpenReportModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteType, setDeleteType] = useState(null); // 'operator' yoki 'report'

    // Operator form
    const [operatorName, setOperatorName] = useState("");
    const [operatorPosition, setOperatorPosition] = useState("");
    const [editingOperator, setEditingOperator] = useState(null);

    // Report form
    const [reportDate, setReportDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [reportOperator, setReportOperator] = useState("");
    const [lateTime, setLateTime] = useState("");
    const [numCalls, setNumCalls] = useState("");
    const [numPriceList, setNumPriceList] = useState("");
    const [editingReport, setEditingReport] = useState(null);

    // Delete uchun
    const [itemToDelete, setItemToDelete] = useState(null);

    // LocalStorage ga saqlash
    useEffect(() => {
        localStorage.setItem("callCenterOperators", JSON.stringify(operators));
    }, [operators]);

    useEffect(() => {
        localStorage.setItem("callCenterReports", JSON.stringify(reports));
    }, [reports]);

    // Filterlangan reportlar
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            // Month filter
            const reportMonth = report.date.substring(0, 7);
            if (reportMonth !== selectedMonth) return false;

            // Operator filter
            if (selectedOperator !== "all" && report.operatorId !== selectedOperator) return false;

            // Search filter
            if (searchTerm) {
                const operator = operators.find(op => op.id === report.operatorId);
                const operatorName = operator ? operator.name.toLowerCase() : "";
                return operatorName.includes(searchTerm.toLowerCase());
            }

            return true;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [reports, selectedMonth, selectedOperator, operators, searchTerm]);

    // Operator statistikasi
    const operatorStats = useMemo(() => {
        const stats = {};

        operators.forEach(op => {
            stats[op.id] = {
                totalLateTime: 0,
                totalCalls: 0,
                totalPriceList: 0,
                daysWorked: 0
            };
        });

        reports.forEach(report => {
            if (report.date.substring(0, 7) === selectedMonth) {
                if (stats[report.operatorId]) {
                    stats[report.operatorId].totalLateTime += report.lateTime || 0;
                    stats[report.operatorId].totalCalls += report.numCalls || 0;
                    stats[report.operatorId].totalPriceList += report.numPriceList || 0;
                    stats[report.operatorId].daysWorked += 1;
                }
            }
        });

        return stats;
    }, [reports, operators, selectedMonth]);

    // Operator qo'shish/tahrirlash
    const handleSaveOperator = () => {
        if (!operatorName.trim()) return;

        if (editingOperator) {
            // Tahrirlash
            setOperators(operators.map(op =>
                op.id === editingOperator.id
                    ? { ...op, name: operatorName.trim(), position: operatorPosition.trim() }
                    : op
            ));
        } else {
            // Yangi qo'shish
            const newOperator = {
                id: Date.now().toString(),
                name: operatorName.trim(),
                position: operatorPosition.trim() || "Operator",
                createdAt: new Date().toISOString()
            };
            setOperators([...operators, newOperator]);
        }

        setOperatorName("");
        setOperatorPosition("");
        setEditingOperator(null);
        setOpenOperatorModal(false);
    };

    // Report qo'shish
    const handleSaveReport = () => {
        if (!reportOperator || !reportDate) return;

        const newReport = {
            id: Date.now().toString(),
            operatorId: reportOperator,
            date: reportDate,
            lateTime: parseInt(lateTime) || 0,
            numCalls: parseInt(numCalls) || 0,
            numPriceList: parseInt(numPriceList) || 0,
            createdAt: new Date().toISOString()
        };

        setReports([newReport, ...reports]);
        resetReportForm();
        setOpenReportModal(false);
    };

    // Report tahrirlash
    const handleEditReport = (report) => {
        setEditingReport(report);
        setReportDate(report.date);
        setReportOperator(report.operatorId);
        setLateTime(report.lateTime.toString());
        setNumCalls(report.numCalls.toString());
        setNumPriceList(report.numPriceList.toString());
        setOpenEditModal(true);
    };

    const handleUpdateReport = () => {
        if (!editingReport) return;

        setReports(reports.map(r =>
            r.id === editingReport.id
                ? {
                    ...r,
                    operatorId: reportOperator,
                    date: reportDate,
                    lateTime: parseInt(lateTime) || 0,
                    numCalls: parseInt(numCalls) || 0,
                    numPriceList: parseInt(numPriceList) || 0
                }
                : r
        ));

        resetReportForm();
        setEditingReport(null);
        setOpenEditModal(false);
    };

    // O'chirish
    const handleDelete = () => {
        if (!itemToDelete) return;

        if (deleteType === 'operator') {
            // Operatorni va uning barcha reportlarini o'chirish
            setReports(reports.filter(r => r.operatorId !== itemToDelete.id));
            setOperators(operators.filter(op => op.id !== itemToDelete.id));
        } else if (deleteType === 'report') {
            setReports(reports.filter(r => r.id !== itemToDelete.id));
        }

        setItemToDelete(null);
        setDeleteType(null);
        setOpenDeleteModal(false);
    };

    const resetReportForm = () => {
        const today = new Date();
        setReportDate(today.toISOString().split('T')[0]);
        setReportOperator("");
        setLateTime("");
        setNumCalls("");
        setNumPriceList("");
    };

    // Oy nomini olish
    const getMonthName = (monthStr) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('uz-Latn-UZ', { month: 'long', year: 'numeric' });
    };

    // Operator nomini olish
    const getOperatorName = (operatorId) => {
        const operator = operators.find(op => op.id === operatorId);
        return operator ? operator.name : "Noma'lum";
    };

    // Umumiy statistika
    const totalStats = useMemo(() => {
        return filteredReports.reduce((acc, report) => ({
            lateTime: acc.lateTime + (report.lateTime || 0),
            calls: acc.calls + (report.numCalls || 0),
            priceList: acc.priceList + (report.numPriceList || 0)
        }), { lateTime: 0, calls: 0, priceList: 0 });
    }, [filteredReports]);

    return (
        <div className="w-full mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg text-white">
                <div>
                    <Typography variant="h4" className="font-bold flex items-center gap-2">
                        <PhoneCall className="h-8 w-8" />
                        Call Center Hisoboti
                    </Typography>
                    <Typography variant="small" className="text-blue-100">
                        Operatorlar faoliyatini kuzatish va hisoblash
                    </Typography>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => {
                            setEditingOperator(null);
                            setOperatorName("");
                            setOperatorPosition("");
                            setOpenOperatorModal(true);
                        }}
                        size="sm"
                        className="flex items-center gap-2 bg-white text-blue-800"
                    >
                        <UserPlus className="h-4 w-4" /> Yangi Operator
                    </Button>
                    <Button
                        onClick={() => {
                            resetReportForm();
                            setOpenReportModal(true);
                        }}
                        size="sm"
                        className="flex items-center gap-2 bg-green-500 text-white"
                    >
                        <Plus className="h-4 w-4" /> Hisobot Qo'shish
                    </Button>
                </div>
            </div>

            {/* Filter qismi */}
            <Card className="shadow-md border border-gray-200">
                <CardBody className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Typography variant="small" className="font-medium text-gray-600 mb-1">
                                Oy tanlang
                            </Typography>
                            <Input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                icon={<CalendarDays className="h-4 w-4" />}
                                className="bg-white"
                            />
                        </div>

                        <div>
                            <Typography variant="small" className="font-medium text-gray-600 mb-1">
                                Operator
                            </Typography>
                            <select
                                value={selectedOperator}
                                onChange={(e) => setSelectedOperator(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Barcha operatorlar</option>
                                {operators.map(op => (
                                    <option key={op.id} value={op.id}>{op.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <Typography variant="small" className="font-medium text-gray-600 mb-1">
                                Qidirish
                            </Typography>
                            <Input
                                type="text"
                                placeholder="Operator nomi bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search className="h-4 w-4" />}
                                className="bg-white"
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Umumiy statistika */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-orange-50 border border-orange-200">
                    <CardBody className="p-4 flex items-center gap-3">
                        <Clock className="h-8 w-8 text-orange-600" />
                        <div>
                            <Typography variant="small" className="text-orange-600 font-medium">
                                Kechikish vaqti
                            </Typography>
                            <Typography variant="h5" className="font-bold text-orange-900">
                                {totalStats.lateTime} min
                            </Typography>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-green-50 border border-green-200">
                    <CardBody className="p-4 flex items-center gap-3">
                        <PhoneCall className="h-8 w-8 text-green-600" />
                        <div>
                            <Typography variant="small" className="text-green-600 font-medium">
                                Qo'ng'iroqlar soni
                            </Typography>
                            <Typography variant="h5" className="font-bold text-green-900">
                                {totalStats.calls}
                            </Typography>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-purple-50 border border-purple-200">
                    <CardBody className="p-4 flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-purple-600" />
                        <div>
                            <Typography variant="small" className="text-purple-600 font-medium">
                                PriceList soni
                            </Typography>
                            <Typography variant="h5" className="font-bold text-purple-900">
                                {totalStats.priceList}
                            </Typography>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Operatorlar statistikasi */}
            {operators.length > 0 && (
                <Card className="shadow-md border border-gray-200">
                    <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
                        <Typography variant="h6" className="font-bold text-gray-800 flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Operatorlar statistikasi ({getMonthName(selectedMonth)})
                        </Typography>
                    </CardHeader>
                    <CardBody className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max table-auto">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 text-left text-sm font-medium text-gray-600">Operator</th>
                                        <th className="p-3 text-left text-sm font-medium text-gray-600">Lavozim</th>
                                        <th className="p-3 text-center text-sm font-medium text-gray-600">Ish kunlari</th>
                                        <th className="p-3 text-center text-sm font-medium text-gray-600">Kechikish (min)</th>
                                        <th className="p-3 text-center text-sm font-medium text-gray-600">Qo'ng'iroqlar</th>
                                        <th className="p-3 text-center text-sm font-medium text-gray-600">PriceList</th>
                                        <th className="p-3 text-center text-sm font-medium text-gray-600">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operators.map((operator) => {
                                        const stats = operatorStats[operator.id] || { totalLateTime: 0, totalCalls: 0, totalPriceList: 0, daysWorked: 0 };
                                        return (
                                            <tr key={operator.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-3 font-medium text-gray-800">{operator.name}</td>
                                                <td className="p-3 text-gray-600">{operator.position}</td>
                                                <td className="p-3 text-center font-medium">{stats.daysWorked}</td>
                                                <td className="p-3 text-center text-orange-600 font-bold">{stats.totalLateTime}</td>
                                                <td className="p-3 text-center text-green-600 font-bold">{stats.totalCalls}</td>
                                                <td className="p-3 text-center text-purple-600 font-bold">{stats.totalPriceList}</td>
                                                <td className="p-3 text-center">
                                                    <div className="flex justify-center gap-1">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditingOperator(operator);
                                                                setOperatorName(operator.name);
                                                                setOperatorPosition(operator.position || "");
                                                                setOpenOperatorModal(true);
                                                            }}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </IconButton>
                                                        <IconButton
                                                            variant="text"
                                                            color="red"
                                                            size="sm"
                                                            onClick={() => {
                                                                setItemToDelete(operator);
                                                                setDeleteType('operator');
                                                                setOpenDeleteModal(true);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </IconButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Batafsil hisobotlar */}
            <Card className="shadow-md border border-gray-200">
                <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
                    <Typography variant="h6" className="font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Batafsil hisobotlar ({filteredReports.length} ta)
                    </Typography>
                </CardHeader>
                <CardBody className="p-0">
                    {filteredReports.length === 0 ? (
                        <div className="text-center py-12">
                            <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <Typography className="text-gray-500">
                                Bu oy uchun hisobotlar mavjud emas
                            </Typography>
                            <Button
                                onClick={() => {
                                    resetReportForm();
                                    setOpenReportModal(true);
                                }}
                                color="blue"
                                variant="text"
                                className="mt-4"
                            >
                                Birinchi hisobotni qo'shish
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max table-auto">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 text-left text-sm font-medium text-gray-600">Sana</th>
                                        <th className="p-3 text-left text-sm font-medium text-gray-600">Operator</th>
                                        <th className="p-3 text-center text-sm font-medium text-gray-600">Kechikish (min)</th>
                                        <th className="p-3 text-center text-sm font-medium text-gray-600">Qo'ng'iroqlar</th>
                                        <th className="p-3 text-center text-sm font-medium text-gray-600">PriceList</th>
                                        <th className="p-3 text-center text-sm font-medium text-gray-600">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.map((report) => (
                                        <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3">
                                                {new Date(report.date).toLocaleDateString('uz-Latn-UZ')}
                                            </td>
                                            <td className="p-3 font-medium text-gray-800">
                                                {getOperatorName(report.operatorId)}
                                            </td>
                                            <td className="p-3 text-center text-orange-600 font-bold">
                                                {report.lateTime}
                                            </td>
                                            <td className="p-3 text-center text-green-600 font-bold">
                                                {report.numCalls}
                                            </td>
                                            <td className="p-3 text-center text-purple-600 font-bold">
                                                {report.numPriceList}
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex justify-center gap-1">
                                                    <IconButton
                                                        variant="text"
                                                        color="blue"
                                                        size="sm"
                                                        onClick={() => handleEditReport(report)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </IconButton>
                                                    <IconButton
                                                        variant="text"
                                                        color="red"
                                                        size="sm"
                                                        onClick={() => {
                                                            setItemToDelete(report);
                                                            setDeleteType('report');
                                                            setOpenDeleteModal(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Operator Modal */}
            <Dialog open={openOperatorModal} handler={() => setOpenOperatorModal(false)} size="sm">
                <DialogHeader className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    {editingOperator ? "Operatorni tahrirlash" : "Yangi operator qo'shish"}
                </DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Operator ismi *"
                        value={operatorName}
                        onChange={(e) => setOperatorName(e.target.value)}
                        icon={<Users className="h-4 w-4" />}
                    />
                    <Input
                        label="Lavozimi (ixtiyoriy)"
                        value={operatorPosition}
                        onChange={(e) => setOperatorPosition(e.target.value)}
                        placeholder="Masalan: Senior Operator"
                    />
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setOpenOperatorModal(false)} className="mr-1">
                        Bekor qilish
                    </Button>
                    <Button
                        variant="gradient"
                        color="blue"
                        onClick={handleSaveOperator}
                        disabled={!operatorName.trim()}
                    >
                        {editingOperator ? "Saqlash" : "Qo'shish"}
                    </Button>
                </DialogFooter>
            </Dialog>
            {/* Hisobot Qo'shish Modal */}
            <Dialog open={openReportModal} handler={() => setOpenReportModal(false)} size="xl">
                <DialogHeader className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Yangi hisobot qo'shish
                </DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    {operators.length === 0 ? (
                        <div className="text-center py-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                            <Typography className="text-yellow-800">
                                Avval operator qo'shishingiz kerak!
                            </Typography>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Typography variant="small" className="font-medium text-gray-600 mb-1">
                                        Operator *
                                    </Typography>
                                    <select
                                        value={reportOperator}
                                        onChange={(e) => setReportOperator(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Operatorni tanlang</option>
                                        {operators.map(op => (
                                            <option key={op.id} value={op.id}>{op.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Typography variant="small" className="font-medium text-gray-600 mb-1">
                                        Sana *
                                    </Typography>
                                    <Input
                                        type="date"
                                        value={reportDate}
                                        onChange={(e) => setReportDate(e.target.value)}
                                        icon={<CalendarDays className="h-4 w-4" />}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                <Input
                                    type="number"
                                    label="Kechikish vaqti (min)"
                                    min="0"
                                    value={lateTime}
                                    onChange={(e) => setLateTime(e.target.value)}
                                    icon={<Clock className="h-4 w-4" />}
                                />
                                <Input
                                    type="number"
                                    label="Qo'ng'iroqlar soni"
                                    min="0"
                                    value={numCalls}
                                    onChange={(e) => setNumCalls(e.target.value)}
                                    icon={<PhoneCall className="h-4 w-4" />}
                                />
                                <Input
                                    type="number"
                                    label="PriceList soni"
                                    min="0"
                                    value={numPriceList}
                                    onChange={(e) => setNumPriceList(e.target.value)}
                                    icon={<DollarSign className="h-4 w-4" />}
                                />
                            </div>
                        </>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setOpenReportModal(false)} className="mr-1">
                        Bekor qilish
                    </Button>
                    <Button
                        variant="gradient"
                        color="blue"
                        onClick={handleSaveReport}
                        disabled={!reportOperator || !reportDate || operators.length === 0}
                    >
                        Qo'shish
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Tahrirlash Modal */}
            <Dialog open={openEditModal} handler={() => setOpenEditModal(false)} size="md">
                <DialogHeader className="flex items-center gap-2">
                    <Edit2 className="h-5 w-5" />
                    Hisobotni tahrirlash
                </DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Typography variant="small" className="font-medium text-gray-600 mb-1">
                                Operator *
                            </Typography>
                            <select
                                value={reportOperator}
                                onChange={(e) => setReportOperator(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Operatorni tanlang</option>
                                {operators.map(op => (
                                    <option key={op.id} value={op.id}>{op.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Typography variant="small" className="font-medium text-gray-600 mb-1">
                                Sana *
                            </Typography>
                            <Input
                                type="date"
                                value={reportDate}
                                onChange={(e) => setReportDate(e.target.value)}
                                icon={<CalendarDays className="h-4 w-4" />}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <Input
                            type="number"
                            label="Kechikish vaqti (min)"
                            min="0"
                            value={lateTime}
                            onChange={(e) => setLateTime(e.target.value)}
                            icon={<Clock className="h-4 w-4" />}
                        />
                        <Input
                            type="number"
                            label="Qo'ng'iroqlar soni"
                            min="0"
                            value={numCalls}
                            onChange={(e) => setNumCalls(e.target.value)}
                            icon={<PhoneCall className="h-4 w-4" />}
                        />
                        <Input
                            type="number"
                            label="PriceList soni"
                            min="0"
                            value={numPriceList}
                            onChange={(e) => setNumPriceList(e.target.value)}
                            icon={<DollarSign className="h-4 w-4" />}
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
                        onClick={handleUpdateReport}
                        disabled={!reportOperator || !reportDate}
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
                    {deleteType === 'operator' ? (
                        <>
                            Siz <span className="font-bold text-black">"{itemToDelete?.name}"</span> operatorini
                            va uning barcha hisobotlarini o'chirmoqchimisiz?
                        </>
                    ) : (
                        <>
                            Siz <span className="font-bold text-black">{itemToDelete?.date ? new Date(itemToDelete.date).toLocaleDateString('uz-Latn-UZ') : ''}</span>
                            sanasidagi hisobotni o'chirmoqchimisiz?
                        </>
                    )}
                    <Typography variant="small" className="text-red-500 mt-2">
                        Bu amalni qaytarib bo'lmaydi!
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="blue-gray" onClick={() => setOpenDeleteModal(false)} className="mr-1">
                        Bekor qilish
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleDelete}>
                        Ha, o'chirish
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}