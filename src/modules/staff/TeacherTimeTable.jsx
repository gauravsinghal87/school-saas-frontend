import React, { useState } from 'react';
import { getTeacherTimetableQuery } from '../../hooks/useQueryMutations';
import DataTable from "../../components/common/ReusableTable";
import SlidePanel from "../../components/common/SlidePanel";
import { Eye, CalendarDays } from "lucide-react";

const PANEL_MODE = { VIEW: "view" };

const TeacherTimeTable = () => {
    // ── State ──
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [panel, setPanel] = useState({ open: false, mode: null, row: null });

    // ── Data Fetching ──
    const { data: response, isLoading } = getTeacherTimetableQuery({
        classId: '69ce4ef9b99f96284e262cb3',
        sectionId: '69ce4ef9b99f96284e262cb5',
        page,
        limit,
        search
    });

    const timetableData = response?.data?.entries || [];
    const total = response?.data?.pagination?.total || timetableData.length;

    // ── Panel Handlers ──
    const openView = (row) => setPanel({ open: true, mode: PANEL_MODE.VIEW, row });
    const closePanel = () => setPanel({ open: false, mode: null, row: null });

    // ── Table Columns ──
    const COLUMNS = [
        {
            key: "day",
            label: "Day",
            sortable: true,
            render: (val) => <span className="font-semibold text-text-heading">{val}</span>
        },
        {
            key: "periodId.name",
            label: "Period",
            render: (_, row) => (
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {row.periodId.name}
                </span>
            )
        },
        {
            key: "subjectId.name",
            label: "Subject",
            render: (_, row) => <span className="font-medium">{row.subjectId.name}</span>
        },
        {
            key: "timing",
            label: "Timing",
            render: (_, row) => (
                <div className="text-xs font-bold text-text-secondary uppercase tracking-tight">
                    {row.periodId.startTime} — {row.periodId.endTime}
                </div>
            )
        },
        {
            key: "teacherId.name",
            label: "Teacher",
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-[10px]">
                        {row.teacherId.name.charAt(0)}
                    </div>
                    <span className="text-sm">{row.teacherId.name}</span>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-heading italic flex items-center gap-2">
                            {/* <CalendarDays className="w-6 h-6 text-primary" /> */}
                            Teacher Timetable
                        </h1>
                        <p className="text-sm text-text-secondary mt-0.5">
                            Manage and track academic schedules and subject allocations.
                        </p>
                    </div>
                </div>

                {/* Main Table */}
                <DataTable
                    title="Schedule Overview"
                    columns={COLUMNS}
                    data={timetableData}
                    loading={isLoading}
                    rowKey={(row) => row.periodId._id}
                    emptyMessage="No schedule found for this class/section."
                    searchPlaceholder="Search by day, subject or teacher..."
                    serverMode
                    page={page}
                    total={total}
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    onPageChange={setPage}
                    onPageSizeChange={(val) => { setLimit(val); setPage(1); }}
                    actionCell={(row) => (
                        <button
                            onClick={() => openView(row)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    )}
                />
            </div>

            {/* View Details Slide Panel */}
            <SlidePanel
                open={panel.open}
                onClose={closePanel}
                title="Class Details"
                subtitle={`${panel.row?.day} - ${panel.row?.periodId?.name}`}
            >
                {panel.mode === PANEL_MODE.VIEW && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-border bg-surface-page p-5 space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Subject</label>
                                <p className="text-lg font-bold text-text-heading">{panel.row?.subjectId?.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Start Time</label>
                                    <p className="font-semibold text-primary">{panel.row?.periodId?.startTime}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">End Time</label>
                                    <p className="font-semibold text-primary">{panel.row?.periodId?.endTime}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border border-border rounded-2xl space-y-3">
                            <p className="text-sm font-semibold text-text-heading">Assigned Faculty</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl">
                                    {panel.row?.teacherId?.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-text-heading">{panel.row?.teacherId?.name}</p>
                                    <p className="text-xs text-text-secondary">Faculty ID: {panel.row?.teacherId?._id?.slice(-6).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SlidePanel>
        </div>
    );
};

export default TeacherTimeTable;