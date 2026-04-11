import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  BookOpen,
  User,
  Coffee,
  Clock,
  MapPin,
  GraduationCap,
  Loader2,
  Sun,
  Moon,
  Bell,
  ChevronRight
} from "lucide-react";
import { useStudentTimetable } from "../../../hooks/useQueryMutations";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Helper to format time
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHours = h % 12 || 12;
  return `${formattedHours}:${minutes} ${ampm}`;
};

// Get period of day
const getPeriodOfDay = (timeStr) => {
  if (!timeStr) return "day";
  const [hours] = timeStr.split(":");
  const h = parseInt(hours, 10);
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
};

// Get icon and color for period
const getPeriodStyle = (period) => {
  const styles = {
    morning: { icon: Sun, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    afternoon: { icon: Sun, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    evening: { icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    default: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  };
  return styles[period] || styles.default;
};

// Skeleton Loader
const TimetableSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
      ))}
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-surface-page dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Current Time Indicator Component
const CurrentTimeIndicator = ({ currentPeriod }) => {
  if (!currentPeriod) return null;

  return (
    <div className="mb-4 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-primary">Currently in session</span>
        <ChevronRight size={14} className="text-primary" />
        <span className="text-sm font-semibold text-primary">{currentPeriod.periodId?.name}</span>
        <span className="text-xs text-gray-500">
          ({formatTime(currentPeriod.periodId?.startTime)} - {formatTime(currentPeriod.periodId?.endTime)})
        </span>
      </div>
    </div>
  );
};

