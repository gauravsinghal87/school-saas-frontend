import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Check,
    Clock,
    X,
    Star,
    StarHalf,
    Download,
    Search,
    Users,
    XCircle,
    UserCheck,
    Calendar as CalendarIcon,
    Loader2,
    ArrowLeft,
    User,
    Mail,
    Briefcase,
    CalendarDays,
    TrendingUp,
    Award,
    Activity,
    Eye
} from "lucide-react";

import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import Card from "../../../../components/common/Card";
import { showSuccess, showError } from "../../../../utils/toast";
import {
    getUsersListQuery,
    getTeacherAttendanceQuery,
    getStudentAttendanceQuery
} from "../../../../hooks/useQueryMutations";

// ==================== HELPERS ====================

const statusIcon = (status, size = "w-3.5 h-3.5") => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
        case "present":
            return <Check className={`${size} text-success`} />;
        case "late":
            return <Clock className={`${size} text-warning`} />;
        case "absent":
            return <X className={`${size} text-error`} />;
        case "holiday":
            return <Star className={`${size} text-warning`} />;
        case "halfday":
            return <StarHalf className={`${size} text-info`} />;
        default:
            return <span className="text-border">—</span>;
    }
};

const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    const colors = {
        present: "bg-success/10 text-success border-success/20",
        late: "bg-warning/10 text-warning border-warning/20",
        absent: "bg-error/10 text-error border-error/20",
        holiday: "bg-warning/10 text-warning border-warning/20",
        halfday: "bg-info/10 text-info border-info/20",
    };
    return colors[statusLower] || "bg-gray-100 text-text-secondary";
};

const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const badges = {
        present: { label: "Present", icon: <Check size={12} /> },
        late: { label: "Late", icon: <Clock size={12} /> },
        absent: { label: "Absent", icon: <X size={12} /> },
        holiday: { label: "Holiday", icon: <Star size={12} /> },
        halfday: { label: "Half Day", icon: <StarHalf size={12} /> },
    };
    return badges[statusLower] || { label: status || "Unknown", icon: null };
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
};

// ==================== MAIN COMPONENT ====================

export default function AttendanceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const today = new Date();

    // State
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Detail modal
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Get user details
    const { data: usersData, isLoading: isUserLoading } = getUsersListQuery({
        page: 1,
        limit: 100,
        search: searchTerm,
        role: "",
        status: ""
    });

    const currentUser = useMemo(() => {
        const users = usersData?.data?.users || [];
        return users.find(u => u._id === id);
    }, [usersData, id]);

    // Determine user role and type
    const userRole = currentUser?.role?.toLowerCase();
    const isTeacher = userRole === "staff" || userRole === "teacher";
    const isStudent = userRole === "student";

    // Fetch attendance data based on user type
    const teacherQuery = getTeacherAttendanceQuery({ teacherId: id, startDate, endDate }, !!(isTeacher && id));
    const studentQuery = getStudentAttendanceQuery({ studentId: id, startDate, endDate }, !!(isStudent && id));

    const attendanceResponse = isTeacher ? teacherQuery?.data : studentQuery?.data;
    const isAttendanceLoading = isTeacher ? teacherQuery?.isLoading : studentQuery?.isLoading;
    const refetch = isTeacher ? teacherQuery?.refetch : studentQuery?.refetch;

    // Safe data extraction with fallbacks
    const attendanceData = attendanceResponse?.data || {};
    const summary = attendanceData?.summary || {
        totalClasses: 0,
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        holiday: 0,
        attendancePercentage: "0"
    };
    const records = attendanceData?.records || [];

    // Filter records by month/year
    const filteredRecords = useMemo(() => {
        if (!Array.isArray(records)) return [];
        return records.filter(record => {
            if (!record?.date) return false;
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
        });
    }, [records, selectedMonth, selectedYear]);

    // Create attendance map for the month
    const attendanceMap = useMemo(() => {
        const map = {};
        if (Array.isArray(filteredRecords)) {
            filteredRecords.forEach(record => {
                if (record?.date) {
                    const dateKey = formatDate(record.date);
                    map[dateKey] = record.status?.toLowerCase();
                }
            });
        }
        return map;
    }, [filteredRecords]);

    // Get days in month
    const getDaysInMonth = (month, year) => {
        const days = new Date(year, month + 1, 0).getDate();
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        return Array.from({ length: days }, (_, i) => {
            const date = new Date(year, month, i + 1);
            return {
                day: i + 1,
                weekday: weekdays[date.getDay()],
                dateString: formatDate(date),
                isToday: formatDate(date) === formatDate(new Date()),
            };
        });
    };

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const monthName = new Date(selectedYear, selectedMonth).toLocaleString("default", { month: "long" });

    // Export to CSV
    const handleExportAttendance = () => {
        if (!Array.isArray(records) || records.length === 0) {
            showError("No data to export");
            return;
        }

        const csvRows = [
            ["Date", "Class", "Section", "Status", "Remarks", "Marked At"].join(",")
        ];

        records.forEach(record => {
            const row = [
                formatDate(record.date),
                record.class?.name || "-",
                record.section?.name || "-",
                record.status || "-",
                record.remarks || "-",
                record.markedAt ? new Date(record.markedAt).toLocaleString() : "-"
            ];
            csvRows.push(row.map(cell => `"${cell}"`).join(","));
        });

        const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Attendance_${currentUser?.name || id}_${selectedYear}_${monthName}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        showSuccess("Export completed");
    };

    // Handle cell click to show details
    const handleViewDetails = (dateString) => {
        const record = records.find(r => formatDate(r.date) === dateString);
        setSelectedRecord(record);
        setDetailModalOpen(true);
    };

    // Loading state
    if (isUserLoading || isAttendanceLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-100px)] gap-4">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                    <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
                </div>
                <p className="text-text-secondary font-medium">Loading attendance data...</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-100px)] gap-4">
                <div className="bg-error/10 p-4 rounded-full">
                    <Users size={48} className="text-error" />
                </div>
                <p className="text-text-secondary text-lg">User not found</p>
                <Button variant="primary" onClick={() => navigate(-1)} icon={<ArrowLeft size={16} />}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-page">
            {/* Header Section */}
            <div className="bg-surface-card border-b border-border sticky top-0 z-20 shadow-sm">
                <div className="px-6 py-5">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                            >
                                <ArrowLeft size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                            </button>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1.5 rounded-lg bg-primary/10">
                                        <UserCheck className="text-primary" size={20} />
                                    </div>
                                    <h1 className="text-2xl font-bold text-text-heading">
                                        Attendance Overview
                                    </h1>
                                </div>
                                <p className="text-text-secondary text-sm">
                                    {getGreeting()}, {currentUser?.name}
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={handleExportAttendance}
                            variant="outline"
                            size="sm"
                            icon={<Download size={16} />}
                            className="hover:bg-primary/5"
                            disabled={!records || records.length === 0}
                        >
                            Export Report
                        </Button>
                    </div>

                    {/* User Info Bar */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/5">
                                <User size={14} className="text-text-secondary" />
                            </div>
                            <span className="text-sm text-text-primary font-medium">{currentUser?.name}</span>
                        </div>
                        <div className="w-px h-4 bg-border"></div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/5">
                                <Mail size={14} className="text-text-secondary" />
                            </div>
                            <span className="text-sm text-text-secondary">{currentUser?.email}</span>
                        </div>
                        <div className="w-px h-4 bg-border"></div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/5">
                                <Briefcase size={14} className="text-text-secondary" />
                            </div>
                            <span className="text-sm px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                                {currentUser?.role}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-border"></div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/5">
                                <Activity size={14} className="text-text-secondary" />
                            </div>
                            <span className="text-sm text-text-secondary">
                                {isTeacher ? "Teacher Attendance" : isStudent ? "Student Attendance" : "Attendance"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Stats Cards */}


            {/* Filters Bar */}
            <div className="px-6 pb-4 mt-3">
                <Card className="p-4">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="w-48">
                            <Select
                                label="Month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                options={Array.from({ length: 12 }, (_, i) => ({
                                    label: new Date(0, i).toLocaleString("default", { month: "short" }),
                                    value: i
                                }))}
                            />
                        </div>
                        <div className="w-28">
                            <Select
                                label="Year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                options={Array.from({ length: 5 }, (_, i) => ({
                                    label: String(today.getFullYear() - i),
                                    value: today.getFullYear() - i
                                }))}
                            />
                        </div>
                        <div className="w-48">
                            <Input
                                label="Start Date (Optional)"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="w-48">
                            <Input
                                label="End Date (Optional)"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        {(startDate || endDate) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setStartDate("");
                                    setEndDate("");
                                }}
                                className="mb-0.5"
                            >
                                Clear Dates
                            </Button>
                        )}
                    </div>
                </Card>
            </div>

            {/* Legend */}
            <div className="px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                    {["Present", "Late", "Absent", "Holiday", "Half Day"].map((status) => {
                        const { icon, label } = getStatusBadge(status);
                        return (
                            <div key={status} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusColor(status)}`}>
                                {icon}
                                <span>{label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Attendance Calendar Table */}
            <div className="px-6 pb-6 w-[78vw]">
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="max-h-[550px] overflow-auto">
                            <table className="min-w-[900px] w-full text-sm">
                                <thead className="sticky top-0 z-10 bg-gray-50 border-b border-border">
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <th className="text-left px-4 py-3 font-semibold text-text-primary sticky left-0 bg-gray-50 z-20 min-w-[120px] shadow-sm">
                                            Date
                                        </th>
                                        <th className="text-left px-4 py-3 font-semibold text-text-primary min-w-[100px] shadow-sm">
                                            Class
                                        </th>
                                        <th className="text-left px-4 py-3 font-semibold text-text-primary min-w-[100px] shadow-sm">
                                            Section
                                        </th>
                                        {daysInMonth.map(({ day, weekday, isToday, dateString }) => (
                                            <th
                                                key={dateString}
                                                className={`text-center px-2 py-3 min-w-[55px] ${isToday ? "bg-primary/15 text-primary shadow-inner" : "text-text-secondary"}`}
                                            >
                                                <div className="font-semibold text-sm">{day}</div>
                                                <div className="text-[10px] font-normal mt-0.5">{weekday.slice(0, 3)}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3 sticky left-0 bg-white z-10 font-semibold text-text-primary">
                                            {monthName} {selectedYear}
                                        </td>
                                        <td className="px-4 py-3 text-text-secondary">-</td>
                                        <td className="px-4 py-3 text-text-secondary">-</td>
                                        {daysInMonth.map((d) => {
                                            const status = attendanceMap[d.dateString];
                                            const { icon } = getStatusBadge(status);
                                            const hasRecord = !!status;
                                            return (
                                                <td
                                                    key={d.dateString}
                                                    onClick={() => hasRecord && handleViewDetails(d.dateString)}
                                                    className={`text-center px-2 py-3 ${hasRecord ? 'cursor-pointer hover:bg-gray-100 transition-all duration-200' : 'cursor-default'}`}
                                                >
                                                    <div className="flex justify-center transform transition-transform hover:scale-110">
                                                        {icon || statusIcon(status)}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {(!records || records.length === 0) && (
                        <div className="text-center py-16">
                            <div className="bg-gray-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <CalendarDays size={40} className="text-text-secondary opacity-50" />
                            </div>
                            <p className="text-text-secondary font-medium">No attendance records found</p>
                            <p className="text-text-secondary text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Recent Records Table */}
            {records && records.length > 0 && (
                <div className="px-6 pb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-text-heading flex items-center gap-2">
                            <Award size={18} className="text-primary" />
                            Recent Attendance Records
                        </h3>
                        <span className="text-xs text-text-secondary">{records.length} records found</span>
                    </div>
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-border">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-semibold text-text-secondary">Date</th>
                                        <th className="text-left px-4 py-3 font-semibold text-text-secondary">Class</th>
                                        <th className="text-left px-4 py-3 font-semibold text-text-secondary">Section</th>
                                        <th className="text-left px-4 py-3 font-semibold text-text-secondary">Status</th>
                                        <th className="text-left px-4 py-3 font-semibold text-text-secondary">Remarks</th>
                                        <th className="text-left px-4 py-3 font-semibold text-text-secondary">Marked At</th>
                                        <th className="text-center px-4 py-3 font-semibold text-text-secondary">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.slice(0, 10).map((record, index) => {
                                        const { icon, label } = getStatusBadge(record.status);
                                        return (
                                            <tr key={index} className="border-b border-border hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-3 text-text-primary font-medium">{formatDisplayDate(record.date)}</td>
                                                <td className="px-4 py-3 text-text-primary">{record.class?.name || "-"}</td>
                                                <td className="px-4 py-3 text-text-primary">{record.section?.name || "-"}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                                        {icon}
                                                        {label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-text-secondary max-w-[200px] truncate">{record.remarks || "-"}</td>
                                                <td className="px-4 py-3 text-text-secondary text-xs">
                                                    {record.markedAt ? new Date(record.markedAt).toLocaleString() : "-"}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => handleViewDetails(formatDate(record.date))}
                                                        className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors group"
                                                    >
                                                        <Eye size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* Detail Modal */}
            {detailModalOpen && selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-surface-card rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-2xl border-b border-border px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-primary/20">
                                    <CalendarIcon size={18} className="text-primary" />
                                </div>
                                <h3 className="font-semibold text-text-heading">Attendance Details</h3>
                            </div>
                            <button
                                onClick={() => setDetailModalOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                            >
                                <XCircle size={20} className="text-text-secondary hover:text-error transition-colors" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* User Info */}
                            <div className="text-center pb-3 border-b border-border">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <UserCheck size={24} className="text-primary" />
                                </div>
                                <h4 className="font-semibold text-text-primary text-lg">{currentUser?.name}</h4>
                                <p className="text-xs text-text-secondary">{currentUser?.email}</p>
                                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                                    {currentUser?.role}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-text-secondary text-sm">Date</span>
                                    <span className="font-medium text-text-primary">{formatDisplayDate(selectedRecord.date)}</span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-t border-border">
                                    <span className="text-text-secondary text-sm">Class</span>
                                    <span className="text-text-primary">{selectedRecord.class?.name || "-"}</span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-t border-border">
                                    <span className="text-text-secondary text-sm">Section</span>
                                    <span className="text-text-primary">{selectedRecord.section?.name || "-"}</span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-t border-border">
                                    <span className="text-text-secondary text-sm">Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRecord.status)}`}>
                                        {getStatusBadge(selectedRecord.status).icon}
                                        {getStatusBadge(selectedRecord.status).label}
                                    </span>
                                </div>

                                {selectedRecord.remarks && (
                                    <div className="flex justify-between items-start py-2 border-t border-border">
                                        <span className="text-text-secondary text-sm">Remarks</span>
                                        <span className="text-text-primary text-sm max-w-[200px] text-right">{selectedRecord.remarks}</span>
                                    </div>
                                )}

                                {selectedRecord.markedAt && (
                                    <div className="flex justify-between items-center py-2 border-t border-border">
                                        <span className="text-text-secondary text-sm">Marked At</span>
                                        <span className="text-text-secondary text-xs">{new Date(selectedRecord.markedAt).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-border px-6 py-4 flex justify-end">
                            <Button variant="outline" onClick={() => setDetailModalOpen(false)} size="sm">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}