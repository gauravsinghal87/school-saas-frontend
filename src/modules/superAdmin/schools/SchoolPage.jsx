

import React, { useState } from "react";
import { showSuccess, showError } from "../../../utils/toast";
import DataTable from "../../../components/common/ReusableTable";
import SlidePanel from "../../../components/common/SlidePanel";
import Input from "../../../components/common/Input";
import Textarea from "../../../components/common/Textarea";
import AppPhoneInput from "../../../components/common/PhoneInput";
import { Eye } from "lucide-react";
import { createSchoolMutation, getAdminListQuery, updateSchoolStatusMutation, useSchoolList } from "../../../hooks/useQueryMutations";
import Button from "../../../components/common/Button";
import ToggleButton from "../../../components/common/ToggleButton";


const PHONE_REGEX = /^[6-9]\d{9}$/;
const PANEL_MODE = { ADD: "add", EDIT: "edit", STATUS: "status", VIEW: "view" };

const STATUS_MAP = {
    true: { label: "Active", bg: "bg-success/10", text: "text-success" },
    false: { label: "Inactive", bg: "bg-error/10", text: "text-error" },
};

// ── Validation rules (mirrors fieldRules from react-hook-form) ──────────────

function validateField(name, value) {
    switch (name) {
        case "name":
            if (!value?.trim()) return "School name is required";
            if (value.trim().length < 3) return "Min 3 characters";
            return "";
        case "email":
            if (!value?.trim()) return "Email is required";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
            return "";
        case "address":
            if (!value?.trim()) return "Address is required";
            if (value.trim().length < 10) return "Enter a complete address";
            return "";
        case "adminName":
            if (!value?.trim()) return "Admin name is required";
            if (value.trim().length < 3) return "Min 3 characters";
            return "";
        case "adminEmail":
            if (!value?.trim()) return "Admin email is required";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter valid email";
            return "";
        case "adminPhone":
            if (!value?.trim()) return "Admin phone is required";
            // pattern check intentionally loose (mirrors original commented-out PHONE_REGEX)
            return "";
        default:
            return "";
    }
}

function validateForm(values, mode) {
    const fields = ["name", "email", "address"];
    if (mode === "add") fields.push("adminName", "adminEmail", "adminPhone");

    const errors = {};
    fields.forEach((f) => {
        const msg = validateField(f, values[f]);
        if (msg) errors[f] = msg;
    });
    return errors;
}

// ── StatusPanel ──────────────────────────────────────────────────────────────

function StatusPanel({ row, onConfirm, loading }) {
    const isActive = row?.isActive;
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface-page p-5 space-y-3">
                <p className="text-sm font-semibold text-text-heading">{row?.name}</p>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    Current status:
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                        {isActive ? "Active" : "Inactive"}
                    </span>
                </div>
            </div>

            <p className="text-sm text-text-secondary">
                This will <strong>{isActive ? "deactivate" : "activate"}</strong> the school.
                {isActive ? " All associated logins will be suspended." : " The school will regain full access."}
            </p>

            <Button
                onClick={onConfirm}
                loading={loading}
                className={`w-full ${isActive ? "!bg-error hover:!bg-error/90" : "!bg-success hover:!bg-success/90"}`}
            >
                {loading ? "Updating…" : isActive ? "Deactivate School" : "Activate School"}
            </Button>
        </div>
    );
}


