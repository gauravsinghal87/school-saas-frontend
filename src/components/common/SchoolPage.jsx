import React, { useState } from "react";
import { showSuccess, showError } from "../../utils/toast";
import { useSchoolList } from "../../hooks/useQueryMutations";
import DataTable from "./ReusableTable";

const STATUS_MAP = {
    true: { label: "Active", bg: "bg-[var(--color-success)]/10", text: "text-[var(--color-success)]" },
    false: { label: "Inactive", bg: "bg-[var(--color-error)]/10", text: "text-[var(--color-error)]" },
};

const StatusBadge = ({ value }) => {
    const cfg = STATUS_MAP[String(value)] ?? STATUS_MAP.false;
    return (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
        </span>
    );
};

const COLUMNS = [
    { key: "name", label: "School Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: false, width: "140px" },
    { key: "address", label: "Address", sortable: false },
    {
        key: "isActive", label: "Status", sortable: true, width: "100px",
        render: (val) => <StatusBadge value={val} />,
    },
    {
        key: "createdAt", label: "Registered On", sortable: true, width: "140px",
        render: (val) => val
            ? new Date(val).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : "—",
    },
];

export default function SchoolsPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const { data: apiResponse, isLoading, refetch } = useSchoolList({ page, limit, search });

    const schools = apiResponse?.data?.schools ?? [];
    const total = apiResponse?.data?.pagination?.total ?? 0;

    const handleAdd = () => {
        showSuccess("Open Add School form");
    };

    const handleEdit = (row) => {
        showSuccess(`Edit: ${row.name}`);
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

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">Schools</h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
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
                    onAdd={handleAdd}
                    addLabel="Add School"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    serverMode
                    page={page}
                    total={total}
                    onSearch={(val) => {
                        setSearch(val);
                        setPage(1);
                    }}
                    onPageChange={setPage}
                    onPageSizeChange={(val) => {
                        setLimit(val);
                        setPage(1);
                    }}
                />

            </div>
        </div>
    );
}