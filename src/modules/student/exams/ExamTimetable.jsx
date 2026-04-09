import { useState, useMemo } from "react";
import {
    Calendar,
    Clock,
    BookOpen,
    Award,
    Search,
    Filter,
    AlertCircle,
    CheckCircle,
    FileText,
    GraduationCap,
    Users,
    ChevronRight
} from "lucide-react";
import { useStudentExamTimetable } from "../../../hooks/useQueryMutations";
import { format, isAfter, isBefore, parseISO } from "date-fns";

// Status Badge Component
const ExamStatusBadge = ({ status }) => {
    const statusConfig = {
        "draft": { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", label: "Draft", icon: FileText },
        "published": { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "Published", icon: CheckCircle },
        "completed": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", label: "Completed", icon: Award }
    };

    const config = statusConfig[status] || statusConfig["draft"];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon size={12} />
            {config.label}
        </span>
    );
};

// Subject Card Component for Timetable
const SubjectExamCard = ({ exam, index }) => {
    const examDate = new Date(exam.examDate);
    const isToday = format(examDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    const isPast = isBefore(examDate, new Date()) && !isToday;
    const isUpcoming = isAfter(examDate, new Date()) && !isToday;

    // Format exam time if available
    const examTime = exam.examTime ? format(parseISO(`2000-01-01T${exam.examTime}`), "hh:mm a") : null;

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border transition-all duration-300 hover:shadow-md ${isToday ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
            }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left side - Subject Info */}
                <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isToday ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                        }`}>
                        <span className="font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                                {exam.subject}
                            </h3>
                            <ExamStatusBadge status={exam.examStatus} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {exam.examName}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Award size={12} />
                                Max Marks: {exam.maxMarks}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <CheckCircle size={12} />
                                Pass Marks: {exam.passMarks}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right side - Date & Time */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-1">
                    <div className={`flex items-center gap-2 ${isToday ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>
                        <Calendar size={14} />
                        <span className="font-medium">
                            {format(examDate, "dd MMM yyyy")}
                        </span>
                    </div>
                    {examTime && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={14} />
                            <span>{examTime}</span>
                        </div>
                    )}
                    {isToday && (
                        <span className="text-xs text-primary font-medium mt-1">Today!</span>
                    )}
                    {isUpcoming && !isToday && (
                        <span className="text-xs text-blue-500 mt-1">
                            {Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                    )}
                    {isPast && !isToday && (
                        <span className="text-xs text-gray-400 mt-1">Completed</span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Exam Group Card (Group by Exam Name)
const ExamGroupCard = ({ examName, subjects, examStatus }) => {
    const [expanded, setExpanded] = useState(true);

    // Get earliest and latest exam dates
    const examDates = subjects.map(s => new Date(s.examDate));
    const startDate = new Date(Math.min(...examDates));
    const endDate = new Date(Math.max(...examDates));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Exam Header */}
            <div
                onClick={() => setExpanded(!expanded)}
                className="p-5 bg-gradient-to-r from-primary/5 to-transparent cursor-pointer hover:bg-primary/10 transition-colors"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                {examName}
                            </h2>
                            <div className="flex flex-wrap gap-3 mt-1">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={12} />
                                    {format(startDate, "dd MMM")} - {format(endDate, "dd MMM yyyy")}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <BookOpen size={12} />
                                    {subjects.length} Subjects
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExamStatusBadge status={examStatus} />
                        <ChevronRight size={20} className={`text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
                    </div>
                </div>
            </div>

            {/* Exam Subjects List */}
            {expanded && (
                <div className="p-5 pt-0 space-y-3 border-t border-gray-100 dark:border-gray-700 mt-4">
                    {subjects.map((subject, idx) => (
                        <SubjectExamCard key={idx} exam={subject} index={idx} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Skeleton Loader
const TimetableSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex-1">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                            <div key={j} className="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Empty State
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No Exam Timetable Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            There are no exams scheduled for your class at the moment. Check back later!
        </p>
    </div>
);

// Main Component
export default function StudentExamTimetable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Fetch exam timetable
    const { data: response, isLoading, error } = useStudentExamTimetable();

    const timetableData = response?.data;
    const timetable = timetableData?.timetable || [];
    const classInfo = timetableData?.class;
    const sectionInfo = timetableData?.section;

    // Group timetable by exam name
    const groupedTimetable = useMemo(() => {
        const groups = {};
        timetable.forEach(item => {
            if (!groups[item.examName]) {
                groups[item.examName] = {
                    examName: item.examName,
                    examStatus: item.examStatus,
                    subjects: []
                };
            }
            groups[item.examName].subjects.push(item);
        });

        // Sort subjects by exam date within each group
        Object.keys(groups).forEach(key => {
            groups[key].subjects.sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
        });

        return Object.values(groups);
    }, [timetable]);

    // Apply filters
    const filteredTimetable = useMemo(() => {
        let filtered = groupedTimetable;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(examGroup =>
                examGroup.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                examGroup.subjects.some(subject =>
                    subject.subject.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(examGroup => {
                if (statusFilter === "published") return examGroup.examStatus === "published";
                if (statusFilter === "draft") return examGroup.examStatus === "draft";
                if (statusFilter === "completed") {
                    // Check if all subjects are completed (past dates)
                    const now = new Date();
                    return examGroup.subjects.every(subject => new Date(subject.examDate) < now);
                }
                if (statusFilter === "upcoming") {
                    const now = new Date();
                    return examGroup.subjects.some(subject => new Date(subject.examDate) > now);
                }
                return true;
            });
        }

        return filtered;
    }, [groupedTimetable, searchTerm, statusFilter]);

    // Stats
    const stats = {
        totalExams: groupedTimetable.length,
        totalSubjects: timetable.length,
        published: groupedTimetable.filter(e => e.examStatus === "published").length,
        upcoming: groupedTimetable.filter(e =>
            e.subjects.some(s => new Date(s.examDate) > new Date())
        ).length,
    };

    if (error) {
        console.error("Error fetching exam timetable:", error);
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        Unable to Load Timetable
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        There was an error loading your exam timetable. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Calendar className="text-primary" size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                                    Exam Timetable
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {classInfo?.name && `Class ${classInfo.name}`}
                                    {sectionInfo?.name && ` - Section ${sectionInfo.name}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                        <p className="text-sm text-blue-600 dark:text-blue-400">Total Exams</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalExams}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                        <p className="text-sm text-purple-600 dark:text-purple-400">Total Subjects</p>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.totalSubjects}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                        <p className="text-sm text-green-600 dark:text-green-400">Published</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.published}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4">
                        <p className="text-sm text-orange-600 dark:text-orange-400">Upcoming</p>
                        <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.upcoming}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by exam name or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div className="relative w-full sm:w-48">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                        >
                            <option value="all">All Exams</option>
                            <option value="published">Published</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Timetable Display */}
                {isLoading ? (
                    <TimetableSkeleton />
                ) : filteredTimetable.length > 0 ? (
                    <div className="space-y-6">
                        {filteredTimetable.map((examGroup, index) => (
                            <ExamGroupCard
                                key={index}
                                examName={examGroup.examName}
                                subjects={examGroup.subjects}
                                examStatus={examGroup.examStatus}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}

                {/* Footer Note */}
                {timetable.length > 0 && (
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            📅 Please check the exam dates carefully. Reach out to your class teacher for any clarifications.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}