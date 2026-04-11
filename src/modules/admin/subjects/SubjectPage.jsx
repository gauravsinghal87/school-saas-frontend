import React, { useState } from "react";
import { showSuccess, showError } from "../../../utils/toast";
import DataTable from "../../../components/common/ReusableTable";
import SlidePanel from "../../../components/common/SlidePanel";
import Input from "../../../components/common/Input";
import Textarea from "../../../components/common/Textarea";
import Button from "../../../components/common/Button";
import { Edit, Trash2, Plus, BookOpen } from "lucide-react";
import {
    addSubjectMutation,
    getSubjectsQuery,
    updateSubjectMutation,
    deleteSubjectMutation,
} from "../../../hooks/useQueryMutations";

const PANEL_MODE = { ADD: "add", EDIT: "edit", VIEW: "view" };

// ── Validation ──────────────────────────────────────────────────────────────
function validateSubjectForm(values) {
    const errors = {};

    if (!values.name?.trim()) {
        errors.name = "Subject name is required";
    } else if (values.name.trim().length < 2) {
        errors.name = "Subject name must be at least 2 characters";
    } else if (values.name.trim().length > 50) {
        errors.name = "Subject name must be less than 50 characters";
    }

    if (values.description?.trim() && values.description.trim().length > 500) {
        errors.description = "Description must be less than 500 characters";
    }

    return errors;
}

