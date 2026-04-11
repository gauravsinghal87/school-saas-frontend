import React, { useState } from 'react';
import { useStudentResultForParent } from '../../../hooks/useQueryMutations';
import DataTable from '../../../components/common/ReusableTable';
import {
    BookOpen, Calendar, Trophy, TrendingUp, TrendingDown,
    Eye, ChevronDown, ChevronUp, CheckCircle, XCircle,
    Award, Target, Clock, FileText, BarChart3, Search
} from 'lucide-react';

const ExamAndResultsParentPage = () => {
    const [selectedChild, setSelectedChild] = useState(null);
    const [expandedExam, setExpandedExam] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data: response, isLoading } = useStudentResultForParent();
    const results = response?.data?.results;
    const children = results?.children || [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface-page flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-text-secondary mt-4 font-medium">Loading results...</p>
                </div>
            </div>
        );
    }

    if (!children.length) {
        return (
            <div className="min-h-screen bg-surface-page px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-surface-card rounded-2xl border border-border p-16 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-page flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-text-secondary opacity-40" />
                        </div>
                        <p className="text-text-secondary font-medium">No results found</p>
                        <p className="text-xs text-text-secondary mt-1">No exam results available for your children</p>
                    </div>
                </div>
            </div>
        );
    }

    const getGradeColor = (percentage) => {
        if (percentage >= 90) return "text-success";
        if (percentage >= 75) return "text-primary";
        if (percentage >= 60) return "text-info";
        if (percentage >= 45) return "text-warning";
        return "text-error";
    };

    const getGradeLetter = (percentage) => {
        if (percentage >= 90) return "A+";
        if (percentage >= 75) return "A";
        if (percentage >= 60) return "B";
        if (percentage >= 45) return "C";
        if (percentage >= 33) return "D";
        return "F";
    };

    const getResultStatus = (percentage) => {
        if (percentage >= 33) {
            return { label: "Passed", color: "text-success", bg: "bg-success/10", icon: CheckCircle };
        }
        return { label: "Failed", color: "text-error", bg: "bg-error/10", icon: XCircle };
    };

    // Prepare data for DataTable
    const prepareExamData = () => {
        const allExams = [];
        children.forEach((child, childIdx) => {
            const shouldShowChild = selectedChild === null || selectedChild === childIdx;
            if (shouldShowChild) {
                child.exams.forEach((exam, examIdx) => {
                    allExams.push({
                        ...exam,
                        childName: child.student.name,
                        childClass: `${child.student.class.name}-${child.student.section.name}`,
                        rollNumber: child.student.roll_number,
                        childId: child.student.id,
                        childIdx,
                        examIdx
                    });
                });
            }
        });
        return allExams;
    };

    const examData = prepareExamData();

    // Filter exams based on search
    const filteredExams = examData.filter(exam => {
        const searchLower = searchTerm.toLowerCase();
        return (
            exam.exam_name?.toLowerCase().includes(searchLower) ||
            exam.childName?.toLowerCase().includes(searchLower) ||
            exam.childClass?.toLowerCase().includes(searchLower)
        );
    });

    // Columns for DataTable
    const COLUMNS = [
        {
            key: "index",
            label: "Sr. No",
            sortable: false,
            width: "70px",
            render: (_, row, idx) => (page - 1) * limit + idx + 1,
        },
        {
            key: "childName",
            label: "Student Name",
            sortable: true,
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-text-heading text-sm">{row.childName}</span>
                    <span className="text-xs text-text-secondary">
                        Class {row.childClass} | Roll: {row.rollNumber}
                    </span>
                </div>
            )
        },
        {
            key: "exam_name",
            label: "Exam Name",
            sortable: true,
            render: (val, row) => (
                <div>
                    <p className="font-medium text-text-heading text-sm">{val}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-text-secondary" />
                        <span className="text-xs text-text-secondary">
                            {new Date(row.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: "total_obtained",
            label: "Marks",
            sortable: true,
            width: "120px",
            render: (_, row) => (
                <div className="text-center">
                    <p className="font-bold text-text-heading">{row.total_obtained || 0}/{row.total_max}</p>
                    <p className="text-xs text-text-secondary">{((row.total_obtained / row.total_max) * 100).toFixed(1)}%</p>
                </div>
            )
        },
        {
            key: "percentage",
            label: "Percentage",
            sortable: true,
            width: "100px",
            render: (_, row) => {
                const percentage = (row.total_obtained / row.total_max) * 100;
                return (
                    <div className="flex flex-col items-center">
                        <span className={`font-bold ${getGradeColor(percentage)}`}>
                            {percentage.toFixed(1)}%
                        </span>
                        <span className="text-xs text-primary">{getGradeLetter(percentage)}</span>
                    </div>
                );
            }
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            width: "100px",
            render: (_, row) => {
                const percentage = (row.total_obtained / row.total_max) * 100;
                const status = getResultStatus(percentage);
                const StatusIcon = status.icon;
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                    </span>
                );
            }
        }
    ];

    // Action Cell with view details button
    const ActionCell = ({ row }) => (
        <button
            onClick={() => setExpandedExam(expandedExam === `${row.childIdx}-${row.examIdx}` ? null : `${row.childIdx}-${row.examIdx}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
        >
            {expandedExam === `${row.childIdx}-${row.examIdx}` ? (
                <>Hide Details</>
            ) : (
                <>
                    <Eye className="w-4 h-4" />
                    View Details
                </>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-heading">Exam Results</h1>
                        <p className="text-sm text-text-secondary mt-0.5">
                            Track your children's academic performance
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-success"></div>
                            <span>Passed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-error"></div>
                            <span>Failed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-warning"></div>
                            <span>Pending</span>
                        </div>
                    </div>
                </div>

                {/* Children Selection Tabs */}
                {children.length > 1 && (
                    <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
                        <button
                            onClick={() => setSelectedChild(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                ${selectedChild === null
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-card text-text-secondary hover:bg-primary/10'
                                }`}
                        >
                            All Children
                        </button>
                        {children.map((child, idx) => (
                            <button
                                key={child.student.id}
                                onClick={() => setSelectedChild(selectedChild === idx ? null : idx)}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                    ${selectedChild === idx
                                        ? 'bg-primary text-white'
                                        : 'bg-surface-card text-text-secondary hover:bg-primary/10'
                                    }
                                `}
                            >
                                {child.student.name} (Class {child.student.class.name}-{child.student.section.name})
                            </button>
                        ))}
                    </div>
                )}

                {/* Results Table */}
                <DataTable
                    actionCell={(row) => <ActionCell row={row} />}
                    title="Exam Results"
                    subtitle="View all exam results for your children"
                    columns={COLUMNS}
                    data={filteredExams}
                    loading={isLoading}
                    rowKey={(row) => `${row.childId}-${row.exam_id}`}
                    emptyMessage="No exam results found"
                    emptyDescription="No results available for the selected filters"
                    searchPlaceholder="Search by exam name, student name, or class..."
                    defaultPageSize={limit}
                    pageSizeOptions={[5, 10, 20, 50]}
                    serverMode={false}
                    page={page}
                    total={filteredExams.length}
                    onSearch={(val) => {
                        setSearchTerm(val);
                        setPage(1);
                    }}
                    onPageChange={setPage}
                    onPageSizeChange={(val) => {
                        setLimit(val);
                        setPage(1);
                    }}
                />

                {/* Expanded Exam Details */}
                {expandedExam && (
                    <div className="bg-surface-card rounded-2xl border border-border overflow-hidden">
                        {children.map((child, childIdx) => {
                            const [expChildIdx, expExamIdx] = expandedExam.split('-');
                            if (parseInt(expChildIdx) !== childIdx) return null;

                            const exam = child.exams[parseInt(expExamIdx)];
                            if (!exam) return null;

                            const totalPercentage = (exam.total_obtained / exam.total_max) * 100;
                            const passedSubjects = exam.subjects.filter(s => s.is_passed === true).length;
                            const failedSubjects = exam.subjects.filter(s => s.is_passed === false).length;
                            const pendingSubjects = exam.subjects.filter(s => s.marks_obtained === null).length;

                            return (
                                <div key={`expanded-${childIdx}-${expExamIdx}`} className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-text-heading">
                                            {exam.exam_name} - Subject Details
                                        </h3>
                                        <button
                                            onClick={() => setExpandedExam(null)}
                                            className="text-text-secondary hover:text-error transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {exam.subjects.map((subject, subIdx) => {
                                            const isPassed = subject.is_passed;
                                            const hasMarks = subject.marks_obtained !== null;
                                            const percentage = hasMarks ? (subject.marks_obtained / subject.max_marks) * 100 : 0;

                                            return (
                                                <div key={subIdx} className="flex items-center justify-between p-4 rounded-xl bg-surface-page border border-border hover:border-primary/20 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPassed ? 'bg-success/10' : hasMarks ? 'bg-error/10' : 'bg-warning/10'}`}>
                                                            {isPassed ? (
                                                                <CheckCircle className="w-5 h-5 text-success" />
                                                            ) : hasMarks ? (
                                                                <XCircle className="w-5 h-5 text-error" />
                                                            ) : (
                                                                <Clock className="w-5 h-5 text-warning" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-text-heading">{subject.subject_name}</p>
                                                            <p className="text-xs text-text-secondary">
                                                                Pass: {subject.pass_marks} | Max: {subject.max_marks}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        {hasMarks ? (
                                                            <>
                                                                <p className={`text-xl font-bold ${isPassed ? 'text-success' : 'text-error'}`}>
                                                                    {subject.marks_obtained}
                                                                </p>
                                                                <p className="text-xs text-text-secondary">
                                                                    {percentage.toFixed(1)}%
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p className="text-sm text-warning font-medium">Not Published</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Summary Bar */}
                                    <div className="mt-6 pt-4 border-t border-border">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center p-3 bg-success/5 rounded-xl">
                                                <p className="text-2xl font-bold text-success">{passedSubjects}</p>
                                                <p className="text-xs text-text-secondary">Subjects Passed</p>
                                            </div>
                                            <div className="text-center p-3 bg-error/5 rounded-xl">
                                                <p className="text-2xl font-bold text-error">{failedSubjects}</p>
                                                <p className="text-xs text-text-secondary">Subjects Failed</p>
                                            </div>
                                            <div className="text-center p-3 bg-warning/5 rounded-xl">
                                                <p className="text-2xl font-bold text-warning">{pendingSubjects}</p>
                                                <p className="text-xs text-text-secondary">Subjects Pending</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer Note */}
                {filteredExams.length > 0 && (
                    <div className="text-center pt-2">
                        <p className="text-xs text-text-secondary">
                            Click "View Details" to see subject-wise marks breakdown
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamAndResultsParentPage;