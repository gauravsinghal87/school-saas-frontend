import React, { useState, useEffect, useMemo } from "react";
import { CheckCircle, XCircle, Clock, Save, Users, CalendarDays, Eye, CalendarRange, X } from "lucide-react";
import DataTable from "../../../components/common/ReusableTable";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import {
    fetchstudentListQuery,
    markAttendanceMutation,
    getClassAttendanceQuery,
    getStudentAttendanceQuery
} from "../../../hooks/useQueryMutations";
import { showSuccess, showError } from "../../../utils/toast";
import { useDebounce } from "../../../hooks/useDebounce";

const ATTENDANCE_STATUS = {
    PRESENT: "present",
    ABSENT: "absent",
    LATE: "late"
};

const STATUS_CONFIG = {
    present: { label: "Present", color: "bg-success/10 text-success border-success", icon: CheckCircle },
    absent: { label: "Absent", color: "bg-error/10 text-error border-error", icon: XCircle },
    late: { label: "Late", color: "bg-warning/10 text-warning border-warning", icon: Clock }
};

export default function StudentAttendancePage() {
    // 1. Date & Table States
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    // Modal States
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    // IDs
    const classId = "69d4c8429a9888c1ee9f91f7";
    const sectionId = "69d4c8429a9888c1ee9f91f9";
    const teacherId = "69d4cade9a9888c1ee9f9376";

    // 2. Data Fetching
    const { data: apiResponse, isLoading: loadingStudents } = fetchstudentListQuery({
        classId, sectionId, page, limit, search: debouncedSearch
    });

    const { data: existingAttendanceRes, isFetching: isSyncing } = getClassAttendanceQuery({
        classId,
        sectionId,
        date: selectedDate
    });



    const { data: studentAttendanceData, refetch: refetchStudentAttendance, isLoading: loadingStudentHistory } = getStudentAttendanceQuery({
        studentId: selectedStudent?.user?._id || '',
        startDate: null,
        endDate: null,
    });

    const markMutation = markAttendanceMutation();
    const [attendanceData, setAttendanceData] = useState({});

    const students = apiResponse?.data?.students || [];
    const total = apiResponse?.data?.pagination?.total || 0;

    // 3. Sync local marking state with the "Overview" data
    useEffect(() => {
        if (students.length > 0) {
            const initialData = {};
            const existingEntries = existingAttendanceRes?.data?.students || [];

            students.forEach(student => {
                const existing = existingEntries.find(a => a.studentId?._id === student.user?._id);
                initialData[student._id] = {
                    studentId: student.user?._id,
                    status: existing?.status || ATTENDANCE_STATUS.PRESENT,
                    remarks: existing?.remarks || ""
                };
            });
            setAttendanceData(initialData);
        }
    }, [students, existingAttendanceRes]);

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };

    const handleRemarkChange = (studentId, remarks) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks }
        }));
    };

    const handleSubmit = () => {
        const payload = {
            teacherId,
            date: selectedDate,
            studentEntries: Object.values(attendanceData)
        };

        markMutation.mutate(payload, {
            onSuccess: () => showSuccess(`Attendance for ${selectedDate} updated!`),
            onError: (err) => showError(err?.message || "Failed to mark attendance")
        });
    };

    const handleViewStudent = (student) => {
        console.log('studentn', student)
        setSelectedStudent(student);
        setShowStudentModal(true);
        // Reset date range to last 30 days
        setDateRange({
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
        });
    };

    useEffect(() => {
        if (showStudentModal && selectedStudent) {
            refetchStudentAttendance();
        }
    }, [dateRange, showStudentModal, selectedStudent]);

    const COLUMNS = [
        {
            key: "index",
            label: "Sr. No",
            width: "70px",
            render: (_, __, idx) => (page - 1) * limit + idx + 1,
        },
        {
            key: "fullName",
            label: "Student Name",
            width: "150px",
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-text-heading">{row.fullName}</span>
                    <span className="text-[10px] text-primary font-bold uppercase">ID: {row.admissionNumber}</span>
                </div>
            )
        },
        {
            key: "status",
            label: "Attendance Status",
            width: "200px",
            render: (_, row) => {
                const currentStatus = attendanceData[row._id]?.status;
                return (
                    <div className="flex items-center gap-2">
                        <StatusButton
                            active={currentStatus === ATTENDANCE_STATUS.PRESENT}
                            onClick={() => handleStatusChange(row._id, ATTENDANCE_STATUS.PRESENT)}
                            variant="success"
                            icon={<CheckCircle size={14} />}
                            label="Present"
                        />
                        <StatusButton
                            active={currentStatus === ATTENDANCE_STATUS.ABSENT}
                            onClick={() => handleStatusChange(row._id, ATTENDANCE_STATUS.ABSENT)}
                            variant="error"
                            icon={<XCircle size={14} />}
                            label="Absent"
                        />
                        <StatusButton
                            active={currentStatus === ATTENDANCE_STATUS.LATE}
                            onClick={() => handleStatusChange(row._id, ATTENDANCE_STATUS.LATE)}
                            variant="warning"
                            icon={<Clock size={14} />}
                            label="Late"
                        />
                    </div>
                );
            }
        },
        {
            key: "remarks",
            label: "Remarks",
            width: "150px",
            render: (_, row) => (
                <input
                    type="text"
                    placeholder="Add note..."
                    value={attendanceData[row._id]?.remarks || ""}
                    onChange={(e) => handleRemarkChange(row._id, e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white text-xs outline-none focus:border-primary transition-colors"
                />
            )
        },
        {
            key: "actions",
            label: "Actions",
            width: "100px",
            render: (_, row) => (
                <button
                    onClick={() => handleViewStudent(row)}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-xl text-primary font-bold text-xs transition-all duration-200 hover:bg-primary/10 active:scale-95 border border-transparent hover:border-primary/20"
                >
                    <div className="p-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                    </div>
                    <span>View </span>
                </button>
            )
        }
    ];

    // Calculate attendance statistics for the selected student
    const attendanceStats = useMemo(() => {
        if (!studentAttendanceData?.data?.attendanceRecords) return null;

        const records = studentAttendanceData.data.attendanceRecords;
        const total = records.length;
        const present = records.filter(r => r.status === ATTENDANCE_STATUS.PRESENT).length;
        const absent = records.filter(r => r.status === ATTENDANCE_STATUS.ABSENT).length;
        const late = records.filter(r => r.status === ATTENDANCE_STATUS.LATE).length;
        const percentage = total > 0 ? ((present + late * 0.5) / total * 100).toFixed(1) : 0;

        return { total, present, absent, late, percentage };
    }, [studentAttendanceData]);

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header & Date Selector */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4  p-6 rounded-3xl border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Users size={30} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text-heading">Daily Attendance</h1>
                            <p className="text-sm text-text-secondary font-medium">Manage and view historical records</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* <div className="relative group">
                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-hover:scale-110 transition-transform" size={18} />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setPage(1);
                                }}
                                className="h-12 pl-12 pr-4 bg-surface-page border border-border rounded-2xl text-sm font-bold text-text-heading focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer transition-all"
                            />
                        </div> */}

                        <Button onClick={handleSubmit} loading={markMutation.isPending} className="h-12 px-6 rounded-2xl shadow-xl shadow-primary/20">
                            <Save size={18} className="mr-2" /> Save Attendance
                        </Button>
                    </div>
                </div>

                {isSyncing && (
                    <div className="flex justify-center">
                        <span className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-widest">
                            Syncing records for {selectedDate}...
                        </span>
                    </div>
                )}

                <DataTable
                    data={students}
                    columns={COLUMNS}
                    loading={loadingStudents}
                    title={`Attendance Sheet - ${new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    serverMode
                    page={page}
                    total={total}
                    onPageChange={setPage}
                    onPageSizeChange={(val) => { setLimit(val); setPage(1); }}
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    searchPlaceholder="Search students..."
                    showActions={false}
                />
            </div>

            {/* Student Attendance History Modal */}
            <Modal
                isOpen={showStudentModal}
                onClose={() => setShowStudentModal(false)}
            // size="xl"
            // className="max-w-4xl"
            >
                {selectedStudent && (
                    <div className="space-y-6">
                        {/* Modal Header */}
                        <div className="flex justify-between items-start border-b border-border pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-text-heading">Attendance History</h2>
                                <div className="mt-1">
                                    <span className="font-semibold text-text-heading">{selectedStudent.fullName}</span>
                                    <span className="text-text-secondary ml-2 text-sm">ID: {selectedStudent.admissionNumber}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowStudentModal(false)}
                                className="p-2 hover:bg-surface-page rounded-xl transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Date Range Picker */}
                        <div className="bg-surface-page p-4 rounded-2xl border border-border">
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <CalendarRange size={18} className="text-primary" />
                                    <span className="text-sm font-medium text-text-secondary">Date Range:</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="h-10 px-3 rounded-lg border border-border bg-white text-sm focus:border-primary outline-none"
                                    />
                                    <span className="text-text-secondary">to</span>
                                    <input
                                        type="date"
                                        value={dateRange.endDate}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="h-10 px-3 rounded-lg border border-border bg-white text-sm focus:border-primary outline-none"
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setDateRange({
                                            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                            endDate: new Date().toISOString().split('T')[0]
                                        });
                                    }}
                                    variant="outline"
                                >
                                    Last 30 Days
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                                        setDateRange({
                                            startDate: startOfMonth,
                                            endDate: new Date().toISOString().split('T')[0]
                                        });
                                    }}
                                    variant="outline"
                                >
                                    This Month
                                </Button>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        {attendanceStats && (
                            <div className="grid grid-cols-5 gap-4">
                                <StatCard
                                    label="Total Days"
                                    value={attendanceStats.total}
                                    color="primary"
                                />
                                <StatCard
                                    label="Present"
                                    value={attendanceStats.present}
                                    color="success"
                                    icon={CheckCircle}
                                />
                                <StatCard
                                    label="Absent"
                                    value={attendanceStats.absent}
                                    color="error"
                                    icon={XCircle}
                                />
                                <StatCard
                                    label="Late"
                                    value={attendanceStats.late}
                                    color="warning"
                                    icon={Clock}
                                />
                                <StatCard
                                    label="Attendance %"
                                    value={`${attendanceStats.percentage}%`}
                                    color="primary"
                                />
                            </div>
                        )}

                        {/* Attendance Records Table */}
                        <div className="border border-border rounded-2xl overflow-hidden">
                            <div className="bg-surface-page px-6 py-3 border-b border-border">
                                <h3 className="font-semibold text-text-heading">Attendance Records</h3>
                            </div>
                            <div className="overflow-x-auto">
                                {loadingStudentHistory ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-surface-page border-b border-border">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Marked At</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentAttendanceData?.data?.records?.length > 0 ? (
                                                studentAttendanceData.data.records.map((record, idx) => {
                                                    const StatusIcon = STATUS_CONFIG[record.status]?.icon;
                                                    return (
                                                        <tr key={idx} className="border-b border-border hover:bg-surface-page/50 transition-colors">
                                                            <td className="px-6 py-3 text-sm text-text-heading">
                                                                {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </td>
                                                            <td className="px-6 py-3">
                                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[record.status]?.color}`}>
                                                                    {StatusIcon && <StatusIcon size={12} />}
                                                                    {STATUS_CONFIG[record.status]?.label}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-3 text-xs text-text-secondary">
                                                                {record.markedAt ? new Date(record.markedAt).toLocaleString() : '-'}
                                                            </td>
                                                            <td className="px-6 py-3 text-sm text-text-secondary">
                                                                {record.remarks || '-'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-text-secondary">
                                                        No attendance records found for this date range
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

// UI Helpers
function StatCard({ label, value, color, icon: Icon }) {
    const colors = {
        primary: "bg-primary/5 text-primary border-primary/10",
        success: "bg-success/5 text-success border-success/10",
        error: "bg-error/5 text-error border-error/10",
        warning: "bg-warning/5 text-warning border-warning/10"
    };

    return (
        <div className={`flex flex-col items-center p-3 rounded-xl border ${colors[color]}`}>
            {Icon && <Icon size={16} className="mb-1" />}
            <span className="text-xs font-medium text-text-secondary">{label}</span>
            <span className="text-xl font-bold mt-1">{value}</span>
        </div>
    );
}

function StatusButton({ active, onClick, variant, icon, label }) {
    const variants = {
        success: active ? "bg-success text-white border-success shadow-md" : "text-success bg-white border-success/20 hover:bg-success/5",
        error: active ? "bg-error text-white border-error shadow-md" : "text-error bg-white border-error/20 hover:bg-error/5",
        warning: active ? "bg-warning text-white border-warning shadow-md" : "text-warning bg-white border-warning/20 hover:bg-warning/5",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-center w-10 h-10 rounded-xl border font-bold transition-all duration-200 ${variants[variant]}`}
            title={label}
        >
            {icon}
        </button>
    );
}