import React, { useState } from 'react'
import { getTeacherInOutTimesQuery } from "../../hooks/useQueryMutations";
import { CalendarDays, Clock, CheckCircle2, XCircle, Clock3, Minus, ChevronDown, ChevronUp, Search, Filter } from "lucide-react";

function formatDate(isoString) {
    const istDate = new Date(new Date(isoString).getTime() + 5.5 * 60 * 60 * 1000);
    return istDate.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(isoString) {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

const STATUS_CONFIG = {
    present: { label: "Present", icon: CheckCircle2, cls: "text-success bg-success/10" },
    absent: { label: "Absent", icon: XCircle, cls: "text-error bg-error/10" },
    late: { label: "Late", icon: Clock3, cls: "text-warning bg-warning/10" },
    halfDay: { label: "Half Day", icon: Minus, cls: "text-info bg-info/10" },
    holiday: { label: "Holiday", icon: CalendarDays, cls: "text-secondary bg-secondary/10" },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.present;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
            <Icon size={12} />
            {cfg.label}
        </span>
    );
}

const TeacherAttendanceRecords = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const { data, isLoading } = getTeacherInOutTimesQuery({ teacherId: user?.id });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("all");

    const summary = data?.data?.summary;
    const records = data?.data?.records ?? [];

    // Get unique months for filter
    const months = [...new Set(records.map(record =>
        new Date(record.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    ))];

    // Filter records
    const filteredRecords = records.filter(record => {
        const matchesSearch = searchTerm === "" ||
            formatDate(record.date).toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.status.toLowerCase().includes(searchTerm.toLowerCase());

        const recordMonth = new Date(record.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        const matchesMonth = selectedMonth === "all" || recordMonth === selectedMonth;

        return matchesSearch && matchesMonth;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-text-heading">Attendance Records</h2>
                        <p className="text-sm text-text-secondary mt-1">View your daily attendance history</p>
                    </div>

                    {/* Summary Stats */}
                    {summary && (
                        <div className="flex items-center gap-4 p-3 bg-surface-page rounded-xl border border-border">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">{summary.attendancePercentage}%</p>
                                <p className="text-xs text-text-secondary">Attendance</p>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div className="text-center">
                                <p className="text-2xl font-bold text-success">{summary.present}</p>
                                <p className="text-xs text-text-secondary">Present</p>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div className="text-center">
                                <p className="text-2xl font-bold text-error">{summary.absent}</p>
                                <p className="text-xs text-text-secondary">Absent</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search by date or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="pl-9 pr-8 py-2 text-sm border border-border rounded-xl focus:border-primary outline-none  appearance-none cursor-pointer"
                        >
                            <option value="all">All Months</option>
                            {months.map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Records Table */}
                {filteredRecords.length === 0 ? (
                    <div className="text-center py-16 bg-surface-page rounded-2xl border border-border">
                        <CalendarDays size={48} className="mx-auto text-text-secondary opacity-40" />
                        <p className="text-text-secondary mt-3">No attendance records found</p>
                    </div>
                ) : (
                    <div className=" rounded-2xl border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-surface-page border-b border-border">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-text-secondary">#</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-text-secondary">Date</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-text-secondary">Check In</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-text-secondary">Check Out</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-text-secondary">Duration</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-text-secondary">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredRecords.map((rec, idx) => {
                                        const duration = rec.checkInTime && rec.checkOutTime ?
                                            Math.round((new Date(rec.checkOutTime) - new Date(rec.checkInTime)) / (1000 * 60 * 60)) : null;

                                        return (
                                            <tr key={rec.date} className="hover:bg-surface-page/30 transition-colors">
                                                <td className="px-6 py-3 text-text-secondary text-xs">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays size={14} className="text-text-secondary" />
                                                        <span className="text-text-heading">{formatDate(rec.date)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3">
                                                    {rec.checkInTime ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={12} className="text-success" />
                                                            <span className="text-success font-medium">{formatTime(rec.checkInTime)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-text-secondary text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3">
                                                    {rec.checkOutTime ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={12} className="text-error" />
                                                            <span className="text-error font-medium">{formatTime(rec.checkOutTime)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-text-secondary text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3">
                                                    {duration ? (
                                                        <span className="text-text-secondary">{duration} hrs</span>
                                                    ) : (
                                                        <span className="text-text-secondary text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <StatusBadge status={rec.status} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-border bg-surface-page flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p className="text-xs text-text-secondary">
                                Showing {filteredRecords.length} of {records.length} records
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {/* pagination logic */ }}
                                    className="px-3 py-1 text-xs border border-border rounded-lg hover:bg-surface-page transition-colors"
                                >
                                    Previous
                                </button>
                                <button className="px-3 py-1 text-xs bg-primary text-white rounded-lg">
                                    1
                                </button>
                                <button
                                    onClick={() => {/* pagination logic */ }}
                                    className="px-3 py-1 text-xs border border-border rounded-lg hover:bg-surface-page transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherAttendanceRecords;