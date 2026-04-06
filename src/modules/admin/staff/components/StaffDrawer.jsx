import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  X,
  Loader2,
} from "lucide-react";
import api from "../../../../api/apiConfig";

import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import SubmitButton from "../../../../components/common/Button";

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

  const { data: singleStaffRes, isLoading: isFetchingStaff } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: () => api.get(`/api/staff/${staffId}`),
    enabled: !!staffId && mode === "edit",
  });

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
        roleId: selectedData.roleId?._id || "",
        status: selectedData.status || "active",
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

  console.log(singleStaffRes?.data);
  const createMutation = useMutation({
    mutationFn: (newStaff) => api.post("/api/staff/create", newStaff),
    onSuccess: (res) => {
      toast.success(res.message || "Staff created successfully");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      onClose();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create staff"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => {
      const res = api.put(`/api/staff/${staffId}`, payload);
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Staff updated successfully");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      onClose();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update staff"),
  });

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section === "contact") {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [name]: value },
      }));
    } else {
      console.log(name, "+-->", value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      workPhone: Number(formData.workPhone),
      experience: Number(formData.experience),
      salary: Number(formData.salary),
    };
    if (mode === "add") createMutation.mutate(payload);
    else if (mode === "edit") updateMutation.mutate(payload);
  };

  const roleOptions =
    roles?.map((r) => ({ label: r.name, value: r._id })) || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-surface-sidebar/30 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-surface-page h-full shadow-2xl flex flex-col animate-fadeUp border-l border-border">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface-card">
          <div>
            <h2 className="font-['Montserrat'] text-[18px] font-bold text-text-heading capitalize">
              {mode} Staff Member
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              {mode === "add"
                ? "Enter new staff details."
                : "Update existing records."}
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
          {isFetchingStaff && (
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
                    name="workEmail"
                    value={formData.workEmail}
                    onChange={handleChange}
                    type="email"
                    placeholder="work@school.com"
                  />
                  <Input
                    label="Work Phone"
                    required
                    name="workPhone"
                    value={formData.workPhone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="10-digit number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Role"
                    required
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                    options={roleOptions}
                    placeholder="Select Role"
                  />
                  <Input
                    label="Designation"
                    required
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Headmaster"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    required
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Mathematics"
                  />
                  <Input
                    label="Joining Date"
                    required
                    name="date_of_joining"
                    value={formData.date_of_joining}
                    onChange={handleChange}
                    type="date"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. M.Sc"
                  />
                  <Input
                    label="Experience (Years)"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    type="number"
                    placeholder="e.g. 5"
                  />
                </div>
                <Input
                  label="Salary (₹)"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g. 35000"
                />
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

            <div>
              <h3 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2 mt-2">
                Personal Contact
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Personal Email"
                    name="personal_email"
                    value={formData.contact.personal_email}
                    onChange={(e) => handleChange(e, "contact")}
                    type="email"
                  />
                  <Input
                    label="Personal Phone"
                    name="phone"
                    value={formData.contact.phone}
                    onChange={(e) => handleChange(e, "contact")}
                    type="tel"
                  />
                </div>
                <Input
                  label="Address"
                  name="address"
                  value={formData.contact.address}
                  onChange={(e) => handleChange(e, "contact")}
                  type="text"
                  placeholder="Street Address"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.contact.city}
                    onChange={(e) => handleChange(e, "contact")}
                    type="text"
                    placeholder="e.g. Jaipur"
                  />
                  <Input
                    label="State"
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

        <div className="p-5 border-t border-border bg-surface-card flex gap-3 justify-end items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary border border-border hover:bg-surface-page transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="w-[160px]">
            <SubmitButton
              form="staff-form"
              type="submit"
              loading={isSubmitting}
              label={mode === "add" ? "Create Stsaff" : "Save Changes"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default StaffDrawer;
