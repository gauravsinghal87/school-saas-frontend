import { useState } from "react";
import Periods from "./Periods";
import TimetableSchedule from "./TimetableSchedule";

export default function Timetable() {
    const [activeTab, setActiveTab] = useState("periods");

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-heading">Timetable Management</h1>
                <p className="text-sm text-text-secondary mt-0.5">
                    Manage periods and create class timetables
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="flex gap-6">
                    <button
                        onClick={() => setActiveTab("periods")}
                        className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === "periods"
                                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            }`}
                    >
                        Manage Periods
                    </button>
                    <button
                        onClick={() => setActiveTab("timetable")}
                        className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === "timetable"
                                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            }`}
                    >
                        Class Timetable
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === "periods" && <Periods />}
                {activeTab === "timetable" && <TimetableSchedule />}
            </div>
        </div>
    );
}