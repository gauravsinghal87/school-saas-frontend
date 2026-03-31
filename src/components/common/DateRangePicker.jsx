import { useState, useRef, useEffect } from "react";

const days = ["S", "M", "T", "W", "T", "F", "S"];

const getDaysInMonth = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

const toDate = (d) => (d ? new Date(d) : null);

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return toDate(d1).toDateString() === toDate(d2).toDateString();
};

const isBetween = (date, start, end) => {
  if (!start || !end) return false;
  return toDate(date) > toDate(start) && toDate(date) < toDate(end);
};

export default function DateRangePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const ref = useRef();

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleDateClick = (date) => {
    if (!value.startDate || value.endDate) {
      onChange({ startDate: date, endDate: null });
    } else {
      if (date < value.startDate) {
        onChange({ startDate: date, endDate: value.startDate });
      } else {
        onChange({ ...value, endDate: date });
      }
    }
  };

  const changeMonth = (dir) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + dir);
    setCurrentMonth(newDate);
  };

  const renderCalendar = (monthOffset = 0) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      1
    );

    const monthDays = getDaysInMonth(
      date.getFullYear(),
      date.getMonth()
    );

    return (
      <div className="p-4 w-[260px]">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          {monthOffset === 0 && (
            <button onClick={() => changeMonth(-1)} className="text-gray-400 hover:text-black">‹</button>
          )}
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            {date.toLocaleString("default", { month: "long" })}{" "}
            {date.getFullYear()}
          </h3>
          {monthOffset === 1 && (
            <button onClick={() => changeMonth(1)} className="text-gray-400 hover:text-black">›</button>
          )}
        </div>

        {/* DAYS */}
        <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
          {days.map((d) => (
            <span key={d} className="text-center">{d}</span>
          ))}
        </div>

        {/* DATES */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((day, i) => {
            const isStart = isSameDay(day, value.startDate);
            const isEnd = isSameDay(day, value.endDate);
            const inRange =
              value.startDate &&
              value.endDate &&
              isBetween(day, value.startDate, value.endDate);

            return (
              <div
                key={i}
                onClick={() => handleDateClick(day)}
                className={`
                  text-center py-2 text-sm cursor-pointer rounded-lg transition-all duration-200
                  
                  ${isStart || isEnd
                    ? "bg-[var(--color-primary)] text-white font-semibold shadow-md"
                    : ""
                  }

                  ${inRange
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : ""
                  }

                  hover:bg-[var(--color-primary)] hover:text-white
                `}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      {/* INPUT */}
      <div
        onClick={() => setOpen(!open)}
        className="h-[48px] px-4 border rounded-xl flex items-center justify-between cursor-pointer
        bg-[var(--color-surface-card)]
        border-[var(--color-border)]
        shadow-sm hover:shadow-md transition-all"
      >
        <span className="text-sm text-[var(--color-text-primary)]">
          {value.startDate && value.endDate
            ? `${new Date(value.startDate).toLocaleDateString()} - ${new Date(value.endDate).toLocaleDateString()}`
            : "Select date range"}
        </span>
        <span className="text-gray-400">📅</span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute mt-3 bg-white border border-[var(--color-border)] rounded-2xl shadow-2xl z-50 flex backdrop-blur-lg">
          {renderCalendar(0)}
          {renderCalendar(1)}
        </div>
      )}
    </div>
  );
}