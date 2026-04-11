import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    getTeacherExamSubjectsQuery,
    getTeacherExamStudentsQuery,
    updateTeacherExamMarksMutation,
    getTeacherExamMarksQuery,
    uploadMarksBulkMutation
} from '../../hooks/useQueryMutations';
import DataTable from '../../components/common/ReusableTable';
import SlidePanel from '../../components/common/SlidePanel';
import Button from '../../components/common/Button';
import {
    Save, Info, CheckCircle, Target, Download, Edit,
    AlertCircle, Upload, FileSpreadsheet, X, Eye,
    Loader2, CloudUpload, ArrowLeft
} from 'lucide-react';
import { showSuccess, showError } from '../../utils/toast';
import { downloadMarksTemplate } from '../../api/apiMehods';

const PANEL_MODE = { MARKS: "marks", BULK_UPLOAD: "bulk_upload" };

const GiveExamMarkorUpload = () => {
    const [params] = useSearchParams();
    const exam_id = params.get('exam_id');
    const class_id = params.get('class_id');

    const [marksData, setMarksData] = useState({});
    const [editedStudents, setEditedStudents] = useState(new Set());
    const [panel, setPanel] = useState({ open: false, mode: null, student: null });
    const [bulkFile, setBulkFile] = useState(null);
    const fileInputRef = useRef(null);

    // API Queries
    const { data: subjectRes, isLoading: subjectsLoading, refetch: refetchSubjects } = getTeacherExamSubjectsQuery({ examId: exam_id, classId: class_id });
    const [subject_id, setSubjectId] = useState(subjectRes?.data?.results?.[0]?.subject_id || '');
    const { data: studentRes, isLoading: studentsLoading, refetch: refetchStudents } = getTeacherExamStudentsQuery({
        examId: exam_id,
        classId: class_id,
        subjectId: subject_id
    });
    const { data: marksRes, refetch: refetchMarks } = getTeacherExamMarksQuery({
        examId: exam_id,
        classId: class_id,
        subjectId: subject_id
    });

    console.log('subjectRes?.data?.results?.[0]?.subject_id', subjectRes?.data?.results?.[0]?.subject_id)
    // Mutations
    const updateMutation = updateTeacherExamMarksMutation();
    const bulkUploadMutation = uploadMarksBulkMutation();
    // Find details of the selected subject
    const selectedSubjectDetail = useMemo(() => {
        return subjectRes?.data?.results?.find(s => s.subject_id === subject_id);
    }, [subjectRes, subject_id]);

    // Get students with their existing marks
    const studentsWithMarks = useMemo(() => {
        const students = studentRes?.data?.results?.students || [];
        const marksDataFromApi = marksRes?.data?.results?.students || [];

        const marksMap = new Map();
        marksDataFromApi.forEach(student => {
            marksMap.set(student.student_id, {
                marks: student.marks,
                marked_at: student.marked_at
            });
        });

        return students.map(student => ({
            ...student,
            existingMarks: marksMap.get(student.student_id)?.marks || null,
            marked_at: marksMap.get(student.student_id)?.marked_at || null
        }));
    }, [studentRes, marksRes]);

    // Initialize marksData with existing marks
    useEffect(() => {
        if (studentsWithMarks.length > 0 && subject_id) {
            const initialMarks = {};
            studentsWithMarks.forEach(student => {
                if (student.existingMarks !== null && student.existingMarks !== undefined) {
                    initialMarks[student.student_id] = student.existingMarks;
                }
            });
            setMarksData(initialMarks);
        }
    }, [studentsWithMarks, subject_id]);

    const handleMarkChange = (studentId, value) => {
        setMarksData(prev => ({ ...prev, [studentId]: value }));
        setEditedStudents(prev => new Set([...prev, studentId]));
    };

    const handleSave = async () => {
        const payload = {
            exam_id,
            class_id,
            subject_id,
            marks: Object.entries(marksData).map(([id, val]) => ({
                student_id: id,
                marks: Number(val)
            }))
        };

        if (payload.marks.length === 0) {
            showError("Please enter marks first");
            return;
        }

        updateMutation.mutate(payload, {
            onSuccess: () => {
                showSuccess("Marks saved successfully!");
                setEditedStudents(new Set());
                refetchMarks();
            },
            onError: (err) => {
                showError(err?.message || "Failed to save marks");
            }
        });
    };



    const downloadSampleCSV = async () => {
        try {
            const res = await downloadMarksTemplate({
                examId: exam_id,
                classId: class_id,
                subjectId: subject_id
            });
            console.log(res)

            const url = window.URL.createObjectURL(new Blob([res]));
            const a = document.createElement('a');
            a.href = url;
            const fileName = `marks_${selectedSubjectDetail?.subject_name}_${new Date().toISOString().split('T')[0]}.csv`;

            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            showSuccess("Sample file downloaded 🚀");

        } catch (error) {
            console.error("Download failed:", error);
            showError("Failed to download file ❌");
        }
    };

    // Handle Bulk Upload
    const handleBulkUpload = () => {
        if (!bulkFile) {
            showError("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append('exam_id', exam_id);
        formData.append('class_id', class_id);
        formData.append('subject_id', subject_id);
        formData.append('file', bulkFile);

        bulkUploadMutation.mutate(formData, {
            onSuccess: () => {
                showSuccess("Bulk marks uploaded successfully!");
                setBulkFile(null);
                setPanel({ open: false, mode: null, student: null });
                refetchMarks();
                refetchStudents();
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: (err) => {
                showError(err?.message || "Failed to upload marks");
            }
        });
    };

    const openMarksPanel = (student) => {
        setPanel({ open: true, mode: PANEL_MODE.MARKS, student });
    };

    const openBulkUploadPanel = () => {
        setPanel({ open: true, mode: PANEL_MODE.BULK_UPLOAD, student: null });
    };

    const closePanel = () => {
        setPanel({ open: false, mode: null, student: null });
        setBulkFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Columns for DataTable
    const COLUMNS = [
        {
            key: "index",
            label: "Sr. No",
            sortable: false,
            width: "70px",
            render: (_, row, idx) => idx + 1,
        },
        {
            key: "student",
            label: "Student Name",
            sortable: true,
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-text-heading text-sm">{row.name}</span>
                    <span className="text-xs text-text-secondary">{row.first_name} {row.last_name}</span>
                </div>
            )
        },
        {
            key: "roll_number",
            label: "Roll No",
            sortable: true,
            width: "100px",
        },
        {
            key: "admission_number",
            label: "Admission No",
            sortable: true,
            width: "130px",
        },
        {
            key: "section",
            label: "Section",
            sortable: true,
            width: "100px",
            render: (_, row) => row.section?.name || "-"
        },
        {
            key: "currentMarks",
            label: `Marks / ${selectedSubjectDetail?.max_marks || 0}`,
            sortable: true,
            width: "150px",
            render: (_, row) => {
                const currentMarks = marksData[row.student_id];
                const hasExistingMarks = row.existingMarks !== null;
                const isEdited = editedStudents.has(row.student_id);

                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={currentMarks !== undefined ? currentMarks : ''}
                            onChange={(e) => handleMarkChange(row.student_id, e.target.value)}
                            max={selectedSubjectDetail?.max_marks}
                            min="0"
                            className={`
                                w-20 px-2 py-1.5 rounded-lg border text-center font-medium outline-none transition-all text-sm
                                ${isEdited
                                    ? 'border-primary bg-primary/5 text-text-primary'
                                    : hasExistingMarks
                                        ? 'border-success/30 bg-success/5 text-text-primary'
                                        : 'border-border bg-surface-page text-text-primary'
                                }
                                focus:ring-2 focus:ring-primary/20 focus:border-primary
                            `}
                            placeholder="Enter"
                        />
                        {isEdited && (
                            <span className="text-xs text-warning">*</span>
                        )}
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
                const currentMarks = marksData[row.student_id];
                const isPassed = currentMarks >= (selectedSubjectDetail?.pass_marks || 0);

                if (currentMarks !== undefined && currentMarks !== '') {
                    return isPassed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                            <CheckCircle className="w-3 h-3" />
                            Pass
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
                            <AlertCircle className="w-3 h-3" />
                            Fail
                        </span>
                    );
                }
                return (
                    <span className="text-xs text-text-secondary">Pending</span>
                );
            }
        }
    ];

    // Action Cell for DataTable
    const ActionCell = ({ row }) => (
        <button
            onClick={() => openMarksPanel(row)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
        >
            <Eye className="w-4 h-4" />
            View Details
        </button>
    );

    // Marks Panel Component
    const MarksPanel = ({ student, onSubmit, loading }) => {
        const [marks, setMarks] = useState(student?.existingMarks || '');
        const isPassed = marks >= (selectedSubjectDetail?.pass_marks || 0);
        const isMaxExceeded = marks > (selectedSubjectDetail?.max_marks || 0);

        const handleSave = () => {
            if (!marks && marks !== 0) {
                showError("Please enter marks");
                return;
            }
            if (isMaxExceeded) {
                showError(`Marks cannot exceed ${selectedSubjectDetail?.max_marks}`);
                return;
            }
            onSubmit(student.student_id, marks);
        };

        return (
            <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-surface-page p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-text-heading">{student?.name}</h4>
                            <p className="text-sm text-text-secondary mt-1">
                                Roll No: {student?.roll_number} | Section: {student?.section?.name}
                            </p>
                        </div>
                        {student?.existingMarks !== null && (
                            <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                                Previously: {student.existingMarks}
                            </span>
                        )}
                    </div>

                    <div className="border-t border-border text-text-heading pt-4">
                        <label className="block text-sm font-medium text-text-heading mb-2">
                            Enter Marks (Max: {selectedSubjectDetail?.max_marks} | Pass: {selectedSubjectDetail?.pass_marks})
                        </label>
                        <input
                            type="number"
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                            max={selectedSubjectDetail?.max_marks}
                            min="0"
                            className={`
                                w-full px-4 py-3 rounded-xl border text-center font-medium outline-none transition-all
                                ${isMaxExceeded
                                    ? 'border-error bg-error/5 text-error'
                                    : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                                }
                            `}
                            placeholder="Enter marks"
                        />
                        {isMaxExceeded && (
                            <p className="text-xs text-error mt-2">Maximum marks is {selectedSubjectDetail?.max_marks}</p>
                        )}
                        {marks && !isMaxExceeded && (
                            <div className={`mt-3 p-3 rounded-lg ${isPassed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                <div className="flex items-center gap-2">
                                    {isPassed ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    <span className="text-sm font-medium">
                                        {isPassed ? 'Student Passed!' : 'Student Failed!'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={onSubmit} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} loading={loading} className="flex-1 gap-2">
                        <Save className="w-4 h-4" />
                        Save Marks
                    </Button>
                </div>
            </div>
        );
    };

    // Bulk Upload Panel
    const BulkUploadPanel = ({ onSubmit, loading }) => {
        const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'text/csv') {
                setBulkFile(file);
            } else {
                showError("Please select a valid CSV file");
                e.target.value = '';
            }
        };

        return (
            <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-surface-page p-5 space-y-4">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileSpreadsheet className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-semibold text-text-heading">Bulk Upload Marks</h4>
                        <p className="text-xs text-text-secondary mt-1">
                            Upload CSV file with marks for all students
                        </p>
                    </div>

                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="csv-upload"
                        />
                        <label
                            htmlFor="csv-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                        >
                            <CloudUpload className="w-10 h-10 text-text-secondary" />
                            <span className="text-sm font-medium text-primary">
                                {bulkFile ? bulkFile.name : "Click to upload CSV file"}
                            </span>
                            <span className="text-xs text-text-secondary">
                                Format: Roll Number, Student Name, Marks
                            </span>
                        </label>
                    </div>

                    <div className="bg-info/5 rounded-lg p-3 border border-info/20">
                        <p className="text-xs text-info flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Download the sample file to see the correct format
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={downloadSampleCSV}
                        className="w-full gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download Sample CSV
                    </Button>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={onSubmit} className="flex-1">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onSubmit(bulkFile)}
                        loading={loading}
                        className="flex-1 gap-2"
                        disabled={!bulkFile}
                    >
                        <Upload className="w-4 h-4" />
                        Upload Marks
                    </Button>
                </div>
            </div>
        );
    };

    const panelMeta = {
        [PANEL_MODE.MARKS]: { title: "Student Marks", subtitle: "Enter marks for individual student" },
        [PANEL_MODE.BULK_UPLOAD]: { title: "Bulk Upload", subtitle: "Upload marks for all students at once" },
    };

    const meta = panel.mode ? panelMeta[panel.mode] : {};

    const isLoading = subjectsLoading || studentsLoading;

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-heading">Marks Entry Portal</h1>
                        <p className="text-sm text-text-secondary mt-0.5">
                            Enter and manage student marks for exams
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {subject_id && (
                            <>
                                <Button
                                    onClick={downloadSampleCSV}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Sample
                                </Button>
                                <Button
                                    onClick={openBulkUploadPanel}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Bulk Upload
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Subject Selector Card */}
                <div className="bg-surface-card rounded-2xl border border-border p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Select Subject
                            </label>
                            <select
                                className="w-full md:w-96 px-4 py-2.5 rounded-xl bg-surface-page border border-border text-text-primary font-medium text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                value={subject_id}
                                onChange={(e) => {
                                    setSubjectId(e.target.value);
                                    setMarksData({});
                                    setEditedStudents(new Set());
                                }}
                            >
                                <option value=''>Choose a subject</option>
                                {subjectRes?.data?.results?.map(sub => (
                                    <option key={sub.subject_id} value={sub.subject_id}>
                                        {sub.subject_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedSubjectDetail && (
                            <div className="flex flex-wrap gap-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-medium text-text-secondary">Max Marks:</span>
                                    <span className="text-sm font-bold text-primary">{selectedSubjectDetail.max_marks}</span>
                                </div>
                                <div className="w-px h-6 bg-border hidden sm:block"></div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-success" />
                                    <span className="text-xs font-medium text-text-secondary">Pass Marks:</span>
                                    <span className="text-sm font-bold text-success">{selectedSubjectDetail.pass_marks}</span>
                                </div>
                                <div className="w-px h-6 bg-border hidden sm:block"></div>
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-info" />
                                    <span className="text-xs font-medium text-text-secondary">Total Students:</span>
                                    <span className="text-sm font-bold text-info">{studentsWithMarks.length}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Table */}
                {subject_id ? (
                    <>
                        {editedStudents.size > 0 && (
                            <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-warning" />
                                    <span className="text-sm text-warning">
                                        You have {editedStudents.size} unsaved change{editedStudents.size > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <Button onClick={handleSave} size="sm" loading={updateMutation.isPending} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    Save All Changes
                                </Button>
                            </div>
                        )}

                        <DataTable
                            actionCell={(row) => <ActionCell row={row} />}
                            title="Student Marks List"
                            subtitle={`Manage marks for ${selectedSubjectDetail?.subject_name || 'selected subject'}`}
                            columns={COLUMNS}
                            data={studentsWithMarks}
                            loading={isLoading}
                            rowKey="student_id"
                            emptyMessage="No students found"
                            emptyDescription="No students are enrolled in this class"
                            searchPlaceholder="Search by name, roll number..."
                            defaultPageSize={10}
                            pageSizeOptions={[10, 20, 50]}
                            serverMode={false}
                        />
                    </>
                ) : (
                    <div className="bg-surface-card rounded-2xl border border-border p-16 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-page flex items-center justify-center">
                            <Info className="w-10 h-10 text-text-secondary opacity-40" />
                        </div>
                        <p className="text-text-secondary font-medium">Select a subject to begin</p>
                        <p className="text-xs text-text-secondary mt-1">Choose a subject from the dropdown to load students and enter marks</p>
                    </div>
                )}
            </div>

            {/* Slide Panels */}
            <SlidePanel
                open={panel.open && panel.mode === PANEL_MODE.MARKS}
                onClose={closePanel}
                title={meta.title}
                subtitle={meta.subtitle}
            >
                {panel.student && (
                    <MarksPanel
                        student={panel.student}
                        onSubmit={(studentId, marks) => {
                            handleMarkChange(studentId, marks);
                            closePanel();
                            showSuccess("Marks updated successfully");
                        }}
                        loading={false}
                    />
                )}
            </SlidePanel>

            <SlidePanel
                open={panel.open && panel.mode === PANEL_MODE.BULK_UPLOAD}
                onClose={closePanel}
                title={meta.title}
                subtitle={meta.subtitle}
            >
                <BulkUploadPanel
                    onSubmit={(file) => {
                        if (file) handleBulkUpload();
                        else closePanel();
                    }}
                    loading={bulkUploadMutation.isPending}
                />
            </SlidePanel>
        </div>
    );
};

export default GiveExamMarkorUpload;