import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Check, Clock, X, Star, StarHalf, Download, Users,
    XCircle, UserCheck, Calendar as CalendarIcon, Loader2,
    ArrowLeft, User, Mail, Briefcase, CalendarDays,
    Award, Activity, Eye, TrendingUp, LogIn, LogOut
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

const STATUS_CONFIG = {
    present: { color: "var(--color-success)", bg: "color-mix(in srgb, var(--color-success) 10%, transparent)", border: "color-mix(in srgb, var(--color-success) 25%, transparent)", label: "Present", icon: Check },
    late: { color: "var(--color-warning)", bg: "color-mix(in srgb, var(--color-warning) 10%, transparent)", border: "color-mix(in srgb, var(--color-warning) 25%, transparent)", label: "Late", icon: Clock },
    absent: { color: "var(--color-error)", bg: "color-mix(in srgb, var(--color-error)   10%, transparent)", border: "color-mix(in srgb, var(--color-error)   25%, transparent)", label: "Absent", icon: X },
    holiday: { color: "var(--color-secondary)", bg: "color-mix(in srgb, var(--color-secondary) 10%, transparent)", border: "color-mix(in srgb, var(--color-secondary) 25%, transparent)", label: "Holiday", icon: Star },
    halfday: { color: "var(--color-info)", bg: "color-mix(in srgb, var(--color-info)    10%, transparent)", border: "color-mix(in srgb, var(--color-info)    25%, transparent)", label: "Half Day", icon: StarHalf },
};

const getStatusConfig = (status) =>
    STATUS_CONFIG[status?.toLowerCase()] || {
        color: "var(--color-text-secondary)",
        bg: "color-mix(in srgb, var(--color-border) 40%, transparent)",
        border: "var(--color-border)",
        label: status || "—",
        icon: null,
    };

const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
};

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
};

// ==================== SUB-COMPONENTS ====================

const StatusPill = ({ status }) => {
    const cfg = getStatusConfig(status);
    const Icon = cfg.icon;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 10px", borderRadius: 999,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            color: cfg.color, fontSize: 11, fontWeight: 600,
        }}>
            {Icon && <Icon size={11} />}
            {cfg.label}
        </span>
    );
};

