import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import SidePanel from "../../../components/common/SlidePanel";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/common/ReusableTable";
import ConfirmBox from "../../../components/common/ConfirmBox";
import {
    examSubjectsList,
    addExamSubjectsMutation,
    updateExamSubjectMutation,
    deleteExamSubjectMutation,
    examById
} from "../../../hooks/useQueryMutations";
import { getSubjectsQuery } from "../../../hooks/useQueryMutations";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import Select from "../../../components/common/Select";
import Input from "../../../components/common/Input";
import { Controller } from "react-hook-form";

export default function ExamSubjects() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("add");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Fetch exam details
    const { data: examData } = examById(id);
    const exam = examData?.data?.results || examData?.results;

    // Fetch exam subjects
    const { data: subjectsResponse, isLoading, refetch } = examSubjectsList(id, { page, limit, search });
    const tableData = subjectsResponse?.data?.results || subjectsResponse?.results || [];
    const pagination = subjectsResponse?.data?.pagination || subjectsResponse?.pagination || {};

    // Fetch all subjects for adding
    const { data: allSubjectsData } = getSubjectsQuery();
    const allSubjects = allSubjectsData?.results || allSubjectsData?.data || [];

    // Filter out already added subjects
    const existingSubjectIds = tableData.map(s => s.subjectId?._id || s.subjectId);
    const availableSubjects = allSubjects.filter(s => !existingSubjectIds.includes(s._id));

    const subjectOptions = availableSubjects.map(subject => ({
        label: subject.name,
        value: subject._id,
    }));

    // Columns for subjects table
    const COLUMNS = [
        {
            key: "subjectId",
            label: "Subject Name",
            render: (val) => val?.name || "—",
        },
        {
            key: "maxMarks",
            label: "Max Marks",
            render: (val) => val || "—",
        },
        {
            key: "passMarks",
            label: "Pass Marks",
            render: (val) => val || "—",
        },
        {
            key: "examDate",
            label: "Exam Date",
            render: (val) => val ? new Date(val).toLocaleDateString() : "—",
        },
    ];

    // Mutations
    const { mutateAsync: addSubjects, isPending: isAdding } = addExamSubjectsMutation();
    const { mutateAsync: updateSubject, isPending: isUpdating } = updateExamSubjectMutation();
    const { mutateAsync: deleteSubject, isPending: isDeleting } = deleteExamSubjectMutation();

    // Form handling for adding multiple subjects
    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            subjects: [{ subjectId: "", maxMarks: "", passMarks: "", examDate: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "subjects",
    });

    // Form for editing single subject
    const [editForm, setEditForm] = useState({
        subjectId: "",
        maxMarks: "",
        passMarks: "",
        examDate: "",
    });

    const openAddModal = () => {
        setMode("add");
        reset({
            subjects: [{ subjectId: "", maxMarks: "", passMarks: "", examDate: "" }],
        });
        setIsOpen(true);
    };

    const openEditModal = (subject) => {
        setMode("edit");
        setSelectedSubject(subject);
        setEditForm({
            subjectId: subject.subjectId?._id || subject.subjectId,
            maxMarks: subject.maxMarks,
            passMarks: subject.passMarks,
            examDate: subject.examDate ? subject.examDate.split("T")[0] : "",
        });
        setIsOpen(true);
    };

    const onSubmitAdd = async (formData) => {
        try {
            const payload = {
                subjects: formData.subjects.map(s => ({
                    subjectId: s.subjectId,
                    maxMarks: parseInt(s.maxMarks),
                    passMarks: parseInt(s.passMarks),
                    examDate: s.examDate,
                })),
            };
            await addSubjects({ id, data: payload });
            refetch();
            setIsOpen(false);
            reset();
        } catch (err) {
            console.error("Error adding subjects:", err);
        }
    };

    const onSubmitEdit = async () => {
        try {
            await updateSubject({
                examId: id,
                subjectId: selectedSubject._id,
                data: {
                    maxMarks: parseInt(editForm.maxMarks),
                    passMarks: parseInt(editForm.passMarks),
                    examDate: editForm.examDate,
                },
            });
            refetch();
            setIsOpen(false);
            setSelectedSubject(null);
        } catch (err) {
            console.error("Error updating subject:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteSubject({
                examId: id,
                subjectId: selectedSubject._id,
            });
            refetch();
            setConfirmOpen(false);
            setSelectedSubject(null);
        } catch (err) {
            console.error("Error deleting subject:", err);
        }
    };

    // Watch first subject for validation
    const watchedSubjects = watch("subjects");

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
                        Exam Subjects: {exam?.name || "Loading..."}
                    </h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Manage subjects for this exam
                    </p>
                </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-end mb-4">
                <Button onClick={openAddModal} disabled={availableSubjects.length === 0}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subjects
                </Button>
            </div>

            {/* Subjects Table */}
            <DataTable
                title="Exam Subjects"
                data={tableData}
                columns={COLUMNS}
                loading={isLoading}
                rowKey="_id"
                serverMode
                onSearch={(val) => { setSearch(val); setPage(1); }}
                searchPlaceholder="Search subjects..."
                actionCell={(row) => (
                    <div className="flex items-center gap-2">
                        <button
                            className="text-yellow-600 hover:text-yellow-800"
                            onClick={() => openEditModal(row)}
                            title="Edit Subject Details"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => {
                                setSelectedSubject(row);
                                setConfirmOpen(true);
                            }}
                            title="Remove Subject"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            />

            {/* Add Subjects Modal */}
            <SidePanel
                open={isOpen && mode === "add"}
                onClose={() => {
                    setIsOpen(false);
                    reset();
                }}
                title="Add Subjects to Exam"
                size="large"
            >
                <form onSubmit={handleSubmit(onSubmitAdd)} className="flex flex-col gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-2">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            Add subjects with their max marks, pass marks, and exam date
                        </p>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Subject {index + 1}</h3>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subject *</label>
                                    <Controller
                                        name={`subjects.${index}.subjectId`}
                                        control={control}
                                        rules={{ required: "Subject is required" }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value || ""}
                                                onChange={(val) => field.onChange(val)}
                                                options={subjectOptions}
                                                placeholder="Select subject"
                                                error={errors.subjects?.[index]?.subjectId?.message}
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Exam Date *</label>
                                    <Input
                                        type="date"
                                        register={register(`subjects.${index}.examDate`, {
                                            required: "Exam date is required",
                                        })}
                                        error={errors.subjects?.[index]?.examDate?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Max Marks *</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g., 100"
                                        register={register(`subjects.${index}.maxMarks`, {
                                            required: "Max marks is required",
                                            min: { value: 1, message: "Must be greater than 0" }
                                        })}
                                        error={errors.subjects?.[index]?.maxMarks?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Pass Marks *</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g., 40"
                                        register={register(`subjects.${index}.passMarks`, {
                                            required: "Pass marks is required",
                                            min: { value: 1, message: "Must be greater than 0" },
                                            validate: (value, formValues) => {
                                                const maxMarks = formValues.subjects?.[index]?.maxMarks;
                                                if (maxMarks && parseInt(value) > parseInt(maxMarks)) {
                                                    return "Pass marks cannot exceed max marks";
                                                }
                                                return true;
                                            }
                                        })}
                                        error={errors.subjects?.[index]?.passMarks?.message}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ subjectId: "", maxMarks: "", passMarks: "", examDate: "" })}
                        className="w-full"
                        disabled={subjectOptions.length === 0}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Subject
                    </Button>

                    <div className="flex justify-end mt-auto">
                        <Button type="submit" loading={isAdding} variant="primary">
                            Add Subjects
                        </Button>
                    </div>
                </form>
            </SidePanel>

            {/* Edit Subject Modal */}
            <SidePanel
                open={isOpen && mode === "edit"}
                onClose={() => {
                    setIsOpen(false);
                    setSelectedSubject(null);
                }}
                title="Edit Subject Details"
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <Input
                            value={selectedSubject?.subjectId?.name || ""}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Exam Date *</label>
                        <Input
                            type="date"
                            value={editForm.examDate}
                            onChange={(e) => setEditForm({ ...editForm, examDate: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Max Marks *</label>
                        <Input
                            type="number"
                            value={editForm.maxMarks}
                            onChange={(e) => setEditForm({ ...editForm, maxMarks: e.target.value })}
                            placeholder="e.g., 100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Pass Marks *</label>
                        <Input
                            type="number"
                            value={editForm.passMarks}
                            onChange={(e) => setEditForm({ ...editForm, passMarks: e.target.value })}
                            placeholder="e.g., 40"
                        />
                    </div>

                    <div className="flex justify-end mt-auto">
                        <Button onClick={onSubmitEdit} loading={isUpdating} variant="primary">
                            Update Subject
                        </Button>
                    </div>
                </div>
            </SidePanel>

            {/* Confirm Delete Dialog */}
            <ConfirmBox
                isOpen={confirmOpen}
                title="Remove Subject"
                message={`Are you sure you want to remove "${selectedSubject?.subjectId?.name}" from this exam?`}
                loading={isDeleting}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}