import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { showSuccess, showError } from "../../utils/toast";
import { useSchoolList } from "../../hooks/useQueryMutations";
import DataTable from "./ReusableTable";
import SlidePanel from "../../components/common/SlidePanel";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import AppPhoneInput from "../../components/common/PhoneInput";
import Button from "../../components/common/Button";


const PHONE_REGEX = /^[6-9]\d{9}$/;

const PANEL_MODE = { ADD: "add", EDIT: "edit", STATUS: "status" };

const STATUS_MAP = {
    true: { label: "Active", bg: "bg-success/10", text: "text-success" },
    false: { label: "Inactive", bg: "bg-error/10", text: "text-error" },
};

const COLUMNS = [
    { key: "name", label: "School Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: false, width: "140px" },
    { key: "address", label: "Address", sortable: false },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: false, width: "140px" },
    { key: "address", label: "Address", sortable: false },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: false, width: "140px" },
    { key: "address", label: "Address", sortable: false },
    {
        key: "isActive", label: "Status", sortable: true, width: "110px",
        render: (val) => {
            const cfg = STATUS_MAP[String(val)] ?? STATUS_MAP.false;
            return (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                </span>
            );
        },
    },
    {
        key: "createdAt", label: "Registered On", sortable: true, width: "140px",
        render: (val) => val
            ? new Date(val).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : "—",
    },
];

const fieldRules = {
    name: { required: "School name is required", minLength: { value: 3, message: "Min 3 characters" } },
    email: { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" } },
    phone: { required: "Phone is required", pattern: { value: PHONE_REGEX, message: "Enter a valid 10-digit number" } },
    address: { required: "Address is required", minLength: { value: 10, message: "Enter a complete address" } },
};


function SchoolForm({ defaultValues, onSubmit, loading }) {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        mode: "onTouched",
        defaultValues: defaultValues ?? {},
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Input
                label="School Name"
                name="name"
                placeholder="e.g. Mother World School"
                required
                error={errors.name?.message}
                {...register("name", fieldRules.name)}
            />
            <Input
                label="School Email"
                name="email"
                type="email"
                placeholder="school@example.com"
                required
                error={errors.email?.message}
                {...register("email", fieldRules.email)}
            />
            <Controller
                name="phone"
                control={control}
                rules={fieldRules.phone}
                render={({ field }) => (
                    <AppPhoneInput
                        label="School Phone"
                        name="phone"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        required
                        error={errors.phone?.message}
                    />
                )}
            />
            <Textarea
                label="School Address"
                name="address"
                placeholder="Full address with city, state and PIN…"
                required
                error={errors.address?.message}
                {...register("address", fieldRules.address)}
            />

            <div className="flex gap-3 pt-2">
                <Button type="submit" loading={loading} className="flex-1">
                    {loading ? "Saving…" : defaultValues ? "Update School" : "Register School"}
                </Button>
            </div>
        </form>
    );
}



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


export default function SchoolsPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const { data: apiResponse, isLoading, refetch } = useSchoolList({ page, limit, search });

    const schools = apiResponse?.data?.schools ?? [];
    const total = apiResponse?.data?.pagination?.total ?? 0;

    const [panel, setPanel] = useState({ open: false, mode: null, row: null });
    const [submitting, setSubmitting] = useState(false);

    const openAdd = () => setPanel({ open: true, mode: PANEL_MODE.ADD, row: null });
    const openEdit = (row) => setPanel({ open: true, mode: PANEL_MODE.EDIT, row });
    const openStatus = (row) => setPanel({ open: true, mode: PANEL_MODE.STATUS, row });
    const closePanel = () => setPanel({ open: false, mode: null, row: null });

    const handleAddSubmit = async (data) => {
        setSubmitting(true);
        try {
            // await api.post("/schools", data);
            showSuccess("School registered successfully!");
            closePanel();
            refetch();
        } catch (err) {
            showError(err?.message || "Failed to register school.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditSubmit = async (data) => {
        setSubmitting(true);
        try {
            // await api.put(`/schools/${panel.row._id}`, data);
            showSuccess("School updated successfully!");
            closePanel();
            refetch();
        } catch (err) {
            showError(err?.message || "Failed to update school.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusToggle = async () => {
        setSubmitting(true);
        try {
            // await api.patch(`/schools/${panel.row._id}/status`, { isActive: !panel.row.isActive });
            showSuccess(`School ${panel.row.isActive ? "deactivated" : "activated"} successfully!`);
            closePanel();
            refetch();
        } catch (err) {
            showError(err?.message || "Failed to update status.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (row) => {
        if (!window.confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
        try {
            // await api.delete(`/schools/${row._id}`);
            showSuccess(`"${row.name}" deleted.`);
            refetch();
        } catch (err) {
            showError(err?.message || "Delete failed.");
        }
    };

    const panelMeta = {
        [PANEL_MODE.ADD]: { title: "Register School", subtitle: "Add a new institution to EduCore" },
        [PANEL_MODE.EDIT]: { title: "Edit School", subtitle: `Updating: ${panel.row?.name ?? ""}` },
        [PANEL_MODE.STATUS]: { title: "Update Status", subtitle: "Toggle school active / inactive" },
    };

    const meta = panel.mode ? panelMeta[panel.mode] : {};

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-text-heading">Schools</h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Manage all registered schools on EduCore.
                    </p>
                </div>

                <DataTable
                    title="All Schools"
                    columns={COLUMNS}
                    data={schools}
                    loading={isLoading}
                    rowKey="_id"
                    emptyMessage="No schools registered yet"
                    searchPlaceholder="Search by name, email, phone…"
                    defaultPageSize={limit}
                    pageSizeOptions={[10, 20, 50]}
                    onAdd={openAdd}
                    addLabel="Add School"
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    serverMode
                    page={page}
                    total={total}
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    onPageChange={setPage}
                    onPageSizeChange={(val) => { setLimit(val); setPage(1); }}
                    actions={
                        <button
                            onClick={() => panel.row ? openStatus(panel.row) : null}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-medium border border-border text-text-secondary hover:text-text-primary hover:bg-surface-card transition-all duration-150"
                        >
                            Status
                        </button>
                    }
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
                    <SchoolForm onSubmit={handleAddSubmit} loading={submitting} />
                )}
                {panel.mode === PANEL_MODE.EDIT && (
                    <SchoolForm defaultValues={panel.row} onSubmit={handleEditSubmit} loading={submitting} />
                )}
                {panel.mode === PANEL_MODE.STATUS && (
                    <StatusPanel row={panel.row} onConfirm={handleStatusToggle} loading={submitting} />
                )}
            </SlidePanel>
        </div>
    );
}