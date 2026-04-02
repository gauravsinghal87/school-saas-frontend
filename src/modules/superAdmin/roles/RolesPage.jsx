import React, { useState } from "react";
import { showSuccess, showError } from "../../../utils/toast";
import DataTable from "../../../components/common/ReusableTable";
import SlidePanel from "../../../components/common/SlidePanel";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import {
    createRoleMutation,
    getRolesQuery,
    updateRoleMutation,
    deleteRoleMutation
} from "../../../hooks/useQueryMutations";

const PANEL_MODE = { ADD: "add", EDIT: "edit", VIEW: "view" };

function validateRoleForm(values) {
    const errors = {};
    if (!values.name?.trim()) {
        errors.name = "Role name is required";
    } else if (values.name.trim().length < 2) {
        errors.name = "Min 2 characters";
    } else if (!/^[A-Z][A-Z_]*$/.test(values.name.trim())) {
        errors.name = "Use uppercase letters and underscores only (e.g., TEACHER, SUPER_ADMIN)";
    }
    return errors;
}

// ── Role Form Component ──────────────────────────────────────────────────────
function RoleForm({ defaultValues, onSubmit, loading, mode, onClose }) {
    const [values, setValues] = useState({
        name: defaultValues?.name ?? "",
        _id: defaultValues?._id ?? null,
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (value) => {
        const upperValue = value.toUpperCase();
        setValues((prev) => ({ ...prev, name: upperValue }));
        if (touched.name) {
            const msg = validateRoleForm({ name: upperValue }).name;
            setErrors((prev) => ({ ...prev, name: msg }));
        }
    };

    const handleBlur = () => {
        setTouched((prev) => ({ ...prev, name: true }));
        const msg = validateRoleForm(values).name;
        setErrors((prev) => ({ ...prev, name: msg }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateRoleForm(values);
        setTouched({ name: true });
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const reset = () => {
            setValues({ name: "", _id: null });
            setErrors({});
            setTouched({});
        };

        onSubmit(values, reset);
    };

    return (
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
            <Input
                label="Role Name"
                name="name"
                placeholder="e.g., TEACHER, STUDENT, ADMIN, SUPER_ADMIN"
                required
                value={values.name}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                error={errors.name}
                helperText="Use uppercase letters and underscores only"
                autoFocus
                readOnly={mode === PANEL_MODE.VIEW}
            />

            <div className="flex gap-3 pt-4">
                <Button type="submit" loading={loading} className="flex-1">
                    {loading ? "Saving..." : mode === "edit" ? "Update Role" : "Create Role"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                </Button>
            </div>
        </form>
    );
}

// ── Main Roles Component ─────────────────────────────────────────────────────
export default function RolesPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const { data: rolesData, isLoading, refetch } = getRolesQuery();
    const { mutate: createRole, isPending: isCreating } = createRoleMutation();
    const { mutate: updateRole, isPending: isUpdating } = updateRoleMutation();
    const { mutate: deleteRole, isPending: isDeleting } = deleteRoleMutation();

    const roles = rolesData?.results ?? [];
    const total = roles.length;

    const [panel, setPanel] = useState({ open: false, mode: null, role: null });

    const openAdd = () => setPanel({ open: true, mode: PANEL_MODE.ADD, role: null });
    const openView = (role) => setPanel({ open: true, mode: PANEL_MODE.VIEW, role });
    const openEdit = (role) => setPanel({ open: true, mode: PANEL_MODE.EDIT, role });
    const closePanel = () => setPanel({ open: false, mode: null, role: null });

    const handleCreateRole = (data, reset) => {
        createRole(data, {
            onSuccess: () => {
                reset();
                closePanel();
                refetch();
                showSuccess("Role created successfully 🎉");
            },
            onError: (err) => {
                showError(err?.response?.data?.message || err?.message || "Failed to create role");
            },
        });
    };

    const handleUpdateRole = (data, reset) => {
        const { name } = data;
        // console.log("Updating role with data:", name);
        updateRole(data, {
            onSuccess: () => {
                reset();
                closePanel();
                refetch();
                showSuccess("Role updated successfully 🎉");
            },
            onError: (err) => {
                showError(err?.response?.data?.message || err?.message || "Failed to update role");
            },
        });
    };

    const handleDeleteRole = (role) => {
        if (window.confirm(`Delete role "${role.name}"? This cannot be undone.`)) {
            deleteRole(role._id, {
                onSuccess: () => {
                    refetch();
                    showSuccess(`Role "${role.name}" deleted successfully 🎉`);
                },
                onError: (err) => {
                    showError(err?.response?.data?.message || err?.message || "Failed to delete role");
                },
            });
        }
    };

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
            label: "Role Name",
            sortable: true,
            render: (val) => (
                <span className="inline-flex px-3 py-1 rounded-lg text-sm font-semibold bg-primary/10 text-primary">
                    {val}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Created At",
            sortable: true,
            width: "180px",
            render: (val) => val ? new Date(val).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }) : "—",
        },
        {
            key: "updatedAt",
            label: "Last Updated",
            sortable: true,
            width: "180px",
            render: (val) => val ? new Date(val).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
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
                    title="View Role"
                >
                    <Eye className="w-4 h-4 text-primary" />
                </button>
                <button
                    onClick={() => openEdit(row)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                    title="Edit Role"
                >
                    <Edit className="w-4 h-4 text-primary" />
                </button>
                <button
                    onClick={() => handleDeleteRole(row)}
                    disabled={isDeleting}
                    className="p-1.5 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50"
                    title="Delete Role"
                >
                    <Trash2 className="w-4 h-4 text-error" />
                </button>
            </div>
        );
    }

    const panelMeta = {
        [PANEL_MODE.VIEW]: { title: "VIEW Role", subtitle: "View new user role to the system" },
        [PANEL_MODE.ADD]: { title: "Create Role", subtitle: "Add a new user role to the system" },
        [PANEL_MODE.EDIT]: { title: "Edit Role", subtitle: `Updating: ${panel.role?.name ?? ""}` },
    };

    const meta = panel.mode ? panelMeta[panel.mode] : {};

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-heading">User Roles</h1>
                        <p className="text-sm text-text-secondary mt-0.5">
                            Create and manage roles for school users across the platform.
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold bg-button-primary text-button-primary-text hover:bg-button-primary-hover transition-all duration-150 shadow-sm hover:shadow active:scale-[0.97] whitespace-nowrap"
                    >
                        <IconPlus />
                        Create Role
                    </button>
                </div>

                {/* Roles Table */}
                <DataTable
                    title="All Roles"
                    actionCell={(row) => <ActionCell row={row} />}
                    columns={COLUMNS}
                    data={roles}
                    loading={isLoading}
                    rowKey="_id"
                    emptyMessage="No roles created yet. Click 'Create Role' to add one."
                    searchPlaceholder="Search by role name..."
                    defaultPageSize={limit}
                    pageSizeOptions={[10, 20, 50]}
                    addLabel="Create Role"
                    serverMode
                    page={page}
                    total={total}
                    onSearch={(val) => { setSearch(val); setPage(1); }}
                    onPageChange={setPage}
                    onPageSizeChange={(val) => { setLimit(val); setPage(1); }}
                    actions={<></>}
                />
            </div>

            {/* Slide Panel for Add/Edit */}
            <SlidePanel
                open={panel.open}
                onClose={closePanel}
                title={meta.title}
                subtitle={meta.subtitle}
            >
                <RoleForm
                    defaultValues={panel.role}
                    onSubmit={panel.mode === "add" ? handleCreateRole : handleUpdateRole}
                    loading={isCreating || isUpdating}
                    mode={panel.mode}
                    onClose={closePanel}
                />
            </SlidePanel>
        </div>
    );
}