import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  Eye,
  Filter,
  Loader2,
} from "lucide-react";
import StaffDrawer from "./components/StaffDrawer";
import StaffDetail from "./components/StaffDetails";
import {
  deleteStaffMutation,
  getStaffList,
  useRolesList,
} from "../../../hooks/useQueryMutations";
export default function AdminStaff() {
  const [currentView, setCurrentView] = useState("list");
  const [viewingStaffId, setViewingStaffId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data: staffRes, isLoading: isLoadingStaff } = getStaffList({
    page,
    searchTerm,
    statusFilter,
  });
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const { data: rolesRes } = useRolesList();
  const roles = rolesRes?.results || [];

  const staffList = staffRes?.data || [];
  const pagination = staffRes?.pagination || { totalPages: 1, page: 1 };

  const openDrawer = (mode, id = null) => {
    setDrawerMode(mode);
    setSelectedStaffId(id);
    setIsDrawerOpen(true);
  };

  const handleViewDetail = (id) => {
    setViewingStaffId(id);
    setCurrentView("detail");
  };

  const deleteMutation = deleteStaffMutation();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-surface-page">
      {currentView === "detail" ? (
        <StaffDetail
          staffId={viewingStaffId}
          onBack={() => setCurrentView("list")}
        />
      ) : (
        <div className="animate-fadeUp">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-['Montserrat'] font-bold text-text-heading">
                Staff Administration
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Manage school personnel, roles, and status.
              </p>
            </div>
            <button
              onClick={() => openDrawer("add")}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm shadow-primary/30"
            >
              <Plus size={18} /> Add Staff
            </button>
          </div>

          {/* Filter & Search */}
          <div className="bg-surface-card border border-border rounded-t-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by Name, Emp ID, or Designation..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-page border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-text-primary placeholder:text-text-secondary dark:placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-surface-page border border-border rounded-xl px-3 py-2.5">
                <Filter size={16} className="text-text-secondary" />
                <select
                  className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-surface-card border border-border border-t-0 rounded-b-xl overflow-x-auto relative min-h-[300px]">
            {isLoadingStaff && (
              <div className="absolute inset-0 bg-surface-card/60 backdrop-blur-sm z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-page/50">
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                    Employee
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                    Designation & Role
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                    Contact
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                    Status
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isLoadingStaff && staffList.length > 0
                  ? staffList.map((staff) => (
                      <tr
                        key={staff._id}
                        className="hover:bg-surface-page/80 transition-colors group"
                      >
                        <td className="py-4 px-6 border-b border-border group-last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
                              {staff.user_id.name.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold text-text-primary text-[14px]">
                                {staff.user_id.name}
                              </div>
                              <div className="text-[12px] text-text-secondary mt-0.5 font-medium">
                                {staff.employee_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-border group-last:border-0">
                          <div className="text-[13px] text-text-primary font-medium">
                            {staff.designation}
                          </div>
                          <div className="text-[12px] text-text-secondary mt-0.5 flex items-center gap-1.5">
                            <Briefcase size={12} /> {staff.roleId.name} •{" "}
                            {staff.department}
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-border group-last:border-0">
                          <div className="text-[12px] text-text-primary flex items-center gap-2 mb-1.5">
                            <Mail size={13} className="text-text-secondary" />{" "}
                            {staff.user_id.email}
                          </div>
                          <div className="text-[12px] text-text-primary flex items-center gap-2">
                            <Phone size={13} className="text-text-secondary" />{" "}
                            {staff.user_id.phone}
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-border group-last:border-0">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold capitalize border ${staff.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${staff.status === "active" ? "bg-success" : "bg-error"}`}
                            ></span>
                            {staff.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 border-b border-border group-last:border-0 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleViewDetail(staff._id)}
                              className="p-2 text-text-secondary hover:text-info hover:bg-info/10 rounded-lg transition-colors cursor-pointer"
                              title="View Profile & Docs"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => openDrawer("edit", staff._id)}
                              className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(staff._id)}
                              className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : !isLoadingStaff && (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-12 text-center text-text-secondary text-sm"
                        >
                          No staff found.
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>

            {/* Pagination */}
            {!isLoadingStaff && staffList.length > 0 && (
              <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-secondary bg-surface-page/30">
                <div>
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 bg-surface-card border border-border rounded-md hover:text-text-primary transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= pagination.totalPages}
                    className="px-3 py-1.5 bg-surface-card border border-border rounded-md hover:text-text-primary transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD/EDIT DRAWER */}
      <StaffDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        staffId={selectedStaffId}
        onClose={() => setIsDrawerOpen(false)}
        roles={roles}
      />
    </div>
  );
}