const StatCard = ({ label, value, color, icon: Icon, sub }) => (
    <div className="flex-1 min-w-[130px] rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "var(--color-surface-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "12px 12px 0 0" }} />
        <div className="flex items-center gap-2 mb-3 mt-1">
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `color-mix(in srgb, ${color} 12%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} color={color} />
            </div>
            <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: "var(--color-text-heading)", lineHeight: 1, fontVariantNumeric: "tabular-nums", fontFamily: "Montserrat, sans-serif" }}>{value}</div>
        {sub && <div style={{ marginTop: 5, fontSize: 11, color, fontWeight: 600 }}>{sub}</div>}
    </div>
);

const FilterSelect = ({ label, value, onChange, children }) => (
    <div>
        <label style={{ display: "block", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
        <select value={value} onChange={onChange} style={{
            background: "var(--color-surface-card)", border: "1px solid var(--color-border)", borderRadius: 10,
            color: "var(--color-text-primary)", padding: "9px 14px", fontSize: 13, outline: "none",
            cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
        }}>
            {children}
        </select>
    </div>
);

const FilterDateInput = ({ label, value, onChange }) => (
    <div>
        <label style={{ display: "block", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {label} <span style={{ color: "var(--color-border)", fontWeight: 400, textTransform: "none" }}>(optional)</span>
        </label>
        <input type="date" value={value} onChange={onChange} style={{
            background: "var(--color-surface-card)", border: "1px solid var(--color-border)", borderRadius: 10,
            color: "var(--color-text-primary)", padding: "9px 14px", fontSize: 13, outline: "none",
            fontFamily: "inherit", boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
        }} />
    </div>
);

const IconChip = ({ icon: Icon, label, accent }) => (
    <div style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8,
        background: accent ? "color-mix(in srgb, var(--color-primary) 10%, transparent)" : "color-mix(in srgb, var(--color-border) 40%, transparent)",
        border: `1px solid ${accent ? "color-mix(in srgb, var(--color-primary) 30%, transparent)" : "var(--color-border)"}`,
    }}>
        <Icon size={12} color={accent ? "var(--color-primary)" : "var(--color-text-secondary)"} />
        <span style={{ fontSize: 12, color: accent ? "var(--color-primary)" : "var(--color-text-secondary)", fontWeight: accent ? 600 : 400 }}>{label}</span>
    </div>
);

// ── Time badge used in calendar cell for teacher ──
const TimeBadge = ({ icon: Icon, time, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color, fontWeight: 600, marginTop: 2 }}>
        <Icon size={8} color={color} />
        {time}
    </div>
);

// ==================== MAIN COMPONENT ====================

export default function AttendanceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const today = new Date();

    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const { data: usersData, isLoading: isUserLoading } = getUsersListQuery({ page: 1, limit: 100, search: "", role: "", status: "" });
    const currentUser = useMemo(() => (usersData?.data?.users || []).find(u => u._id === id), [usersData, id]);

    const userRole = currentUser?.role?.toLowerCase();
    const isTeacher = userRole === "staff" || userRole === "teacher";
    const isStudent = userRole === "student";

    const teacherQuery = getTeacherAttendanceQuery({ teacherId: id, startDate, endDate }, !!(isTeacher && id));
    const studentQuery = getStudentAttendanceQuery({ studentId: id, startDate, endDate }, !!(isStudent && id));
    const attendanceResponse = isTeacher ? teacherQuery?.data : studentQuery?.data;
    const isAttendanceLoading = isTeacher ? teacherQuery?.isLoading : studentQuery?.isLoading;

    const attendanceData = attendanceResponse?.data || {};
    const rawSummary = attendanceData?.summary || {};
    // Teacher API uses "totalDays", Student API uses "totalClasses" — normalise both
    const summary = {
        totalClasses: rawSummary.totalClasses ?? rawSummary.totalDays ?? 0,
        present:      rawSummary.present ?? 0,
        absent:       rawSummary.absent ?? 0,
        late:         rawSummary.late ?? 0,
        halfDay:      rawSummary.halfDay ?? 0,
        holiday:      rawSummary.holiday ?? 0,
        attendancePercentage: rawSummary.attendancePercentage ?? "0",
    };
    const records = attendanceData?.records || [];

    const filteredRecords = useMemo(() => {
        if (!Array.isArray(records)) return [];
        return records.filter(r => {
            if (!r?.date) return false;
            const d = new Date(r.date);
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        });
    }, [records, selectedMonth, selectedYear]);

    // Map: dateString → full record (so we can access checkIn/Out etc.)
    const recordMap = useMemo(() => {
        const map = {};
        filteredRecords.forEach(r => { if (r?.date) map[formatDate(r.date)] = r; });
        return map;
    }, [filteredRecords]);

    const attendanceMap = useMemo(() => {
        const map = {};
        Object.entries(recordMap).forEach(([k, r]) => { map[k] = r.status?.toLowerCase(); });
        return map;
    }, [recordMap]);

    const getDaysInMonth = (month, year) => {
        const days = new Date(year, month + 1, 0).getDate();
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return Array.from({ length: days }, (_, i) => {
            const date = new Date(year, month, i + 1);
            return { day: i + 1, weekday: weekdays[date.getDay()], dateString: formatDate(date), isToday: formatDate(date) === formatDate(new Date()) };
        });
    };

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const monthName = new Date(selectedYear, selectedMonth).toLocaleString("default", { month: "long" });
    const attendancePct = parseFloat(summary.attendancePercentage) || 0;
    const pctColor = attendancePct >= 75 ? "var(--color-success)" : "var(--color-error)";

    // ── Export: include role-specific columns ──
    const handleExportAttendance = () => {
        if (!records.length) { showError("No data to export"); return; }
        let rows;
        if (isTeacher) {
            rows = [["Date", "Status", "Check-In Time", "Check-Out Time"].join(",")];
            records.forEach(r => rows.push([
                formatDate(r.date),
                r.status || "-",
                r.checkInTime  ? new Date(r.checkInTime).toLocaleString()  : "-",
                r.checkOutTime ? new Date(r.checkOutTime).toLocaleString() : "-",
            ].map(c => `"${c}"`).join(",")));
        } else {
            rows = [["Date", "Class", "Section", "Status", "Remarks", "Marked At"].join(",")];
            records.forEach(r => rows.push([
                formatDate(r.date),
                r.class?.name || "-",
                r.section?.name || "-",
                r.status || "-",
                r.remarks || "-",
                r.markedAt ? new Date(r.markedAt).toLocaleString() : "-",
            ].map(c => `"${c}"`).join(",")));
        }
        const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `Attendance_${currentUser?.name || id}_${selectedYear}_${monthName}.csv`; a.click();
        URL.revokeObjectURL(url); showSuccess("Export completed");
    };

    const handleViewDetails = (dateString) => {
        const record = records.find(r => formatDate(r.date) === dateString);
        setSelectedRecord(record); setDetailModalOpen(true);
    };

    if (isUserLoading || isAttendanceLoading) return (
        <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: "calc(100vh - 100px)", background: "var(--color-surface-page)" }}>
            <div className="rounded-full h-12 w-12" style={{ border: "3px solid var(--color-border)", borderTopColor: "var(--color-primary)", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, fontWeight: 500 }}>Loading attendance data…</p>
        </div>
    );

    if (!currentUser) return (
        <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: "calc(100vh - 100px)", background: "var(--color-surface-page)" }}>
            <div style={{ background: "color-mix(in srgb, var(--color-error) 10%, transparent)", padding: 24, borderRadius: "50%" }}>
                <Users size={40} color="var(--color-error)" />
            </div>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 15 }}>User not found</p>
            <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "var(--color-button-primary)", color: "var(--color-button-primary-text)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
                <ArrowLeft size={15} /> Go Back
            </button>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", background: "var(--color-surface-page)", fontFamily: "Merriweather, sans-serif" }}>
            <style>{`@keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }`}</style>

            {/* ── STICKY HEADER ── */}
            <div style={{ position: "sticky", top: 0, zIndex: 30, background: "var(--color-surface-header)", borderBottom: "1px solid var(--color-border)", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <div style={{ padding: "18px 28px" }}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate(-1)}
                                style={{ width: 36, height: 36, borderRadius: 10, background: "color-mix(in srgb, var(--color-border) 50%, transparent)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 10%, transparent)"}
                                onMouseLeave={e => e.currentTarget.style.background = "color-mix(in srgb, var(--color-border) 50%, transparent)"}>
                                <ArrowLeft size={16} color="var(--color-text-secondary)" />
                            </button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary)" }} />
                                    <h1 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-text-heading)", margin: 0, fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}>
                                        Attendance Overview
                                    </h1>
                                </div>
                                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--color-text-secondary)" }}>
                                    {getGreeting()}, <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>{currentUser?.name}</span>
                                </p>
                            </div>
                        </div>

                        <button onClick={handleExportAttendance} disabled={!records.length}
                            className="flex items-center gap-2"
                            style={{ padding: "9px 18px", borderRadius: 10, background: records.length ? "color-mix(in srgb, var(--color-primary) 8%, transparent)" : "color-mix(in srgb, var(--color-border) 40%, transparent)", border: `1px solid ${records.length ? "color-mix(in srgb, var(--color-primary) 30%, transparent)" : "var(--color-border)"}`, color: records.length ? "var(--color-primary)" : "var(--color-text-secondary)", fontSize: 13, fontWeight: 600, cursor: records.length ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.15s" }}
                            onMouseEnter={e => records.length && (e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 14%, transparent)")}
                            onMouseLeave={e => records.length && (e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 8%, transparent)")}>
                            <Download size={14} /> Export Report
                        </button>
                    </div>

                    {/* User chips */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                        <IconChip icon={User} label={currentUser?.name} />
                        <IconChip icon={Mail} label={currentUser?.email} />
                        <IconChip icon={Briefcase} label={currentUser?.role} accent />
                        <IconChip icon={Activity} label={isTeacher ? "Teacher Attendance" : isStudent ? "Student Attendance" : "Attendance"} />
                    </div>
                </div>
            </div>

            <div style={{ padding: "24px 28px" }}>

                {/* ── STAT CARDS ── */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <StatCard label="Total Days" value={summary.totalClasses} color="var(--color-primary)" icon={CalendarDays} />
                    <StatCard label="Present" value={summary.present} color="var(--color-success)" icon={Check}
                        sub={summary.totalClasses ? `${Math.round((summary.present / summary.totalClasses) * 100)}% of total` : null} />
                    <StatCard label="Absent" value={summary.absent} color="var(--color-error)" icon={X}
                        sub={summary.totalClasses ? `${Math.round((summary.absent / summary.totalClasses) * 100)}% of total` : null} />
                    <StatCard label="Late" value={summary.late} color="var(--color-warning)" icon={Clock}
                        sub={summary.totalClasses ? `${Math.round((summary.late / summary.totalClasses) * 100)}% of total` : null} />
                    <StatCard label="Half Day" value={summary.halfDay} color="var(--color-info)" icon={StarHalf} />
                    {/* Attendance Rate */}
                    <div className="flex-1 min-w-[160px] rounded-2xl p-5 relative overflow-hidden"
                        style={{ background: "var(--color-surface-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: pctColor, borderRadius: "12px 12px 0 0" }} />
                        <div className="flex items-center gap-2 mb-3 mt-1">
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: `color-mix(in srgb, ${pctColor} 12%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <TrendingUp size={15} color={pctColor} />
                            </div>
                            <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Rate</span>
                        </div>
                        <div style={{ fontSize: 30, fontWeight: 800, color: pctColor, lineHeight: 1, fontVariantNumeric: "tabular-nums", fontFamily: "Montserrat, sans-serif" }}>
                            {attendancePct.toFixed(1)}%
                        </div>
                        <div style={{ marginTop: 10, height: 5, borderRadius: 99, background: "var(--color-border)" }}>
                            <div style={{ height: "100%", borderRadius: 99, width: `${Math.min(100, attendancePct)}%`, background: pctColor, transition: "width 0.8s ease" }} />
                        </div>
                    </div>
                </div>

                {/* ── FILTERS ── */}
                <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--color-surface-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarIcon size={14} color="var(--color-text-secondary)" />
                        <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Filter Period</span>
                    </div>
                    <div className="flex flex-wrap gap-4 items-end">
                        <FilterSelect label="Month" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
                            ))}
                        </FilterSelect>
                        <FilterSelect label="Year" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={i} value={today.getFullYear() - i}>{today.getFullYear() - i}</option>
                            ))}
                        </FilterSelect>
                        <FilterDateInput label="Start Date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        <FilterDateInput label="End Date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        {(startDate || endDate) && (
                            <button onClick={() => { setStartDate(""); setEndDate(""); }}
                                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, background: "color-mix(in srgb, var(--color-error) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--color-error) 25%, transparent)", color: "var(--color-error)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                <XCircle size={13} /> Clear Dates
                            </button>
                        )}
                    </div>
                </div>

                {/* ── LEGEND ── */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                        const Icon = cfg.icon;
                        return (
                            <div key={key} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 11, fontWeight: 600 }}>
                                <Icon size={11} />{cfg.label}
                            </div>
                        );
                    })}
                </div>

                {/* ── CALENDAR TABLE ── */}
                <div className="rounded-2xl w-[100vw] md:!w-[77vw] overflow-hidden mb-6" style={{ background: "var(--color-surface-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                    <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--color-border)", background: "color-mix(in srgb, var(--color-primary) 3%, var(--color-surface-card))" }}>
                        <div className="flex items-center gap-2">
                            <CalendarDays size={15} color="var(--color-primary)" />
                            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-heading)", fontFamily: "Montserrat, sans-serif" }}>{monthName} {selectedYear}</span>
                        </div>
                        <span style={{ fontSize: 11, color: "var(--color-text-secondary)", background: "color-mix(in srgb, var(--color-border) 50%, transparent)", padding: "3px 10px", borderRadius: 99, fontWeight: 500 }}>
                            {filteredRecords.length} records this month
                        </span>
                    </div>
                    <div style={{ overflowX: "auto", maxHeight: 420, overflowY: "auto" }}>
                        <table style={{ minWidth: 900, width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                                <tr style={{ background: "color-mix(in srgb, var(--color-surface-page) 70%, var(--color-surface-card))" }}>
                                    {/* Sticky label column */}
                                    <th style={{ textAlign: "left", padding: "11px 16px", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid var(--color-border)", whiteSpace: "nowrap", minWidth: 130, position: "sticky", left: 0, background: "color-mix(in srgb, var(--color-surface-page) 70%, var(--color-surface-card))", zIndex: 11 }}>Date</th>

                                    {/* Student-only columns */}
                                    {isStudent && (
                                        <>
                                            <th style={{ textAlign: "left", padding: "11px 16px", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid var(--color-border)", whiteSpace: "nowrap", minWidth: 100 }}>Class</th>
                                            <th style={{ textAlign: "left", padding: "11px 16px", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid var(--color-border)", whiteSpace: "nowrap", minWidth: 100 }}>Section</th>
                                        </>
                                    )}

                                    {daysInMonth.map(({ day, weekday, isToday, dateString }) => (
                                        <th key={dateString} style={{ textAlign: "center", padding: "10px 4px", minWidth: isTeacher ? 72 : 52, borderBottom: `2px solid ${isToday ? "var(--color-primary)" : "var(--color-border)"}`, background: isToday ? "color-mix(in srgb, var(--color-primary) 8%, var(--color-surface-card))" : "color-mix(in srgb, var(--color-surface-page) 70%, var(--color-surface-card))" }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? "var(--color-primary)" : "var(--color-text-primary)", fontVariantNumeric: "tabular-nums" }}>{day}</div>
                                            <div style={{ fontSize: 9, marginTop: 2, color: isToday ? "var(--color-primary)" : "var(--color-text-secondary)", fontWeight: 500 }}>{weekday}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                    <td style={{ padding: "13px 16px", position: "sticky", left: 0, background: "var(--color-surface-card)", zIndex: 5, fontWeight: 600, color: "var(--color-text-heading)", whiteSpace: "nowrap", fontSize: 13 }}>
                                        {monthName} {selectedYear}
                                    </td>

                                    {/* Student-only cells */}
                                    {isStudent && (
                                        <>
                                            <td style={{ padding: "13px 16px", color: "var(--color-text-secondary)" }}>—</td>
                                            <td style={{ padding: "13px 16px", color: "var(--color-text-secondary)" }}>—</td>
                                        </>
                                    )}

                                    {daysInMonth.map((d) => {
                                        const record = recordMap[d.dateString];
                                        const status = record?.status?.toLowerCase();
                                        const cfg = getStatusConfig(status);
                                        const Icon = cfg.icon;
                                        const hasRecord = !!status;

                                        return (
                                            <td key={d.dateString} onClick={() => hasRecord && handleViewDetails(d.dateString)}
                                                style={{ textAlign: "center", padding: "8px 4px", cursor: hasRecord ? "pointer" : "default", background: d.isToday ? "color-mix(in srgb, var(--color-primary) 5%, transparent)" : "transparent", transition: "background 0.15s", verticalAlign: "top" }}
                                                onMouseEnter={e => hasRecord && (e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 8%, transparent)")}
                                                onMouseLeave={e => (e.currentTarget.style.background = d.isToday ? "color-mix(in srgb, var(--color-primary) 5%, transparent)" : "transparent")}>
                                                {Icon ? (
                                                    <div>
                                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 28, height: 28, borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, margin: "0 auto", transition: "transform 0.15s" }}
                                                            onMouseEnter={e => hasRecord && (e.currentTarget.style.transform = "scale(1.15)")}
                                                            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                                                            <Icon size={13} color={cfg.color} />
                                                        </div>
                                                        {/* Teacher: show check-in / check-out times under the icon */}
                                                        {isTeacher && record?.checkInTime && (
                                                            <div style={{ marginTop: 4 }}>
                                                                <TimeBadge icon={LogIn} time={formatTime(record.checkInTime)} color="var(--color-success)" />
                                                                {record.checkOutTime
                                                                    ? <TimeBadge icon={LogOut} time={formatTime(record.checkOutTime)} color="var(--color-error)" />
                                                                    : <div style={{ fontSize: 8, color: "var(--color-text-secondary)", marginTop: 1 }}>No checkout</div>
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: "var(--color-border)", fontSize: 18, lineHeight: 1 }}>·</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {(!records || records.length === 0) && (
                        <div style={{ textAlign: "center", padding: "60px 20px" }}>
                            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--color-surface-page)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                <CalendarDays size={32} color="var(--color-border)" />
                            </div>
                            <p style={{ color: "var(--color-text-secondary)", margin: 0, fontWeight: 600, fontSize: 14 }}>No attendance records found</p>
                            <p style={{ color: "var(--color-border)", margin: "6px 0 0", fontSize: 13 }}>Try adjusting your filters</p>
                        </div>
                    )}
                </div>

                {/* ── RECENT RECORDS TABLE ── */}
                {records.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Award size={16} color="var(--color-primary)" />
                                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-heading)", fontFamily: "Montserrat, sans-serif" }}>Recent Records</span>
                            </div>
                            <span style={{ fontSize: 11, color: "var(--color-text-secondary)", background: "color-mix(in srgb, var(--color-border) 50%, transparent)", padding: "3px 10px", borderRadius: 99, fontWeight: 500 }}>{records.length} total</span>
                        </div>

                        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--color-surface-card)", border: "1px solid var(--color-border)", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                    <thead>
                                        <tr style={{ background: "color-mix(in srgb, var(--color-surface-page) 70%, var(--color-surface-card))", borderBottom: "1px solid var(--color-border)" }}>
                                            {/* Common column */}
                                            <th style={{ padding: "11px 16px", textAlign: "left", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Date</th>

                                            {/* Teacher-specific columns */}
                                            {isTeacher && (
                                                <>
                                                    <th style={{ padding: "11px 16px", textAlign: "left", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Check-In</th>
                                                    <th style={{ padding: "11px 16px", textAlign: "left", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Check-Out</th>
                                                </>
                                            )}

                                            {/* Student-specific columns */}
                                            {isStudent && (
                                                <>
                                                    <th style={{ padding: "11px 16px", textAlign: "left", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Class</th>
                                                    <th style={{ padding: "11px 16px", textAlign: "left", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Section</th>
                                                    <th style={{ padding: "11px 16px", textAlign: "left", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Remarks</th>
                                                    <th style={{ padding: "11px 16px", textAlign: "left", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Marked At</th>
                                                </>
                                            )}

                                            {/* Common columns */}
                                            <th style={{ padding: "11px 16px", textAlign: "left", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Status</th>
                                            <th style={{ padding: "11px 16px", textAlign: "center", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.slice(0, 10).map((record, index) => (
                                            <tr key={index} style={{ borderBottom: "1px solid var(--color-border)", transition: "background 0.15s" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 3%, transparent)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                                                {/* Date — always shown */}
                                                <td style={{ padding: "13px 16px", color: "var(--color-text-primary)", fontWeight: 600, whiteSpace: "nowrap" }}>{formatDisplayDate(record.date)}</td>

                                                {/* Teacher-specific cells */}
                                                {isTeacher && (
                                                    <>
                                                        <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                                                            {record.checkInTime ? (
                                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--color-success)", fontWeight: 600, fontSize: 12 }}>
                                                                    <LogIn size={12} color="var(--color-success)" />
                                                                    {formatTime(record.checkInTime)}
                                                                </span>
                                                            ) : <span style={{ color: "var(--color-text-secondary)" }}>—</span>}
                                                        </td>
                                                        <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                                                            {record.checkOutTime ? (
                                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--color-error)", fontWeight: 600, fontSize: 12 }}>
                                                                    <LogOut size={12} color="var(--color-error)" />
                                                                    {formatTime(record.checkOutTime)}
                                                                </span>
                                                            ) : (
                                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--color-text-secondary)", fontStyle: "italic" }}>
                                                                    Not checked out
                                                                </span>
                                                            )}
                                                        </td>
                                                    </>
                                                )}

                                                {/* Student-specific cells */}
                                                {isStudent && (
                                                    <>
                                                        <td style={{ padding: "13px 16px", color: "var(--color-text-secondary)" }}>{record.class?.name || "—"}</td>
                                                        <td style={{ padding: "13px 16px", color: "var(--color-text-secondary)" }}>{record.section?.name || "—"}</td>
                                                        <td style={{ padding: "13px 16px", color: "var(--color-text-secondary)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{record.remarks || "—"}</td>
                                                        <td style={{ padding: "13px 16px", color: "var(--color-text-secondary)", fontSize: 11, whiteSpace: "nowrap" }}>{record.markedAt ? formatDateTime(record.markedAt) : "—"}</td>
                                                    </>
                                                )}

                                                {/* Status — always shown */}
                                                <td style={{ padding: "13px 16px" }}><StatusPill status={record.status} /></td>

                                                {/* View button — always shown */}
                                                <td style={{ padding: "13px 16px", textAlign: "center" }}>
                                                    <button onClick={() => handleViewDetails(formatDate(record.date))}
                                                        style={{ width: 32, height: 32, borderRadius: 8, background: "color-mix(in srgb, var(--color-border) 40%, transparent)", border: "1px solid var(--color-border)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 10%, transparent)"; e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-primary) 40%, transparent)"; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-border) 40%, transparent)"; e.currentTarget.style.borderColor = "var(--color-border)"; }}>
                                                        <Eye size={14} color="var(--color-text-secondary)" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── DETAIL MODAL ── */}
            {detailModalOpen && selectedRecord && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(3,7,18,0.45)", backdropFilter: "blur(6px)", padding: 16 }}>
                    <div style={{ width: "100%", maxWidth: 420, background: "var(--color-surface-card)", border: "1px solid var(--color-border)", borderRadius: 24, boxShadow: "0 24px 60px rgba(0,0,0,0.12), 0 0 0 1px color-mix(in srgb, var(--color-primary) 15%, transparent)", overflow: "hidden", animation: "scaleIn 0.2s ease" }}>

                        {/* Modal header */}
                        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "color-mix(in srgb, var(--color-primary) 4%, var(--color-surface-card))" }}>
                            <div className="flex items-center gap-3">
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: "color-mix(in srgb, var(--color-primary) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <CalendarIcon size={16} color="var(--color-primary)" />
                                </div>
                                <span style={{ fontWeight: 700, color: "var(--color-text-heading)", fontSize: 15, fontFamily: "Montserrat, sans-serif" }}>Attendance Details</span>
                            </div>
                            <button onClick={() => setDetailModalOpen(false)}
                                style={{ width: 30, height: 30, borderRadius: 8, background: "color-mix(in srgb, var(--color-border) 50%, transparent)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                <X size={14} color="var(--color-text-secondary)" />
                            </button>
                        </div>

                        {/* User summary */}
                        <div style={{ padding: "24px", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>
                            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "color-mix(in srgb, var(--color-primary) 10%, transparent)", border: "2px solid color-mix(in srgb, var(--color-primary) 25%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                                <UserCheck size={22} color="var(--color-primary)" />
                            </div>
                            <h4 style={{ margin: "0 0 4px", color: "var(--color-text-heading)", fontWeight: 700, fontSize: 16, fontFamily: "Montserrat, sans-serif" }}>{currentUser?.name}</h4>
                            <p style={{ margin: "0 0 10px", color: "var(--color-text-secondary)", fontSize: 12 }}>{currentUser?.email}</p>
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: 999, background: "color-mix(in srgb, var(--color-primary) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)", color: "var(--color-primary)", fontSize: 11, fontWeight: 600 }}>
                                {currentUser?.role}
                            </span>
                        </div>

                        {/* Details list — role-specific */}
                        <div style={{ padding: "8px 24px 20px" }}>
                            {/* Common: Date */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
                                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>Date</span>
                                <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>{formatDisplayDate(selectedRecord.date)}</span>
                            </div>

                            {/* Teacher-specific: Check-In / Check-Out */}
                            {isTeacher && (
                                <>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>
                                            <LogIn size={12} color="var(--color-success)" /> Check-In Time
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: selectedRecord.checkInTime ? "var(--color-success)" : "var(--color-text-secondary)" }}>
                                            {selectedRecord.checkInTime ? formatDateTime(selectedRecord.checkInTime) : "—"}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>
                                            <LogOut size={12} color="var(--color-error)" /> Check-Out Time
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: selectedRecord.checkOutTime ? "var(--color-error)" : "var(--color-text-secondary)", fontStyle: selectedRecord.checkOutTime ? "normal" : "italic" }}>
                                            {selectedRecord.checkOutTime ? formatDateTime(selectedRecord.checkOutTime) : "Not checked out"}
                                        </span>
                                    </div>
                                </>
                            )}

                            {/* Student-specific: Class, Section, Remarks, Marked At */}
                            {isStudent && (
                                <>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
                                        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>Class</span>
                                        <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>{selectedRecord.class?.name || "—"}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
                                        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>Section</span>
                                        <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>{selectedRecord.section?.name || "—"}</span>
                                    </div>
                                    {selectedRecord.remarks && (
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
                                            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>Remarks</span>
                                            <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{selectedRecord.remarks}</span>
                                        </div>
                                    )}
                                    {selectedRecord.markedAt && (
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
                                            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>Marked At</span>
                                            <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>{formatDateTime(selectedRecord.markedAt)}</span>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Common: Status */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>Status</span>
                                <StatusPill status={selectedRecord.status} />
                            </div>
                        </div>

                        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "flex-end" }}>
                            <button onClick={() => setDetailModalOpen(false)}
                                style={{ padding: "9px 20px", borderRadius: 10, background: "color-mix(in srgb, var(--color-border) 50%, transparent)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 10%, transparent)"; e.currentTarget.style.color = "var(--color-primary)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-border) 50%, transparent)"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}