import { useState } from "react";
import { Search, Plus, Edit2, Trash2, ShieldAlert } from "lucide-react";
import { hasPermission } from "../../../utils/permissions";

// DUMMY PERMISSIONS & DATA (Replace with actual user context & API data)
const dummyStaffUser = {
  role: "STAFF",
  permissions: ["VIEW_TEACHERS", "EDIT_TEACHERS"], // Notice DELETE is missing to demo UI hiding
};

const TEACHERS = [
  {
    id: "TCH001",
    name: "Anita Singh",
    dept: "Mathematics",
    phone: "+91 9876543210",
    status: "Active",
  },
  {
    id: "TCH002",
    name: "Rajeev Verma",
    dept: "Science",
    phone: "+91 9876543211",
    status: "Active",
  },
  {
    id: "TCH003",
    name: "Meera Iyer",
    dept: "English",
    phone: "+91 9876543212",
    status: "On Leave",
  },
];

export default function StaffTeachers() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-surface-page animate-fadeUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-['Montserrat'] font-bold text-text-heading">
            Teacher Directory
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage teaching staff records and assignments.
          </p>
        </div>

        {hasPermission(dummyStaffUser, "ADD_TEACHERS") && (
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
            <Plus size={18} />
            Add Teacher
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-card border border-border rounded-t-xl p-4 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            size={18}
          />
          <input
            type="text"
            placeholder="Search teachers by name or ID..."
            className="w-full pl-10 pr-4 py-2 bg-surface-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-card border border-border border-t-0 rounded-b-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-page/50">
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                Teacher Details
              </th>
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                Department
              </th>
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                Status
              </th>
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {TEACHERS.map((teacher) => (
              <tr
                key={teacher.id}
                className="hover:bg-surface-page/80 transition-colors group"
              >
                <td className="py-4 px-6 border-b border-border group-last:border-0">
                  <div className="font-medium text-text-primary text-sm">
                    {teacher.name}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {teacher.id} • {teacher.phone}
                  </div>
                </td>
                <td className="py-4 px-6 border-b border-border group-last:border-0 text-sm text-text-primary">
                  {teacher.dept}
                </td>
                <td className="py-4 px-6 border-b border-border group-last:border-0">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                      teacher.status === "Active"
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-warning/10 text-warning border border-warning/20"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-border group-last:border-0 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {hasPermission(dummyStaffUser, "EDIT_TEACHERS") && (
                      <button
                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {hasPermission(dummyStaffUser, "DELETE_TEACHERS") ? (
                      <button
                        className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button
                        className="p-2 text-border cursor-not-allowed"
                        title="No Permission to Delete"
                      >
                        <ShieldAlert size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
