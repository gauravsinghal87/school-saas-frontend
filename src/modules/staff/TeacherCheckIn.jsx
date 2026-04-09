import React, { useState } from "react";
import { LogIn, LogOut, Loader2, Eye, CalendarDays } from "lucide-react";
import { teacherCheckIn, teacherCheckOut } from "../../api/apiMehods";
import { showError, showSuccess } from "../../utils/toast";
import { getTeacherInOutTimesQuery } from "../../hooks/useQueryMutations";
import { useNavigate } from "react-router-dom";

function formatTime(isoString) {
    if (!isoString) return null;
    return new Date(isoString).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function getTodayRecord(records = []) {
    const todayIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const todayStr = todayIST.toISOString().slice(0, 10); // "YYYY-MM-DD"

    return records.find((r) => {
        // date is stored as 18:30 UTC = 00:00 IST next day, so add 5.5h offset
        const recordIST = new Date(new Date(r.date).getTime() + 5.5 * 60 * 60 * 1000);
        return recordIST.toISOString().slice(0, 10) === todayStr;
    }) ?? null;
}

export default function TeacherCheckInOUt() {
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const { data, refetch } = getTeacherInOutTimesQuery({ teacherId: user?.id });

    const records = data?.data?.records ?? [];
    const todayRecord = getTodayRecord(records);

    const checkInTime = todayRecord?.checkInTime ?? null;
    const checkOutTime = todayRecord?.checkOutTime ?? null; // will be null if field absent
    const isCheckedIn = !!checkInTime && !checkOutTime;
    const navigate = useNavigate()
    const handleToggle = async () => {
        setLoading(true);
        try {
            if (!isCheckedIn) {
                await teacherCheckIn();
                showSuccess("Check-in successful! Have a great day.");
            } else {
                await teacherCheckOut();
                showSuccess("Check-out successful. See you tomorrow!");
            }
            refetch();
        } catch (err) {
            showError(err?.response?.data?.message || "Attendance update failed");
        } finally {
            setLoading(false);
        }
    };

    if (localStorage.getItem("role") !== "STAFF") return null;

    return (
        <div className="flex items-center gap-2 ">
            <button
                onClick={() => navigate("/staff/attendance-records")}
                className="hidden sm:flex items-center gap-1.5 px-2.5 hover:cursor-pointer py-1.5 rounded-full text-xs font-semibold
        bg-base-200 hover:bg-base-300 text-base-content/60 hover:text-base-content
        border border-border hover:border-border transition-all duration-200 group"
                title="View attendance records"
            >
                <CalendarDays size={13} className="group-hover:text-heading text-text-heading " />
                <span className='text-text-heading'>Records</span>
            </button>
            {checkInTime && (
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-base-content/60">
                    <span className="text-success font-medium">
                        In: {formatTime(checkInTime)}
                    </span>
                    {checkOutTime && (
                        <>
                            <span className="opacity-40">·</span>
                            <span className="text-error font-medium">
                                Out: {formatTime(checkOutTime)}
                            </span>
                        </>
                    )}
                </div>
            )}

            {!checkOutTime && (
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`
                        relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold
                        transition-all duration-300
                        ${isCheckedIn
                            ? "bg-success/10 text-success border border-success/20 hover:bg-success/20"
                            : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                        }
                        ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                    `}
                >
                    {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : isCheckedIn ? (
                        <LogOut size={14} />
                    ) : (
                        <LogIn size={14} />
                    )}
                    <span className="hidden sm:inline">
                        {loading ? "Processing..." : isCheckedIn ? "Check Out" : "Check In"}
                    </span>
                    <span className={`flex h-2 w-2 rounded-full ${isCheckedIn ? "bg-success animate-pulse" : "bg-primary"}`} />
                </button>
            )}
        </div>
    );
}