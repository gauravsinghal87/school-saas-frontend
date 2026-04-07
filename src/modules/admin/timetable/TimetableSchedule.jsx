import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import SidePanel from "../../../components/common/SlidePanel";
import TimetableForm from "./TimetableForm";
import Button from "../../../components/common/Button";
import {
    createTimetableMutation,
    deleteTimetableMutation,
    getTimetableQuery,
    periodsList
} from "../../../hooks/useQueryMutations";
import { classesListMutation, sectionList } from "../../../hooks/useQueryMutations";
import { academicYearList } from "../../../hooks/useQueryMutations";
import ConfirmBox from "../../../components/common/ConfirmBox";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const BREAK_PERIODS = ["Lunch", "Break", "Recess", "Snack Break"];

export default function TimetableSchedule() {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
    const [existingTimetable, setExistingTimetable] = useState(null);

    // Fetch data
    const { data: classesData } = classesListMutation({ page: 1, limit: 100, search: "" });
    const { data: sectionsResponse } = sectionList({ page: 1, limit: 100, search: "", classId: selectedClass });
    const { data: academicSessions } = academicYearList({ page: 1, limit: 100, search: "" });
    const { data: periodsData } = periodsList({ academicSessionId: selectedAcademicYear });

    // Handle different response structures
    const classOptions = classesData?.results || classesData?.data || [];

    let sectionOptions = [];
    if (sectionsResponse?.results?.docs) {
        sectionOptions = sectionsResponse.results.docs;
    } else if (sectionsResponse?.results && Array.isArray(sectionsResponse.results)) {
        sectionOptions = sectionsResponse.results;
    } else if (sectionsResponse?.data && Array.isArray(sectionsResponse.data)) {
        sectionOptions = sectionsResponse.data;
    } else if (Array.isArray(sectionsResponse)) {
        sectionOptions = sectionsResponse;
    }

    const academicYearOptions = academicSessions?.results || academicSessions?.data || [];

    // Filter out break periods
    let allPeriods = periodsData?.data || periodsData?.results || [];
    const periods = allPeriods.filter(period => {
        const isBreak = BREAK_PERIODS.some(breakName =>
            period.name?.toLowerCase().includes(breakName.toLowerCase())
        );
        return !isBreak && !period.isBreak;
    });

    const filteredSections = sectionOptions.filter(section =>
        !selectedClass || section.classId === selectedClass || section.class?._id === selectedClass
    );

    // Fetch existing timetable
    const { data: timetableData, refetch: refetchTimetable } = getTimetableQuery(
        {
            classId: selectedClass,
            sectionId: selectedSection,
            academicSessionId: selectedAcademicYear,
        },
        !!(selectedClass && selectedSection && selectedAcademicYear)
    );

    // Mutations
    const { mutateAsync: createTimetable, isPending: isCreating } = createTimetableMutation();
    const { mutateAsync: deleteTimetable, isPending: isDeleting } = deleteTimetableMutation();

    // Form handling
    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            academicSessionId: "",
            classId: "",
            sectionId: "",
            entries: [],
        },
    });

    // Watch values
    const watchedAcademicSession = watch("academicSessionId");
    const watchedClass = watch("classId");
    const watchedSection = watch("sectionId");

    // Update selections when form values change
    useEffect(() => {
        if (watchedAcademicSession) setSelectedAcademicYear(watchedAcademicSession);
        if (watchedClass) setSelectedClass(watchedClass);
        if (watchedSection) setSelectedSection(watchedSection);
    }, [watchedAcademicSession, watchedClass, watchedSection]);

    // Reset form entries when selections change
    useEffect(() => {
        setValue("entries", []);
        setExistingTimetable(null);
    }, [selectedAcademicYear, selectedClass, selectedSection, setValue]);

    // Load existing timetable data
    useEffect(() => {
        if (timetableData?.data) {
            const entries = timetableData.data.entries || [];
            setExistingTimetable(timetableData.data);

            const formattedEntries = entries.map(entry => ({
                day: entry.day,
                periodId: entry.periodId?._id || entry.periodId,
                subjectId: entry.subjectId?._id || entry.subjectId,
                teacherId: entry.teacherId?._id || entry.teacherId,
            }));

            setValue("entries", formattedEntries);
        }
    }, [timetableData, setValue]);

    const openModal = () => {
        reset({
            academicSessionId: selectedAcademicYear,
            classId: selectedClass,
            sectionId: selectedSection,
            entries: existingTimetable?.entries?.map(entry => ({
                day: entry.day,
                periodId: entry.periodId?._id || entry.periodId,
                subjectId: entry.subjectId?._id || entry.subjectId,
                teacherId: entry.teacherId?._id || entry.teacherId,
            })) || [],
        });
        setIsOpen(true);
    };

    const onSubmit = async (formData) => {
        try {
            // Filter out entries with no subject or teacher
            const validEntries = formData.entries.filter(entry =>
                entry.subjectId && entry.teacherId && entry.subjectId !== "" && entry.teacherId !== ""
            );

            const payload = {
                academicSessionId: formData.academicSessionId,
                classId: formData.classId,
                sectionId: formData.sectionId,
                entries: validEntries,
            };

            await createTimetable(payload);
            refetchTimetable();
            setIsOpen(false);
        } catch (err) {
            console.error("Error saving timetable:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTimetable({
                classId: selectedClass,
                sectionId: selectedSection,
                academicSessionId: selectedAcademicYear,
            });
            refetchTimetable();
            setConfirmOpen(false);
        } catch (err) {
            console.error("Error deleting timetable:", err);
        }
    };

    // Rest of your render function remains the same...
    const renderTimetable = () => {
        if (!timetableData?.data?.entries || timetableData.data.entries.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    No timetable found. Click "Create Timetable" to add one.
                </div>
            );
        }

        const entries = timetableData.data.entries;
        const uniquePeriods = [...new Map(entries.map(entry => [entry.periodId?._id, entry.periodId])).values()];
        const sortedPeriods = uniquePeriods
            .filter(period => {
                const isBreak = BREAK_PERIODS.some(breakName =>
                    period?.name?.toLowerCase().includes(breakName.toLowerCase())
                );
                return !isBreak && !period?.isBreak;
            })
            .sort((a, b) => (a.order || 0) - (b.order || 0));

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day / Period</th>
                            {sortedPeriods.map(period => (
                                <th key={period._id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {period.name}
                                    <br />
                                    <span className="text-xs font-normal">{period.startTime} - {period.endTime}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {DAYS.map(day => (
                            <tr key={day} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                    {day}
                                </td>
                                {sortedPeriods.map(period => {
                                    const entry = entries.find(
                                        e => e.day === day && (e.periodId?._id === period._id || e.periodId === period._id)
                                    );
                                    return (
                                        <td key={period._id} className="px-4 py-3 text-sm">
                                            {entry ? (
                                                <div>
                                                    <div className="font-medium">{entry.subjectId?.name || entry.subjectId}</div>
                                                    <div className="text-xs text-gray-500">{entry.teacherId?.name || entry.teacherId}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            {/* Filters - same as before */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Academic Session</label>
                    <select
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                        value={selectedAcademicYear}
                        onChange={(e) => setSelectedAcademicYear(e.target.value)}
                    >
                        <option value="">Select Academic Session</option>
                        {academicYearOptions.map((session) => (
                            <option key={session._id} value={session._id}>
                                {session.academicSession || `${new Date(session.startDate).getFullYear()}-${new Date(session.endDate).getFullYear()}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <select
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        disabled={!selectedAcademicYear}
                    >
                        <option value="">Select Class</option>
                        {classOptions.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Section</label>
                    <select
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        disabled={!selectedClass}
                    >
                        <option value="">Select Section</option>
                        {filteredSections.map((section) => (
                            <option key={section._id} value={section._id}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Actions */}
            {selectedAcademicYear && selectedClass && selectedSection && (
                <div className="flex gap-4 mb-6">
                    <Button onClick={openModal}>
                        {existingTimetable ? "Edit Timetable" : "Create Timetable"}
                    </Button>
                    {existingTimetable && (
                        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                            Delete Timetable
                        </Button>
                    )}
                </div>
            )}

            {/* Timetable Display */}
            {selectedAcademicYear && selectedClass && selectedSection && renderTimetable()}

            {/* Side Panel Form */}
            <SidePanel
                open={isOpen}
                onClose={() => setIsOpen(false)}
                title={existingTimetable ? "Edit Timetable" : "Create Timetable"}
                size="large"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <TimetableForm
                        register={register}
                        errors={errors}
                        control={control}
                        periods={periods}
                        selectedAcademicYear={selectedAcademicYear}
                        selectedClass={selectedClass}
                        selectedSection={selectedSection}
                    />

                    <div className="flex justify-end mt-auto">
                        <Button type="submit" loading={isCreating} loadingLabel="Saving..." variant="primary">
                            Save Timetable
                        </Button>
                    </div>
                </form>
            </SidePanel>

            {/* Confirm Delete Dialog */}
            <ConfirmBox
                isOpen={confirmOpen}
                title="Delete Timetable"
                message="Are you sure you want to delete this timetable?"
                loading={isDeleting}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}