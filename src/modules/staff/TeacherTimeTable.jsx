import React from 'react';
import { getTeacherTimetableQuery } from '../../hooks/useQueryMutations';
import { Clock, GraduationCap, Utensils } from "lucide-react";

const TeacherTimeTable = () => {
    // ── Data Fetching ──
    const { data: response, isLoading } = getTeacherTimetableQuery();

    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Rows and Data mapping from new API response
    const allPeriods = response?.data?.allPeriods || [];
    const groupedByDay = response?.data?.groupedByDay || {};

    // Helper to find the specific entry for a Day and Period ID
    const getCellData = (day, periodId) => {
        return groupedByDay[day]?.find(item => item.period._id === periodId);
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse">Syncing Schedule...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <GraduationCap className="text-primary w-10 h-10" />
                            FACULTY SCHEDULE
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Manage your weekly lecture allocations and breaks.</p>
                    </div>
                </div>

                {/* ── Timetable Grid ── */}
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden overflow-x-auto">
                    <table className="w-full border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-900">
                                <th className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-r border-slate-800 w-44">
                                    Time Slot
                                </th>
                                {DAYS.map(day => (
                                    <th key={day} className="p-5 text-center text-xs font-black text-white uppercase tracking-wider border-r border-slate-800 last:border-0">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {allPeriods.map((period) => {
                                const isLunch = period.name.toLowerCase() === 'lunch';

                                return (
                                    <tr key={period._id} className={`border-b border-slate-100 last:border-0 transition-colors ${isLunch ? 'bg-amber-50/50' : 'hover:bg-slate-50/50'}`}>

                                        {/* Time Column */}
                                        <td className={`p-5 border-r border-slate-100 ${isLunch ? 'bg-amber-100/30' : 'bg-slate-50/30'}`}>
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isLunch ? 'text-amber-600' : 'text-primary'}`}>
                                                    {period.name}
                                                </span>
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                    <Clock className={`w-3.5 h-3.5 ${isLunch ? 'text-amber-400' : 'text-slate-300'}`} />
                                                    {period.startTime} — {period.endTime}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Days Columns */}
                                        {DAYS.map(day => {
                                            const session = getCellData(day, period._id);

                                            return (
                                                <td key={day} className="p-3 border-r border-slate-100 last:border-0 align-middle">
                                                    {isLunch ? (
                                                        <div className="flex flex-col items-center justify-center py-2 opacity-60">
                                                            <Utensils className="w-4 h-4 text-amber-500 mb-1" />
                                                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-tighter">Refectory Break</span>
                                                        </div>
                                                    ) : session?.subject ? (
                                                        <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm group hover:border-primary hover:shadow-md transition-all">
                                                            <div className="space-y-3">
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                                                                    Class {session.class}
                                                                </span>
                                                                <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">
                                                                    {session.subject.name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center group py-6">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Status Legend */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 px-2">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/40"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Lecture</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/40"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lunch Break</span>
                        </div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-full uppercase tracking-tighter">
                        Teacher Ref ID: {response?.data?.teacherId}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherTimeTable;