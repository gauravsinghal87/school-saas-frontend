import { useState, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { X, Loader2, BookOpen } from "lucide-react";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import SubmitButton from "../../../../components/common/Button";
import {
  createStaffMutation,
  getSubjectsQuery,
  updateStaffMutation,
  useStaffDetail,
} from "../../../../hooks/useQueryMutations";

const INITIAL_FORM_STATE = {
  name: "",
  workEmail: "",
  workPhone: "",
  designation: "",
  date_of_joining: "",
  department: "",
  qualification: "",
  experience: "",
  salary: "",
  roleId: "",
  status: "active",
  subjects: [], 
  contact: {
    personal_email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "India",
  },
};

function StaffDrawer({ isOpen, onClose, mode, staffId, roles }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Fetch Staff Details (for edit mode)
  const { data: singleStaffRes, isLoading: isFetchingStaff } = useStaffDetail(
    staffId,
    mode === "edit" || mode === "view",
  );

  // Fetch Subjects List
  const { data: subjectsRes, isLoading: isFetchingSubjects } =
    getSubjectsQuery();
  const subjectsList = subjectsRes?.results || [];

  const teacherRoleId = roles?.find(
    (r) => r.name.toUpperCase() === "TEACHER",
  )?._id;
  const isTeacherSelected = formData.roleId === teacherRoleId;

  useEffect(() => {
    if (mode === "add") {
      setFormData(INITIAL_FORM_STATE);
    } else if (singleStaffRes?.data) {
      const selectedData = singleStaffRes.data;
      setFormData({
        name: selectedData.user_id?.name || "",
        workEmail: selectedData.user_id?.email || "",
        workPhone: selectedData.user_id?.phone || "",
        designation: selectedData.designation || "",
        date_of_joining: selectedData.date_of_joining?.split("T")[0] || "",
        department: selectedData.department || "",
        qualification: selectedData.qualification || "",
        experience: selectedData.experience || "",
        salary: selectedData.salary || "",
        roleId: selectedData.roleId?._id || selectedData.roleId || "",
        status: selectedData.status || "active",
        // Extract subject IDs whether they come as objects or strings
        subjects: selectedData.subjects?.map((s) => s._id || s) || [],
        contact: {
          personal_email: selectedData.contact?.personal_email || "",
          phone: selectedData.contact?.phone || "",
          address: selectedData.contact?.address || "",
          city: selectedData.contact?.city || "",
          state: selectedData.contact?.state || "",
          country: selectedData.contact?.country || "India",
        },
      });
    }
  }, [singleStaffRes, mode, isOpen]);

  const createMutation = createStaffMutation(onClose);
  const updateMutation = updateStaffMutation(onClose);

  if (!isOpen) return null;

  const isReadOnly = mode === "view";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleChange = (e, section = null) => {
    if (isReadOnly) return;
    const { name, value } = e.target;

    if (section === "contact") {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [name]: value },
      }));
    } else {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        // If changing role away from Teacher, clear subjects
        if (name === "roleId" && value !== teacherRoleId) {
          newData.subjects = [];
        }
        return newData;
      });
    }
  };

  // Toggle multiple subjects
  const handleSubjectToggle = (subjectId) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const currentSubjects = prev.subjects || [];
      if (currentSubjects.includes(subjectId)) {
        return {
          ...prev,
          subjects: currentSubjects.filter((id) => id !== subjectId),
        };
      } else {
        return { ...prev, subjects: [...currentSubjects, subjectId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      workPhone: Number(formData.workPhone),
      experience: Number(formData.experience),
      salary: Number(formData.salary),
    };

    // Clean up empty subjects array if not a teacher
    if (payload.roleId !== teacherRoleId) {
      delete payload.subjects;
    }

    if (mode === "add") {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate({ id: staffId, data: payload });
    }
  };

  const roleOptions =
    roles?.map((r) => ({ label: r.name, value: r._id })) || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-surface-sidebar/30 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-surface-page h-full shadow-2xl flex flex-col animate-fadeUp border-l border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface-card">
          <div>
            <h2 className="font-['Montserrat'] text-[18px] font-bold text-text-heading capitalize">
              {mode} Staff Member
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              {mode === "add"
                ? "Enter new staff details."
                : mode === "edit"
                  ? "Update existing records."
                  : "Viewing staff details."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:bg-surface-page rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
          {(isFetchingStaff || isFetchingSubjects) && (
            <div className="absolute inset-0 bg-surface-page/80 z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}

          <form
            id="staff-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <div>
              <h3 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
                Professional Details
              </h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  required
                  disabled={isReadOnly}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Work Email"
                    required
                    disabled={isReadOnly}
                    name="workEmail"
                    value={formData.workEmail}
                    onChange={handleChange}
                    type="email"
                    placeholder="work@school.com"
                  />
                  <Input
                    label="Work Phone"
                    required
                    disabled={isReadOnly}
                    name="workPhone"
                    value={formData.workPhone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="10-digit number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={
                      isReadOnly ? "opacity-60 pointer-events-none" : ""
                    }
                  >
                    <Select
                      label="Role"
                      required
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleChange}
                      options={roleOptions}
                      placeholder="Select Role"
                    />
                  </div>
                  <Input
                    label="Designation"
                    required
                    disabled={isReadOnly}
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Headmaster"
                  />
                </div>

                {/* DYNAMIC SUBJECTS SELECTOR (Visible only if Role is Teacher) */}
                {isTeacherSelected && (
                  <div className="bg-surface-card border border-border p-4 rounded-xl">
                    <label className="flex items-center gap-1.5 text-xs font-semibold mb-3 text-text-primary uppercase tracking-wider">
                      <BookOpen size={14} className="text-primary" /> Assign
                      Subjects
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {subjectsList.map((sub) => {
                        const isSelected = formData.subjects?.includes(sub._id);
                        return (
                          <button
                            key={sub._id}
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => handleSubjectToggle(sub._id)}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                              isSelected
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-surface-page text-text-secondary border-border hover:border-primary/50 hover:text-text-primary"
                            } ${isReadOnly ? "opacity-60 cursor-default" : "cursor-pointer"}`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                      {subjectsList.length === 0 && (
                        <span className="text-xs text-text-secondary italic">
                          No subjects configured.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    required
                    disabled={isReadOnly}
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Mathematics"
                  />
                  <Input
                    label="Joining Date"
                    required
                    disabled={isReadOnly}
                    name="date_of_joining"
                    value={formData.date_of_joining}
                    onChange={handleChange}
                    type="date"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Qualification"
                    disabled={isReadOnly}
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. M.Sc"
                  />
                  <Input
                    label="Experience (Years)"
                    disabled={isReadOnly}
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    type="number"
                    placeholder="e.g. 5"
                  />
                </div>
                <Input
                  label="Salary (₹)"
                  disabled={isReadOnly}
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g. 35000"
                />
                <div
                  className={isReadOnly ? "opacity-60 pointer-events-none" : ""}
                >
                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2 mt-2">
                Personal Contact
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Personal Email"
                    disabled={isReadOnly}
                    name="personal_email"
                    value={formData.contact.personal_email}
                    onChange={(e) => handleChange(e, "contact")}
                    type="email"
                  />
                  <Input
                    label="Personal Phone"
                    disabled={isReadOnly}
                    name="phone"
                    value={formData.contact.phone}
                    onChange={(e) => handleChange(e, "contact")}
                    type="tel"
                  />
                </div>
                <Input
                  label="Address"
                  disabled={isReadOnly}
                  name="address"
                  value={formData.contact.address}
                  onChange={(e) => handleChange(e, "contact")}
                  type="text"
                  placeholder="Street Address"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    disabled={isReadOnly}
                    name="city"
                    value={formData.contact.city}
                    onChange={(e) => handleChange(e, "contact")}
                    type="text"
                    placeholder="e.g. Jaipur"
                  />
                  <Input
                    label="State"
                    disabled={isReadOnly}
                    name="state"
                    value={formData.contact.state}
                    onChange={(e) => handleChange(e, "contact")}
                    type="text"
                    placeholder="e.g. Rajasthan"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-surface-card flex gap-3 justify-end items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary border border-border hover:bg-surface-page transition-colors cursor-pointer"
          >
            {isReadOnly ? "Close" : "Cancel"}
          </button>
          {!isReadOnly && (
            <div className="w-[160px]">
              <SubmitButton
                form="staff-form"
                type="submit"
                loading={isSubmitting}
                label={mode === "add" ? "Create Staff" : "Save Changes"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffDrawer;
