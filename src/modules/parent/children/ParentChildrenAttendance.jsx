import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarRange,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  useMyChildren,
  useParentStudentAttendance,
} from "../../../hooks/useQueryMutations";
import ChildrenSkeleton from "../components/loaders/ChildrenSkeleton";
import AttendanceSkeleton from "../components/loaders/AttendanceSkeleton";

export default function ParentChildrenAttendance() {
  // Default to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const [selectedChild, setSelectedChild] = useState(null);
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const { data: childrenRes, isLoading: isChildrenLoading } = useMyChildren();

  const childrenList = childrenRes?.data?.data || [];

  useEffect(() => {
    if (childrenList.length > 0 && !selectedChild) {
      setSelectedChild(childrenList[0]);
    }
  }, [childrenList, selectedChild]);

  const {
    data: attendanceRes,
    isLoading: isAttendanceLoading,
    isFetching: isAttendanceFetching,
  } = useParentStudentAttendance({
    studentId: selectedChild?.user?.userId,
    startDate,
    endDate,
  });
console.log(selectedChild)
  const summary = attendanceRes?.data?.summary || {
    totalClasses: 0,
    present: 0,
    absent: 0,
    late: 0,
    attendancePercentage: "0.00",
  };
  const records = attendanceRes?.data?.records || [];

  // Helper for Status Colors
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return {
          color: "text-success",
          bg: "bg-success/10",
          icon: CheckCircle2,
        };
      case "absent":
        return { color: "text-error", bg: "bg-error/10", icon: XCircle };
      case "late":
        return { color: "text-warning", bg: "bg-warning/10", icon: Clock };
      case "halfday":
        return { color: "text-info", bg: "bg-info/10", icon: AlertCircle };
      default:
        return {
          color: "text-text-secondary",
          bg: "bg-surface-page",
          icon: CalendarDays,
        };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-surface-page animate-fadeUp">
      {/* ─── HEADER ─── */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-['Montserrat'] font-bold text-text-heading flex items-center gap-2">
          <Users className="text-primary" size={24} />
          My Children
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Select a child to view their attendance and academic performance.
        </p>
      </div>

      {/* ─── CHILDREN SELECTOR CARDS ─── */}
      <div className="mb-8">
        {isChildrenLoading ? (
          <ChildrenSkeleton />
        ) : childrenList.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {childrenList.map((child) => {
              const isSelected = selectedChild?._id === child._id;
              return (
                <button
                  key={child._id}
                  onClick={() => setSelectedChild(child)}
                  className={`group relative flex-shrink-0 w-[260px] sm:w-[280px] p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected
                      ? "bg-surface-card border-primary shadow-md shadow-primary/10 ring-1 ring-primary/20"
                      : "bg-surface-card border-border hover:border-primary/50 hover:bg-surface-page"
                  }`}
                >
                  {/* Subtle active indicator blob */}
                  {isSelected && (
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
                  )}

                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg uppercase transition-colors ${isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary/20"}`}
                    >
                      {child.firstName?.charAt(0)}
                      {child.lastName?.charAt(0)}
                    </div>
                    <div>
                      <h3
                        className={`font-semibold text-[15px] ${isSelected ? "text-primary" : "text-text-primary"}`}
                      >
                        {child.firstName} {child.lastName}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5 font-medium">
                        Admn No: {child.admissionNumber}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-surface-card border border-border rounded-2xl text-center">
            <p className="text-sm text-text-secondary">
              No children linked to your account.
            </p>
          </div>
        )}
      </div>

      {/* ─── ATTENDANCE DASHBOARD ─── */}
      {selectedChild && (
        <div className="animate-fadeUp">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-t border-border pt-8">
            <h2 className="text-lg font-['Montserrat'] font-bold text-text-heading flex items-center gap-2">
              <CalendarRange className="text-primary" size={20} />
              Attendance Overview
            </h2>

            {/* Date Filters */}
            <div className="flex items-center gap-2 bg-surface-card border border-border rounded-xl p-1 shadow-sm w-full sm:w-auto">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-text-primary focus:outline-none p-2 w-full sm:w-auto cursor-pointer"
              />
              <span className="text-border">|</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-text-primary focus:outline-none p-2 w-full sm:w-auto cursor-pointer"
              />
            </div>
          </div>

          {isAttendanceLoading ? (
            <AttendanceSkeleton />
          ) : (
            <div className="relative">
              {/* Fetching overlay for date changes */}
              {isAttendanceFetching && !isAttendanceLoading && (
                <div className="absolute inset-0 bg-surface-page/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                  <Loader2 className="animate-spin text-primary" size={24} />
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Percentage Card */}
                <div className="bg-surface-card border border-border rounded-2xl p-5 relative overflow-hidden flex flex-col justify-center shadow-sm">
                  <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Overall Rate
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl sm:text-4xl font-['Montserrat'] font-bold text-primary leading-none">
                      {summary.attendancePercentage}%
                    </span>
                  </div>
                  {/* Progress bar visual */}
                  <div className="w-full bg-surface-page h-1.5 rounded-full mt-4 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-1000"
                      style={{ width: `${summary.attendancePercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Present Card */}
                <div className="bg-surface-card border border-border rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-success/10 text-success flex items-center justify-center">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Present
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-text-heading">
                    {summary.present}{" "}
                    <span className="text-sm font-medium text-text-secondary">
                      days
                    </span>
                  </span>
                </div>

                {/* Absent Card */}
                <div className="bg-surface-card border border-border rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-error/10 text-error flex items-center justify-center">
                      <XCircle size={14} />
                    </div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Absent
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-text-heading">
                    {summary.absent}{" "}
                    <span className="text-sm font-medium text-text-secondary">
                      days
                    </span>
                  </span>
                </div>

                {/* Late/Half-day Card */}
                <div className="bg-surface-card border border-border rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-warning/10 text-warning flex items-center justify-center">
                      <Clock size={14} />
                    </div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Late / Half
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-text-heading">
                    {summary.late + summary.halfDay}{" "}
                    <span className="text-sm font-medium text-text-secondary">
                      days
                    </span>
                  </span>
                </div>
              </div>

              {/* Detailed Records List */}
              <div className="bg-surface-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-border bg-surface-page/50">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Daily Log
                  </h3>
                </div>

                {records.length > 0 ? (
                  <div className="divide-y divide-border">
                    {records.map((record, idx) => {
                      const StatusIcon = getStatusConfig(record.status).icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 sm:px-6 hover:bg-surface-page/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusConfig(record.status).bg} ${getStatusConfig(record.status).color}`}
                            >
                              <StatusIcon size={18} />
                            </div>
                            <div>
                              <div className="font-semibold text-text-primary text-sm">
                                {new Date(record.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </div>
                              {record.remarks && (
                                <div className="text-xs text-text-secondary mt-0.5 max-w-[200px] sm:max-w-md truncate">
                                  Note: {record.remarks}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <span
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${getStatusConfig(record.status).bg} ${getStatusConfig(record.status).color} border-${getStatusConfig(record.status).color}/20`}
                            >
                              {record.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CalendarDays
                      className="text-text-secondary opacity-30 mb-3"
                      size={40}
                    />
                    <h3 className="text-sm font-bold text-text-primary">
                      No Records Found
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      There is no attendance data for the selected date range.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