// Class Card Component
const ClassCard = ({ entry, index }) => {
  const periodType = getPeriodOfDay(entry.periodId?.startTime);
  const PeriodIcon = getPeriodStyle(periodType).icon;
  const progress = ((index + 1) / 6) * 100; // For visual progress

  return (
    <div className="group relative">
      {/* Progress line on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/40 to-primary/10 rounded-l-2xl"></div>

      <div className="bg-surface-page dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transform hover:-translate-y-0.5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Time Card */}
          <div className="sm:w-28 flex-shrink-0">
            <div className={`${getPeriodStyle(periodType).bg} rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700`}>
              <PeriodIcon className={`w-5 h-5 ${getPeriodStyle(periodType).color} mx-auto mb-1`} />
              <p className="text-xs font-medium text-gray-500 ">
                {getPeriodStyle(periodType).bg.includes('amber') ? 'Morning' :
                  getPeriodStyle(periodType).bg.includes('orange') ? 'Afternoon' : 'Evening'}
              </p>
              <p className="text-sm font-bold   mt-1">
                {formatTime(entry.periodId?.startTime)}
              </p>
              <p className="text-xs text-gray-500 ">
                - {formatTime(entry.periodId?.endTime)}
              </p>
            </div>
          </div>

          {/* Class Details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg">
                  {entry.periodId?.name}
                </span>
                <span className="text-xs text-gray-400">Period {entry.periodId?.order}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold   mb-3 flex items-center gap-2">
              <BookOpen className="text-primary" size={18} />
              {entry.subjectId?.name || "Subject Not Assigned"}
            </h3>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <User size={12} className="text-gray-500" />
                </div>
                <span>Teacher: <span className="font-medium  ">
                  {entry.teacherId?.name || "TBA"}
                </span></span>
              </div>

              {entry.classroom && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin size={14} />
                  <span>Room: {entry.classroom}</span>
                </div>
              )}
            </div>

            {/* Progress indicator for the day */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Day progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
                <div
                  className="bg-primary/60 rounded-full h-1 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ day }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-page from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
    <div className="w-20 h-20 bg-surface-page dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-md">
      <Coffee className="text-gray-400" size={32} />
    </div>
    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
      No Classes Today! 🎉
    </h3>
    <p className="text-gray-500  max-w-sm px-4">
      You have a free day on {day}. Use this time to catch up on assignments,
      review your notes, or take a well-deserved break!
    </p>
    <div className="mt-6 flex gap-2">
      <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">Self Study</span>
      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Assignment Due</span>
      <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">Exam Prep</span>
    </div>
  </div>
);

// Statistics Summary Component
const StatisticsSummary = ({ schedule }) => {
  const totalClasses = schedule.reduce((sum, day) => sum + day.length, 0);
  const avgClassesPerDay = (totalClasses / 6).toFixed(1);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div className="bg-surface-page p-3 text-center">
        <GraduationCap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
        <p className="text-2xl font-bold text-blue-600">{totalClasses}</p>
        <p className="text-xs text-gray-600 ">Total Classes</p>
      </div>
      <div className="bg-surface-page f rounded-xl p-3 text-center">
        <CalendarDays className="w-5 h-5 text-green-600 mx-auto mb-1" />
        <p className="text-2xl font-bold text-green-600">{avgClassesPerDay}</p>
        <p className="text-xs text-gray-600 ">Avg/Day</p>
      </div>
      <div className="bg-surface-page  rounded-xl p-3 text-center">
        <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
        <p className="text-2xl font-bold text-purple-600">6</p>
        <p className="text-xs text-gray-600 ">Periods/Day</p>
      </div>
      <div className="bg-surface-page from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-3 text-center">
        <Bell className="w-5 h-5 text-orange-600 mx-auto mb-1" />
        <p className="text-2xl font-bold text-orange-600">{DAYS_OF_WEEK.length}</p>
        <p className="text-xs text-gray-600 ">School Days</p>
      </div>
    </div>
  );
};

// Main Component
export default function StudentTimetable() {
  // Auto-select today's day, or default to Monday
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const initialDay = DAYS_OF_WEEK.includes(today) ? today : "Monday";

  const [activeDay, setActiveDay] = useState(initialDay);

  // Fetch Timetable API
  const { data: response, isLoading } = useStudentTimetable();

  // Group and sort entries by Day and Period Order
  const groupedSchedule = useMemo(() => {
    const groups = DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {});

    const entries = response?.data?.entries;
    if (!entries || !Array.isArray(entries)) return groups;

    entries.forEach((entry) => {
      if (groups[entry.day]) {
        groups[entry.day].push(entry);
      }
    });

    // Sort periods chronologically for each day
    Object.keys(groups).forEach((day) => {
      groups[day].sort(
        (a, b) => (a.periodId?.order || 0) - (b.periodId?.order || 0)
      );
    });

    return groups;
  }, [response]);

  const currentDayClasses = groupedSchedule[activeDay] || [];

  // Find current ongoing period
  const currentPeriod = useMemo(() => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    return currentDayClasses.find(entry => {
      const start = entry.periodId?.startTime;
      const end = entry.periodId?.endTime;
      return start && end && currentTime >= start && currentTime <= end;
    });
  }, [currentDayClasses]);

  // Prepare schedule array for statistics
  const scheduleArray = useMemo(() => {
    return DAYS_OF_WEEK.map(day => groupedSchedule[day] || []);
  }, [groupedSchedule]);

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CalendarDays className="text-primary" size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold  ">
                My Weekly Schedule
              </h1>
              <p className="text-sm text-gray-500  mt-1">
                Your personalized academic timetable for the current session
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <TimetableSkeleton />
        ) : (
          <>
            {/* Statistics Summary */}
            <StatisticsSummary schedule={scheduleArray} />

            {/* Current Period Indicator */}
            {currentPeriod && <CurrentTimeIndicator currentPeriod={currentPeriod} />}

            {/* Day Selector Tabs */}
            <div className="mb-6">
              <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
                {DAYS_OF_WEEK.map((day) => {
                  const isActive = activeDay === day;
                  const classCount = groupedSchedule[day]?.length || 0;
                  const isToday = today === day;

                  return (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`relative flex flex-col items-center px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer ${isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "bg-surface-page dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        }`}
                    >
                      <span className="text-sm font-semibold">{day}</span>
                      <span className={`text-xs mt-0.5 ${isActive ? "text-white/80" : "text-gray-400"
                        }`}>
                        {classCount} {classCount === 1 ? "class" : "classes"}
                      </span>
                      {isToday && !isActive && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Classes List */}
            <div className="space-y-4">
              {currentDayClasses.length > 0 ? (
                currentDayClasses.map((entry, index) => (
                  <ClassCard key={index} entry={entry} index={index} />
                ))
              ) : (
                <EmptyState day={activeDay} />
              )}
            </div>

            {/* Footer Note */}
            <div className="mt-8 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                ⏰ Timetable is subject to change. Please check with your class teacher for any updates.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
