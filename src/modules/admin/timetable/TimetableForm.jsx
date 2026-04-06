import { useEffect } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import Select from "../../../components/common/Select";
import { getSubjectsQuery, getTeachers } from "../../../hooks/useQueryMutations";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableForm({
    control,
    errors,
    periods = [],
    selectedAcademicYear,
    selectedClass,
    selectedSection,
}) {
    // Fetch subjects and teachers
    const { data: subjectsData } = getSubjectsQuery();
    const { data: teachersData } = getTeachers();

    const subjectOptions = subjectsData?.results?.map((subject) => ({
        label: subject.name,
        value: subject._id,
    })) || [];

    const teacherOptions = teachersData?.results?.map((teacher) => ({
        label: teacher.name,
        value: teacher._id,
    })) || [];

    const periodOptions = periods.map((period) => ({
        label: `${period.name} (${period.startTime} - ${period.endTime})`,
        value: period._id,
    }));

    // Use field array for entries
    const { fields, append, remove } = useFieldArray({
        control,
        name: "entries",
    });

    // Initialize entries for all days and periods
    useEffect(() => {
        if (periods.length > 0 && fields.length === 0) {
            const initialEntries = [];
            DAYS.forEach(day => {
                periods.forEach(period => {
                    initialEntries.push({
                        day,
                        periodId: period._id,
                        subjectId: "",
                        teacherId: "",
                    });
                });
            });
            initialEntries.forEach(entry => append(entry));
        }
    }, [periods, fields.length, append]);

    // Group entries by day for better UI
    const getEntriesByDay = (day) => {
        return fields.filter(field => field.day === day);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                    Configure timetable for each day and period. Select subject and teacher for each slot.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                            {periods.map((period, idx) => (
                                <th key={period._id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {period.name}
                                    <br />
                                    <span className="text-xs font-normal">{period.startTime} - {period.endTime}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {DAYS.map((day, dayIndex) => {
                            const dayEntries = getEntriesByDay(day);
                            return (
                                <tr key={day} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                        {day}
                                    </td>
                                    {dayEntries.map((entry, periodIndex) => {
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