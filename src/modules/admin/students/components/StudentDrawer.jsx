import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { X, Loader2 } from "lucide-react";
import api from "../../../../api/apiConfig";

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import SubmitButton from "../../../../components/common/Button";
import { enrollStudentMutation, useStudentDetail } from "../../../../hooks/useQueryMutations";

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

const { data: singleRes, isLoading: isFetching } =
  useStudentDetail(studentId, mode === "add");

  useEffect(() => {
    if (mode === "add") {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [singleRes, mode, isOpen, roles]);

const enrollMutation = enrollStudentMutation(onClose);

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

export default StudentDrawer;
