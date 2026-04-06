import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { hasPermission } from "../../../utils/permissions";

const dummyStaffUser = {
  role: "STAFF",
  permissions: [
    "VIEW_STUDENTS",
    "ADD_STUDENTS",
    "EDIT_STUDENTS",
    "DELETE_STUDENTS",
  ],
};

const STUDENTS = [
  {
    id: "ADM001",
    name: "Aman Sharma",
    cls: "6A",
    parent: "Rakesh Sharma",
    status: "Enrolled",
  },
  {
    id: "ADM002",
    name: "Riya Gupta",
    cls: "6A",
    parent: "Suresh Gupta",
    status: "Enrolled",
  },
  {
    id: "ADM003",
    name: "Arjun Singh",
    cls: "7B",
    parent: "Anita Singh",
    status: "Suspended",
  },
];

export default function StaffStudents() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-surface-page animate-fadeUp">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-['Montserrat'] font-bold text-text-heading">
            Student Records
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage admissions, details, and student status.
          </p>
        </div>

        {hasPermission(dummyStaffUser, "ADD_STUDENTS") && (
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer shadow-sm shadow-primary/30">
            <Plus size={18} />
            New Admission
          </button>
        )}
      </div>

      <div className="bg-surface-card border border-border rounded-t-xl p-4 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            size={18}
          />
          <input
            type="text"
            placeholder="Search students by name, ID or class..."
            className="w-full pl-10 pr-4 py-2 bg-surface-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="bg-surface-card border border-border border-t-0 rounded-b-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-page/50">
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                Student
              </th>
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                Class
              </th>
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                Guardian
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
            {STUDENTS.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-surface-page/80 transition-colors group"
              >
                <td className="py-4 px-6 border-b border-border group-last:border-0">
                  <div className="font-medium text-text-primary text-sm">
                    {student.name}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {student.id}
                  </div>
                </td>
                <td className="py-4 px-6 border-b border-border group-last:border-0">
                  <span className="text-[12px] text-text-secondary bg-surface-page border border-border px-2.5 py-1 rounded-md">
                    {student.cls}
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-border group-last:border-0 text-sm text-text-primary">
                  {student.parent}
                </td>
                <td className="py-4 px-6 border-b border-border group-last:border-0">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                      student.status === "Enrolled"
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-error/10 text-error border border-error/20"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-border group-last:border-0 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {hasPermission(dummyStaffUser, "VIEW_STUDENTS") && (
                      <button
                        className="p-2 text-text-secondary hover:text-info hover:bg-info/10 rounded-lg transition-colors cursor-pointer"
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {hasPermission(dummyStaffUser, "EDIT_STUDENTS") && (
                      <button
                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {hasPermission(dummyStaffUser, "DELETE_STUDENTS") && (
                      <button
                        className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
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
