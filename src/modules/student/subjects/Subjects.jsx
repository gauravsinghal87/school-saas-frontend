import { useState, useMemo } from "react";
import {
    BookOpen,
    GraduationCap,
    Library,
    Calculator,
    FlaskConical,
    Globe,
    Languages,
    Music,
    Palette,
    Laptop,
    Microscope,
    History,
    Map,
    Atom,
    Code,
    Search,
    ChevronRight
} from "lucide-react";
import { useStudentSubjects } from "../../../hooks/useQueryMutations";

// Subject icon mapping based on subject name
const getSubjectIcon = (subjectName) => {
    const name = subjectName?.toLowerCase() || "";

    if (name.includes("math") || name.includes("mathematics")) return Calculator;
    if (name.includes("science") || name.includes("physics") || name.includes("chemistry") || name.includes("biology")) return FlaskConical;
    if (name.includes("english") || name.includes("literature")) return BookOpen;
    if (name.includes("hindi")) return Languages;
    if (name.includes("sanskrit")) return Library;
    if (name.includes("social") || name.includes("history") || name.includes("geography") || name.includes("civics")) return Globe;
    if (name.includes("computer") || name.includes("it") || name.includes("coding")) return Laptop;
    if (name.includes("art") || name.includes("drawing")) return Palette;
    if (name.includes("music")) return Music;
    if (name.includes("science")) return Microscope;
    if (name.includes("history")) return History;
    if (name.includes("geography")) return Map;
    if (name.includes("physics")) return Atom;
    if (name.includes("coding") || name.includes("programming")) return Code;

    return GraduationCap;
};

// Get subject color based on subject name
const getSubjectColor = (subjectName) => {
    const name = subjectName?.toLowerCase() || "";

    if (name.includes("math") || name.includes("mathematics")) return "from-red-500 to-red-600";
    if (name.includes("science")) return "from-green-500 to-green-600";
    if (name.includes("english")) return "from-blue-500 to-blue-600";
    if (name.includes("hindi")) return "from-orange-500 to-orange-600";
    if (name.includes("sanskrit")) return "from-purple-500 to-purple-600";
    if (name.includes("social")) return "from-yellow-500 to-yellow-600";
    if (name.includes("computer")) return "from-cyan-500 to-cyan-600";
    if (name.includes("art")) return "from-pink-500 to-pink-600";
    if (name.includes("music")) return "from-indigo-500 to-indigo-600";

    return "from-primary to-primary-dark";
};

// Subject Card Component
const SubjectCard = ({ subject, index }) => {
    const Icon = getSubjectIcon(subject.name);
    const gradientColor = getSubjectColor(subject.name);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative animate-fadeUp"
            style={{ animationDelay: `${index * 0.05}s` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 h-full transform hover:-translate-y-1">
                {/* Gradient top bar */}
                <div className={`h-2 bg-gradient-to-r ${gradientColor}`}></div>

                <div className="p-6">
                    {/* Icon and Number */}
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110`}>
                            <Icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            #{String(index + 1).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Subject Name */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
                        {subject.name}
                    </h3>

                    {/* View Details Button */}
                    {/* <button
                        className={`mt-4 w-full py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${isHovered
                                ? `bg-gradient-to-r ${gradientColor} text-white shadow-md`
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        View Details
                        <ChevronRight size={16} className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </button> */}
                </div>
            </div>
        </div>
    );
};

// Skeleton Loader
const SubjectsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <div className="h-2 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-3/4"></div>
                    <div className="mt-4 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
            </div>
        ))}
    </div>
);

// Empty State Component
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-md">
            <BookOpen className="text-gray-400" size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No Subjects Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            No subjects have been assigned to your class yet. Please contact your class teacher.
        </p>
    </div>
);

// Main Component
export default function StudentSubjects() {
    // Get studentId from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const studentId = user?._id || user?.id;

    const { data: response, isLoading, error } = useStudentSubjects(studentId);

    const subjectsData = response?.data || response?.results;
    const subjects = subjectsData?.subjects || [];
    const className = subjectsData?.className || "";

    // Search functionality
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSubjects = useMemo(() => {
        if (!searchTerm) return subjects;
        return subjects.filter(subject =>
            subject.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [subjects, searchTerm]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-red-500" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        Unable to Load Subjects
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        There was an error loading your subjects. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <GraduationCap className="text-primary" size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                                    My Subjects
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Class {className} • {subjects.length} Subjects
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent w-full sm:w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Card - Simplified */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400">Total Subjects</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{subjects.length}</p>
                            </div>
                            <BookOpen className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600 dark:text-purple-400">Class</p>
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{className}</p>
                            </div>
                            <GraduationCap className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Subjects Grid */}
                {isLoading ? (
                    <SubjectsSkeleton />
                ) : filteredSubjects.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSubjects.map((subject, index) => (
                                <SubjectCard key={subject._id} subject={subject} index={index} />
                            ))}
                        </div>

                        {/* Footer Note */}
                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                📚 These are the subjects assigned to your class.
                            </p>
                        </div>
                    </>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}