function SchoolForm({ defaultValues, onSubmit, loading, mode }) {
    console.log("Default values in form >>", defaultValues) // DEBUG


    const [values, setValues] = useState({
        name: defaultValues?.name ?? "",
        email: defaultValues?.email ?? "",
        phone: defaultValues?.phone ? String(defaultValues.phone) : "",
        address: defaultValues?.address ?? "",
        adminName: defaultValues?.admin?.name ?? "",
        adminEmail: defaultValues?.admin?.email ?? "",
        adminPhone: defaultValues?.admin?.phone
            ? String(defaultValues.admin.phone)
            : "",
        status: defaultValues?.isActive ?? true,
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    console.log("Form values >>", defaultValues) // DEBUG

    const handleChange = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        // validate on change only if field was already touched
        if (touched[name]) {
            setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (name) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, values[name]) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm(values, mode);
        // Mark all relevant fields as touched
        const touchAll = {};
        Object.keys(newErrors).forEach((k) => (touchAll[k] = true));
        setTouched((prev) => ({ ...prev, ...touchAll }));
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        // mirrors reset() from react-hook-form — passed as second arg to onSubmit
        const reset = () => {
            setValues({
                name: "", email: "", phone: "", address: "",
                adminName: "", adminEmail: "", adminPhone: "", status: true,
            });
            setErrors({});
            setTouched({});
        };

        onSubmit(values, reset);
    };

    return (
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
            <Input
                label="School Name"
                name="name"
                placeholder="e.g. Mother World School"
                required
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                error={errors.name}
                readOnly={mode === "view"}
            />
            <Input
                label="School Email"
                name="email"
                type="email"
                placeholder="school@example.com"
                required
                value={values.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                error={errors.email}
                readOnly={mode === "view"}
            />
            <AppPhoneInput
                label="School Phone"
                name="phone"
                value={values.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                required
                error={errors.phone}
                {...(mode === "view" && { disabled: true })}
            />
            <Textarea
                label="School Address"
                name="address"
                placeholder="Full address with city, state and PIN…"
                required
                value={values.address}
                onChange={(e) => handleChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                error={errors.address}
                readOnly={mode === "view"}
            />

            {/* ── View mode: status block ── */}
            {mode === "view" && (
                <div className="rounded-2xl border border-border bg-surface-page p-5 space-y-4">
                    <p className="text-sm font-semibold text-text-heading">School Status</p>

                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        Current status:
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${values.status ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                            {values.status ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <p className="text-xs text-text-secondary">Change status</p>
                        <button
                            type="button"
                            disabled={mode === "view"}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${values.status ? "bg-success shadow-md shadow-success/30" : "bg-border"}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-all duration-300 ${values.status ? "translate-x-6" : "translate-x-0"}`} />
                        </button>
                    </div>



                    <p className="text-sm text-text-secondary">
                        This will <strong>{values.status ? "deactivate" : "activate"}</strong> the school.
                        {values.status ? " All associated logins will be suspended." : " The school will regain full access."}
                    </p>
                </div>
            )}

            {mode === "view" && (
                <div className="space-y-5 border-t border-border pt-4">
                    <p className="text-sm font-semibold text-text-heading">Admin Details</p>

                    <Input
                        label="Admin Full Name"
                        name="adminName"
                        placeholder="e.g. Dilip Kumar"
                        required
                        value={values.adminName}
                        onChange={(e) => handleChange("adminName", e.target.value)}
                        onBlur={() => handleBlur("adminName")}
                        error={errors.adminName}
                    />
                    <Input
                        label="Admin Email"
                        name="adminEmail"
                        type="email"
                        placeholder="admin@example.com"
                        required
                        value={values.adminEmail}
                        onChange={(e) => handleChange("adminEmail", e.target.value)}
                        onBlur={() => handleBlur("adminEmail")}
                        error={errors.adminEmail}
                    />
                    <AppPhoneInput
                        label="Admin Phone"
                        name="adminPhone"
                        value={values.adminPhone}
                        onChange={(e) => handleChange("adminPhone", e.target.value)}
                        onBlur={() => handleBlur("adminPhone")}
                        required
                        error={errors.adminPhone}
                    />
                </div>
            )}
            {/* ── Add mode: admin details ── */}
            {mode === "add" && (
                <div className="space-y-5 border-t border-border pt-4">
                    <p className="text-sm font-semibold text-text-heading">Admin Details</p>

                    <Input
                        label="Admin Full Name"
                        name="adminName"
                        placeholder="e.g. Dilip Kumar"
                        required
                        value={values.adminName}
                        onChange={(e) => handleChange("adminName", e.target.value)}
                        onBlur={() => handleBlur("adminName")}
                        error={errors.adminName}
                    />
                    <Input
                        label="Admin Email"
                        name="adminEmail"
                        type="email"
                        placeholder="admin@example.com"
                        required
                        value={values.adminEmail}
                        onChange={(e) => handleChange("adminEmail", e.target.value)}
                        onBlur={() => handleBlur("adminEmail")}
                        error={errors.adminEmail}
                    />
                    <AppPhoneInput
                        label="Admin Phone"
                        name="adminPhone"
                        value={values.adminPhone}
                        onChange={(e) => handleChange("adminPhone", e.target.value)}
                        onBlur={() => handleBlur("adminPhone")}
                        required
                        error={errors.adminPhone}
                    />
                </div>
            )}

            {/* ── Submit ── */}
            {mode === "add" && (
                <div className="flex gap-3 pt-2">
                    <Button type="submit" loading={loading} className="flex-1">
                        {loading ? "Saving…" : defaultValues ? "Update School" : "Register School"}
                    </Button>
                </div>
            )}
        </form>
    );
}


export default function SchoolsPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const { data: apiResponse, isLoading, refetch } = useSchoolList({ page, limit, search });
    const { data: apiResponseAdmin, isPending: loddddd, refetch: ee } = getAdminListQuery({ page, limit, search });

    const { mutate: updateStatus, isPending, variables } = updateSchoolStatusMutation();
    const { mutate: createSchool, isPending: isCreating } = createSchoolMutation();

    const schools = apiResponse?.data?.schools ?? [];
    const total = apiResponse?.data?.pagination?.total ?? 0;

    const [panel, setPanel] = useState({ open: false, mode: null, row: null });
    const [submitting, setSubmitting] = useState(false);

    const openAdd = () => setPanel({ open: true, mode: PANEL_MODE.ADD, row: null });
    const openEdit = (row) => setPanel({ open: true, mode: PANEL_MODE.EDIT, row });
    const openView = (row) => setPanel({ open: true, mode: PANEL_MODE.VIEW, row });
    const openStatus = (row) => setPanel({ open: true, mode: PANEL_MODE.STATUS, row });
    const closePanel = () => setPanel({ open: false, mode: null, row: null });

    const handleAddSubmit = (data, reset) => {
        setSubmitting(isCreating);
        createSchool(data, {
            onSuccess: () => {
                reset();
                closePanel();
                setSubmitting(false);
            },
            onError: (err) => {
                showError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to register school"
                );
            },
        });
    };

    const handleEditSubmit = async (data) => {
        setSubmitting(true);
        try {
            closePanel();
            refetch();
        } catch (err) {
            showError(err?.message || "Failed to update school.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusToggle = (row) => {
        const newStatus = !row.isActive;
        updateStatus({
            id: row._id,
            isActive: newStatus,
        });
    };

    const handleDelete = async (row) => {
        if (!window.confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
        try {
            showSuccess(`"${row.name}" deleted.`);
            refetch();
        } catch (err) {
            showError(err?.message || "Delete failed.");
        }
    };

    const COLUMNS = [
        {
            key: "index",
            label: "Sr. No",
            sortable: false,
            width: "70px",
            render: (_, row, idx) => (page - 1) * limit + idx + 1,
        },
        { key: "name", label: "School Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "phone", label: "Phone", sortable: false, width: "140px" },
        { key: "address", label: "Address", sortable: false },

        {
            key: "isActive",
            label: "Status",
            sortable: true,
            width: "140px",
            render: (val, row) => (
                <ToggleButton onToggle={() => handleStatusToggle(row)} isActive={val} disabled={isPending && variables?.id === row._id} />
            ),
        },
        {
            key: "createdAt",
            label: "Registered On",
            sortable: true,
            width: "140px",
            render: (val) => val
                ? new Date(val).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                : "—",
        },
    ];

    const IconPlus = () => (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
        </svg>
    );

    const panelMeta = {
        [PANEL_MODE.ADD]: { title: "Register School", subtitle: "Add a new institution to EduCore" },
        [PANEL_MODE.VIEW]: { title: "View School", subtitle: "View school details" },
        [PANEL_MODE.EDIT]: { title: "Edit School", subtitle: `Updating: ${panel.row?.name ?? ""}` },
        [PANEL_MODE.STATUS]: { title: "Update Status", subtitle: "Toggle school active / inactive" },
    };

    const meta = panel.mode ? panelMeta[panel.mode] : {};

    function ActionCell({ row, onEdit }) {
        return (
            <div className="flex items-center gap-1">
                {onEdit && (
                    <button
                        onClick={() => onEdit(row)}
                        title="Edit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-heading">Schools</h1>
                        <p className="text-sm text-text-secondary mt-0.5">
                            Manage all registered schools on EduCore.
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold bg-button-primary text-button-primary-text hover:bg-button-primary-hover transition-all duration-150 shadow-sm hover:shadow active:scale-[0.97] whitespace-nowrap"
                    >
                        <IconPlus />
                        Add School
                    </button>
                </div>

                <DataTable
                    actionCell={(row) => (
                        <ActionCell row={row} onEdit={openView} />
                    )}
                    title="All Schools"
                    columns={COLUMNS}
                    data={schools}
                    loading={isLoading}
                    rowKey="_id"
                    emptyMessage="No schools registered yet"
                    searchPlaceholder="Search by name, email, phone…"
                    defaultPageSize={limit}
                    pageSizeOptions={[10, 20, 50]}
                    addLabel="Add School"
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    serverMode
                    page={page}
                    total={total}
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    onPageChange={setPage}
                    onPageSizeChange={(val) => { setLimit(val); setPage(1); }}
                    actions={<></>}
                />
            </div>

            {/* ── Slide Panel ── */}
            <SlidePanel
                open={panel.open}
                onClose={closePanel}
                title={meta.title}
                subtitle={meta.subtitle}
            >
                {panel.mode === PANEL_MODE.ADD && (
                    <SchoolForm onSubmit={handleAddSubmit} mode="add" loading={isCreating} />
                )}
                {panel.mode === PANEL_MODE.VIEW && (
                    <SchoolForm defaultValues={panel.row} onSubmit={openView} mode="view" loading={submitting} />
                )}
                {panel.mode === PANEL_MODE.STATUS && (
                    <StatusPanel row={panel.row} onConfirm={handleStatusToggle} loading={submitting} />
                )}
            </SlidePanel>
        </div>
    );
}


