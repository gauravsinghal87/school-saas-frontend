import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  X,
  Eye,
  Filter,
  Loader2,
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import api from "../../../api/apiConfig";

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import SubmitButton from "../../../components/common/Button";

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  previousSchool: "",
  rollNumber: "",
  parentEmail: "",
  parentPhone: "",
  fatherName: "",
  motherName: "",
  guardianName: "",
  relation: "",
  classId: "",
  sectionId: "",
  sessionId: "",
  studentRoleId: "",
  parentRoleId: "",
};

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-6">
    <div className="h-24 bg-surface-card rounded-2xl border border-border"></div>
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="h-64 bg-surface-card rounded-2xl border border-border col-span-1"></div>
      <div className="h-96 bg-surface-card rounded-2xl border border-border col-span-2"></div>
    </div>
  </div>
);

// ─── STUDENT DETAIL & DOCUMENT COMPONENT ──────────────────────────────────────

function StudentDetail({ studentId, onBack }) {
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => api.get(`/api/student/${studentId}`),
    enabled: !!studentId,
  });

  const student = res?.data?.student;
  const userId = student?.userId; // Mapped from your GET details response

  // Document Upload State
  const [aadhar, setAadhar] = useState(null);
  const [pan, setPan] = useState(null);
  const [certificates, setCertificates] = useState([]);

  const addCertificateField = () =>
    setCertificates([...certificates, { file: null, type: "" }]);
  const removeCertificateField = (index) =>
    setCertificates(certificates.filter((_, i) => i !== index));

  const uploadDocsMutation = useMutation({
    mutationFn: (formData) =>
      api.post(`/api/staff/${userId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: (res) => {
      toast.success(res.message || "Documents uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      setAadhar(null);
      setPan(null);
      setCertificates([]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to upload documents");
    },
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!aadhar && !pan && certificates.length === 0) {
      return toast.error("Please select at least one document to upload.");
    }

    const formData = new FormData();
    if (aadhar) formData.append("aadhar_card", aadhar);
    if (pan) formData.append("pan_card", pan);

    let certValid = true;
    certificates.forEach((cert) => {
      if (cert.file && !cert.type) {
        certValid = false;
        toast.error(
          "Please enter a certificate type (e.g., B.ED, Transfer Cert) for all selected files.",
        );
      } else if (cert.file && cert.type) {
        formData.append("certificates", cert.file);
        formData.append("certificate_types", cert.type);
      }
    });

    if (certValid) uploadDocsMutation.mutate(formData);
  };

  if (isLoading) return <DetailSkeleton />;
  if (!student)
    return (
      <div className="text-center py-10 text-text-secondary">
        Student not found
      </div>
    );

  return (
    <div className="animate-fadeUp flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={onBack}
          className="p-2 bg-surface-card border border-border rounded-xl hover:bg-surface-page transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <div>
          <h2 className="text-2xl font-['Montserrat'] font-bold text-text-heading">
            {student.user?.name}
          </h2>
          <p className="text-sm text-text-secondary">
            Admission No: {student.admissionNumber || "N/A"} • Roll No:{" "}
            {student.currentEnrollment?.rollNumber}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Col: Profile Info & Existing Docs */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface-card border border-border rounded-2xl p-6">
            <h3 className="text-[13px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
              Student Profile
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-text-secondary block text-xs">Email</span>{" "}
                <span className="font-medium">{student.user?.email}</span>
              </div>
              <div>
                <span className="text-text-secondary block text-xs">Phone</span>{" "}
                <span className="font-medium">+91 {student.user?.phone}</span>
              </div>
              <div>
                <span className="text-text-secondary block text-xs">DOB</span>{" "}
                <span className="font-medium">
                  {student.dob
                    ? new Date(student.dob).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-text-secondary block text-xs">
                  Guardian
                </span>{" "}
                <span className="font-medium">
                  {student.parents?.[0]?.guardianName || "N/A"} (
                  {student.parents?.[0]?.relation})
                </span>
              </div>
              <div>
                <span className="text-text-secondary block text-xs mb-1">
                  Status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold capitalize border ${student.isActive ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"}`}
                >
                  {student.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-card border border-border rounded-2xl p-6">
            <h3 className="text-[13px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
              Uploaded Documents
            </h3>
            <div className="space-y-3">
              {student.documents?.aadhar_card?.file_url && (
                <a
                  href={student.documents.aadhar_card.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface-page border border-border rounded-xl hover:border-primary transition-colors"
                >
                  <CheckCircle2 size={18} className="text-success" />
                  <span className="text-sm font-medium">Aadhar Card</span>
                </a>
              )}
              {student.documents?.pan_card?.file_url && (
                <a
                  href={student.documents.pan_card.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface-page border border-border rounded-xl hover:border-primary transition-colors"
                >
                  <CheckCircle2 size={18} className="text-success" />
                  <span className="text-sm font-medium">PAN Card</span>
                </a>
              )}
              {student.documents?.certificates?.map((cert) => (
                <a
                  key={cert._id}
                  href={cert.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface-page border border-border rounded-xl hover:border-primary transition-colors"
                >
                  <FileText size={18} className="text-primary" />
                  <span className="text-sm font-medium">
                    {cert.certificate_type}
                  </span>
                </a>
              ))}
              {!student.documents?.aadhar_card &&
                !student.documents?.pan_card &&
                (!student.documents?.certificates ||
                  student.documents.certificates.length === 0) && (
                  <p className="text-xs text-text-secondary text-center py-2">
                    No documents uploaded yet.
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Right Col: Document Upload Portal */}
        <div className="lg:col-span-2 bg-surface-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
            <UploadCloud className="text-primary" size={24} />
            <h3 className="text-lg font-['Montserrat'] font-bold text-text-heading">
              Upload New Documents
            </h3>
          </div>

          <form onSubmit={handleUpload} className="flex flex-col gap-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-primary">
                  Aadhar Card
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setAadhar(e.target.files[0])}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-border rounded-xl bg-surface-page p-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-primary">
                  PAN Card (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setPan(e.target.files[0])}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-border rounded-xl bg-surface-page p-1"
                />
              </div>
            </div>

            <div className="mt-2 border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-text-primary">
                  Other Certificates (TC, Marksheets)
                </label>
                <button
                  type="button"
                  onClick={addCertificateField}
                  className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  + Add Document
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {certificates.length === 0 && (
                  <p className="text-xs text-text-secondary">
                    Click 'Add Document' to upload previous marksheets or
                    transfer certificates.
                  </p>
                )}
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-end gap-3 p-4 bg-surface-page border border-border rounded-xl relative group"
                  >
                    <div className="w-full sm:flex-1">
                      <Input
                        label="Document Type (e.g. TC, 5th Marksheet)"
                        required
                        value={cert.type}
                        onChange={(e) => {
                          const newCerts = [...certificates];
                          newCerts[index].type = e.target.value;
                          setCertificates(newCerts);
                        }}
                        placeholder="Type of Document"
                      />
                    </div>
                    <div className="w-full sm:flex-1">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                        onChange={(e) => {
                          const newCerts = [...certificates];
                          newCerts[index].file = e.target.files[0];
                          setCertificates(newCerts);
                        }}
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-border rounded-xl bg-surface-card p-1 mt-1"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCertificateField(index)}
                      className="p-2.5 text-error bg-error/10 hover:bg-error/20 rounded-xl transition-colors mb-0.5 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-border">
              <div className="w-[180px]">
                <SubmitButton
                  loading={uploadDocsMutation.isPending}
                  label="Upload Documents"
                  type="submit"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── SLIDE-OVER DRAWER COMPONENT (FOR ENROLLMENT) ─────────────────────────────

function StudentDrawer({
  isOpen,
  onClose,
  mode,
  studentId,
  roles,
  classes,
  sessions,
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const { data: singleRes, isLoading: isFetching } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => api.get(`/api/student/${studentId}`),
    enabled: !!studentId && mode === "edit",
  });

  useEffect(() => {
    if (mode === "add") {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [singleRes, mode, isOpen, roles]);

  const enrollMutation = useMutation({
    mutationFn: (payload) => api.post("/api/student/enroll", payload),
    onSuccess: (res) => {
      toast.success(res.message || "Student enrolled successfully");
      queryClient.invalidateQueries({ queryKey: ["studentList"] });
      onClose();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to enroll student"),
  });

  if (!isOpen) return null;

  const isSubmitting = enrollMutation.isPending;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset section if class changes
    if (name === "classId") {
      setFormData((prev) => ({ ...prev, sectionId: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      enrollMutation.mutate(formData);
    } else {
      toast.success("Edit API will be hooked up here!");
      onClose();
    }
  };

  // Dropdown Mappings
  const roleOptions =
    roles?.map((r) => ({ label: r.name, value: r._id })) || [];
  const sessionOptions =
    sessions?.map((s) => ({ label: s.academicSession, value: s._id })) || [];
  const classOptions =
    classes?.map((c) => ({ label: `Class ${c.name}`, value: c._id })) || [];

  // Dynamic Section Mapping based on selected class
  const selectedClassObj = classes?.find((c) => c._id === formData.classId);
  const sectionOptions =
    selectedClassObj?.sections?.map((s) => ({
      label: `Section ${s.name}`,
      value: s._id,
    })) || [];

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const relationOptions = [
    { label: "Father", value: "father" },
    { label: "Mother", value: "mother" },
    { label: "Guardian", value: "guardian" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-surface-sidebar/30 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-surface-page h-full shadow-2xl flex flex-col animate-fadeUp border-l border-border">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface-card">
          <div>
            <h2 className="font-['Montserrat'] text-[18px] font-bold text-text-heading capitalize">
              {mode === "add" ? "Enroll Student" : "Edit Student"}
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              {mode === "add"
                ? "Enter details for new admission."
                : "Update existing student records."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:bg-surface-page rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
          {isFetching && (
            <div className="absolute inset-0 bg-surface-page/80 z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}

          <form
            id="enroll-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
          >
            {/* Basic Info */}
            <div>
              <h3 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
                Student Basic Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Nikumbh"
                />
                <Input
                  label="Last Name"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Sharma"
                />
                <Input
                  label="Date of Birth"
                  required
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  type="date"
                />
                <Select
                  label="Gender"
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={genderOptions}
                  placeholder="Select Gender"
                />
                <Input
                  label="Student Email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="student@example.com"
                />
                <Input
                  label="Student Phone"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="10-digit number"
                />
              </div>
              <div className="mt-4">
                <Input
                  label="Address"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full Address"
                />
              </div>
            </div>

            {/* Academic Info */}
            <div>
              <h3 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
                Academic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Academic Session"
                  required
                  name="sessionId"
                  value={formData.sessionId}
                  onChange={handleChange}
                  options={sessionOptions}
                  placeholder="Select Session"
                />
                <Select
                  label="Class"
                  required
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  options={classOptions}
                  placeholder="Select Class"
                />
                <Select
                  label="Section"
                  required
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleChange}
                  options={sectionOptions}
                  placeholder={
                    formData.classId ? "Select Section" : "Select Class First"
                  }
                />
                <Input
                  label="Roll Number"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                />
                <Input
                  label="Previous School"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  placeholder="School Name"
                />
              </div>
            </div>

            {/* Parent Info */}
            <div>
              <h3 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
                Parent / Guardian Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Father's Name"
                  required
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Father Name"
                />
                <Input
                  label="Mother's Name"
                  required
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  placeholder="Mother Name"
                />
                <Input
                  label="Guardian's Name"
                  required
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="Local Guardian"
                />
                <Select
                  label="Relation"
                  required
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  options={relationOptions}
                  placeholder="Select Relation"
                />
                <Input
                  label="Parent Email"
                  required
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  type="email"
                  placeholder="parent@example.com"
                />
                <Input
                  label="Parent Phone"
                  required
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="10-digit number"
                />
              </div>
            </div>

            {/* Roles Setup (Hidden or Selectable) */}
            <div>
              <h3 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
                Role Assignments
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Student Role Profile"
                  required
                  name="studentRoleId"
                  value={formData.studentRoleId}
                  onChange={handleChange}
                  options={roleOptions}
                  placeholder="Select Student Role"
                />
                <Select
                  label="Parent Role Profile"
                  required
                  name="parentRoleId"
                  value={formData.parentRoleId}
                  onChange={handleChange}
                  options={roleOptions}
                  placeholder="Select Parent Role"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-border bg-surface-card flex gap-3 justify-end items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary border border-border hover:bg-surface-page transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <div className="w-[180px]">
            <SubmitButton
              form="enroll-form"
              loading={isSubmitting}
              label={mode === "add" ? "Enroll Student" : "Save Changes"}
              loadingLabel="Processing..."
              type="submit"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────

export default function AdminStudents() {
  const queryClient = useQueryClient();

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

  // 1. Fetch Dependencies (Roles, Classes, Sessions)
  const { data: rolesRes } = useQuery({
    queryKey: ["roles"],
    queryFn: () => api.get("/api/super-admin/role"),
  });
  const { data: sessionsRes } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => api.get("/api/academic-session"),
  });
  const { data: classesRes } = useQuery({
    queryKey: ["classes"],
    queryFn: () => api.get("/api/admin/class/get/all"),
  });

  const roles = rolesRes?.results || [];
  const sessions = sessionsRes?.results || [];
  const classes = classesRes?.results || [];

  // 2. Fetch Students List
  //   const { data: studentsRes, isLoading: isLoadingStudents } = useQuery({
  //     queryKey: [
  //       "studentList",
  //       page,
  //       searchTerm,
  //       classFilter,
  //       sectionFilter,
  //       sessionFilter,
  //     ],
  //     queryFn: () =>
  //       api.get(
  //         `/api/student?page=${page}&limit=10&search=${searchTerm}&classId=${classFilter}&sectionId=${sectionFilter}&sessionId=${sessionFilter}`,
  //       ),
  //   });

  const { data: studentsRes, isLoading: isLoadingStudents } = useQuery({
    queryKey: [
      "studentList",
      page,
      searchTerm,
      classFilter,
      sectionFilter,
      sessionFilter,
    ],
    queryFn: () => {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", 10);

      if (searchTerm) params.append("search", searchTerm);
      if (classFilter !== "null") params.append("classId", classFilter);
      if (sectionFilter !== "null") params.append("sectionId", sectionFilter);
      if (sessionFilter !== "null") params.append("sessionId", sessionFilter);

      return api.get(`/api/student?${params.toString()}`);
    },
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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      toast.success("Delete functionality will go here.");
    }
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-surface-page">
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
          <div className="bg-surface-card border border-border border-t-0 rounded-b-xl overflow-x-auto relative min-h-[300px]">
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
                              onClick={() => handleViewDetail(student._id)}
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

      {/* ENROLL / EDIT DRAWER */}
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
