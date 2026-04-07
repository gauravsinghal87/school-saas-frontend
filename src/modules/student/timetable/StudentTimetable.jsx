import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, BookOpen, User, Coffee, Clock } from "lucide-react";
import { useStudentTimetable } from "../../../hooks/useQueryMutations";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
// Helper to format "9:30" to "09:30 AM"
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHours = h % 12 || 12;
  return `${formattedHours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const TimetableSkeleton = () => (
  <div className="animate-pulse">
    {/* Tabs Skeleton */}
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 hide-scrollbar">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-10 w-28 bg-surface-card rounded-full flex-shrink-0 border border-border"
        ></div>
      ))}
    </div>
    {/* Timeline Skeleton */}
    <div className="flex flex-col gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-6">
          <div className="w-full sm:w-24 h-8 sm:h-16 bg-surface-card rounded-lg sm:rounded-xl flex-shrink-0 border border-border"></div>
          <div className="flex-1 h-24 bg-surface-card rounded-2xl border border-border"></div>
        </div>
      ))}
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function StudentTimetable() {
  // Automatically select today's day, or default to Monday if it's Sunday
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const initialDay = DAYS_OF_WEEK.includes(today) ? today : "Monday";

  const [activeDay, setActiveDay] = useState(initialDay);

  // Fetch Timetable API
const { data: response, isLoading } = useStudentTimetable();
  // Group and sort entries by Day and Period Order
  const groupedSchedule = useMemo(() => {
    // Initialize empty arrays for all days to ensure tabs always work
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
        (a, b) => (a.periodId?.order || 0) - (b.periodId?.order || 0),
      );
    });

    return groups;
  }, [response]);

  const currentDayClasses = groupedSchedule[activeDay] || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-surface-page animate-fadeUp">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-['Montserrat'] font-bold text-text-heading flex items-center gap-2">
          <CalendarDays className="text-primary" size={24} />
          Weekly Class Schedule
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-lg">
          Your personalized academic timetable for the current session.
        </p>
      </div>

      {isLoading ? (
        <TimetableSkeleton />
      ) : (
        <div className="max-w-4xl">
          {/* Day Selector (Tabs) */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {DAYS_OF_WEEK.map((day) => {
              const isActive = activeDay === day;
              const classCount = groupedSchedule[day]?.length || 0;

              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20 border-transparent scale-105"
                      : "bg-surface-card text-text-secondary border border-border hover:border-primary/50 hover:text-text-primary hover:bg-surface-page"
                  }`}
                >
                  {day}
                  {/* Subtle indicator for how many classes are on this day */}
                  <span
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-surface-page border border-border text-text-secondary"
                    }`}
                  >
                    {classCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timeline View */}
          <div className="relative">
            {/* Vertical timeline spine (hidden on mobile, visible on sm+) */}
            <div className="absolute left-[88px] top-4 bottom-4 w-px bg-border hidden sm:block"></div>

            {currentDayClasses.length > 0 ? (
              <div className="flex flex-col gap-5 sm:gap-6 relative z-10 animate-fadeUp">
                {currentDayClasses.map((entry, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-8 group"
                  >
                    {/* Time Block (Left side) */}
                    <div className="sm:w-[120px] flex sm:flex-col items-center sm:items-end justify-start sm:justify-center gap-2 sm:gap-0 sm:text-right pt-0 sm:pt-4">
                      {/* Mobile view time formatting */}
                      <div className="flex items-center gap-1.5 sm:hidden bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                        <Clock size={12} className="text-primary" />
                        <span className="text-[11px] font-bold text-primary">
                          {formatTime(entry.periodId?.startTime)} -{" "}
                          {formatTime(entry.periodId?.endTime)}
                        </span>
                      </div>

                      {/* Desktop view time formatting */}
                      <div className="hidden sm:block text-sm font-bold text-text-primary">
                        {formatTime(entry.periodId?.startTime)}
                      </div>
                      <div className="hidden sm:block text-[11px] text-text-secondary font-medium">
                        {formatTime(entry.periodId?.endTime)}
                      </div>

                      {/* Timeline Dot (Desktop only) */}
                      <div className="hidden sm:block absolute left-[84px] w-[9px] h-[9px] rounded-full bg-surface-page border-2 border-primary group-hover:bg-primary transition-colors duration-300 mt-0.5"></div>
                    </div>

                    {/* Class Details Card (Right side) */}
                    <div className="flex-1 bg-surface-card border border-border rounded-2xl p-4 sm:p-5 hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden sm:group-hover:-translate-y-0.5">
                      {/* Subtle accent line on the left of the card */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors duration-300"></div>

                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                            {entry.periodId?.name}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-['Montserrat'] font-bold text-text-heading mb-3 flex items-center gap-2 group-hover:text-primary transition-colors">
                        <BookOpen
                          className="text-primary opacity-80"
                          size={18}
                        />
                        {entry.subjectId?.name || "Subject Not Assigned"}
                      </h3>

                      <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-text-secondary font-medium border-t border-border/50 pt-3">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-surface-page border border-border flex items-center justify-center flex-shrink-0">
                          <User size={13} className="text-text-secondary" />
                        </div>
                        Teacher:{" "}
                        <span className="text-text-primary">
                          {entry.teacherId?.name || "TBA"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State for Days with no classes */
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center bg-surface-card border border-dashed border-border rounded-2xl animate-fadeUp">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-page rounded-full flex items-center justify-center mb-4 border border-border">
                  <Coffee
                    className="text-text-secondary opacity-60"
                    size={24}
                  />
                </div>
                <h3 className="text-[15px] sm:text-[16px] font-bold text-text-primary mb-1">
                  No Classes Scheduled
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary max-w-[250px] px-4">
                  You have a free day on {activeDay}! Enjoy your break or use
                  this time to catch up on assignments.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
