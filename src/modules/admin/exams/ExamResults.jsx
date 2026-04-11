import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/common/ReusableTable";
import {
    examResultsList,
    generateResultMutation,
    examById
} from "../../../hooks/useQueryMutations";
import { getStudentsQuery } from "../../../hooks/useQueryMutations";
import { ArrowLeft, Download, RefreshCw, FileBarChart } from "lucide-react";
import { showSuccess, showError } from "../../../utils/toast";

export default function ExamResults() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [resultStatus, setResultStatus] = useState("");
    const [generating, setGenerating] = useState(false);

    // Fetch exam details
    const { data: examData } = examById(id);
    const exam = examData?.data?.results || examData?.results;

    // Fetch students
    const { data: studentsData } = getStudentsQuery();
    const students = studentsData?.data?.results || studentsData?.results || [];

    // Fetch exam results
    const params = {
        page,
        limit,
        search,
        studentId: selectedStudent || undefined,
        resultStatus: resultStatus || undefined,
    };
    const { data: resultsResponse, isLoading, refetch } = examResultsList(id, params);
    const tableData = resultsResponse?.data?.results || resultsResponse?.results || [];
    const pagination = resultsResponse?.data?.pagination || resultsResponse?.pagination || {};

    // Mutations
    const { mutateAsync: generateResult } = generateResultMutation();

    const studentOptions = students.map(student => ({
        label: `${student.firstName} ${student.lastName} (${student.admissionNumber})`,
        value: student._id,
    }));

    const statusOptions = [
        { label: "All", value: "" },
        { label: "Pass", value: "pass" },
        { label: "Fail", value: "fail" },
    ];

    const handleGenerateResults = async () => {
        setGenerating(true);
        try {
            await generateResult(id);
            refetch();
            showSuccess("Results generated successfully!");
        } catch (err) {
            console.error("Error generating results:", err);
            showError("Failed to generate results");
        } finally {
            setGenerating(false);
        }
    };

    const getGradeColor = (grade) => {
        const colors = {
            'A+': 'text-green-600',
            'A': 'text-green-500',
            'B+': 'text-blue-600',
            'B': 'text-blue-500',
            'C+': 'text-yellow-600',
            'C': 'text-yellow-500',
            'D': 'text-orange-500',
            'F': 'text-red-600',
        };
        return colors[grade] || 'text-gray-600';
    };

    const getResultStatusColor = (status) => {
        return status === 'pass'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const COLUMNS = [
        {
            key: "studentId",
            label: "Student",
            sortable: true,
            render: (val) => val ? `${val.firstName} ${val.lastName}` : "—",
        },
        {
            key: "admissionNumber",
            label: "Admission No",
            render: (val, row) => row.studentId?.admissionNumber || "—",
        },
        {
            key: "totalMarks",
            label: "Total Marks",
            render: (val) => val || "—",
        },
        {
            key: "percentage",
            label: "Percentage",
            render: (val) => val ? `${val}%` : "—",
        },
        {
            key: "grade",
            label: "Grade",
            render: (val) => (
                <span className={`font-semibold ${getGradeColor(val)}`}>
                    {val || "—"}
                </span>
            ),
        },
        {
            key: "resultStatus",
            label: "Status",
            render: (val) => (
                <span className={`px-2 py-1 text-xs rounded-full ${getResultStatusColor(val)}`}>
                    {val === 'pass' ? 'Pass' : 'Fail'}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Generated On",
            render: (val) => val ? new Date(val).toLocaleDateString() : "—",
        },
    ];

    // Calculate summary statistics
    const summary = {
        totalStudents: tableData.length,
        passed: tableData.filter(r => r.resultStatus === 'pass').length,
        failed: tableData.filter(r => r.resultStatus === 'fail').length,
        averagePercentage: tableData.length > 0
            ? (tableData.reduce((sum, r) => sum + (r.percentage || 0), 0) / tableData.length).toFixed(2)
            : 0,
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/school-admin/exams")}
                    className="text-gray-600 hover: "
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-text-heading">
                        Exam Results: {exam?.name || "Loading..."}
                    </h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        View and manage exam results
                    </p>
                </div>
                <Button onClick={handleGenerateResults} loading={generating}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Results
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-page  rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold">{summary.totalStudents}</p>
                </div>
                <div className="bg-surface-page  rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-500">Passed</p>
                    <p className="text-2xl font-bold text-green-600">{summary.passed}</p>
                </div>
                <div className="bg-surface-page  rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-500">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{summary.failed}</p>
                </div>
                <div className="bg-surface-page  rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-500">Average Percentage</p>
                    <p className="text-2xl font-bold text-blue-600">{summary.averagePercentage}%</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
                <div className="w-64">
                    <select
                        className="w-full px-3 py-2 border border-border  text-text-heading  rounded-lg "
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                        <option value="">All Students</option>
                        {studentOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-40">
                    <select
                        className="w-full px-3 py-2 border border-border  text-text-heading  rounded-lg "
                        value={resultStatus}
                        onChange={(e) => setResultStatus(e.target.value)}
                    >
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Table */}
            <DataTable
                title="Student Results"
                data={tableData}
                columns={COLUMNS}
                loading={isLoading}
                rowKey="_id"
                serverMode
                onSearch={(val) => { setSearch(val); setPage(1); }}
                searchPlaceholder="Search by student name..."
                pagination={{
                    currentPage: pagination.page || page,
                    totalPages: pagination.totalPages || 1,
                    totalItems: pagination.totalItems || 0,
                    onPageChange: setPage,
                }}
            />

            {/* No Results Message */}
            {!isLoading && tableData.length === 0 && (
                <div className="text-center py-12">
                    <FileBarChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No results generated yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Click "Generate Results" to calculate results for this exam
                    </p>
                </div>
            )}
        </div>
    );
}