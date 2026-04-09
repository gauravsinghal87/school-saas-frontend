import React, { useState, useMemo } from "react";
import { Plus, BookOpen, Eye, Edit3, Trash2, UploadCloud, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../components/common/ReusableTable";
import SlidePanel from "../../../components/common/SlidePanel";
import Button from "../../../components/common/Button";
import {
    getAssignmentsQuery,
    createAssignmentMutation,
    updateAssignmentMutation,
    deleteAssignmentMutation,
    getClassSecSubQuery
} from "../../../hooks/useQueryMutations";
import { showError, showSuccess } from "../../../utils/toast";
import Input from "../../../components/common/Input";
import Textarea from "../../../components/common/Textarea";

const PANEL_MODE = { ADD: "add", EDIT: "edit", VIEW: "view" };

function AssignmentForm({ defaultValues, onSubmit, loading, mode, metaData }) {
    const [values, setValues] = useState({
        classId: defaultValues?.class?._id ?? "",
        sectionId: defaultValues?.section?._id ?? "",
        subjectId: defaultValues?.subject?._id ?? "",
        title: defaultValues?.title ?? "",
        description: defaultValues?.description ?? "",
        dueDate: defaultValues?.dueDate ? defaultValues.dueDate.split("T")[0] : "",
        file: null,
        existingFile: defaultValues?.fileUrl?.secure_url ?? null,
    });

    const isView = mode === PANEL_MODE.VIEW;

    const availableSections = useMemo(() => {
        const cls = metaData.find(c => c._id === values.classId);
        return cls ? cls.sections : [];
    }, [values.classId, metaData]);

    const availableSubjects = useMemo(() => {
        const cls = metaData.find(c => c._id === values.classId);
        return cls ? cls.subjects : [];
    }, [values.classId, metaData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.classId || !values.sectionId || !values.subjectId || !values.title) {
            showError("Please fill all required fields");
            return;
        }

        const formData = new FormData();
        formData.append('classId', values.classId);
        formData.append('sectionId', values.sectionId);
        formData.append('subjectId', values.subjectId);
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('dueDate', new Date(values.dueDate).toISOString());

        if (values.file) {
            formData.append('file', values.file);
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 p-4 bg-surface-page rounded-2xl border border-border">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Target Audience</p>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">Class</label>
                    <select
                        disabled={isView}
                        className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm outline-none disabled:bg-slate-50"
                        value={values.classId}
                        onChange={(e) => setValues({ ...values, classId: e.target.value, sectionId: "", subjectId: "" })}
                    >
                        <option value="">Select Class</option>
                        {metaData.map(c => <option key={c._id} value={c._id}>Class {c.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-text-secondary">Section</label>
                        <select
                            disabled={isView || !values.classId}
                            className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm disabled:bg-slate-50"
                            value={values.sectionId}
                            onChange={(e) => setValues({ ...values, sectionId: e.target.value })}
                        >
                            <option value="">Select Section</option>
                            {availableSections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-text-secondary">Subject</label>
                        <select
                            disabled={isView || !values.sectionId}
                            className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm disabled:bg-slate-50"
                            value={values.subjectId}
                            onChange={(e) => setValues({ ...values, subjectId: e.target.value })}
                        >
                            <option value="">Select Subject</option>
                            {availableSubjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <Input label="Assignment Title" value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} readOnly={isView} required />
            <Input label="Due Date" type="date" value={values.dueDate} onChange={(e) => setValues({ ...values, dueDate: e.target.value })} readOnly={isView} required />
            <Textarea label="Instructions" value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} readOnly={isView} rows={3} />

            <div className="space-y-2">
                <label className="text-sm font-semibold text-text-heading">Attachment</label>
                {values.existingFile && !values.file && (
                    <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <FileText size={20} className="text-primary flex-shrink-0" />
                            <a href={values.existingFile} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline truncate">
                                View Current Attachment
                            </a>
                        </div>
                        {!isView && (
                            <button type="button" onClick={() => setValues({ ...values, existingFile: null })} className="text-error p-1 hover:bg-error/10 rounded-lg">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                )}
                {values.file && (
                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-amber-600" />
                            <span className="text-xs font-bold truncate">{values.file.name}</span>
                        </div>
                        <button type="button" onClick={() => setValues({ ...values, file: null })} className="text-error p-1 hover:bg-error/10 rounded-lg">
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
                {!isView && !values.file && !values.existingFile && (
                    <div className="relative group border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setValues({ ...values, file: e.target.files[0] })} />
                        <UploadCloud className="mx-auto text-text-secondary group-hover:text-primary mb-1" size={24} />
                        <p className="text-xs font-medium text-text-secondary group-hover:text-primary">Click to upload assignment file</p>
                    </div>
                )}
            </div>

            {!isView && <Button type="submit" loading={loading} className="w-full mt-4">Publish Assignment</Button>}
        </form>
    );
}

export default function AssignmentsPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [panel, setPanel] = useState({ open: false, mode: null, row: null });
    const navigate = useNavigate();

    // Get teacher/section ID from localStorage or context
    const sectionId = localStorage.getItem('teacherSectionId') || '69ce4ef9b99f96284e262cb5';
    const classId = localStorage.getItem('teacherClassId') || '69ce4ef9b99f96284e262cb3';

    const { data: apiResponse, isLoading, refetch } = getAssignmentsQuery({
        sectionId: sectionId, // Make sure your hook accepts sectionId
        page,
        limit,
        search
    });

    const { data: classResponse } = getClassSecSubQuery({
        classId: classId,
        sectionId: sectionId
    });

    const createMutation = createAssignmentMutation();
    const updateMutation = updateAssignmentMutation();
    const deleteMutation = deleteAssignmentMutation();

    const assignments = apiResponse?.data?.docs ?? apiResponse?.data ?? [];
    const total = apiResponse?.data?.totalDocs ?? apiResponse?.totalDocs ?? 0;
    const classMetaData = classResponse?.results ?? classResponse?.data ?? [];

    const handleFormSubmit = (formData) => {
        const isAdd = panel.mode === PANEL_MODE.ADD;
        const action = isAdd ? createMutation.mutate : updateMutation.mutate;
        const payload = isAdd ? formData : { id: panel.row._id, formData };

        action(payload, {
            onSuccess: () => {
                showSuccess(`Assignment ${isAdd ? "created" : "updated"} successfully`);
                setPanel({ open: false, mode: null, row: null });
                refetch();
            },
            onError: (err) => showError(err?.message || "Operation failed")
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this assignment?")) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    showSuccess("Assignment deleted");
                    refetch();
                },
                onError: (err) => showError(err?.message || "Delete failed")
            });
        }
    };



    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4  p-6 rounded-3xl border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <BookOpen size={30} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text-heading">Assignments</h1>
                            <p className="text-sm text-text-secondary font-medium">Create and manage assignments for your students</p>
                        </div>
                    </div>

                    <Button onClick={() => setPanel({ open: true, mode: PANEL_MODE.ADD, row: null })} className="flex items-center gap-2 h-12 px-6 rounded-2xl shadow-lg shadow-primary/20">
                        <Plus size={18} /> New Assignment
                    </Button>
                </div>

                <DataTable
                    title="Active Assignments"
                    columns={[
                        {
                            key: "index",
                            label: "Sr. No",
                            sortable: false,
                            width: "70px",
                            render: (_, row, idx) => (page - 1) * limit + idx + 1,
                        },
                        {
                            key: "title",
                            label: "Details",
                            render: (val, row) => (
                                <div className="flex flex-col">
                                    <span className="font-bold">{val}</span>
                                    <span className="text-[10px] text-primary font-bold uppercase">
                                        Class {row.class?.name} • {row.section?.name} | {row.subject?.name}
                                    </span>
                                </div>
                            )
                        },
                        {
                            key: "dueDate",
                            label: "Due Date",
                            render: (val) => <span className="text-error font-bold text-xs">{new Date(val).toLocaleDateString("en-IN")}</span>
                        }
                    ]}
                    data={assignments}
                    loading={isLoading}
                    serverMode
                    page={page}
                    total={total}
                    onPageChange={setPage}
                    onPageSizeChange={(val) => { setLimit(val); setPage(1); }}
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    searchPlaceholder="Search assignments..."
                    actionCell={(row) => (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPanel({ open: true, mode: PANEL_MODE.VIEW, row })}
                                className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                                title="View Details"
                            >
                                <Eye size={18} />
                            </button>
                            <button
                                onClick={() => setPanel({ open: true, mode: PANEL_MODE.EDIT, row })}
                                className="p-2 hover:bg-amber-500/10 rounded-lg text-amber-600 transition-colors"
                                title="Edit Assignment"
                            >
                                <Edit3 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(row._id)}
                                className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors"
                                title="Delete Assignment"
                            >
                                <Trash2 size={18} />
                            </button>
                            <button
                                onClick={() => navigate(`/staff/assignments/${row._id}/submissions`)}
                                className="p-2 hover:bg-success/10 rounded-lg text-success transition-colors"
                                title="View Submissions"
                            >
                                <Users size={18} />
                            </button>
                        </div>
                    )}
                />
            </div>

            <SlidePanel
                open={panel.open}
                onClose={() => setPanel({ open: false, mode: null, row: null })}
                title={
                    panel.mode === PANEL_MODE.ADD ? "Create Assignment" :
                        panel.mode === PANEL_MODE.EDIT ? "Edit Assignment" : "Assignment Details"
                }
            >
                <AssignmentForm
                    mode={panel.mode}
                    defaultValues={panel.row}
                    metaData={classMetaData}
                    loading={createMutation.isPending || updateMutation.isPending}
                    onSubmit={handleFormSubmit}
                />
            </SlidePanel>
        </div>
    );
}