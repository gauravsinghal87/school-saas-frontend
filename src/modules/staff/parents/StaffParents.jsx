import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Link as LinkIcon } from "lucide-react";
import { hasPermission } from "../../../utils/permissions";

const dummyStaffUser = {
  role: "STAFF",
  permissions: [
    "VIEW_PARENTS",
    "ADD_PARENTS",
    "EDIT_PARENTS",
    "ASSIGN_PARENTS",
  ],
};

const PARENTS = [
  {
    id: "PAR001",
    name: "Rakesh Sharma",
    phone: "+91 9876543210",
    email: "rakesh@email.com",
    linkedStudents: ["Aman Sharma (6A)"],
  },
  {
    id: "PAR002",
    name: "Suresh Gupta",
    phone: "+91 9876543211",
    email: "suresh@email.com",
    linkedStudents: ["Riya Gupta (6A)", "Rahul Gupta (4B)"],
  },
  {
    id: "PAR003",
    name: "Pooja Singh",
    phone: "+91 9876543212",
    email: "pooja@email.com",
    linkedStudents: [],
  }, // Unassigned
];

export default function StaffParents() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-surface-page animate-fadeUp">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-['Montserrat'] font-bold text-text-heading">
            Parent & Guardian Portal
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage parent accounts and link them to respective students.
          </p>
        </div>

        {hasPermission(dummyStaffUser, "ADD_PARENTS") && (
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer shadow-sm shadow-primary/30">
            <Plus size={18} />
            Add Parent
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
            placeholder="Search parents by name or phone..."
            className="w-full pl-10 pr-4 py-2 bg-surface-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="bg-surface-card border border-border border-t-0 rounded-b-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-page/50">
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                Guardian Details
              </th>
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                Contact Info
              </th>
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                Linked Students
              </th>
              <th className="py-3 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {PARENTS.map((parent) => (
              <tr
                key={parent.id}
                className="hover:bg-surface-page/80 transition-colors group"
              >
                <td className="py-4 px-6 border-b border-border group-last:border-0">
                  <div className="font-medium text-text-primary text-sm">
                    {parent.name}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {parent.id}
                  </div>
                </td>
                <td className="py-4 px-6 border-b border-border group-last:border-0">
                  <div className="text-sm text-text-primary">
                    {parent.phone}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {parent.email}
                  </div>
                </td>
                <td className="py-4 px-6 border-b border-border group-last:border-0">
                  {parent.linkedStudents.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {parent.linkedStudents.map((child) => (
                        <span
                          key={child}
                          className="text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-md"
                        >
                          {child}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[12px] text-warning bg-warning/10 px-2.5 py-1 rounded-md font-medium border border-warning/20">
                      Unassigned
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 border-b border-border group-last:border-0 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {hasPermission(dummyStaffUser, "ASSIGN_PARENTS") && (
                      <button
                        className="p-2 text-text-secondary hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors cursor-pointer"
                        title="Link to Student"
                      >
                        <LinkIcon size={16} />
                      </button>
                    )}
                    {hasPermission(dummyStaffUser, "EDIT_PARENTS") && (
                      <button
                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit Parent"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {hasPermission(dummyStaffUser, "DELETE_PARENTS") && (
                      <button
                        className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Parent"
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
