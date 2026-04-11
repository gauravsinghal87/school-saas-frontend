import { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Filter,
  Loader2,
  GraduationCap,
} from "lucide-react";
import api from "../../../api/apiConfig";

import StudentDetail from "./components/StudentDetail";
import StudentDrawer from "./components/StudentDrawer";
import {
  useClassesList,
  useRolesList,
  useSessionsList,
  useStudentsList,
} from "../../../hooks/useQueryMutations";

export default function AdminStudents() {
  const [currentView, setCurrentView] = useState("list");
  const [viewingStudentId, setViewingStudentId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("null");
  const [sectionFilter, setSectionFilter] = useState("null");
  const [sessionFilter, setSessionFilter] = useState("null");
  const [page, setPage] = useState(1);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const { data: rolesRes } = useRolesList();

  const { data: sessionsRes } = useSessionsList();
  const { data: classesRes } = useClassesList();

  const roles = rolesRes?.results || [];
  const sessions = sessionsRes?.results || [];
  const classes = classesRes?.results || [];

  const { data: studentsRes, isLoading: isLoadingStudents } = useStudentsList({
    page,
    searchTerm,
    classFilter,
    sectionFilter,
    sessionFilter,
  });

  const studentList = studentsRes?.data?.students || [];
  const pagination = studentsRes?.data?.pagination || {
    totalPages: 1,
    page: 1,
  };
  // Actions
  const openDrawer = (mode, id = null) => {
    setDrawerMode(mode);
    setSelectedStudentId(id);
    setIsDrawerOpen(true);
  };

  const handleViewDetail = (id) => {
    setViewingStudentId(id);
    setCurrentView("detail");
  };

  return (
    <div className="md:p-6 lg:p-8 min-h-screen bg-surface-page">
      {currentView === "detail" ? (
        <StudentDetail
          studentId={viewingStudentId}
          onBack={() => setCurrentView("list")}
        />
      ) : (
        <div className="animate-fadeUp">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-['Montserrat'] font-bold text-text-heading">
                Student Directory
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Manage enrollments, classes, and student records.
              </p>
            </div>
            <button
              onClick={() => openDrawer("add")}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm shadow-primary/30"
            >
              <Plus size={18} /> New Admission
            </button>
          </div>

          {/* Filters & Search */}
          <div className="bg-surface-card border border-border rounded-t-xl p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by Name or Admission No..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-page border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-text-primary placeholder:text-text-secondary dark:placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-surface-page border border-border rounded-xl px-3 py-2.5 flex-1 sm:flex-none">
                <Filter size={16} className="text-text-secondary" />
                <select
                  className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer w-full"
                  value={sessionFilter}
                  onChange={(e) => {
                    setSessionFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="null">All Sessions</option>
                  {sessions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.academicSession}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-surface-page border border-border rounded-xl px-3 py-2.5 flex-1 sm:flex-none">
                <GraduationCap size={16} className="text-text-secondary" />
                <select
                  className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer w-full"
                  value={classFilter}
                  onChange={(e) => {
                    setClassFilter(e.target.value);
                    setSectionFilter("null");
                    setPage(1);
                  }}
                >
                  <option value="null">All Classes</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      Class {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-surface-card w-[92vw] md:w-auto border border-border border-t-0 rounded-b-xl overflow-x-auto relative min-h-[300px]">
            {isLoadingStudents && (
              <div className="absolute inset-0 bg-surface-card/60 backdrop-blur-sm z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-page/50">
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                    Student
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                    Class & Session
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border">
                    Guardian
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
                {!isLoadingStudents && studentList.length > 0
                  ? studentList.map((student) => (
                      <tr
                        key={student._id}
                        className="hover:bg-surface-page/80 transition-colors group"
                      >
                        <td className="py-4 px-6 border-b border-border group-last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
                              {student.fullName?.substring(0, 2) || "ST"}
                            </div>
                            <div>
                              <div className="font-semibold text-text-primary text-[14px]">
                                {student.fullName}
                              </div>
                              <div className="text-[12px] text-text-secondary mt-0.5 font-medium">
                                {student.admissionNumber || "Pending"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-border group-last:border-0">
                          <div className="text-[13px] text-text-primary font-medium">
                            Session {student.currentSession}
                          </div>
                          <div className="text-[12px] text-text-secondary mt-0.5">
                            Roll No: {student.rollNumber || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-border group-last:border-0">
                          <div className="text-[13px] text-text-primary font-medium">
                            {student.guardianName}
                          </div>
                          <div className="text-[12px] text-text-secondary mt-0.5">
                            Guardian
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-border group-last:border-0">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold capitalize border ${student.isActive ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${student.isActive ? "bg-success" : "bg-error"}`}
                            ></span>
                            {student.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-6 border-b border-border group-last:border-0 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() =>
                                handleViewDetail(student?.user?._id)
                              }
                              className="p-2 text-text-secondary hover:text-info hover:bg-info/10 rounded-lg transition-colors cursor-pointer"
                              title="View Profile & Docs"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : !isLoadingStudents && (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-12 text-center text-text-secondary text-sm"
                        >
                          No students found matching your criteria.
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>

            {/* Pagination */}
            {!isLoadingStudents && studentList.length > 0 && (
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

      <StudentDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        studentId={selectedStudentId}
        onClose={() => setIsDrawerOpen(false)}
        roles={roles}
        classes={classes}
        sessions={sessions}
      />
    </div>
  );
}
