import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/common/ReusableTable";
import {
    examSubjectsList,
    examMarksList,
    upsertMarksMutation,
    examById
} from "../../../hooks/useQueryMutations";
import { getStudentsQuery } from "../../../hooks/useQueryMutations";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import Input from "../../../components/common/Input";
import { showSuccess } from "../../../utils/toast";

export default function ExamMarks() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [marksData, setMarksData] = useState({});
    const [saving, setSaving] = useState(false);

    // Fetch exam details
    const { data: examData } = examById(id);
    const exam = examData?.data?.results || examData?.results;

    // Fetch exam subjects
    const { data: subjectsResponse } = examSubjectsList(id);
    const subjects = subjectsResponse?.data?.results || subjectsResponse?.results || [];

    // Fetch students
    const { data: studentsData } = getStudentsQuery();
    const students = studentsData?.data?.results || studentsData?.results || [];

    // Fetch existing marks
    const { data: marksResponse, refetch: refetchMarks } = examMarksList(id, {
        studentId: selectedStudent || undefined,
    });
    const existingMarks = marksResponse?.data?.results || marksResponse?.results || [];

    // Mutations
    const { mutateAsync: upsertMarks } = upsertMarksMutation();

    // Initialize marks data when student is selected
    useEffect(() => {
        if (selectedStudent && subjects.length > 0) {
            const initialMarks = {};
            subjects.forEach(subject => {
                const existing = existingMarks.find(
                    m => m.subjectId?._id === subject.subjectId?._id
                );
                initialMarks[subject._id || subject.subjectId?._id] = {
                    marksObtained: existing?.marksObtained || "",
                    subjectId: subject.subjectId?._id,
                };
            });
            setMarksData(initialMarks);
        }
    }, [selectedStudent, subjects, existingMarks]);

    const studentOptions = students.map(student => ({
        label: `${student.firstName} ${student.lastName} (${student.admissionNumber})`,
        value: student._id,
    }));

    const handleMarksChange = (subjectId, value) => {
        setMarksData(prev => ({
            ...prev,
            [subjectId]: {
                ...prev[subjectId],
                marksObtained: value,
            },
        }));
    };

    const handleSaveMarks = async () => {
        if (!selectedStudent) {
            showError("Please select a student");
            return;
        }

        setSaving(true);
        try {
            const marks = Object.values(marksData)
                .filter(m => m.marksObtained !== "" && m.marksObtained !== null)
                .map(m => ({
                    studentId: selectedStudent,
                    subjectId: m.subjectId,
                    marksObtained: parseInt(m.marksObtained),
                }));

            if (marks.length === 0) {
                showError("Please enter marks for at least one subject");
                return;
            }

            await upsertMarks({ id, data: { marks } });
            refetchMarks();
            showSuccess("Marks saved successfully!");
        } catch (err) {
            console.error("Error saving marks:", err);
        } finally {
            setSaving(false);
        }
    };

    // Columns for marks entry table
    const MARKS_COLUMNS = [
        {
            key: "subject",
            label: "Subject",
            render: (val, row) => row.subjectId?.name || row.name || "—",
        },
        {
            key: "maxMarks",
            label: "Max Marks",
            render: (val, row) => row.maxMarks || "—",
        },
        {
            key: "passMarks",
            label: "Pass Marks",
            render: (val, row) => row.passMarks || "—",
        },
        {
            key: "marksObtained",
            label: "Marks Obtained",
            render: (val, row) => (
                <Input
                    type="number"
                    value={marksData[row._id || row.subjectId?._id]?.marksObtained || ""}
                    onChange={(e) => handleMarksChange(row._id || row.subjectId?._id, e.target.value)}
                    placeholder="Enter marks"
                    className="w-32"
                    min="0"
                    max={row.maxMarks}
                />
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (val, row) => {
                const obtained = marksData[row._id || row.subjectId?._id]?.marksObtained;
                if (!obtained) return "—";
                const passMarks = row.passMarks;
                const isPass = parseInt(obtained) >= passMarks;
                return (
                    <span className={`px-2 py-1 text-xs rounded-full ${isPass
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {isPass ? "Pass" : "Fail"}
                    </span>
                );
            },
        },
    ];

    // Columns for marks history table
    const HISTORY_COLUMNS = [
        {
            key: "subjectId",
            label: "Subject",
            render: (val) => val?.name || "—",
        },
        {
            key: "marksObtained",
            label: "Marks Obtained",
            render: (val) => val || "—",
        },
        {
            key: "teacherId",
            label: "Entered By",
            render: (val) => val?.name || "—",
        },
        {
            key: "createdAt",
            label: "Date",
            render: (val) => val ? new Date(val).toLocaleDateString() : "—",
        },
    ];

    const selectedStudentData = students.find(s => s._id === selectedStudent);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/school-admin/exams")}
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-text-heading">
                        Enter Marks: {exam?.name || "Loading..."}
                    </h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Enter marks for students in this exam
                    </p>
                </div>
            </div>

            {/* Student Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select Student</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                        >
                            <option value="">Select a student</option>
                            {studentOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedStudent && (
                        <div className="flex items-end">
                            <Button onClick={handleSaveMarks} loading={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Marks
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Marks Entry Table */}
            {selectedStudent && (
                <>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">
                            Student: {selectedStudentData?.firstName} {selectedStudentData?.lastName}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Admission No: {selectedStudentData?.admissionNumber}
                        </p>
                    </div>

                    <DataTable
                        title="Enter Marks"
                        data={subjects}
                        columns={MARKS_COLUMNS}
                        rowKey="_id"
                        loading={false}
                    />

                    {/* Marks History */}
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4">Marks History</h2>
                        <DataTable
                            title="Previous Entries"
                            data={existingMarks}
                            columns={HISTORY_COLUMNS}
                            rowKey="_id"
                            loading={false}
                        />
                    </div>
                </>
            )}

            {!selectedStudent && (
                <div className="text-center py-12 text-gray-500">
                    Please select a student to enter marks
                </div>
            )}
        </div>
    );
}