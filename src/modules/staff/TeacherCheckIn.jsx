import React, { useState } from "react";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { teacherCheckIn, teacherCheckOut } from "../../api/apiMehods";
import { showError, showSuccess } from "../../utils/toast";


export default function TeacherCheckInOUt() {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            if (!isCheckedIn) {
                await teacherCheckIn();
                setIsCheckedIn(true);
                showSuccess("Check-in successful! Have a great day.");
            } else {
                await teacherCheckOut();
                setIsCheckedIn(false);
                showSuccess("Check-out successful. See you tomorrow!");
            }
        } catch (err) {
            showError(err?.response?.data?.message || "Attendance update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {localStorage.getItem("role") === "STAFF" &&
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`
                relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300
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

                    {/* Status Indicator Dot */}
                    <span className={`flex h-2 w-2 rounded-full ${isCheckedIn ? "bg-success animate-pulse" : "bg-primary"}`} />
                </button>}

        </>
    );
}