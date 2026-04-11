import { useState } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    BookOpen,
    Users,
    Award,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    Activity,
    FileText,
    Edit2,
    School,
    Hash,
    Calendar as CalendarIcon,
    Smartphone,
    Home,
    IdCard
} from "lucide-react";
import { useStudentProfile } from "../../../hooks/useQueryMutations";
import { format } from "date-fns";

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-surface-page dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
        </div>
        <p className="text-2xl font-bold  ">{value}</p>
        <p className="text-sm text-gray-500  mt-1">{title}</p>
    </div>
);

// Info Row Component
const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
            <p className="text-xs text-gray-500 ">{label}</p>
            <p className="text-sm font-medium   mt-0.5">{value || "Not provided"}</p>
        </div>
    </div>
);

// Subject Tag Component
const SubjectTag = ({ subject }) => (
    <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer">
        {subject.name}
    </span>
);

// Attendance Trend Component
const AttendanceTrend = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-3">
            {data.map((day, index) => (
                <div key={index} className="text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${day.status === 'present'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {day.status === 'present' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{format(new Date(day.date), "dd MMM")}</p>
                </div>
            ))}
        </div>
    );
};

// Skeleton Loader
const ProfileSkeleton = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-surface-page dark:bg-gray-800 rounded-2xl p-6">
                    <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2">
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-surface-page dark:bg-gray-800 rounded-2xl p-6">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((j) => (
                                    <div key={j} className="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Main Component
export default function StudentProfile() {
    const [showAllSubjects, setShowAllSubjects] = useState(false);
    const { data: response, isLoading, error } = useStudentProfile();

    const profileData = response?.data;
    const student = profileData?.student;
    const academic = profileData?.academic;
    const attendanceSummary = profileData?.attendance_summary;
    const attendanceTrend = profileData?.attendance_trend;
    const recentResults = profileData?.recent_results || [];

    // Format date of birth
    const formattedDOB = student?.dob ? format(new Date(student.dob), "dd MMMM yyyy") : "Not provided";

    // Get display subjects (limit to 6 initially)
    const subjects = academic?.subjects || [];
    const displayedSubjects = showAllSubjects ? subjects : subjects.slice(0, 6);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold   mb-2">
                        Unable to Load Profile
                    </h3>
                    <p className="text-gray-500 ">
                        There was an error loading your profile. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-page">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <User className="text-primary" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold  ">
                                My Profile
                            </h1>
                            <p className="text-sm text-gray-500  mt-1">
                                View your personal and academic information
                            </p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <ProfileSkeleton />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Personal Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-surface-page dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-6">
                                {/* Profile Header */}
                                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 text-center">
                                    <div className="w-32 h-32 bg-surface-page from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto shadow-lg">
                                        <span className="text-4xl font-bold text-white">
                                            {student?.firstName?.[0]?.toUpperCase()}{student?.lastName?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold   mt-4">
                                        {student?.firstName} {student?.lastName}
                                    </h2>
                                    <p className="text-sm text-gray-500  mt-1">
                                        Student • Class {student?.class?.name}-{student?.section?.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Admission No: {student?.admissionNumber}
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="p-5">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                        <Mail size={16} />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-1">
                                        <InfoRow label="Email Address" value={student?.contact?.email} icon={Mail} />
                                        <InfoRow label="Phone Number" value={student?.contact?.phone} icon={Phone} />
                                        <InfoRow label="Address" value={student?.contact?.address} icon={MapPin} />
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div className="p-5 border-t border-gray-100 dark:border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                        <GraduationCap size={16} />
                                        Academic Details
                                    </h3>
                                    <div className="space-y-1">
                                        <InfoRow label="Roll Number" value={student?.rollNumber} icon={Hash} />
                                        <InfoRow label="Date of Birth" value={formattedDOB} icon={Calendar} />
                                        <InfoRow label="Gender" value={student?.gender?.toUpperCase()} icon={Users} />
                                        <InfoRow label="Active Session" value={academic?.activeSession?.name} icon={CalendarIcon} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Stats & Academic Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Attendance Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard
                                    title="Total Days"
                                    value={attendanceSummary?.total_days || 0}
                                    icon={Calendar}
                                    color="bg-blue-500"
                                />
                                <StatCard
                                    title="Present"
                                    value={attendanceSummary?.present || 0}
                                    icon={CheckCircle}
                                    color="bg-green-500"
                                />
                                <StatCard
                                    title="Absent"
                                    value={attendanceSummary?.absent || 0}
                                    icon={XCircle}
                                    color="bg-red-500"
                                />
                                <StatCard
                                    title="Attendance %"
                                    value={`${attendanceSummary?.percentage || 0}%`}
                                    icon={TrendingUp}
                                    color="bg-purple-500"
                                    subtitle={attendanceSummary?.percentage >= 75 ? "Good" : "Needs Improvement"}
                                />
                            </div>

                            {/* Attendance Trend */}
                            {attendanceTrend && attendanceTrend.length > 0 && (
                                <div className="bg-surface-page dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold   mb-4 flex items-center gap-2">
                                        <Activity size={20} className="text-primary" />
                                        Recent Attendance
                                    </h3>
                                    <AttendanceTrend data={attendanceTrend} />
                                </div>
                            )}

                            {/* Subjects */}
                            <div className="bg-surface-page dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold   flex items-center gap-2">
                                        <BookOpen size={20} className="text-primary" />
                                        My Subjects
                                    </h3>
                                    <span className="text-sm text-gray-500">{subjects.length} Subjects</span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {displayedSubjects.map((subject) => (
                                        <SubjectTag key={subject.id} subject={subject} />
                                    ))}
                                </div>

                                {subjects.length > 6 && (
                                    <button
                                        onClick={() => setShowAllSubjects(!showAllSubjects)}
                                        className="mt-4 text-sm text-primary hover:text-primary-dark font-medium"
                                    >
                                        {showAllSubjects ? "Show Less" : `Show All ${subjects.length} Subjects`}
                                    </button>
                                )}
                            </div>

                            {/* Recent Results */}
                            {recentResults.length > 0 && (
                                <div className="bg-surface-page dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold   mb-4 flex items-center gap-2">
                                        <Award size={20} className="text-primary" />
                                        Recent Results
                                    </h3>
                                    <div className="space-y-3">
                                        {recentResults.map((result, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <div>
                                                    <p className="font-medium  ">{result.examName}</p>
                                                    <p className="text-xs text-gray-500">{result.subject}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-primary">{result.marksObtained}/{result.maxMarks}</p>
                                                    <p className="text-xs text-gray-500">Percentage: {result.percentage}%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions / Info */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-surface-page dark:bg-gray-800 rounded-lg shadow-sm">
                                        <School className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold   mb-1">Need Help?</h4>
                                        <p className="text-sm text-gray-600 ">
                                            For any queries regarding your academic information, please contact your class teacher or the school administration.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}