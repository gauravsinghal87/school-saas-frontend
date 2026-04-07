import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Trash2,
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
} from "lucide-react";
import api from "../../../../api/apiConfig";

import Input from "../../../../components/common/Input";
import SubmitButton from "../../../../components/common/Button";
import {
  useStaffDetail,
  useUploadStaffDocumentsMutation,
} from "../../../../hooks/useQueryMutations";

const DetailSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-6">
    <div className="h-24 bg-surface-card rounded-2xl border border-border"></div>
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="h-64 bg-surface-card rounded-2xl border border-border col-span-1"></div>
      <div className="h-96 bg-surface-card rounded-2xl border border-border col-span-2"></div>
    </div>
  </div>
);

function StaffDetail({ staffId, onBack }) {
  const queryClient = useQueryClient();

  const { data: staffRes, isLoading } = useStaffDetail(staffId);

  const staff = staffRes?.data;
  const userId = staff?.user_id?._id || staff?.user_id;

  const [aadhar, setAadhar] = useState(null);
  const [pan, setPan] = useState(null);
  const [certificates, setCertificates] = useState([]);

  const addCertificateField = () =>
    setCertificates([...certificates, { file: null, type: "" }]);
  const removeCertificateField = (index) =>
    setCertificates(certificates.filter((_, i) => i !== index));

  const uploadDocsMutation = useUploadStaffDocumentsMutation(staffId, userId);

  const handleUpload = (e) => {
    e.preventDefault();

    if (!aadhar && !pan && certificates.length === 0) {
      return; // ❌ no toast here
    }

    const formData = new FormData();

    if (aadhar) formData.append("aadhar_card", aadhar);
    if (pan) formData.append("pan_card", pan);

    let certValid = true;

    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];

      if (cert.file && !cert.type) {
        certValid = false;
        break;
      }

      if (cert.file && cert.type) {
        formData.append("certificates", cert.file);
        formData.append("certificate_types", cert.type);
      }
    }

    if (!certValid) return;

    uploadDocsMutation.mutate({ formData });
  };

  if (isLoading) return <DetailSkeleton />;
  if (!staff)
    return (
      <div className="text-center py-10 text-text-secondary">
        Staff not found
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
            {staff.user_id?.name}
          </h2>
          <p className="text-sm text-text-secondary">
            {staff.designation} • {staff.employee_id}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Col: Profile Info & Existing Docs */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Info Card */}
          <div className="bg-surface-card border border-border rounded-2xl p-6">
            <h3 className="text-[13px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
              Profile Details
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-text-secondary block text-xs">Email</span>{" "}
                <span className="font-medium">{staff.user_id?.email}</span>
              </div>
              <div>
                <span className="text-text-secondary block text-xs">Phone</span>{" "}
                <span className="font-medium">+91 {staff.user_id?.phone}</span>
              </div>
              <div>
                <span className="text-text-secondary block text-xs">
                  Department
                </span>{" "}
                <span className="font-medium">{staff.department}</span>
              </div>
              <div>
                <span className="text-text-secondary block text-xs">
                  Date of Joining
                </span>{" "}
                <span className="font-medium">
                  {new Date(staff.date_of_joining).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-text-secondary block text-xs mb-1">
                  Status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold capitalize border ${staff.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"}`}
                >
                  {staff.status}
                </span>
              </div>
            </div>
          </div>

          {/* Existing Documents Card */}
          <div className="bg-surface-card border border-border rounded-2xl p-6">
            <h3 className="text-[13px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
              Uploaded Documents
            </h3>
            <div className="space-y-3">
              {staff.documents?.aadhar_card?.file_url && (
                <a
                  href={staff.documents.aadhar_card.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface-page border border-border rounded-xl hover:border-primary transition-colors"
                >
                  <CheckCircle2 size={18} className="text-success" />
                  <span className="text-sm font-medium">Aadhar Card</span>
                </a>
              )}
              {staff.documents?.pan_card?.file_url && (
                <a
                  href={staff.documents.pan_card.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface-page border border-border rounded-xl hover:border-primary transition-colors"
                >
                  <CheckCircle2 size={18} className="text-success" />
                  <span className="text-sm font-medium">PAN Card</span>
                </a>
              )}
              {staff.documents?.certificates?.map((cert) => (
                <a
                  key={cert._id}
                  href={cert.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface-page border border-border rounded-xl hover:border-primary transition-colors"
                >
                  <FileText size={18} className="text-primary" />
                  <span className="text-sm font-medium">
                    {cert.certificate_type} Certificate
                  </span>
                </a>
              ))}
              {!staff.documents?.aadhar_card &&
                !staff.documents?.pan_card &&
                (!staff.documents?.certificates ||
                  staff.documents.certificates.length === 0) && (
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
            {/* Core Docs */}
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
                  PAN Card
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setPan(e.target.files[0])}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-border rounded-xl bg-surface-page p-1"
                />
              </div>
            </div>

            {/* Dynamic Certificates */}
            <div className="mt-2 border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-text-primary">
                  Educational Certificates
                </label>
                <button
                  type="button"
                  onClick={addCertificateField}
                  className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  + Add Certificate
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {certificates.length === 0 && (
                  <p className="text-xs text-text-secondary">
                    Click 'Add Certificate' to upload degrees/diplomas.
                  </p>
                )}
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-end gap-3 p-4 bg-surface-page border border-border rounded-xl relative group"
                  >
                    <div className="w-full sm:flex-1">
                      <Input
                        label="Degree/Type (e.g. B.ED, M.A)"
                        required
                        value={cert.type}
                        onChange={(e) => {
                          const newCerts = [...certificates];
                          newCerts[index].type = e.target.value;
                          setCertificates(newCerts);
                        }}
                        placeholder="Certificate Type"
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
                      className="p-2.5 text-error bg-error/10 hover:bg-error/20 rounded-xl transition-colors mb-0.5"
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

export default StaffDetail;
