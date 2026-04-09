import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";
import api from "../../../api/apiConfig"; // Adjust path if necessary

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const AssignmentsSkeleton = () => (
  <div className="animate-pulse space-y-8">
    {[1, 2].map((studentIdx) => (
      <div key={studentIdx} className="space-y-4">
        {/* Student Header Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface-card rounded-full border border-border"></div>
          <div className="h-5 bg-surface-card rounded w-48 border border-border"></div>
        </div>
        {/* Assignment Cards Skeleton */}
        <div className="grid gap-3">
          {[1, 2, 3].map((cardIdx) => (
            <div
              key={cardIdx}
              className="h-20 bg-surface-card border border-border rounded-2xl"
            ></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ─── UTILS ────────────────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusConfig = (status, dueDate) => {
  const isOverdue =
    status?.toLowerCase() === "pending" && new Date(dueDate) < new Date();

  if (status?.toLowerCase() === "submitted") {
    return {
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/20",
      icon: CheckCircle2,
      text: "Submitted",
    };
  }

  if (isOverdue) {
    return {
      color: "text-error",
      bg: "bg-error/10",
      border: "border-error/20",
      icon: AlertCircle,
      text: "Overdue",
    };
  }

  return {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    icon: Clock,
    text: "Pending",
  };
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ParentAssignments() {
  // Fetch Parent Assignments
  const { data: response, isLoading } = useQuery({
    queryKey: ["parentAssignments"],
    queryFn: () => api.get("/api/parent/my-children-assignments"),
  });
  
  const payload = response?.data;
  const assignmentsList = payload?.children || payload || [];

  // Group assignments by studentName dynamically
  const groupedAssignments = useMemo(() => {
    const groups = {};
    assignmentsList.forEach((assignment) => {
      // FIX: Use studentName from the assignment API payload
      const student = assignment.studentName || "Unknown Student";

      if (!groups[student]) {
        groups[student] = [];
      }
      groups[student].push(assignment);
    });

    // Sort assignments within each group by due date (closest first)
    Object.keys(groups).forEach((student) => {
      groups[student].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    });

    return groups;
  }, [assignmentsList]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-surface-page animate-fadeUp">
      {/* ─── HEADER ─── */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-['Montserrat'] font-bold text-text-heading flex items-center gap-2">
          <BookOpen className="text-primary" size={24} />
          Homework & Assignments
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-lg">
          Track homework, project due dates, and submission statuses for all
          your children.
        </p>
      </div>

      {isLoading ? (
        <AssignmentsSkeleton />
      ) : Object.keys(groupedAssignments).length > 0 ? (
        <div className="space-y-10">
          {Object.entries(groupedAssignments).map(
            ([studentName, assignments]) => (
              <div key={studentName} className="animate-fadeUp">
                {/* Student Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase border border-primary/20 shadow-sm">
                    {studentName.charAt(0)}
                  </div>
                  <h2 className="text-lg font-['Montserrat'] font-bold text-text-heading">
                    {studentName}
                  </h2>
                  <div className="px-2.5 py-1 rounded-md bg-surface-card border border-border text-[10px] font-bold text-text-secondary uppercase">
                    {assignments.length} Tasks
                  </div>
                </div>

                {/* Assignments List */}
                <div className="grid gap-3">
                  {assignments.map((assignment) => {
                    const statusConfig = getStatusConfig(
                      assignment.submissionStatus,
                      assignment.dueDate,
                    );
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={assignment._id}
                        className="group bg-surface-card border border-border rounded-2xl p-4 sm:p-5 hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Hover Accent Line */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.bg.replace("/10", "/50")} group-hover:${statusConfig.bg.replace("/10", "")} transition-colors duration-300`}
                        ></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Left: Task Info */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-surface-page border border-border flex items-center justify-center flex-shrink-0 text-text-secondary group-hover:text-primary transition-colors">
                              <FileText size={22} />
                            </div>

                            <div>
                              <h3 className="text-base font-bold text-text-heading group-hover:text-primary transition-colors line-clamp-1">
                                {assignment.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary font-medium mt-1">
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/5 text-primary border border-primary/10">
                                  {assignment.subject}
                                </span>
                                <span className="hidden sm:inline text-border">
                                  •
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <CalendarDays
                                    size={13}
                                    className="opacity-70"
                                  />
                                  Due: {formatDate(assignment.dueDate)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Status & Submission Details */}
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t border-border sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                            >
                              <StatusIcon size={14} />
                              {statusConfig.text}
                            </div>

                            {assignment.submissionStatus?.toLowerCase() ===
                              "submitted" &&
                              assignment.submittedAt && (
                                <div className="text-[10px] text-text-secondary font-medium flex items-center gap-1">
                                  <CheckCircle2
                                    size={10}
                                    className="text-success"
                                  />
                                  Turned in {formatDate(assignment.submittedAt)}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        /* ─── EMPTY STATE ─── */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-card border border-dashed border-border rounded-2xl animate-fadeUp shadow-sm">
          <div className="w-16 h-16 bg-surface-page rounded-full flex items-center justify-center mb-4 border border-border">
            <BookOpen className="text-text-secondary opacity-50" size={32} />
          </div>
          <h3 className="text-[16px] font-bold text-text-primary mb-1">
            No Assignments Found
          </h3>
          <p className="text-sm text-text-secondary max-w-[280px]">
            Your children currently have no pending or submitted assignments.
          </p>
        </div>
      )}
    </div>
  );
}
