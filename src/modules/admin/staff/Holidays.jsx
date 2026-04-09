import React, { useState } from 'react';
import {
    Calendar,
    Search,
    CalendarDays,
    Loader2,
    X,
    ChevronRight
} from "lucide-react";

import { useDebounce } from '../../../hooks/useDebounce';
import { getHolidaysQuery } from '../../../hooks/useQueryMutations';

const Holidays = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // 🔥 Debounce logic: wait 500ms after user stops typing
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Fetch data using the debounced term
    const { data, isLoading } = getHolidaysQuery({
        page: 1,
        limit: 100,
        search: debouncedSearch
    });

    const holidays = data?.data?.holidays || [];

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8 font-['Merriweather']">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* --- HEADER & SEARCH --- */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-text-heading font-['Montserrat'] tracking-tight">
                            Academic Calendar
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            Official school holidays and event schedule for the current session.
                        </p>
                    </div>

                    <div className="relative w-full lg:max-w-md group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search size={18} className="text-text-secondary group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by holiday name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-12 py-3.5 text-text-heading bg-surface-page border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-['Montserrat'] text-sm shadow-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute inset-y-0 right-4 flex items-center text-text-secondary hover:text-error transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* --- DATA VIEW --- */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="animate-spin text-primary" size={48} />
                        <span className="font-['Montserrat'] text-xs font-bold uppercase tracking-[0.3em] text-text-secondary animate-pulse">
                            Syncing Data
                        </span>
                    </div>
                ) : holidays.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-surface-card rounded-3xl border border-border border-dashed">
                        <CalendarDays className="text-text-secondary/20 mb-4" size={64} />
                        <h3 className="font-['Montserrat'] font-bold text-text-heading text-lg">
                            No Holidays Found
                        </h3>
                        <p className="text-text-secondary max-w-xs mx-auto mt-2 text-sm">
                            {searchTerm
                                ? `We couldn't find any events matching "${searchTerm}". Try a different keyword.`
                                : "The administration hasn't published the holiday list for this period yet."}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-6 text-primary font-['Montserrat'] text-xs font-extrabold uppercase tracking-widest hover:underline"
                            >
                                Reset Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {holidays.map((item) => (
                            <div
                                key={item._id}
                                className="group bg-surface-card border border-border rounded-3xl p-6 flex items-start gap-5 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
                            >
                                {/* Date Icon Wrapper */}
                                <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 bg-surface-page rounded-2xl border border-border group-hover:bg-primary transition-colors duration-300">
                                    <span className="text-[10px] font-['Montserrat'] font-bold text-text-secondary uppercase group-hover:text-white/80">
                                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                    <span className="text-3xl font-['Montserrat'] font-black text-text-heading group-hover:text-white leading-none my-1">
                                        {new Date(item.date).getDate()}
                                    </span>
                                    <span className="text-[10px] font-['Montserrat'] font-bold text-primary group-hover:text-white/90">
                                        {new Date(item.date).getFullYear()}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                        <span className="text-[10px] font-['Montserrat'] font-bold text-secondary uppercase tracking-widest">
                                            Event
                                        </span>
                                    </div>
                                    <h3 className="font-['Montserrat'] font-bold text-text-heading text-xl leading-tight mb-2 group-hover:text-primary transition-colors truncate">
                                        {item.title}
                                    </h3>
                                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 italic font-light">
                                        {item.description || "Official academic recess."}
                                    </p>


                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Holidays;