// ── Subject Form Component ──────────────────────────────────────────────────
function SubjectForm({ defaultValues, onSubmit, loading, mode, onClose }) {
    const [values, setValues] = useState({
        name: defaultValues?.name ?? "",
        description: defaultValues?.description ?? "",
        _id: defaultValues?._id ?? null,
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (field, value) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        if (touched[field]) {
            const newErrors = validateSubjectForm({ ...values, [field]: value });
            setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
        }
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const newErrors = validateSubjectForm(values);
        setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateSubjectForm(values);
        setTouched({ name: true, description: true });
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showError("Please fix the errors before submitting");
            return;
        }

        const reset = () => {
            setValues({ name: "", description: "", _id: null });
            setErrors({});
            setTouched({});
        };

        onSubmit(values, reset);
    };

    const isViewMode = mode === "view";

    return (
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
            <Input
                label="Subject Name"
                name="name"
                placeholder="e.g., Mathematics, Science, English"
                required
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                error={errors.name}
                readOnly={isViewMode}
                autoFocus={!isViewMode}
            />

            <Textarea
                label="Description"
                name="description"
                placeholder="Enter subject description (optional)"
                value={values.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                error={errors.description}
                rows={4}
                readOnly={isViewMode}
                helperText="Maximum 500 characters"
            />

            {!isViewMode && (
                <div className="flex gap-3 pt-4">
                    <Button type="submit" loading={loading} className="flex-1">
                        {loading
                            ? (mode === "edit" ? "Updating..." : "Creating...")
                            : (mode === "edit" ? "Update Subject" : "Create Subject")
                        }
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                </div>
            )}

            {isViewMode && (
                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Close
                    </Button>
                </div>
            )}
        </form>
    );
}

// ── Main Subject Page ────────────────────────────────────────────────────────
export default function SubjectPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const { data: subjectsData, isLoading, error, refetch } = getSubjectsQuery();
    const { mutate: addSubject, isPending: isAdding } = addSubjectMutation();
    const { mutate: updateSubject, isPending: isUpdating } = updateSubjectMutation();
    const { mutate: deleteSubject, isPending: isDeleting } = deleteSubjectMutation();

    const subjects = subjectsData?.results ?? subjectsData?.data?.subjects ?? [];
    const total = subjects.length;

    const [panel, setPanel] = useState({ open: false, mode: null, subject: null });

    const openAdd = () => setPanel({ open: true, mode: PANEL_MODE.ADD, subject: null });
    const openEdit = (subject) => setPanel({ open: true, mode: PANEL_MODE.EDIT, subject });
    const openView = (subject) => setPanel({ open: true, mode: PANEL_MODE.VIEW, subject });
    const closePanel = () => setPanel({ open: false, mode: null, subject: null });

    const handleAddSubject = (data, reset) => {
        addSubject(data, {
            onSuccess: () => {
                reset();
                closePanel();
                refetch();
            },
            onError: (err) => {
                const errorMessage = err?.response?.data?.message || err?.message || "Failed to add subject";
                showError(errorMessage);
            },
        });
    };

    const handleUpdateSubject = (data, reset) => {
        updateSubject({ id: data._id, ...data }, {
            onSuccess: () => {
                reset();
                closePanel();
                refetch();
            },
            onError: (err) => {
                const errorMessage = err?.response?.data?.message || err?.message || "Failed to update subject";
                showError(errorMessage);
            },
        });
    };

    const handleDeleteSubject = (subject) => {
        if (window.confirm(`Delete subject "${subject.name}"? This action cannot be undone.`)) {
            deleteSubject(subject._id, {
                onSuccess: () => {
                    refetch();
                },
                onError: (err) => {
                    const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete subject";
                    showError(errorMessage);
                },
            });
        }
    };

    // Filter subjects based on search
    const filteredSubjects = search
        ? subjects.filter(subject =>
            subject.name?.toLowerCase().includes(search.toLowerCase()) ||
            subject.description?.toLowerCase().includes(search.toLowerCase())
        )
        : subjects;

    const paginatedSubjects = filteredSubjects.slice((page - 1) * limit, page * limit);
    const totalFiltered = filteredSubjects.length;

    const COLUMNS = [
        {
            key: "index",
            label: "Sr. No",
            sortable: false,
            width: "80px",
            render: (_, __, idx) => (page - 1) * limit + idx + 1,
        },
        {
            key: "name",
            label: "Subject Name",
            sortable: true,
            render: (val) => (
                <span className="inline-flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-medium text-text-primary">{val}</span>
                </span>
            ),
        },
        {
            key: "description",
            label: "Description",
            sortable: false,
            render: (val) => (
                <span className="text-text-secondary text-sm">
                    {val || "—"}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Created At",
            sortable: true,
            width: "160px",
            render: (val) => val ? new Date(val).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }) : "—",
        },
    ];

    const IconPlus = () => (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
        </svg>
    );

    function ActionCell({ row }) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => openView(row)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                    title="View Subject"
                >
                    <svg className="w-4 h-4 text-text-secondary hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
                <button
                    onClick={() => openEdit(row)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                    title="Edit Subject"
                >
                    <Edit className="w-4 h-4 text-primary" />
                </button>
                <button
                    onClick={() => handleDeleteSubject(row)}
                    disabled={isDeleting}
                    className="p-1.5 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50"
                    title="Delete Subject"
                >
                    <Trash2 className="w-4 h-4 text-error" />
                </button>
            </div>
        );
    }

    const panelMeta = {
        [PANEL_MODE.ADD]: { title: "Add Subject", subtitle: "Create a new subject for the curriculum" },
        [PANEL_MODE.EDIT]: { title: "Edit Subject", subtitle: `Updating: ${panel.subject?.name ?? ""}` },
        [PANEL_MODE.VIEW]: { title: "Subject Details", subtitle: `Viewing: ${panel.subject?.name ?? ""}` },
    };

    const meta = panel.mode ? panelMeta[panel.mode] : {};

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface-page flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <p className="text-text-secondary">Loading subjects...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-surface-page flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-error/5 border border-error/20 rounded-xl p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-error/10 mb-4">
                        <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-text-heading mb-2">Failed to Load Subjects</h3>
                    <p className="text-text-secondary text-sm mb-4">
                        {error?.response?.data?.message || error?.message || "Unable to fetch subjects. Please try again."}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-page md:px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-heading">Subjects</h1>
                        <p className="text-sm text-text-secondary mt-0.5">
                            Manage all academic subjects offered in the curriculum
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold bg-button-primary text-button-primary-text hover:bg-button-primary-hover transition-all duration-150 shadow-sm hover:shadow active:scale-[0.97] whitespace-nowrap"
                    >
                        <IconPlus />
                        Add Subject
                    </button>
                </div>



                {/* Subjects Table */}
            <div className="w-[91vw] md:w-auto">
                    <DataTable
                    actionCell={(row) => <ActionCell row={row} />}
                    title="All Subjects"
                    columns={COLUMNS}
                    data={paginatedSubjects}
                    loading={isLoading}
                    rowKey="_id"
                    emptyMessage="No subjects found. Click 'Add Subject' to create one."
                    searchPlaceholder="Search by subject name or description..."
                    defaultPageSize={limit}
                    pageSizeOptions={[10, 20, 50]}
                    addLabel="Add Subject"
                    serverMode={false}
                    page={page}
                    total={totalFiltered}
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    onPageChange={setPage}
                    onPageSizeChange={(val) => { setLimit(val); setPage(1); }}
                    actions={<></>}
                />
            </div>
            </div>

            {/* Slide Panel for Add/Edit/View */}
            <SlidePanel
                open={panel.open}
                onClose={closePanel}
                title={meta.title}
                subtitle={meta.subtitle}
            >
                <SubjectForm
                    defaultValues={panel.subject}
                    onSubmit={panel.mode === "add" ? handleAddSubject : handleUpdateSubject}
                    loading={isAdding || isUpdating}
                    mode={panel.mode}
                    onClose={closePanel}
                />
            </SlidePanel>
        </div>
    );
}