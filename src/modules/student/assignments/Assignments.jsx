import { useState, useMemo } from "react";
import {
    FileText,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Upload,
    Download,
    Eye,
    X,
    Search,
    Filter,
    BookOpen,
    ChevronRight,
    FileCheck,
    AlertTriangle
} from "lucide-react";
import { useStudentAssignments, submitAssignmentMutation } from "../../../hooks/useQueryMutations";
import { format } from "date-fns";

// Status Badge Component
const StatusBadge = ({ status }) => {
    const statusConfig = {
        "Pending": { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
        "Submitted": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: FileCheck },
        "Late": { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: AlertTriangle },
        "Graded": { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
    };

    const config = statusConfig[status] || statusConfig["Pending"];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon size={12} />
            {status}
        </span>
    );
};

// Assignment Card Component
const AssignmentCard = ({ assignment, onViewDetails, onSubmit }) => {
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = dueDate < new Date() && assignment.submissionStatus === "Pending";
    const submissionStatus = assignment.submissionStatus;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1">
                            {assignment.title}
                        </h3>
                    </div>
                    <StatusBadge status={submissionStatus} />
                </div>

                {/* Subject */}
                <div className="mb-3">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <BookOpen size={12} />
                        {assignment.subjectId?.name || "Unknown Subject"}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {assignment.description || "No description provided"}
                </p>

                {/* Due Date */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                        <span className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {format(dueDate, "dd MMM yyyy")}
                        </span>
                    </div>
                    {isOverdue && submissionStatus === "Pending" && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={12} />
                            Overdue
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onViewDetails(assignment)}
                        className="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye size={16} />
                        View Details
                    </button>
                    {submissionStatus === "Pending" && (
                        <button
                            onClick={() => onSubmit(assignment)}
                            className="flex-1 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                        >
                            <Upload size={16} />
                            Submit
                        </button>
                    )}
                    {submissionStatus === "Submitted" && (
                        <button
                            disabled
                            className="flex-1 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={16} />
                            Submitted
                        </button>
                    )}
                    {submissionStatus === "Late" && (
                        <button
                            onClick={() => onSubmit(assignment)}
                            className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Upload size={16} />
                            Submit Late
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Assignment Details Modal
const AssignmentDetailsModal = ({ assignment, isOpen, onClose }) => {
    if (!isOpen) return null;

    const dueDate = new Date(assignment.dueDate);
    const isOverdue = dueDate < new Date() && assignment.submissionStatus === "Pending";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-5 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{assignment.title}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Subject */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</label>
                        <p className="text-gray-800 dark:text-white mt-1">{assignment.subjectId?.name || "Unknown Subject"}</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                        <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                            {assignment.description || "No description provided"}
                        </p>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</label>
                        <p className={`mt-1 font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
                            {format(dueDate, "dd MMMM yyyy, hh:mm a")}
                            {isOverdue && " (Overdue)"}
                        </p>
                    </div>

                    {/* Assignment File */}
                    {assignment.fileUrl?.secure_url && (
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignment File</label>
                            <a
                                href={assignment.fileUrl.secure_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                            >
                                <Download size={16} />
                                Download Assignment
                            </a>
                        </div>
                    )}

                    {/* Status */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Status</label>
                        <div className="mt-1">
                            <StatusBadge status={assignment.submissionStatus} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Submit Assignment Modal
const SubmitAssignmentModal = ({ assignment, isOpen, onClose, onSubmit }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async () => {
        if (!file) {
            alert("Please select a file to upload");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("assignmentId", assignment._id);
        formData.append("classId", assignment.classId);
        formData.append("sectionId", assignment.sectionId);
        formData.append("file", file);

        await onSubmit(formData);
        setUploading(false);
        onClose();
        setFile(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Submit Assignment</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Assignment:</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{assignment.title}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Upload Your Work</label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-primary transition-colors">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {file ? file.name : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PDF, DOC, DOCX, JPG, PNG, ZIP (Max 10MB)
                                </p>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!file || uploading}
                        className="flex-1 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={16} />
                                Submit
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Skeleton Loader
const AssignmentsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                    <div className="flex gap-2">
                        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Empty State
const EmptyState = ({ hasFilters }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            {hasFilters ? "No matching assignments" : "No Assignments Yet"}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            {hasFilters
                ? "Try adjusting your search or filter criteria"
                : "You don't have any assignments at the moment. Check back later!"}
        </p>
    </div>
);

// Main Component
export default function StudentAssignments() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [submitModalOpen, setSubmitModalOpen] = useState(false);

    // Fetch assignments
    const { data: response, isLoading, refetch } = useStudentAssignments();
    const assignments = response?.data?.assignments || [];
    const pagination = response?.data?.pagination || {};

    // Submit mutation
    const { mutateAsync: submitAssignment, isPending: isSubmitting } = submitAssignmentMutation();

    // Filter assignments
    const filteredAssignments = useMemo(() => {
        let filtered = assignments;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.subjectId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(a => a.submissionStatus === statusFilter);
        }

        return filtered;
    }, [assignments, searchTerm, statusFilter]);

    // Stats
    const stats = {
        total: assignments.length,
        pending: assignments.filter(a => a.submissionStatus === "Pending").length,
        submitted: assignments.filter(a => a.submissionStatus === "Submitted").length,
        late: assignments.filter(a => a.submissionStatus === "Late").length,
    };

    const handleViewDetails = (assignment) => {
        setSelectedAssignment(assignment);
        setViewModalOpen(true);
    };

    const handleSubmitClick = (assignment) => {
        setSelectedAssignment(assignment);
        setSubmitModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        await submitAssignment(formData);
        refetch();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <FileText className="text-primary" size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                                    My Assignments
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Track and submit your assignments
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                        <p className="text-sm text-blue-600 dark:text-blue-400">Total</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
                        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                        <p className="text-sm text-green-600 dark:text-green-400">Submitted</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.submitted}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4">
                        <p className="text-sm text-red-600 dark:text-red-400">Late</p>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.late}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or subject..."
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
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Late">Late</option>
                        </select>
                    </div>
                </div>

                {/* Assignments Grid */}
                {isLoading ? (
                    <AssignmentsSkeleton />
                ) : filteredAssignments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAssignments.map((assignment) => (
                            <AssignmentCard
                                key={assignment._id}
                                assignment={assignment}
                                onViewDetails={handleViewDetails}
                                onSubmit={handleSubmitClick}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState hasFilters={!!(searchTerm || statusFilter !== "all")} />
                )}

                {/* Modals */}
                {selectedAssignment && (
                    <>
                        <AssignmentDetailsModal
                            assignment={selectedAssignment}
                            isOpen={viewModalOpen}
                            onClose={() => {
                                setViewModalOpen(false);
                                setSelectedAssignment(null);
                            }}
                        />
                        <SubmitAssignmentModal
                            assignment={selectedAssignment}
                            isOpen={submitModalOpen}
                            onClose={() => {
                                setSubmitModalOpen(false);
                                setSelectedAssignment(null);
                            }}
                            onSubmit={handleSubmit}
                        />
                    </>
                )}
            </div>
        </div>
    );
}