import { useState, useEffect } from "react";
import { Search, CalendarDays, Sparkles, Loader2 } from "lucide-react";
import { studentHolidayQuery } from "../../../hooks/useQueryMutations";

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const HolidaySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div
        key={i}
        className="animate-pulse bg-surface-card border border-border rounded-2xl p-5 flex gap-4 h-[120px]"
      >
        <div className="w-16 h-16 bg-surface-page rounded-xl flex-shrink-0"></div>
        <div className="flex-1 flex flex-col gap-2 py-1">
          <div className="h-5 bg-surface-page rounded-md w-3/4"></div>
          <div className="h-3 bg-surface-page rounded-md w-1/2"></div>
          <div className="h-3 bg-surface-page rounded-md w-full mt-2"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function StudentHolidays() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data: response, isLoading } = studentHolidayQuery({
    page,
    limit,
    debouncedSearch,
  });

  const holidaysList = response?.data?.holidays || [];
  const pagination = response?.data?.pagination || { totalPages: 1, page: 1 };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-surface-page animate-fadeUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-['Montserrat'] font-bold text-text-heading flex items-center gap-2">
            <Sparkles className="text-primary" size={24} />
            Academic Holidays
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Stay updated with upcoming school holidays and festivals.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-card border border-border rounded-2xl p-4 mb-6 flex items-center shadow-sm">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            size={18}
          />
          <input
            type="text"
            placeholder="Search holidays by name or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-page border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-text-primary placeholder:text-text-secondary dark:placeholder:text-gray-400"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-[400px]">
        {isLoading ? (
          <HolidaySkeleton />
        ) : holidaysList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeUp">
            {holidaysList.map((holiday) => {
              const dateObj = new Date(holiday.date);
              const month = dateObj.toLocaleString("default", {
                month: "short",
              });
              const dateNum = dateObj.getDate().toString().padStart(2, "0");
              const year = dateObj.getFullYear();

              return (
                <div
                  key={holiday._id}
                  className="group relative bg-surface-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-default"
                >
                  {/* Decorative Background Blob */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-125 z-0"></div>

                  <div className="flex gap-4 items-start relative z-10">
                    {/* Calendar Badge */}
                    <div className="flex flex-col items-center justify-center w-[60px] h-[64px] bg-primary/10 rounded-xl text-primary flex-shrink-0 border border-primary/10 shadow-inner group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-0.5">
                        {month}
                      </span>
                      <span className="text-2xl font-['Montserrat'] font-bold leading-none tracking-tight">
                        {dateNum}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-[15px] font-bold text-text-primary mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                        {holiday.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-text-secondary font-medium mb-2.5 uppercase tracking-wider">
                        <CalendarDays size={13} className="opacity-70" />
                        {holiday.day}, {year}
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                        {holiday.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeUp">
            <div className="w-20 h-20 bg-surface-card rounded-full flex items-center justify-center mb-4 border border-border shadow-sm">
              <CalendarDays
                className="text-text-secondary opacity-50"
                size={32}
              />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-1">
              No Holidays Found
            </h3>
            <p className="text-sm text-text-secondary max-w-sm">
              {searchInput
                ? "We couldn't find any holidays matching your search criteria."
                : "There are currently no holidays scheduled for this academic session."}
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && holidaysList.length > 0 && (
          <div className="mt-8 p-4 border border-border rounded-2xl flex items-center justify-between text-sm text-text-secondary bg-surface-card shadow-sm">
            <div className="font-medium">
              Page <span className="text-text-primary">{pagination.page}</span>{" "}
              of{" "}
              <span className="text-text-primary">{pagination.totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-surface-page border border-border rounded-lg hover:text-text-primary hover:border-text-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pagination.totalPages}
                className="px-4 py-2 bg-surface-page border border-border rounded-lg hover:text-text-primary hover:border-text-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
