// pages/teacher/AssignmentSubmissions.jsx - DataTable Version (Fixed)
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FileText, Download, MessageSquare, Star, CheckCircle, Clock,
    AlertCircle, Send, ArrowLeft, Eye, RefreshCw
} from "lucide-react";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/common/ReusableTable";
import SlidePanel from "../../../components/common/SlidePanel";
import { showSuccess, showError } from "../../../utils/toast";
import {
    getStudentSubmissionsQuery,
    giveFeedbackOnSubmissionMutation
} from "../../../hooks/useQueryMutations";

const SubmissionStatus = {
    PENDING: "Pending",
    SUBMITTED: "Submitted",
    CHECKED: "Checked",
    LATE: "Late"
};

const StatusBadge = ({ status }) => {
    const config = {
        [SubmissionStatus.PENDING]: { color: "warning", icon: Clock, label: "Pending", bg: "bg-warning/10", text: "text-warning" },
        [SubmissionStatus.SUBMITTED]: { color: "info", icon: CheckCircle, label: "Submitted", bg: "bg-info/10", text: "text-info" },
        [SubmissionStatus.CHECKED]: { color: "success", icon: Star, label: "Checked", bg: "bg-success/10", text: "text-success" },
        [SubmissionStatus.LATE]: { color: "error", icon: AlertCircle, label: "Late", bg: "bg-error/10", text: "text-error" }
    };

    const { bg, text, icon: Icon, label } = config[status] || config[SubmissionStatus.PENDING];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${bg} ${text}`}>
            <Icon size={12} />
            {label}
        </span>
    );
};

// Feedback Panel Component for SlidePanel
function FeedbackPanel({ submission, onSubmit, loading, onClose }) {
    const [feedbackText, setFeedbackText] = useState(submission?.feedback || "");
    const [marks, setMarks] = useState(submission?.marks || "");

    const handleSubmit = () => {
        if (!feedbackText.trim()) {
            showError("Please enter feedback");
            return;
        }
        console.log('submission id in feedback panel:', submission); // Debug log  
        onSubmit({
            submissionId: submission?._id,
            feedback: feedbackText,
        });
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface-page p-5 space-y-4">
                <div>
                    <h4 className="font-semibold text-text-heading">
                        {submission?.studentId?.name || submission?.studentDetails?.name || "Student"}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">
                        Roll No: {submission?.studentDetails?.rollNumber || "-"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Submission Preview
                        </label>
                        {submission?.files?.length > 0 ? (
                            <a
                                href={submission.files[0].secure_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                            >
                                <Eye size={16} />
                                View Submitted File
                            </a>
                        ) : (
                            <span className="text-text-secondary text-sm">No file attached</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        Feedback *
                    </label>
                    <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        placeholder="Write your feedback here..."
                    />
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} loading={loading} className="flex-1 gap-2">
                    <Send size={16} />
                    Submit Feedback
                </Button>
            </div>
        </div>
    );
}

export default function AssignmentSubmissions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Fetch submissions for this assignment
    const { data: submissionsData, isLoading, refetch } = getStudentSubmissionsQuery(id);
    const giveFeedbackMutation = giveFeedbackOnSubmissionMutation();

    console.log("Submissions Data:", submissionsData);

    // Handle different response structures - FIXED for your actual data structure
    let submissions = [];
    let assignment = null;

    if (submissionsData) {
        // Try different possible data structures
        if (Array.isArray(submissionsData)) {
            submissions = submissionsData;
            assignment = submissions[0]?.assignmentId;
        } else if (submissionsData.data && Array.isArray(submissionsData.data)) {
            submissions = submissionsData.data;
            assignment = submissions[0]?.assignmentId;
        } else if (submissionsData.submissions && Array.isArray(submissionsData.submissions)) {
            submissions = submissionsData.submissions;
            assignment = submissionsData.assignment || submissions[0]?.assignmentId;
        } else if (submissionsData.data?.submissions && Array.isArray(submissionsData.data.submissions)) {
            submissions = submissionsData.data.submissions;
            assignment = submissionsData.data.assignment || submissions[0]?.assignmentId;
        }
    }

    const handleGiveFeedback = (submission) => {
        setSelectedSubmission(submission);
        setIsPanelOpen(true);
    };

    const handleSubmitFeedback = (data) => {
        console.log('Submitting feedback with data:', data); // Debug log
        giveFeedbackMutation.mutate(data, {
            onSuccess: () => {
                showSuccess("Feedback submitted successfully");
                setIsPanelOpen(false);
                setSelectedSubmission(null);
                refetch();
            },
            onError: (err) => {
                showError(err?.message || "Failed to submit feedback");
            }
        });
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setSelectedSubmission(null);
    };

    const getSubmissionStats = () => {
        if (!submissions?.length) return { total: 0, submitted: 0, pending: 0, checked: 0, late: 0 };

        const total = submissions.length;
        const submitted = submissions.filter(s => s.status === SubmissionStatus.SUBMITTED).length;
        const pending = submissions.filter(s => s.reviewStatus === SubmissionStatus.PENDING).length;
        const checked = submissions.filter(s => s.reviewStatus === SubmissionStatus.CHECKED).length;
        const late = submissions.filter(s => s.status === SubmissionStatus.LATE).length;

        return { total, submitted, pending, checked, late };
    };

    const stats = getSubmissionStats();

    // Define columns for DataTable
    const COLUMNS = [
        {
            key: "student",
            label: "Student",
            sortable: true,
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-text-heading text-sm">
                        {row.studentId?.name || row.studentDetails?.name || "N/A"}
                    </span>
                    <span className="text-xs text-text-secondary">
                        {row.studentId?.email || row.studentDetails?.email || ""}
                    </span>
                </div>
            )
        },
        {
            key: "rollNumber",
            label: "Roll No",
            sortable: true,
            render: (_, row) => row.studentDetails?.rollNumber || "-"
        },
        {
            key: "submittedAt",
            label: "Submitted On",
            sortable: true,
            render: (val, row) => {
                const date = val || row.submittedAt;
                return date ? new Date(date).toLocaleString() : "-";
            }
        },
        {
            key: "attachment",
            label: "Attachment",
            sortable: false,
            render: (_, row) => (
                row.files?.length > 0 ? (
                    <a
                        href={row.files[0].secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm"
                    >
                        <FileText size={14} />
                        View
                        <Download size={12} />
                    </a>
                ) : (
                    <span className="text-text-secondary text-xs">No file</span>
                )
            )
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (val) => <StatusBadge status={val} />
        },
        {
            key: "feedback",
            label: "Feedback",
            sortable: false,
            render: (val, row) => (
                val ? (
                    <div className="max-w-xs">
                        <p className="text-xs text-text-secondary line-clamp-2">{val}</p>
                        {row.marks && (
                            <p className="text-xs font-semibold text-success mt-1">Marks: {row.marks}</p>
                        )}
                    </div>
                ) : (
                    <span className="text-text-secondary text-xs">No feedback</span>
                )
            )
        }
    ];

    // Action button for each row
    const ActionCell = ({ row }) => (
        <button
            onClick={() => handleGiveFeedback(row)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
        >
            <MessageSquare size={14} />
            {row.feedback ? "Edit" : "Give Feedback"}
        </button>
    );

    return (
        <div className="min-h-screen bg-surface-page">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-primary transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Assignments</span>
                    </button>
                    <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2">
                        <RefreshCw size={14} />
                        Refresh
                    </Button>
                </div>

                {/* Assignment Header */}
                {assignment && (
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-border">
                        <div>
                            <h1 className="text-2xl font-bold text-text-heading">{assignment.title}</h1>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <span className="text-sm text-text-secondary">
                                    Assignment ID: {assignment._id}
                                </span>
                                <span className="text-sm text-error">
                                    Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <StatCard label="Total Submissions" value={stats.total} color="primary" />
                    <StatCard label="Submitted" value={stats.submitted} color="info" icon={CheckCircle} />
                    {/* <StatCard label="Pending Review" value={stats.pending} color="warning" icon={Clock} />
                    <StatCard label="Checked" value={stats.checked} color="success" icon={Star} /> */}
                    <StatCard label="Late" value={stats.late} color="error" icon={AlertCircle} />
                </div>

                {/* Data Table */}
                <DataTable
                    actionCell={(row) => <ActionCell row={row} />}
                    title="Student Submissions"
                    subtitle="Review and provide feedback on student assignments"
                    columns={COLUMNS}
                    data={submissions}
                    loading={isLoading}
                    rowKey="_id"
                    emptyMessage="No submissions found"
                    searchPlaceholder="Search by student name, roll number..."
                    defaultPageSize={10}
                    pageSizeOptions={[10, 20, 50]}
                    onPageChange={() => { }}
                    onPageSizeChange={() => { }}
                />
            </div>

            {/* Slide Panel for Feedback */}
            <SlidePanel
                open={isPanelOpen}
                onClose={closePanel}
                title={selectedSubmission?.feedback ? "Edit Feedback" : "Give Feedback"}
                subtitle={`Student: ${selectedSubmission?.studentId?.name || selectedSubmission?.studentDetails?.name || "Student"}`}
            >
                {selectedSubmission && (
                    <FeedbackPanel
                        submission={selectedSubmission}
                        onSubmit={handleSubmitFeedback}
                        loading={giveFeedbackMutation.isPending}
                        onClose={closePanel}
                    />
                )}
            </SlidePanel>
        </div>
    );
}

function StatCard({ label, value, color, icon: Icon }) {
    const colors = {
        primary: "bg-primary/5 text-primary border-primary/20",
        success: "bg-success/5 text-success border-success/20",
        error: "bg-error/5 text-error border-error/20",
        warning: "bg-warning/5 text-warning border-warning/20",
        info: "bg-info/5 text-info border-info/20"
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-xl border ${colors[color]}`}>
            <div>
                <p className="text-xs text-text-secondary">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            {Icon && <Icon size={20} className="opacity-60" />}
        </div>
    );
}