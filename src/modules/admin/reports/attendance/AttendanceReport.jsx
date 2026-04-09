import { useState, useEffect } from "react";
import DataTable from "../../../../components/common/ReusableTable";
import Button from "../../../../components/common/Button";
import { getUsersListQuery } from "../../../../hooks/useQueryMutations";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AttendanceReport() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const navigate = useNavigate();

  const [search, setSearch] = useState(""); // ✅ single search
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, refetch } = getUsersListQuery({
    page,
    limit,
    search,
    role,
    status,
  });

  useEffect(() => {
    refetch();
  }, [page, search, role, status]);

  const users = data?.data?.users || [];
const total = data?.data?.pagination?.totalItems || 0;


  const COLUMNS = [
    {
      key: "name",
      label: "Name",
      render: (_, row) =>
        `${row.name || ""} `.trim(),
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "role",
      label: "Role",
      render: (val) => (
        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">
          {val}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${val === "active"
              ? "bg-success/10 text-success"
              : "bg-error/10 text-error"
            }`}
        >
          {val}
        </span>
      ),
    },
  ];
  const handleViewAttendance = (row) => {
        navigate(`/school-admin/reports/attendance/${row._id}`);
    };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-heading">
            Attendance
          </h1>
          <p className="text-sm text-text-secondary">
            Manage and track user attendance
          </p>
        </div>
      </div>

      {/* 🔥 FILTER BAR (Compact + Clean) */}
      <div className="bg-surface-card border border-border rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">

        {/* Role Filter */}
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-border rounded-lg bg-surface text-sm"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-border rounded-lg bg-surface text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={() => {
            setRole("");
            setStatus("");
            setSearch("");
            setPage(1);
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* 📊 TABLE */}
    <DataTable
  title="Users Attendance List"
  data={users}
  columns={COLUMNS}
  loading={isLoading}
  rowKey="_id"
  serverMode

  // ✅ CORRECT PAGINATION
  page={page}
  total={total}

  onPageChange={(newPage) => setPage(newPage)}

  actionCell={(row) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleViewAttendance(row)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition"
      >
        <Eye size={16} />
      </button>
    </div>
  )}

  onSearch={(val) => {
    setSearch(val);
    setPage(1);
  }}

  searchPlaceholder="Search by name or email..."
/>
    </div>
  );
}