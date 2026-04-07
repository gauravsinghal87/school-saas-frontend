import { useEffect, useRef } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import Select from "../../../components/common/Select";
import { getSubjectsQuery, getAdminTeachersQuery } from "../../../hooks/useQueryMutations";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const BREAK_PERIODS = ["Lunch", "Break", "Recess", "Snack Break"];

export default function TimetableForm({
    control,
    errors = {},
    periods = [],
    selectedAcademicYear,
    selectedClass,
    selectedSection,
}) {
    // Use ref to track if initialization has been done
    const initialized = useRef(false);

    // Filter out break periods
    const academicPeriods = periods.filter(period => {
        const isBreak = BREAK_PERIODS.some(breakName =>
            period.name?.toLowerCase().includes(breakName.toLowerCase())
        );
        return !isBreak && !period.isBreak;
    });

    // Fetch subjects using existing query
    const { data: subjectsData } = getSubjectsQuery();

    // Fetch teachers
    const { data: teachersData, isLoading: teachersLoading } = getAdminTeachersQuery();

    // Format subject options
    const subjectOptions = subjectsData?.results?.map((subject) => ({
        label: subject.name,
        value: subject._id,
    })) || [];

    // Format teacher options
    const teacherOptions = teachersData?.data?.map((teacher) => ({
        label: teacher.name,
        value: teacher._id,
    })) || teachersData?.results?.map((teacher) => ({
        label: teacher.name,
        value: teacher._id,
    })) || [];

    // Use field array for entries
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "entries",
    });

    // Initialize entries for all days and academic periods only - ONCE
    useEffect(() => {
        // Only initialize if we have periods, fields are empty, and not already initialized
        if (academicPeriods.length > 0 && fields.length === 0 && !initialized.current) {
            const initialEntries = [];
            DAYS.forEach(day => {
                academicPeriods.forEach(period => {
                    initialEntries.push({
                        day,
                        periodId: period._id,
                        subjectId: "",
                        teacherId: "",
                    });
                });
            });
            replace(initialEntries);
            initialized.current = true;
        }
    }, [academicPeriods, fields.length, replace]);

    // Reset initialization when class/section/academic year changes
    useEffect(() => {
        initialized.current = false;
    }, [selectedAcademicYear, selectedClass, selectedSection]);

    const getEntriesByDay = (day) => {
        return fields.filter(field => field.day === day);
    };

    if (teachersLoading) {
        return <div className="text-center py-4">Loading teachers...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                    Configure timetable for each day and period. Lunch break is automatically excluded.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                            {academicPeriods.map((period) => (
                                <th key={period._id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {period.name}
                                    <br />
                                    <span className="text-xs font-normal">{period.startTime} - {period.endTime}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {DAYS.map((day) => {
                            const dayEntries = getEntriesByDay(day);
                            return (
                                <tr key={day} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                        {day}
                                    </td>
                                    {dayEntries.map((entry) => {
                                        const globalIndex = fields.findIndex(
                                            f => f.day === day && f.periodId === entry.periodId
                                        );
                                        return (
                                            <td key={entry.id} className="px-4 py-3">
                                                <div className="space-y-2">
                                                    <Controller
                                                        name={`entries.${globalIndex}.subjectId`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select
                                                                value={field.value || ""}
                                                                onChange={(val) => field.onChange(val)}
                                                                options={subjectOptions}
                                                                placeholder="Select subject"
                                                                className="w-40"
                                                            />
                                                        )}
                                                    />
                                                    <Controller
                                                        name={`entries.${globalIndex}.teacherId`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select
                                                                value={field.value || ""}
                                                                onChange={(val) => field.onChange(val)}
                                                                options={teacherOptions}
                                                                placeholder="Select teacher"
                                                                className="w-40"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {errors.entries && (
                <p className="text-sm text-red-500">{errors.entries.message}</p>
            )}
        </div>
    );
}