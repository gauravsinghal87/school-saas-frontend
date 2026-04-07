import React, { useState, useMemo } from "react";
import { Plus, FileText, Calendar as CalendarIcon, Trash2, Eye, BookOpen, UploadCloud } from "lucide-react";
import DataTable from "../../../components/common/ReusableTable";
import SlidePanel from "../../../components/common/SlidePanel";
import Input from "../../../components/common/Input";
import Textarea from "../../../components/common/Textarea";
import Button from "../../../components/common/Button";
import {
    getAssignmentsQuery,
    createAssignmentMutation,
    updateAssignmentMutation,
    deleteAssignmentMutation,
    getClassSecSubQuery
} from "../../../hooks/useQueryMutations";
import { showError } from "../../../utils/toast";

const PANEL_MODE = { ADD: "add", EDIT: "edit", VIEW: "view" };

function AssignmentForm({ defaultValues, onSubmit, loading, mode, metaData }) {
    const [values, setValues] = useState({
        classId: defaultValues?.classId?._id ?? "",
        sectionId: defaultValues?.sectionId?._id ?? "",
        subjectId: defaultValues?.subjectId?._id ?? "",
        title: defaultValues?.title ?? "",
        description: defaultValues?.description ?? "",
        dueDate: defaultValues?.dueDate ? defaultValues.dueDate.split("T")[0] : "",
        file: defaultValues?.file ?? null, // Key name matches your curl: 'file'
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

        // ── FORM DATA CONSTRUCTION ──
        // Since your curl uses --form, we must use FormData
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
            {/* Selection Block */}
            <div className="grid grid-cols-1 gap-4 p-4 bg-surface-page rounded-2xl border border-border">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Target Audience</p>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">Class</label>
                    <select
                        disabled={isView}
                        className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm outline-none"
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
                            className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm"
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
                            className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm"
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

            {/* File Upload Section - Matching --form 'file=...' */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-text-heading">Attachment</label>
                {values.file ? (
                    <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-xl">
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-primary" />
                            <span className="text-xs font-bold truncate max-w-[200px]">{values.file.name || "Attached File"}</span>
                        </div>
                        {!isView && (
                            <button type="button" onClick={() => setValues({ ...values, file: null })} className="text-error p-1 hover:bg-error/10 rounded-lg">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ) : !isView && (
                    <div className="relative group border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all">
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setValues({ ...values, file: e.target.files[0] })}
                        />
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
    const [panel, setPanel] = useState({ open: false, mode: null, row: null });

    const { data: apiResponse, isLoading, refetch } = getAssignmentsQuery();
    const { data: classResponse } = getClassSecSubQuery({ classId: '69ce4ef9b99f96284e262cb3', sectionId: '69ce4ef9b99f96284e262cb5' }); // For the dropdowns in form

    const createMutation = createAssignmentMutation();
    const updateMutation = updateAssignmentMutation();
    const deleteMutation = deleteAssignmentMutation();

    const assignments = apiResponse?.data ?? [];
    const classMetaData = classResponse?.results ?? [];

    const handleFormSubmit = (formData) => {
        // formData is already a FormData object from the AssignmentForm
        const action = panel.mode === PANEL_MODE.ADD
            ? createMutation.mutate
            : (data) => updateMutation.mutate({ id: panel.row._id, data });

        action(formData, {
            onSuccess: () => {
                setPanel({ open: false, mode: null, row: null });
                refetch();
            },
            onError: (err) => showError(err?.message || "Operation failed")
        });
    };

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-text-heading italic flex items-center gap-2">
                            <BookOpen className="text-primary" /> Assignments
                        </h1>
                    </div>
                    <Button onClick={() => setPanel({ open: true, mode: PANEL_MODE.ADD, row: null })} className="flex items-center gap-2">
                        <Plus size={18} /> New Assignment
                    </Button>
                </div>

                <DataTable
                    title="Active Assignments"
                    columns={[
                        {
                            key: "title",
                            label: "Details",
                            render: (val, row) => (
                                <div className="flex flex-col">
                                    <span className="font-bold">{val}</span>
                                    <span className="text-[10px] text-primary font-bold uppercase">
                                        Class {row.classId?.name} • {row.sectionId?.name} | {row.subjectId?.name}
                                    </span>
                                </div>
                            )
                        },
                        { key: "dueDate", label: "Due Date", render: (val) => <span className="text-error font-bold text-xs">{new Date(val).toLocaleDateString("en-IN")}</span> }
                    ]}
                    data={assignments}
                    loading={isLoading}
                    actionCell={(row) => (
                        <button onClick={() => setPanel({ open: true, mode: PANEL_MODE.VIEW, row })} className="p-2 hover:bg-primary/10 rounded-lg text-primary">
                            <Eye size={18} />
                        </button>
                    )}
                />
            </div>

            <SlidePanel
                open={panel.open}
                onClose={() => setPanel({ open: false, mode: null, row: null })}
                title={panel.mode === PANEL_MODE.ADD ? "Create Assignment" : "View Details"}
            >
                <AssignmentForm
                    mode={panel.mode}
                    defaultValues={panel.row}
                    metaData={classMetaData}
                    loading={createMutation.isPending}
                    onSubmit={handleFormSubmit}
                />
            </SlidePanel>
        </div>
    );
}